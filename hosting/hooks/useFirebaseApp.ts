import {initializeApp} from "firebase/app";

export default function useFirebaseApp() {
    const firebaseConfig = {
        apiKey: "AIzaSyD69xHBIGVYb4WQ8X3bzgI3mCj4qI7KipI",
        authDomain: "intersect-me.firebaseapp.com",
        projectId: "intersect-me",
        storageBucket: "intersect-me.appspot.com",
        messagingSenderId: "38166487240",
        appId: "1:38166487240:web:08c41e3ffbef22e87205fd",
        measurementId: "G-VB1Y72TB5L"
    };


    return initializeApp(firebaseConfig);
}