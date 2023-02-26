import GenericSong from "./genericSong";
import {getStorage} from "firebase-admin/storage";
import {getFirestore} from "firebase-admin/firestore";

export const saveLikes = async (uid: string, liked: GenericSong[]) => {
    const storage = getStorage();
    const bucket = storage.bucket();

    const folder = "uploaded";
    const filename = `${uid}.json`;

    const store: LikedSongsStore = {liked};

    const file = bucket.file(`${folder}/${filename}`);
    const json = JSON.stringify(store);

    await file.save(json, {
        contentType: "application/json", /*
        metadata: {
            metadata: {
                firebaseStorageDownloadTokens: Date.now().toString(),
            },
        },*/
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

export const updateMeta = async (uid: string, count: UserMeta) => {
    const db = getFirestore();
    const doc = db.collection("users").doc(uid);
    const meta = await doc.get();
    if (!meta.exists) {
        await doc.set(count);
    } else {
        await doc.update(count);
    }
};

export const usernameToUid = async (username: string): Promise<string> => {
    const db = getFirestore();
    const doc = db.collection("users").where("username", "==", username).limit(1);
    const meta = await doc.get();
    if (!meta.size) {
        throw new Error("Username not found");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return meta.docs[0].id;
};

type UserMeta = {
    username?: string;
    count?: number;
    lastSync?: number;
};

type LikedSongsStore = {
    liked: GenericSong[];
}
