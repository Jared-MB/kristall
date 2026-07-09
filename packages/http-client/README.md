# `@cruz-roja-puebla/http-client`

Full type-safe HTTP client wrapper around `fetch`, designed for strict typing of API routes, parameters, and responses — with zero codegen.

> [!NOTE]
> Primarily designed for **server-side** usage (server functions, API routes, loaders), but runs in the browser as well since it relies solely on standard Web APIs (`fetch`, `Headers`, `FormData`).

## Installation

```bash
pnpm add @cruz-roja-puebla/http-client --filter=[app-name]
```

## Quick Start

### 1. Define your routes

Create a `routes.ts` file describing your API endpoints. Use `z.object()` for any query parameters that need validation or coercion.

```typescript
// routes.ts
import type { ServerRoutes } from '@cruz-roja-puebla/http-client'
import { z } from 'zod'

export const APP_ROUTES = {
  'get-users': {
    url: '/api/users',
    params: z.object({
      page: z.coerce.number().optional(),
      role: z.enum(['admin', 'user']).optional(),
    }),
    returns: {} as { id: number; name: string }[],
  },
  'create-user': {
    url: '/api/users',
    apiPayload: z.object({
      name: z.string(),
      email: z.string().email(),
    }),
    returns: {} as { id: number; name: string; email: string },
  },
} satisfies ServerRoutes
```

### 2. Create the client

Instantiate `createHttpClient` once and export it for use across your app or create separate clients for different purposes.

```typescript
// client.ts
import { createHttpClient } from '@cruz-roja-puebla/http-client'
import { APP_ROUTES } from './routes'

export const client = createHttpClient({
  serverUrl: process.env.API_URL,
  routes: APP_ROUTES,
  interceptors: {
    request: [
      async (req) => {
        const token = localStorage.getItem('token')
        if (token) req.headers.set('Authorization', `Bearer ${token}`)
        return req
      },
    ],
  },
})
```

### 3. Make requests

All methods return a Go-style `[error, data]` tuple — no try/catch needed.

```typescript
const [error, users] = await client.GET('get-users', {
  params: { page: 1, role: 'admin' },
})

if (error) {
  console.error(error)
  return
}

console.log(users) // { id: number; name: string }[]
```

---

## Core Concepts

### Route Definitions

Routes are plain objects that satisfy the `ServerRoutes` type.

| Field | Type | Description |
|---|---|---|
| `url` | `` `/${string}` `` | Endpoint path (must start with `/`) |
| `params` | `z.ZodObject` | Query parameters schema — enables validation and coercion |
| `apiPayload` | `z.ZodObject` | Request body schema — validated before the request is sent |
| `clientInput` | `z.ZodObject` | Input schema for the UI layer (e.g. form validation) — not sent to the API |
| `returns` | `unknown` | Shape of the API response (type-only, not runtime) |

### Error Handling

Every method returns a `readonly [Error, null] | readonly [null, T]` tuple.

```typescript
const [error, data] = await client.GET('get-users')

if (error) return handleError(error)
// data is fully typed and non-null here
```

Errors are **returned** (not thrown) for:
- Network failures
- Non-2xx HTTP responses
- JSON parse failures
- `apiPayload` Zod validation failures

Errors are **thrown** for:
- Missing `serverUrl`
- Missing `Authorization` header on a protected route

### Authentication

All routes are **protected by default**. The client verifies that an `Authorization` header is present after request interceptors run.

```typescript
// Protected (default) — interceptors must attach the Authorization header
const [error, data] = await client.GET('get-users')

// Public — skips the Authorization check entirely
const [error, data] = await client.POST('login', credentials, { auth: false })
```

> [!CAUTION]
> If `auth` is `true` (the default) and no `Authorization` header is present after interceptors run, the client **throws synchronously** — it does not return an error tuple.

### Adapters

An adapter transforms the raw API response before it reaches your application.

