import React, {useEffect, useState} from "react";
import useUserDocument from "../../hooks/useUserDocument";
import {ApiIntersectResult} from "../../types/api";
import useUser from "../../hooks/useUser";
import {Typography} from "@mui/material";
import {useRouter} from "next/router";
import SongsResults from "../../components/SongsResults";
import useApiFetch from "../../hooks/useApiFetch";


export default function IntersectUid() {
    const {user, loading} = useUser();
    const userDoc = useUserDocument();
    const [username, setUsername] = useState<string>("");
    const router = useRouter();
    const {uid} = router.query;
    const [intersectionResult, setIntersectionResult] = useState(null as ApiIntersectResult | null);
    const {errorComponent, apiFetch} = useApiFetch();

    useEffect(() => {
        (async () => {
            if (!uid || typeof uid !== "string" || loading) return;

            const {status, message, results: usernameResult} = await apiFetch(`/api/lookup-uids?uids=${uid}`);

            if (status === "ok") {
                setUsername(usernameResult.usernames[uid] || "Unknown Username");

                const {
                    status,
                    message,
                    results: intersectResults
                } = await apiFetch(`/api/intersect?uid=${encodeURIComponent(uid)}`, {
                    method: "POST"
                });
                const res = intersectResults as ApiIntersectResult;
                console.log(res);
                setIntersectionResult(res);
            } else {
                setIntersectionResult(null);
            }
        })();
    }, [userDoc, user]);

    if (loading || !username) return <div>Loading...</div>;

    return <div>
        <Typography variant={"h2"} component={"h1"}>User: {username}</Typography>
        <Typography variant={"h3"} component={"h2"}>You Both Like</Typography>
        {intersectionResult && <SongsResults songs={intersectionResult.intersection.map(x => x[0])}/>}
        {errorComponent}
    </div>;
}