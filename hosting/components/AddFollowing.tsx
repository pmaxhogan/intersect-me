import React from "react";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import IconButton from "@mui/material/IconButton";
import {Stack} from "@mui/system";
import {Card, TextField} from "@mui/material";
import useUser from "../hooks/useUser";
import useApiFetch from "../hooks/useApiFetch";

export default function AddFollowing() {
    const {user} = useUser();
    const [username, setUsername] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const {errorComponent, apiFetch} = useApiFetch();

    const addFriend = async () => {
        if (username === "" || !user) return;
        setLoading(true);

        const {status, message} = await apiFetch("/api/add-following?following=" + encodeURIComponent(username), {
            method: "POST"
        });

        if (status === "ok") {
            setUsername("");
        }
        setLoading(false);
    };

    const handleInput = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            // noinspection JSIgnoredPromiseFromCall
            addFriend();
        }
    }

    return <Card>
        <Stack direction="row" spacing={1} alignItems="center" padding={1}>
            <TextField
                label="Enter username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyUp={handleInput}
                fullWidth
                disabled={loading}
            />
            <IconButton aria-label="Add" onClick={addFriend}>
                <PersonAddAlt1Icon/>
            </IconButton>
        </Stack>
        {errorComponent}
    </Card>;
}