```typescript
export const client = createHttpClient({
  serverUrl: process.env.API_URL,
  routes: APP_ROUTES,
  // API returns { data: [...] } — adapter extracts the array
  adapter: (response) => response.data,
})
```

When an adapter is provided, the `data` field of the result tuple is typed as the adapter's return type, not the raw `returns` type.

---

## API Reference

### `createHttpClient(config)`

Creates a typed HTTP client.

| Option | Type | Description |
|---|---|---|
| `serverUrl` | `string \| undefined` | Base URL for your API |
| `routes` | `ServerRoutes` | Route definitions object |
| `adapter` | `(data: any) => any` | (Optional) Transform the response body |
| `interceptors` | `Interceptors` | (Optional) Request/response interceptors |

### `client.GET(alias[, options])`

- **`options` is omittable** when the route has no `params` schema
- **`options` is required** (and must include `params`) when the route defines a `params: z.object(...)` schema

```typescript
// Route defines `params: z.object(...)` — options is required
const [error, users] = await client.GET('get-users', {
  params: { page: 1, role: 'admin' }, // required
  auth: true,                          // optional, default: true
})

// Route has no `params` schema — second argument can be omitted entirely
const [error, profile] = await client.GET('get-profile')

// Or pass options to override auth when no params are needed
const [error, profile] = await client.GET('get-profile', { auth: false })
```

| Property | Required | Type | Default | Description |
|---|---|---|---|---|
| `params` | When route defines a `params` schema | `z.infer<Route["params"]>` | — | Query parameters, validated and coerced by the route's Zod schema |
| `auth` | No | `boolean` | `true` | Whether to enforce the `Authorization` header |

### `client.POST(alias, body[, options])`

If the route defines an `apiPayload` schema, the body is **validated and coerced** before being sent. Invalid data returns `[ZodError, null]` without making a network request.

**Options (all optional):**

| Property | Required | Type | Default | Description |
|---|---|---|---|---|
| `params` | No | `object` | — | Query parameters appended to the URL |
| `bodyType` | No | `'json' \| 'form-data'` | `'json'` | Serialization format |
| `auth` | No | `boolean` | `true` | Whether to enforce the `Authorization` header |

### `client.PATCH(alias, body[, options])`

Identical signature to `client.POST`. Use for partial update requests.

---

## Interceptors

Interceptors are async functions that run before the request is sent (request) or after the response is received (response). Both sync and async are supported, and they execute **in order** — each one receives the output of the previous.

### Request Interceptors

```typescript
type RequestInterceptor = (request: HttpRequest, context: HttpRequest) => HttpRequest | Promise<HttpRequest>
```

- **`request`** — the current request state (may already be modified by a previous interceptor)
- **`context`** — a snapshot of the original request before any interceptors ran; useful for logging or error correlation

```typescript
import type { RequestInterceptor } from '@cruz-roja-puebla/http-client'

const authInterceptor: RequestInterceptor = async (request, context) => {
  const token = localStorage.getItem('token')
  if (token) request.headers.set('Authorization', `Bearer ${token}`)
  return request
}
```

The `HttpRequest` shape:

| Property | Type | Description |
|---|---|---|
| `url` | `string` | Full resolved URL (serverUrl + path + query) |
| `method` | `'GET' \| 'POST' \| 'PATCH' \| 'PUT' \| 'DELETE'` | HTTP method |
| `headers` | `Headers` | Mutable headers object |
| `body` | `BodyInit \| null \| undefined` | Serialized request body |

### Response Interceptors

```typescript
type ResponseInterceptor = (response: Response, context: HttpRequest) => Response | Promise<Response>
```

- **`response`** — the current response (may have been modified by a previous interceptor)
- **`context`** — the original `HttpRequest` that generated this response; useful for logging, retries, or redirects

```typescript
import type { ResponseInterceptor } from '@cruz-roja-puebla/http-client'

const unauthorizedInterceptor: ResponseInterceptor = async (response, context) => {
  if (response.status === 401) {
    console.warn(`Unauthorized on ${context.method} ${context.url}`)
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  return response
}
```

