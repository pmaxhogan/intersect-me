// ew
import GenericSong from "../types/genericSong";

const replaceMe = /\W[([ ]?(feat. [^)\n]+|(Live( [0-9]+)?|Remastered|Radio|Original|Extended|[0-9]+),?( (Edit|Recording|(Re)?Mix|Version|Remaster|[0-9]+))*)[ \])]?|\(From [^)]+\)/gi;
export const cleanUp = (str: string) => str.toLowerCase().replace(replaceMe, " ").replace(/[^A-Za-z0-9]/g, " ").replace(/ {2,}/g, " ").trim();
const startsWithCross = (a: string, b: string) => cleanUp(a).startsWith(cleanUp(b)) || cleanUp(b).startsWith(cleanUp(a));
const equalCleaned = (a: string, b: string) => cleanUp(a) === cleanUp(b);

const getArtistChunks = (song: GenericSong) => {
    if (song.artistList) return song.artistList;
    return song.artist.split(/,|&|and|feat./).map((a) => a.trim());
};

const atLeast1InCommon = (list1: string[], list2: string[]) => {
    for (const artist1 of list1) {
        for (const artist2 of list2) {
            if (artist1.toLowerCase() === artist2.toLowerCase()) return true;
        }
    }
    return false;
};

const SECONDS_DELTA = 1;

/**
 * Compare 2 songs
 * @param {GenericSong} song
 * @param {GenericSong} song2
 * @return {boolean}
 */
export function compareSongs(song: GenericSong, song2: GenericSong) {
    if (song.provider === song2.provider && song.providerId === song2.providerId) return true;

    const withinDeltaDuration = Math.abs(song.lengthSeconds - song2.lengthSeconds) < SECONDS_DELTA;

    const songNamesExact = equalCleaned(song.name, song2.name);
    const songNamesOverlap = startsWithCross(song.name, song2.name);

    const commonArtists = atLeast1InCommon(getArtistChunks(song), getArtistChunks(song2));

    return (songNamesExact || (songNamesOverlap && withinDeltaDuration)) && commonArtists;
}
