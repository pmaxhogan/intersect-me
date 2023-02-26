import type GenericSong from "./genericSong";
import {getLikes} from "./db.js";

// .replaceAll(/[\.\(\)\[\]<>_,]/g, " ")
// const replaceMe = /[(\[](feat. [^)\n]+|Live( [0-9]+)?|(Remastered|Radio|Original|Extended) ?(Edit|Recording|Mix|Version)?)[\])]|\(From [^)]+\)/g;

// ew
const replaceMe = /\W[([ ]?(feat. [^)\n]+|(Live( [0-9]+)?|Remastered|Radio|Original|Extended|[0-9]+),?( (Edit|Recording|Mix|Version|Remaster|[0-9]+))*)[ \])]?|\(From [^)]+\)/gi;
const cleanUp = (str: string) => str.toLowerCase().replace(replaceMe, " ").replace(/[^A-Za-z0-9]/g, " ").replace(/ {2,}/g, " ").trim();

const startsWithCross = (a: string, b: string) => cleanUp(a).startsWith(cleanUp(b)) || cleanUp(b).startsWith(cleanUp(a));

export const intersect = (songs: GenericSong[], songs2: GenericSong[]): GenericSong[][] => {
    // console.log(songs.map((song) => [cleanUp(song.name), cleanUp(song.artist)]));
    // console.log(songs2.map((song) => [cleanUp(song.name), cleanUp(song.artist)]));
    const intersectedSongs: GenericSong[][] = [];
    songs2.forEach((song2) => {
        let found = false;
        songs.forEach((song) => {
            if (!found && startsWithCross(song.name, song2.name) && startsWithCross(song.artist, song2.artist)) {
                intersectedSongs.push([song, song2]);
                found = true;
            }
        });

        // if (!found) console.log("not found", song2);
    });
    return intersectedSongs;
};

export const intersectUids = async (uid1: string, uid2: string): Promise<GenericSong[][]> => {
    const [likesU1, likesU2] = await Promise.all([getLikes(uid1), getLikes(uid2)]);
    return intersect(likesU1, likesU2);
};
