import React, {useEffect, useState} from "react";
import useUserDocument from "../../hooks/useUserDocument";
import {ApiIntersectResult, LookupUidsResult} from "../../types/api";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";
import useUser from "../../hooks/useUser";
import {Typography} from "@mui/material";
import {useRouter} from "next/router";
import SongsResults from "../../components/SongsResults";


export default function IntersectUid() {
    const {user, loading} = useUser();
    const userDoc = useUserDocument();
    const [username, setUsername] = useState<string>("");
    const fetchWithAuth = useFetchWithAuth();
    const router = useRouter();
    const {uid} = router.query;
    const [intersectionResult, setIntersectionResult] = useState(null as ApiIntersectResult | null);

    useEffect(() => {
        (async () => {
            if (!uid || typeof uid !== "string" || loading) return;

            const result = await (await fetchWithAuth(`/api/lookup-uids?uids=${uid}`)).json() as LookupUidsResult;
            setUsername(result.usernames[uid] || "Unknown Username");

            const req = await fetchWithAuth(`/api/intersect?username=${encodeURIComponent(username)}`, {
                method: "POST"
            });
            const res = await req.json() as ApiIntersectResult;
            console.log(res);
            setIntersectionResult(res);
        })();
    }, [userDoc, user]);

    if (loading || !username) return <div>Loading...</div>;

    return <div>
        <Typography variant={"h2"} component={"h1"}>User: {username}</Typography>
        <Typography variant={"h3"} component={"h2"}>You Both Like</Typography>
        {intersectionResult && <SongsResults songs={intersectionResult.intersection.map(x => x[0])}/>}
    </div>;
}