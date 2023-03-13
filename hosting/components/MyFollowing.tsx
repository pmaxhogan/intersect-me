import React, {useEffect, useState} from "react";
import {UsernamesMap} from "../types/api";
import Typography from "@mui/material/Typography";
import useUser from "../hooks/useUser";
import useUserDocument from "../hooks/useUserDocument";
import ResultsStack from "./ResultsStack";
import AddFollowing from "./AddFollowing";
import {useRouter} from "next/navigation";
import ForwardButton from "./ForwardButton";
import useApiFetch from "../hooks/useApiFetch";


export default function MyFollowing() {
    const {user} = useUser();
    const userDoc = useUserDocument();
    const [following, setFollowing] = useState<UsernamesMap>({});
    const router = useRouter();
    const {errorComponent, apiFetch} = useApiFetch();


    useEffect(() => {
        (async () => {
            if (userDoc?.following?.length) {
                const uids = userDoc.following.join(",");
                const {status, message, results} = await apiFetch(`/api/lookup-uids?uids=${uids}`);
                setFollowing(results.usernames);
            } else {
                setFollowing({});
            }
        })();
    }, [userDoc, user]);

    console.log(Object.values(following));
    const followingElements = Object.entries(following).map(([uid, username]) => <ForwardButton to={"/intersect/" + uid}
                                                                                                title={username}/>);
    followingElements.push(<AddFollowing/>);
    return <div>
        <Typography variant={"h2"} component={"h1"}>Following</Typography>
        <ResultsStack elements={followingElements}/>
        {errorComponent}
    </div>;
}