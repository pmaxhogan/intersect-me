import type GenericSong from "../types/genericSong";
import {compareSongs} from "./compareSongs.js";
import {compareCompressedSongValues, CompressedSongKey, CompressedSongValue, compressSong} from "./compressSong.js";

export const intersect = (songs: GenericSong[], songs2: GenericSong[]): GenericSong[][] => {
    const usedSong1s = new Set();
    const usedSong2s = new Set();

    console.time("intersect");
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

export const fastIntersect = (songs: GenericSong[], songs2: GenericSong[]): GenericSong[][] => {
    const songsMap: Map<CompressedSongKey, CompressedSongValue[]> = new Map();

    console.time("fastIntersect");
    songs.forEach((song) => {
        const [songKey, songValue] = compressSong(song);

        if (songsMap.has(songKey)) {
            songsMap.get(songKey)?.push(songValue);
        } else {
            songsMap.set(songKey, [songValue]);
        }
    });

    const intersectedSongs: GenericSong[][] = [];

    songs2.forEach((song2) => {
        const [songKey, songValue] = compressSong(song2);
        const matchedSongs = songsMap.get(songKey);
        if (matchedSongs?.length) {
            for (const matchedSong of matchedSongs) {
                if (compareCompressedSongValues(matchedSong, songValue)) {
                    intersectedSongs.push([song2]);
                    break;
                }
            }
        }
    });

    console.timeEnd("fastIntersect");
    return intersectedSongs;
};

export const fastCompareSongsForTest = (song: GenericSong, song2: GenericSong): boolean => fastIntersect([song], [song2]).length > 0;

export type ApiIntersectResult = {
    intersection: GenericSong[][];
    numSongs1: number;
    numSongs2: number;
};
