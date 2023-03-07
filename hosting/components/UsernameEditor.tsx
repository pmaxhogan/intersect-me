import EditIcon from '@mui/icons-material/Edit';
import React from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FluidButton from "./FluidButton";
import {useRouter} from "next/navigation";
import Typography from "@mui/material/Typography";
import useUser from "../hooks/useUser";
import useFirestoreDocument from "../hooks/useFirestoreDocument";
import {InputAdornment, Input} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import {doc, Firestore, updateDoc} from "firebase/firestore";
import useFirestore from "../hooks/useFirestore";

export default function UsernameEditor({onClick}: { onClick?: () => void }) {
    const {user, loading: userLoading, auth} = useUser();
    const {firestoreDoc, loading, error} = useFirestoreDocument("users", user?.uid ?? null);
    const [editingUsername, setEditingUsername] = React.useState(false);
    const [usernameDraft, setUsernameDraft] = React.useState(firestoreDoc?.username ?? "");
    const firestore: Firestore = useFirestore();

    const keyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        // did press enter
        if (e.key === "Enter" && user?.uid) {
            const document = doc(firestore, "users", user.uid);
            await updateDoc(document, "username", usernameDraft);
            setEditingUsername(false);
        }
    };

    const router = useRouter();
    return <Typography variant="h6" component="div">
        {user ? <>{editingUsername ? <Input onKeyDown={keyDown} onChange={(e) => setUsernameDraft(e.target.value)} value={usernameDraft} startAdornment={<InputAdornment position="start"><AccountCircle/></InputAdornment>}
        /> : <>{firestoreDoc?.username ?? "<no username>"}<IconButton aria-label="delete" onClick={() => setEditingUsername(true)}>
            <EditIcon/>
        </IconButton></>}</> : "Signed Out"}
    </Typography>;
}