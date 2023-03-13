import useUser from "./useUser";
import React from "react";
import useFetchWithAuth from "./useFetchWithAuth";
import {Alert, Snackbar} from "@mui/material";

export default function useApiFetch(requireAuth = true) {
    const {user} = useUser();
    const [error, setError] = React.useState<string | null>(null);
    const [showError, setShowError] = React.useState(false);
    const fetchWithAuth = useFetchWithAuth();


    const closeSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setShowError(false);
    }

    const apiFetch = async (url: string, options?: RequestInit) => {
        if (!user && requireAuth) {
            setError("Not logged in");
            setShowError(true);
            return {status: "error", message: "Not logged in"};
        }
        const {status, message, results} = await (await (requireAuth ? fetchWithAuth : fetch)(url, options)).json();

        if (status === "ok") {
            setError(null);
            setShowError(false);
        } else {
            setError(message);
            setShowError(true);
        }

        return {status, message, results};
    }

    const errorComponent = <Snackbar open={showError} autoHideDuration={3000} onClose={closeSnackbar}>
        <Alert severity="error" onClose={closeSnackbar} sx={{width: "100%"}}>
            {error}
        </Alert>
    </Snackbar>;

    return {errorComponent, apiFetch};
}
