import type GenericSong from "../types/genericSong";
import {getLikes} from "./db.js";
import {cleanUp, compareSongs} from "./compareSongs.js";

export const intersect = (songs: GenericSong[], songs2: GenericSong[]): GenericSong[][] => {
    console.log(songs);
    const intersectedSongs: GenericSong[][] = [];
    songs2.forEach((song2) => {
        let found = false;
        songs.forEach((song) => {
            if (cleanUp(song.name).includes("me out of") && cleanUp(song2.name).includes("me out of")) console.log(cleanUp(song.artist), cleanUp(song2.artist));
            if (!found && compareSongs(song, song2)) {
                intersectedSongs.push([song, song2]);
                found = true;
            }
        });
    });
    return intersectedSongs;
};

export const intersectUids = async (uid1: string, uid2: string): Promise<ApiIntersectResult> => {
    const [likesU1, likesU2] = await Promise.all([getLikes(uid1), getLikes(uid2)]);
    return {intersection: intersect(likesU1, likesU2), numSongs1: likesU1.length, numSongs2: likesU2.length};
};

type ApiIntersectResult = {
    intersection: GenericSong[][];
    numSongs1: number;
    numSongs2: number;
};
