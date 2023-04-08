import type GenericSong from "../types/genericSong";
import {getLikes} from "./db.js";
import {compareSongs} from "./compareSongs.js";

export const intersect = (songs: GenericSong[], songs2: GenericSong[]): GenericSong[][] => {
    console.time("intersect");
    const usedSong1s = new Set();
    const usedSong2s = new Set();

    const intersectedSongs: GenericSong[][] = [];
    songs2.forEach((song2) => {
        let found = false;
        songs.forEach((song) => {
            if (!found && compareSongs(song, song2) && !usedSong1s.has(song.url) && !usedSong2s.has(song2.url)) {
                intersectedSongs.push([song, song2]);
                usedSong1s.add(song.url);
                usedSong2s.add(song2.url);
                found = true;
            }
        });
    });
    console.timeEnd("intersect");
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
