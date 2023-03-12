import React from "react";
import ForwardButton from "../components/ForwardButton";
import {Typography} from "@mui/material";
import ButtonStack from "../components/ButtonStack";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import useUser from "../hooks/useUser";
import MySongs from "../components/MySongs";
import MyFollowing from "../components/MyFollowing";
import useFetchWithAuth from "../hooks/useFetchWithAuth";

export default function IndexPage() {
    const {user, loading} = useUser();
    const fetchWithAuth = useFetchWithAuth();

    return (
        <main>
            <style jsx>{`
              .intersection-row {
                display: flex;
                width: 300px;
                justify-content: space-between;
              }
            `}</style>
            <MyFollowing/>
            <Typography variant={"h2"} component={"h1"}>Link a Service</Typography>
            <ButtonStack elements={[
                <ForwardButton leftIcon={<MusicNoteIcon/>} to="/link/apple" title={"Apple Music"}/>,
                <ForwardButton leftIcon={<RssFeedIcon/>} to="/link/spotify" title={"Spotify"}/>,
            ]}/>
            <MySongs/>
        </main>
    )
};
