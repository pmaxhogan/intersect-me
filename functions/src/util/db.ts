import GenericSong from "../types/genericSong";
import {getStorage} from "firebase-admin/storage";
import {getFirestore} from "firebase-admin/firestore";
import {validateUsername} from "./validateUsername.js";

export const saveLikes = async (uid: string, liked: GenericSong[]) => {
    const storage = getStorage();
    const bucket = storage.bucket();

    const folder = "uploaded";
    const filename = `${uid}.json`;

    const store: LikedSongsStore = {liked};

    const file = bucket.file(`${folder}/${filename}`);
    const json = JSON.stringify(store);

    await file.save(json, {
        contentType: "application/json",
    });

    console.log(`Array uploaded as JSON to gs://${bucket.name}/${folder}/${filename}`);
};

export const getLikes = async (uid: string): Promise<GenericSong[]> => {
    const storage = getStorage();
    const bucket = storage.bucket();

    const folder = "uploaded";
    const filename = `${uid}.json`;

    const file = bucket.file(`${folder}/${filename}`);
    const [exists] = await file.exists();
    if (!exists) {
        return [];
    }

    const [buffer] = await file.download();
    const json = buffer.toString("utf8");
    const result = JSON.parse(json) as LikedSongsStore;
    return result.liked;
};

export const updateMeta = async (uid: string, document: UserMeta) => {
    console.log("updating meta", uid, document);
    const db = getFirestore();
    const doc = db.collection("users").doc(uid);
    const meta = await doc.get();
    if (!meta.exists) {
        await doc.set(document);
    } else {
        await doc.update(document);
    }
};

export const usernameToUid = async (username: string): Promise<string> => {
    if (!validateUsername(username)) {
        throw new Error("Invalid username");
    }
    const db = getFirestore();
    const doc = db.collection("users").where("username", "==", username.toLowerCase()).limit(1);
    const meta = await doc.get();
    if (!meta.size) {
        throw new Error("Username not found");
    }

    return meta.docs[0].id;
};

export const getUserDoc = async (uid: string): Promise<UserMeta | undefined> => {
    console.log("getting user doc", uid);
    const db = getFirestore();
    const doc = db.collection("users").doc(uid);
    const meta = await doc.get();
    if (!meta.exists) {
        await updateMeta(uid, {});
        return {};
    }

    return meta?.data();
};

export const deleteUser = async (uid: string) => {
    const db = getFirestore();
    const doc = db.collection("users").doc(uid);
    const meta = await doc.get();
    if (meta.exists) {
        await doc.delete();
    }

    const storage = getStorage();
    const bucket = storage.bucket();

    const folder = "uploaded";
    const filename = `${uid}.json`;

    const file = bucket.file(`${folder}/${filename}`);
    const [exists] = await file.exists();
    if (exists) {
        await file.delete();
    }
};

export const uidToUsername = async (uid: string): Promise<string | undefined> => {
    return (await getUserDoc(uid))?.username;
};

type uid = string;

type UserMeta = {
    username?: string;
    count?: number;
    lastSync?: number;
    following?: uid[];
};

type LikedSongsStore = {
    liked: GenericSong[];
}
