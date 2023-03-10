export interface GenericSong {
    url: string | null;
    albumArt: string;
    providerId: string;
    name: string;
    artist: string;
    lengthSeconds: number;
    provider: "apple" | "spotify";
    artistList?: string[];
}

export interface ApiIntersectResult {
    intersection: GenericSong[][];
    numSongs1: number;
    numSongs2: number;
}

export interface GetSongsResult {
    songs: GenericSong[];
}

export type uid = string;
export type username = string;

export interface SpotifyPlaylist {
    name: string;
    id: string;
    image?: string;
    songs: number;
    owner: string;
}

export type UserMeta = {
    username?: string;
    count?: number;
    lastSync?: number;
    following?: uid[];
    playlists?: SpotifyPlaylist[];
};

export type LookupUidsResult = {
    usernames: UsernamesMap
}

export type UsernamesMap = {
    [uid: string]: username;
};