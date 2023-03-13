import EditIcon from "@mui/icons-material/Edit";
import React, {useEffect} from "react";
import Typography from "@mui/material/Typography";
import useUser from "../hooks/useUser";
import {Input, InputAdornment} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import useUserDocument from "../hooks/useUserDocument";
import useApiFetch from "../hooks/useApiFetch";

export default function UsernameEditor() {
    const {user} = useUser();
    const firestoreDoc = useUserDocument();
    const [editingUsername, setEditingUsername] = React.useState(false);
    const [usernameDraft, setUsernameDraft] = React.useState(firestoreDoc?.username ?? "");
    const {errorComponent, apiFetch} = useApiFetch();

    useEffect(() => {
        setUsernameDraft(firestoreDoc?.username ?? "");
    }, [user, firestoreDoc?.username]);

    const keyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        // did press enter
        if (e.key === "Enter" && user?.uid) {
            const {status, message, results} = await apiFetch(`/api/update-username?username=${usernameDraft}`, {
                method: "POST"
            });

            if (status === "ok") {
                setEditingUsername(false);
            }
        }
        if (e.key === "Escape") setEditingUsername(false);
    };

    const editButton = () => {
        setEditingUsername(true);
    };

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
            {errorComponent}
        </Typography>
    </ClickAwayListener>;
}