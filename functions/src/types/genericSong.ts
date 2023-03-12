type GenericSong = {
    url: string | null;
    albumArt: string;
    providerId: string;
    name: string;
    artist: string;
    lengthSeconds: number;
    provider: "apple" | "spotify";
    artistList?: string[];
}

export default GenericSong;
