import {config} from "dotenv";
import * as functions from "firebase-functions";
import SpotifyWebApi from "spotify-web-api-node";

import express, {Request, Response, NextFunction} from "express";
import {getLikedSongs, getSpotifyApi} from "./spotify.js";
import {decrypt, encrypt} from "./crypto.js";
import {getAuth} from "firebase-admin/auth";
import {initializeApp} from "firebase-admin/app";
import {getLikes, saveLikes, updateMeta, usernameToUid} from "./db.js";
import {intersectUids} from "./intersect.js";
import intersection from "./intersection.json" assert {type: "json"};

import {DecodedIdToken} from "firebase-admin/lib/auth/token-verifier";

config();

initializeApp();

const auth = getAuth();
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

type AuthenticatedRequest = Request & { user: DecodedIdToken };

/**
 * Middleware to authenticate a request
 * @param {AuthenticatedRequest} req request
 * @param {Response} res response
 * @param {NextFunction} next next function
 */
async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authKey = req.headers["x-auth-key"] || req.query["token"];
    if (typeof authKey !== "string") {
        res.send("error");
        return;
    }
    req.user = await auth.verifyIdToken(authKey);
    next();
}

app.post("/api/intersect", authenticate as never, async (req, res) => {
    const username = req.query["username"];
    if (typeof username !== "string") {
        res.send("error");
        return;
    }

    const {uid} = (req as AuthenticatedRequest).user;
    console.log("uid", uid);
    const uid2 = await usernameToUid(username);

    const intersections = await intersectUids(uid, uid2);

    console.log(intersections);

    res.json(intersections);
});

app.get("/api/my-songs", authenticate as never, async (req, res) => {
    const {uid} = (req as AuthenticatedRequest).user;
    console.log("uid", uid);

    const songs = await getLikes(uid);
    res.json({songs});
});

app.post("/api/intersect-dummy", async (req, res) => {
    res.json(intersection);
});

// TODO: validate username
const validateUsername = (username: string) => username.length > 0 && username.length < 20;

app.post("/api/update-username", authenticate as never, async (req, res) => {
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


