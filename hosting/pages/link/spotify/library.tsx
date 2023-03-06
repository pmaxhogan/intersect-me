import {Typography} from "@mui/material";
import {useRouter} from "next/navigation";
import useUser from "../../../hooks/useUser";
import useFirestoreDocument from "../../../hooks/useFirestoreDocument";
import React, {useEffect} from "react";
import CircularProgressWithLabel from "../../../components/CircularProgressWithLabel";
import ForwardButton from "../../../components/ForwardButton";

type UserDocument = {
    count: number;
    lastSync: number;
}

export default function Spotify() {
    const {user, loading, auth} = useUser();
    const {
        firestoreDoc,
        loading: docLoading,
        error
    }: { firestoreDoc: UserDocument, loading: boolean, error: any } = useFirestoreDocument("users", user?.uid ?? null);
    const router = useRouter();
    const [progress, setProgress] = React.useState(0);

    if (!user && !loading) {
        return router.push("/");
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                if(firestoreDoc?.count !== undefined){
                    if(prevProgress < firestoreDoc?.count) {
                        console.log(prevProgress + 1);
                        return Math.min(prevProgress + 50, firestoreDoc?.count);
                    }else{
                        return prevProgress;
                    }
                }else{
                    return 1;
                }
            });
        }, 50);
        return () => {
            clearInterval(timer);
        };
    }, [progress, firestoreDoc]);

    return <div>
        <Typography variant={"h2"} component={"h1"}>Linking Library</Typography>

        <CircularProgressWithLabel value={progress / firestoreDoc?.count * 100} extraText={""}/>

        {firestoreDoc?.count === progress && <div>
            <ForwardButton title={"Continue"} to={"/"}/>
        </div>}
    </div>
}
