import Link from 'next/link'
import {useState} from "react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const signIn = async () => {

    const auth = getAuth();
    try {
        const result = await signInWithPopup(auth, provider);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log(token);
    } catch (error) {
        const {code, message} = error;
        console.log(code, message);
    }
};

const authSpotify = async () => {
    const token = await auth.currentUser.getIdToken(true);

    location.href = `/api/spotify-sync?token=${encodeURIComponent(token)}`;

    // const response = await fetch(`/api/spotify-sync?token=${encodeURIComponent(token)}`, {
    //     headers: {
    //         "x-auth-key": token
    //     },
    //     redirect: "manual"
    // });
    // console.log(response);
    // if (response.redirected) {
    //     window.location.href = response.url;
    // }
}
// auth.currentUser.getIdToken(true).then(function(idToken) {
//     console.log(idToken);
// });


export default function IndexPage() {
    const intersect = async () => {
        const token = await auth.currentUser.getIdToken(true);

        const req = await fetch(`/api/intersect?username=${encodeURIComponent(username)}&token=${encodeURIComponent(token)}`, {
            method: "POST",
        });
        const res = await req.json();
        console.log(res);
    }

    const [username, setUsername] = useState("");

    return (
        <div>
            Hello World. <Link href="/about">About</Link>
            <button onClick={signIn}>Sign in with Google</button>
            <button onClick={authSpotify}>Link spotify</button>
            <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)} value={username}/>
            <button onClick={intersect}>Intersect</button>
        </div>
    )
};