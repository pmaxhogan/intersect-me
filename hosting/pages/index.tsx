import React, {useState} from "react";
import {initializeApp} from "firebase/app";
import ForwardButton from "../components/ForwardButton";
import {Typography} from "@mui/material";
import ButtonStack from "../components/ButtonStack";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import {useRouter} from "next/navigation";
import useUser from "../hooks/useUser";
import {ApiIntersectResult} from "../types/api";
import SongsResults from "../components/SongsResults";
import MySongs from "../components/MySongs";


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
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [intersectionResult, setIntersectionResult] = useState(null as ApiIntersectResult | null);

    if (!loading && !user) {
        router.push("/signin");
    }

    const intersect = async () => {
        if (user) {
            const token = await user?.getIdToken(true);

            const req = await fetch(`/api/intersect-dummy?username=${encodeURIComponent(username)}`, {
                method: "POST",
                headers: {
                    "x-auth-key": await user.getIdToken(),
                }
            });
            const res = await req.json() as ApiIntersectResult;
            console.log(res);
            setIntersectionResult(res);
        }
    };

    return (
        <main>
            <style jsx>{`
              .intersection-row {
                display: flex;
                width: 300px;
                justify-content: space-between;
              }
            `}</style>
            <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)} value={username}/>
            <button onClick={intersect}>Intersect</button>
            {intersectionResult && <SongsResults songs={intersectionResult.intersection.map(x => x[0])}/>}
            <MySongs/>
            <Typography variant={"h2"} component={"h1"}>Link a Service</Typography>
            <ButtonStack elements={[
                <ForwardButton leftIcon={<MusicNoteIcon/>} to="/link/apple" title={"Apple Music"}/>,
                <ForwardButton leftIcon={<RssFeedIcon/>} to="/link/spotify" title={"Spotify"}/>,
            ]}/>
        </main>
    )
};
