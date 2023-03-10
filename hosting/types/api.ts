export interface GenericSong {
    url: string | null;
    albumArt: string;
    providerId: string;
    name: string;
    artist: string;
    lengthSeconds: number;
    provider: "apple" | "spotify";
}

export interface ApiIntersectResult {
    intersection: GenericSong[][];
    numSongs1: number;
    numSongs2: number;
}

export interface GetSongsResult {
    songs: GenericSong[];
}