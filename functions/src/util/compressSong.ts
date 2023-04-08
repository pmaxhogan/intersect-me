// ew
import GenericSong from "../types/genericSong";

const stripRegex = /, .*| [-([].*/gi;
const SECONDS_DELTA = 3;

export type CompressedSongKey = string;
export type CompressedSongValue = {
    artists: string[];
    length: number;
};
export type CompressedSong = [CompressedSongKey, CompressedSongValue];

/**
 * Compress a song
 * @param {GenericSong} song song
 * @return {CompressedSong}
 */
export function compressSong(song: GenericSong): CompressedSong {
    const name = song.name.replace(stripRegex, "");
    return [name.toLowerCase().trim(), {
        artists: getArtistChunks(song),
        length: song.lengthSeconds,
    }];
}


const dedupe = (list: string[]) => [...new Set(list)];

const getArtistChunks = (song: GenericSong) => {
    const set = (song.artistList ? song.artistList.join(",") + "," : "") + song.artist;
    return dedupe(set.toLowerCase().split(/,|&|and|feat./)).map((a) => a.trim().toLowerCase());
};

/**
 * Compare 2 compressed song values
 * @param {CompressedSongValue} song
 * @param {CompressedSongValue} song2
 * @return {boolean}
 */
export function compareCompressedSongValues(song: CompressedSongValue, song2: CompressedSongValue): boolean {
    const {artists, length} = song;
    const {artists: artists2, length: length2} = song2;

    const withinDeltaDuration = !length || !length2 || Math.abs(length - length2) < SECONDS_DELTA;

    const commonArtists = atLeast1InCommon(artists, artists2);

    return withinDeltaDuration && commonArtists;
}

const atLeast1InCommon = (list1: string[], list2: string[]) => {
    for (const artist1 of list1) {
        for (const artist2 of list2) {
            if (artist1.toLowerCase() === artist2.toLowerCase()) return true;
        }
    }
    return false;
};


