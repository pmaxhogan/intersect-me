import EditIcon from "@mui/icons-material/Edit";
import React, {useEffect} from "react";
import Typography from "@mui/material/Typography";
import useUser from "../hooks/useUser";
import {Alert, Input, InputAdornment, Snackbar} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import useUserDocument from "../hooks/useUserDocument";
import useFetchWithAuth from "../hooks/useFetchWithAuth";

export default function UsernameEditor() {
    const {user} = useUser();
    const firestoreDoc = useUserDocument();
    const [editingUsername, setEditingUsername] = React.useState(false);
    const [usernameDraft, setUsernameDraft] = React.useState(firestoreDoc?.username ?? "");
    const fetchWithAuth = useFetchWithAuth();

    const [error, setError] = React.useState<string | null>(null);
    const [showError, setShowError] = React.useState(false);

    useEffect(() => {
        setUsernameDraft(firestoreDoc?.username ?? "");
    }, [user, firestoreDoc?.username]);

    const keyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        // did press enter
        if (e.key === "Enter" && user?.uid) {
            const {status, message} = await (await fetchWithAuth(`/api/update-username?username=${usernameDraft}`, {
                method: "POST"
            })).json();

            if (status === "ok") {
                setEditingUsername(false);
                setError(null);
                setShowError(false);
            } else {
                setError(message);
                setShowError(true);
            }
        }
        if (e.key === "Escape") setEditingUsername(false);
    };

    const editButton = () => {
        setEditingUsername(true);
    };

    const closeSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setShowError(false);
    }

    return <ClickAwayListener onClickAway={() => setEditingUsername(false)}>
        <Typography variant="h6" component="div">
            {user ? <>{editingUsername ?
                <Input autoFocus onKeyDown={keyDown} onChange={(e) => setUsernameDraft(e.target.value)}
                       value={usernameDraft}
                       startAdornment={<InputAdornment position="start"><AccountCircle/></InputAdornment>}/>
                : <>{firestoreDoc?.username ?? "<no username>"}<IconButton aria-label="delete"
                                                                           onClick={editButton}>
                    <EditIcon/>
                </IconButton></>}</> : "Signed Out"}
            <Snackbar open={showError} autoHideDuration={3000} onClose={closeSnackbar}>
                <Alert severity="error" onClose={closeSnackbar} sx={{width: "100%"}}>
                    {error}
                </Alert>
            </Snackbar>
        </Typography>
    </ClickAwayListener>;
}