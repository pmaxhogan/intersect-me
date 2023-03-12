import React from "react";
import {initializeApp} from "firebase/app";
import ForwardButton from "../components/ForwardButton";
import {Typography} from "@mui/material";
import ButtonStack from "../components/ButtonStack";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import useUser from "../hooks/useUser";
import MySongs from "../components/MySongs";
import MyFollowing from "../components/MyFollowing";
import useFetchWithAuth from "../hooks/useFetchWithAuth";


// todo: remove
const firebaseConfig = {
    apiKey: "AIzaSyD69xHBIGVYb4WQ8X3bzgI3mCj4qI7KipI",
    authDomain: "intersect-me.firebaseapp.com",
    projectId: "intersect-me",
    storageBucket: "intersect-me.appspot.com",
    messagingSenderId: "38166487240",
    appId: "1:38166487240:web:08c41e3ffbef22e87205fd",
    measurementId: "G-VB1Y72TB5L"
};

initializeApp(firebaseConfig);


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
            <MySongs/>
            <Typography variant={"h2"} component={"h1"}>Link a Service</Typography>
            <ButtonStack elements={[
                <ForwardButton leftIcon={<MusicNoteIcon/>} to="/link/apple" title={"Apple Music"}/>,
                <ForwardButton leftIcon={<RssFeedIcon/>} to="/link/spotify" title={"Spotify"}/>,
            ]}/>
        </main>
    )
};
