import {Typography} from "@mui/material";
import ForwardButton from "../../../components/ForwardButton";
import ResultsStack from "../../../components/ResultsStack";
import useUser from "../../../hooks/useUser";
import useUserDocument from "../../../hooks/useUserDocument";
import {useRouter} from "next/router";
import React from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import FluidButton from "../../../components/FluidButton";

export default function Spotify() {
    const {user, loading} = useUser();
    const userDoc = useUserDocument();
    const router = useRouter();

    if (loading || !user || !userDoc) {
        return <div>Loading...</div>;
    }

    const linkPlaylist = async (playlistId: string) => {
        if (user) {
            const token = await user.getIdToken(true);

            location.href = `/api/spotify-sync?playlistId=${playlistId}&token=${encodeURIComponent(token)}`;
        }
    }

    const elements = [
        <FluidButton leftIcon={<ArrowBackIosNewIcon/>} title="Back" mainAction={() => router.push("/link/spotify")}/>
    ];

    for (const playlist of (userDoc.playlists || [])) {
        elements.push(<ForwardButton title={playlist.name} onClick={() => linkPlaylist(playlist.id)}/>)
    }
    return <div>
        <Typography variant={"h2"} component={"h1"}>Choose What to Link</Typography>
        <ResultsStack elements={elements}/>
    </div>
}