Use the `context` parameter to act on the original request inside a response interceptor. The following example logs and redirects forbidden access attempts:

```typescript
import type { ResponseInterceptor } from "@cruz-roja-puebla/http-client";

import { redirect } from "@tanstack/react-router";

import { getUserProfile } from "@/core/users/services/get-user-profile";

export const forbiddenInterceptor: ResponseInterceptor = async (response, context) => {
    if (response.status === 403) {
        const user = await getUserProfile({ data: { userId: "" } });

        console.warn(
            `User **${user.name}** with id **${user.id}** tried to access the resource [${context.method}] **${context.url}**. \nLogged out by forbidden interceptor.`,
        );

        throw redirect({
            to: "/login",
        });
    }

    return response;
};

``` 

### Wiring interceptors

```typescript
export const client = createHttpClient({
  serverUrl: process.env.API_URL,
  routes: APP_ROUTES,
  interceptors: {
    request: [authInterceptor],
    response: [unauthorizedInterceptor, forbiddenInterceptor],
  },
})
```

---

## Examples

### Server Function (TanStack Start)

```typescript
import { createServerFn } from '@tanstack/react-start'
import { client } from '../utils/http'
import { usersAdapter } from '../adapters/users.adapter'

export const getUsers = createServerFn().handler(async () => {
  const [error, response] = await client.GET('get-users')

  if (error) throw error

  return usersAdapter(response)
})
```

### File upload with `form-data`

```typescript
const [error, result] = await client.POST('upload-avatar', formPayload, {
  bodyType: 'form-data',
})
```

### Public endpoint

```typescript
const [error, session] = await client.POST('login', credentials, {
  auth: false,
})
```

### Advanced Usage

```typescript
import { DATABASE_STATUS } from "@cruz-roja-puebla/specs/constants/status";
import { createServerFn } from "@tanstack/react-start";
import { ZodError } from "zod";
import { format } from "@/lib/time";
import { vacationsClient } from "../utils/http";
import { VACATION_ROUTES } from "../utils/routes";

export const uploadVacation = createServerFn({ method: "POST" })
    .inputValidator((data: FormData) => {
        if (!(data instanceof FormData)) {
            throw new Error("Expected FormData");
        }

        const segment = data.get("segment")?.toString().split(" - ")[0];

        const payload = {
            segment,
            employeeWhoCovers: data.get("employee-who-covers") || undefined,
            days: data.getAll("days"),
        };

        return VACATION_ROUTES["upload-vacation"].clientInput.parse(payload);
    })
    .handler(async ({ data: { days, segment, employeeWhoCovers } }) => {
        const requestDate = new Date();
        const thisYear = new Date().getFullYear();

        const requestYear = `${thisYear}-12-31` as const;

        const requestData = {
            fechaSolicitud: requestDate,
            numDias: days.length,
            estatusVacacion: DATABASE_STATUS.PENDING,
            observaciones: "-",
            segmento: segment,
            fk_cubre: employeeWhoCovers,
            anio_solicitud: requestYear,
            diasVacaciones: days.map((date) => format(date)).toString(),
        };

        const [error, response] = await vacationsClient.POST("upload-vacation", requestData, {
            bodyType: "form-data",
        });

        if (error) {
            if (error instanceof ZodError) {
                return {
                    success: false,
                    error: "Invalid payload data",
                    code: "",
                };
            }

            throw error;
        }

        if (response.status !== 201) {
            return {
                success: false,
                error: "No se pudieron procesar las vacaciones. Intenta más tarde.",
            };
        }

        return {
            success: true,
        };
    });

```

---

## Development & Testing

```bash
# Run the test suite
pnpm test

# Type check
pnpm check-types

# Lint
pnpm lint
```

When contributing:

1. Run tests before committing — `pnpm test`
2. Add or update tests when changing behavior
3. Update this README and the developer docs when adding features
4. New features must not break existing type inference or runtime behavior