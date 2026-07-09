import AppTabs from "@/components/app-tabs";

export default function ProtectedLayout() {
	// El guard de sesión vive en el layout raíz (Stack.Protected). Aquí solo
	// se monta el navegador de tabs para las pantallas autenticadas.
	return <AppTabs />;
}
