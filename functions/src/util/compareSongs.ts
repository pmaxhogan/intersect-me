// ew
import GenericSong from "../types/genericSong";

const replaceMe = /\W[([ ]?(feat. [^)\n]+|(Live( [0-9]+)?|Remastered|Radio|Original|Extended|[0-9]+),?( (Edit|Recording|Mix|Version|Remaster|[0-9]+))*)[ \])]?|\(From [^)]+\)/gi;
export const cleanUp = (str: string) => str.toLowerCase().replace(replaceMe, " ").replace(/[^A-Za-z0-9]/g, " ").replace(/ {2,}/g, " ").trim();
// const startsWithCross = (a: string, b: string) => cleanUp(a).startsWith(cleanUp(b)) || cleanUp(b).startsWith(cleanUp(a));
const equalish = (a: string, b: string) => cleanUp(a) === cleanUp(b);

/**
 * Compare 2 songs
 * @param {GenericSong} song
 * @param {GenericSong} song2
 * @return {boolean}
 */
export function compareSongs(song: GenericSong, song2: GenericSong) {
    return (song.provider === song2.provider && song.providerId === song2.providerId) || equalish(song.name, song2.name) && equalish(song.artist, song2.artist);
}