import {GenericSong} from "../types/api";

export default function sortSongs(songs: GenericSong[]): GenericSong[] {
    return songs.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        if (a.artist < b.artist) {
            return -1;
        }
        if (a.artist > b.artist) {
            return 1;
        }
        return 0;
    });
}