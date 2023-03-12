import React, {useEffect, useState} from "react";
import {LookupUidsResult, UsernamesMap} from "../types/api";
import Typography from "@mui/material/Typography";
import useUser from "../hooks/useUser";
import useUserDocument from "../hooks/useUserDocument";
import ResultsStack from "./ResultsStack";
import AddFollowing from "./AddFollowing";
import useFetchWithAuth from "../hooks/useFetchWithAuth";
import {useRouter} from "next/navigation";
import ForwardButton from "./ForwardButton";


export default function MyFollowing() {
    const {user} = useUser();
    const userDoc = useUserDocument();
    const [following, setFollowing] = useState<UsernamesMap>({});
    const fetchWithAuth = useFetchWithAuth();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            if (userDoc?.following?.length) {
                const uids = userDoc.following.join(",");
                const result = await (await fetchWithAuth(`/api/lookup-uids?uids=${uids}`)).json() as LookupUidsResult;
                setFollowing(result.usernames);
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
    </div>;
}