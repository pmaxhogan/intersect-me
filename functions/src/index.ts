import {config} from "dotenv";
config();

import * as functions from "firebase-functions";
import SpotifyWebApi from "spotify-web-api-node";

import express from "express";
import {getLikedSongs, getSpotifyApi} from "./spotify.js";
import {decrypt, encrypt} from "./crypto.js";
import {getAuth} from "firebase-admin/auth";
import {initializeApp} from "firebase-admin/app";
import {saveLikes, updateMeta, usernameToUid} from "./db.js";
import {intersectUids} from "./intersect.js";

initializeApp();

const auth = getAuth();

import intersection from "./intersection.json" assert { type: "json" };


const app = express();


app.get("/api/spotify-sync", async (req, res) => {
    const authKey = req.headers["x-auth-key"] || req.query["token"];
    if (typeof authKey !== "string") {
        res.send("error");
        return;
    }

    const {uid} = await auth.verifyIdToken(authKey);
    console.log("uid", uid);


    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.SPOTIFY_REDIRECT_URI,
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

app.post("/api/intersect", async (req, res) => {
    const authKey = req.headers["x-auth-key"] || req.query["token"];
    const username = req.query["username"];
    if (typeof authKey !== "string" || typeof username !== "string") {
        res.send("error");
        return;
    }

    const {uid} = await auth.verifyIdToken(authKey);
    console.log("uid", uid);
    const uid2 = await usernameToUid(username);

    const intersections = await intersectUids(uid, uid2);

    console.log(intersections);

    res.json(intersections);
});

app.post("/api/intersect-dummy", async (req, res) => {
    res.json(intersection);
});

export const api = functions.https.onRequest(app);


