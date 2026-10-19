// Draws the genie as one warped image on the GPU. The fragment shader maps
// each screen pixel back through the funnel to a point on the window's
// snapshot, so the curve is exact at any size: no strips, no seams. Edges get
// analytic anti-aliasing, and mipmaps keep the window smooth as it shrinks
// into the tile.

export type GenieRect = Pick<
	DOMRect,
	"top" | "left" | "right" | "bottom" | "width" | "height"
>;

/** One frame of the genie, in CSS px relative to the viewport. */
export type GenieFrame = {
	from: GenieRect;
	to: GenieRect;
	/** Where the window's top and bottom edges are on screen. */
	top: number;
	bottom: number;
	/** How far the funnel has pinched toward the tile, 0 to 1. */
	bend: number;
};

export type GenieRenderer = {
	/** The largest snapshot side, in device px, the GPU can take. */
	maxTextureSize: number;
	setImage: (image: TexImageSource) => void;
	draw: (frame: GenieFrame) => void;
	destroy: () => void;
};

// A quad over `u_bounds`, from `gl_VertexID`: no vertex buffers needed.
const VERTEX_SHADER = `#version 300 es
uniform vec4 u_bounds;
uniform vec2 u_viewport;
out vec2 v_point;

void main() {
	vec2 corner = vec2(gl_VertexID & 1, gl_VertexID >> 1);
	v_point = mix(u_bounds.xy, u_bounds.zw, corner);
	vec2 clip = v_point / u_viewport * 2.0 - 1.0;
	gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`;

// Rects are (left, top, right, bottom). The funnel is fixed in screen space:
// how far an edge has pinched toward the tile depends only on its height on
// screen, so content flows through it.
const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform sampler2D u_image;
uniform vec4 u_from;
uniform vec4 u_to;
uniform float u_top;
uniform float u_bottom;
uniform float u_bend;
in vec2 v_point;
out vec4 out_color;

vec2 funnelAt(float y) {
	float span = max(u_to.y - u_from.y, 1.0);
	float pinch = smoothstep(0.0, 1.0, (y - u_from.y) / span) * u_bend;
	return mix(u_from.xz, u_to.xz, pinch);
}

// 0 outside an edge, 1 inside, and a one-device-pixel ramp across it.
float coverage(float distance) {
	return clamp(distance / fwidth(distance) + 0.5, 0.0, 1.0);
}

void main() {
	vec2 edges = funnelAt(v_point.y);
	float left = v_point.x - edges.x;
	float right = edges.y - v_point.x;
	float top = v_point.y - u_top;
	float bottom = u_bottom - v_point.y;

	float alpha = coverage(left) * coverage(right) * coverage(top) * coverage(bottom);
	if (alpha <= 0.0) discard;

	vec2 uv = vec2(
		left / max(edges.y - edges.x, 0.001),
		top / max(u_bottom - u_top, 0.001)
	);
	// The image is premultiplied, so coverage scales every channel.
	out_color = texture(u_image, uv) * alpha;
}`;

// Room for the anti-aliased edge outside the shape.
const EDGE_PADDING_PX = 1;

function compileShader(
	gl: WebGL2RenderingContext,
	type: GLenum,
	source: string,
) {
	const shader = gl.createShader(type);
	if (!shader) throw new Error("Genie: could not create a shader");

	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(`Genie: ${gl.getShaderInfoLog(shader)}`);
	}
	return shader;
}

function createProgram(gl: WebGL2RenderingContext) {
	const program = gl.createProgram();
	gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
	gl.attachShader(
		program,
		compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER),
	);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(`Genie: ${gl.getProgramInfoLog(program)}`);
	}
	return program;
}

function createTexture(gl: WebGL2RenderingContext) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	// Trilinear: the window shrinks to a fraction of its size, and plain
	// bilinear filtering would shimmer.
	gl.texParameteri(
		gl.TEXTURE_2D,
		gl.TEXTURE_MIN_FILTER,
		gl.LINEAR_MIPMAP_LINEAR,
	);

	// The window squashes more vertically than horizontally on its way down.
	const anisotropic = gl.getExtension("EXT_texture_filter_anisotropic");
	if (anisotropic) {
		const max = gl.getParameter(anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
		gl.texParameterf(
			gl.TEXTURE_2D,
			anisotropic.TEXTURE_MAX_ANISOTROPY_EXT,
			Math.min(max, 8),
		);
	}
	return texture;
}

const toVec4 = ({ left, top, right, bottom }: GenieRect) =>
	[left, top, right, bottom] as const;

export function createGenieRenderer(canvas: HTMLCanvasElement): GenieRenderer {
	const gl = canvas.getContext("webgl2", {
		premultipliedAlpha: true,
		antialias: false,
		depth: false,
		stencil: false,
	});
	if (!gl) throw new Error("Genie: WebGL2 is not available");

	const pixelRatio = window.devicePixelRatio;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	canvas.width = Math.round(width * pixelRatio);
	canvas.height = Math.round(height * pixelRatio);

	const program = createProgram(gl);
	const texture = createTexture(gl);
	const uniform = (name: string) => gl.getUniformLocation(program, name);
	const uniforms = {
		bounds: uniform("u_bounds"),
		viewport: uniform("u_viewport"),
		from: uniform("u_from"),
		to: uniform("u_to"),
		top: uniform("u_top"),
		bottom: uniform("u_bottom"),
		bend: uniform("u_bend"),
	};

	gl.useProgram(program);
	gl.uniform2f(uniforms.viewport, width, height);
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.clearColor(0, 0, 0, 0);

	return {
		maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
		setImage(image) {
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.generateMipmap(gl.TEXTURE_2D);
		},
		draw({ from, to, top, bottom, bend }) {
			// The funnel's edges never leave the span between the window's and
			// the tile's.
			gl.uniform4f(
				uniforms.bounds,
				Math.min(from.left, to.left) - EDGE_PADDING_PX,
				top - EDGE_PADDING_PX,
				Math.max(from.right, to.right) + EDGE_PADDING_PX,
				bottom + EDGE_PADDING_PX,
			);
			gl.uniform4f(uniforms.from, ...toVec4(from));
			gl.uniform4f(uniforms.to, ...toVec4(to));
			gl.uniform1f(uniforms.top, top);
			gl.uniform1f(uniforms.bottom, bottom);
			gl.uniform1f(uniforms.bend, bend);

			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		},
		destroy() {
			gl.deleteTexture(texture);
			gl.deleteProgram(program);
			gl.getExtension("WEBGL_lose_context")?.loseContext();
		},
	};
}
