import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {GenericSong, GetSongsResult} from "../types/api";
import Typography from "@mui/material/Typography";
import useUser from "../hooks/useUser";
import SongsResults from "./SongsResults";
import useApiFetch from "../hooks/useApiFetch";


export default function MySongs() {
    const router = useRouter();
    const {user, loading} = useUser();
    const [mySongs, setMySongs] = useState(null as GenericSong[] | null);
    const {errorComponent, apiFetch} = useApiFetch();

    const [search, setSearch] = React.useState("");

    useEffect(() => {
        (async () => {
            if (user) {
                const {status, message, results} = await apiFetch(`/api/my-songs`);
                const {songs} = results as GetSongsResult;
                setMySongs(songs);
            }
        })();
    }, [user]);

    if (mySongs === null) return <div>Loading...</div>;


    return <div>
        <Typography variant={"h2"} component={"h1"}>My Songs</Typography>
        <SongsResults songs={mySongs}/>
        {errorComponent}
    </div>;
}