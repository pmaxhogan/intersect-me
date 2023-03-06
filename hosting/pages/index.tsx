import Link from 'next/link'
import {useState} from "react";
import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import BackButton from "../components/BackButton";
import ResultsStack from "../components/ResultsStack";
import ForwardButton from "../components/ForwardButton";
import {Typography} from "@mui/material";
import ButtonStack from "../components/ButtonStack";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import {useRouter} from "next/navigation";
import useUser from "../hooks/useUser";

type GenericSong = {
    url: string | null;
    albumArt: string;
    providerId: string;
    name: string;
    artist: string;
    lengthSeconds: number;
    provider: "apple" | "spotify";
};

type ApiIntersectResult = {
    intersection: GenericSong[][];
    numSongs1: number;
    numSongs2: number;
};

const provider = new GoogleAuthProvider();

const firebaseConfig = {
    apiKey: "AIzaSyD69xHBIGVYb4WQ8X3bzgI3mCj4qI7KipI",
    authDomain: "intersect-me.firebaseapp.com",
    projectId: "intersect-me",
    storageBucket: "intersect-me.appspot.com",
    messagingSenderId: "38166487240",
    appId: "1:38166487240:web:08c41e3ffbef22e87205fd",
    measurementId: "G-VB1Y72TB5L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export default function IndexPage() {
    const {user, loading, auth} = useUser();

    const signIn = async () => {
        console.log("signing in");
        await signInWithPopup(auth, provider);
    };

    const authSpotify = async () => {
        if(user) {
            const token = await user.getIdToken(true);

            location.href = `/api/spotify-sync?token=${encodeURIComponent(token)}`;
        }
    };

    const intersect = async () => {
        if(user) {
            const token = await user?.getIdToken(true);

            const req = await fetch(`/api/intersect-dummy?username=${encodeURIComponent(username)}&token=${encodeURIComponent(token)}`, {
                method: "POST",
            });
            const res = await req.json() as ApiIntersectResult;
            console.log(res);
            setIntersectionResult(res);
        }
    }

    const [username, setUsername] = useState("");
    const [intersectionResult, setIntersectionResult] = useState(null as ApiIntersectResult | null);

    const router = useRouter();

    return (
        <div>

            <style jsx>{`
                .intersection-row {
                    display: flex;
                    width: 300px;
                    justify-content: space-between;
                }
            `}</style>
            Hello World. <Link href="/about">About</Link>
            <button onClick={signIn}>Sign in with Google</button>
            <button onClick={authSpotify}>Link spotify</button>
            <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)} value={username}/>
            <button onClick={intersect}>Intersect</button>
            {intersectionResult && (
                <div className={"intersection-result"}>
                    {intersectionResult.intersection.map((songs, i) => (
                        <div key={i} className={"intersection-row"}>
                            {songs.map((song, j) => (
                                <div key={j}>
                                    <img src={song.albumArt} width={100} height={100}
                                         alt={song.name + " by " + song.artist}/>
                                    <p>{song.name}</p>
                                    <p>{song.artist}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
            {/*<FluidButton leftIcon={<Avatar sx={{bgcolor: red[500]}}>
                A
            </Avatar>} title="a" subtitle="a"/>*/}
            <ResultsStack elements={[
                <BackButton onClick={() => console.log("hi")}/>,
                <ForwardButton onClick={() => console.log("hi")} title={"Forward"}/>,
                <BackButton onClick={() => console.log("hi")}/>
            ]}/>
            <Typography variant={"h2"} component={"h1"}>Link a Service</Typography>
            <ButtonStack elements={[
                <ForwardButton leftIcon={<MusicNoteIcon/>} to="/link/apple" title={"Apple Music"}/>,
                <ForwardButton leftIcon={<RssFeedIcon/>} to="/link/spotify" title={"Spotify"}/>,
            ]}/>
        </div>
    )
};
