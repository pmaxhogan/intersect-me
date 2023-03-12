import React from "react";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import IconButton from "@mui/material/IconButton";
import {Stack} from "@mui/system";
import {Card, TextField} from "@mui/material";
import useUser from "../hooks/useUser";
import useFetchWithAuth from "../hooks/useFetchWithAuth";

export default function AddFollowing() {
    const {user} = useUser();
    const [username, setUsername] = React.useState("");
    const fetchWithAuth = useFetchWithAuth();

    const addFriend = async () => {
        if (username === "" || !user) return;
        await fetchWithAuth("/api/add-following?following=" + encodeURIComponent(username), {
            method: "POST"
        });
        setUsername("");
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
            />
            <IconButton aria-label="Add" onClick={addFriend}>
                <PersonAddAlt1Icon/>
            </IconButton>
        </Stack>
    </Card>;
}