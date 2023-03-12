import type GenericSong from "./types/genericSong";
import {getLikes} from "./db.js";

// ew
const replaceMe = /\W[([ ]?(feat. [^)\n]+|(Live( [0-9]+)?|Remastered|Radio|Original|Extended|[0-9]+),?( (Edit|Recording|Mix|Version|Remaster|[0-9]+))*)[ \])]?|\(From [^)]+\)/gi;
const cleanUp = (str: string) => str.toLowerCase().replace(replaceMe, " ").replace(/[^A-Za-z0-9]/g, " ").replace(/ {2,}/g, " ").trim();

const startsWithCross = (a: string, b: string) => cleanUp(a).startsWith(cleanUp(b)) || cleanUp(b).startsWith(cleanUp(a));

export const intersect = (songs: GenericSong[], songs2: GenericSong[]): GenericSong[][] => {
    const intersectedSongs: GenericSong[][] = [];
    songs2.forEach((song2) => {
        let found = false;
        songs.forEach((song) => {
            if (!found && startsWithCross(song.name, song2.name) && startsWithCross(song.artist, song2.artist)) {
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
