import * as functions from "firebase-functions";
import SpotifyWebApi from "spotify-web-api-node";
import setup from "./util/setup.js";
import express from "express";
import {getLikedSongs, getSpotifyApi} from "./util/spotify.js";
import {decrypt, encrypt} from "./util/crypto.js";
import {getAuth} from "firebase-admin/auth";
import {getLikes, getUserDoc, saveLikes, uidToUsername, updateMeta, usernameToUid} from "./util/db.js";
import {intersectUids} from "./util/intersect.js";

import authenticate, {AuthenticatedRequest} from "./util/authenticate.js";
import {validateUsername} from "./util/validateUsername.js";

setup();

const MAX_UIDS = 10000;


const auth = getAuth();
const app = express();

app.get("/", (req, res) => {
    res.send("hello/");
});

app.get("/api", (req, res) => {
    res.send("hello/api");
});

app.get("/api/spotify-sync", async (req, res) => {
    const authKey = req.headers["x-auth-key"] || req.query["token"];
    if (typeof authKey !== "string") {
        res.send("error");
        return;
    }

    const {uid} = await auth.verifyIdToken(authKey);
    console.log("uid", uid);


    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.NODE_ENV === "production" ? process.env.SPOTIFY_REDIRECT_URI_PROD : process.env.SPOTIFY_REDIRECT_URI_LOCAL,
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    const scopes = "user-library-read user-follow-read playlist-read-private playlist-read-collaborative user-top-read user-read-recently-played".split(" ");
    const url = spotifyApi.createAuthorizeURL(scopes, await encrypt(authKey));

    console.log("spotify", url);
    res.redirect(url);
});

app.get("/api/redirect", async (req, res) => {
    const {code, state} = req.query ? req.query : {code: null, state: null};
    console.log("redirect", code, state);

    if (typeof code !== "string" || typeof state !== "string") {
        res.send("error");
        return;
    }

    const decrypted = await decrypt(state);
    console.log("decrypted", decrypted);
    console.log("redirect", code);

    const {uid} = await auth.verifyIdToken(decrypted);
    console.log("grabbed UID from state", uid);

    const spotifyApi = getSpotifyApi();
    const {body} = await spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(body.access_token);
    spotifyApi.setRefreshToken(body.refresh_token);

    const liked = await getLikedSongs(spotifyApi);

    await saveLikes(uid, liked);
    await updateMeta(uid, {
        count: liked.length,
        lastSync: Date.now(),
    });

    res.redirect("/");
});

app.post("/api/intersect", authenticate, async (req, res) => {
    const destUid = req.query["uid"];
    if (typeof destUid !== "string") {
        res.send("error");
        return;
    }

    const {uid: myUid} = (req as AuthenticatedRequest).user;

    const intersections = await intersectUids(myUid, destUid);

    res.json(intersections);
});

app.get("/api/my-songs", authenticate, async (req, res) => {
    const {uid} = (req as AuthenticatedRequest).user;
    console.log("uid", uid);

    const songs = await getLikes(uid);
    res.json({songs});
});

app.get("/api/lookup-uids", authenticate, async (req, res) => {
    const uids = req.query["uids"];
    if (typeof uids !== "string") {
        res.send("error");
        return;
    }
    const split = uids.split(",");
    if (split.length === 0 || split.length > MAX_UIDS) {
        res.send("error");
        return;
    }

    // convert to usernames
    const usernames = await Promise.all(split.map(async (uid) => {
        const username = await uidToUsername(uid);
        return [uid, username];
    }));
    res.json({usernames: Object.fromEntries(usernames)});
});

app.post("/api/add-following", authenticate, async (req, res) => {
    const newFollowing = req.query["following"];
    functions.logger.log("newFollowing", newFollowing);
    if (typeof newFollowing !== "string" || !validateUsername(newFollowing)) {
        functions.logger.log("invalid username");
        res.send("error");
        return;
    }
    let newFollowingUid;

    try {
        newFollowingUid = await usernameToUid(newFollowing);
    } catch (e) {
        res.status(404);
        res.send("error");
        return;
    }

    const {uid} = (req as AuthenticatedRequest).user;
    const doc = await getUserDoc(uid);
    const following = doc?.following || [];

    if (following.includes(newFollowing)) {
        res.send("ok");
        return;
    }

    following.push(newFollowingUid);

    await updateMeta(uid, {
        following,
    });
});

app.post("/api/update-username", authenticate, async (req, res) => {
    const username = req.query["username"];
    if (typeof username !== "string" || !validateUsername(username)) {
        res.send({status: "error", message: "Invalid username"});
        return;
    }

    const {uid} = (req as AuthenticatedRequest).user;
    console.log("uid", uid);

    // check if username is taken
    try {
        const uid2 = await usernameToUid(username);
        if (uid2 && uid !== uid2) {
            res.send({status: "error", message: "Username is taken"});
            return;
        }
    } catch (ignored) {
        // ignore
    }

    await updateMeta(uid, {
        username,
    });

    res.send({status: "ok"});
});

export const api = functions.https.onRequest(app);


