import useUser from "./useUser";

export default function useFetchWithAuth() {
    const {user, loading, auth} = useUser();

    return async function fetchWithAuth(url: string, options: RequestInit = {}) {
        if (loading) {
            throw new Error("User is loading");
        }
        if (!user) {
            throw new Error("User is not logged in");
        }
        const idToken = await user.getIdToken();
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "x-auth-key": idToken
            }
        });
    }
}