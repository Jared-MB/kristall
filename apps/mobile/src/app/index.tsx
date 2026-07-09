import { Redirect } from "expo-router";

// Ruta de entrada "/": redirige a la home autenticada. Si no hay sesión, el
// guard del layout raíz (Stack.Protected) intercepta y lleva a login.
export default function Index() {
	return <Redirect href="/home" />;
}
