import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Persistent session token store.
 *
 * Mobile counterpart to the dashboard's httpOnly cookie session. On native it
 * uses the OS keystore/keychain via `expo-secure-store`; on web (where
 * SecureStore is unavailable) it falls back to `localStorage`.
 */
const SESSION_KEY = "session";

const isWeb = Platform.OS === "web";

export async function getSessionToken(): Promise<string | null> {
	if (isWeb) {
		return globalThis.localStorage?.getItem(SESSION_KEY) ?? null;
	}
	return SecureStore.getItemAsync(SESSION_KEY);
}

export async function setSessionToken(token: string): Promise<void> {
	if (isWeb) {
		globalThis.localStorage?.setItem(SESSION_KEY, token);
		return;
	}
	await SecureStore.setItemAsync(SESSION_KEY, token);
}

export async function clearSessionToken(): Promise<void> {
	if (isWeb) {
		globalThis.localStorage?.removeItem(SESSION_KEY);
		return;
	}
	await SecureStore.deleteItemAsync(SESSION_KEY);
}
