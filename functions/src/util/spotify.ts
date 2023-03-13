import {config} from "dotenv";

import SpotifyWebApi from "spotify-web-api-node";
import GenericSong from "../types/genericSong";
import {Artists, fetchApiCallback, offsetOpts, SavedTrackObject} from "../types/spotifySong";

config();

export const getSpotifyApi = () => new SpotifyWebApi({
    redirectUri: process.env.NODE_ENV === "production" ? process.env.SPOTIFY_REDIRECT_URI_PROD : process.env.SPOTIFY_REDIRECT_URI_LOCAL,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});


// const scopes = "user-library-read user-follow-read playlist-read-private playlist-read-collaborative user-top-read user-read-recently-played".split(" ");
// console.log(spotifyApi.createAuthorizeURL(scopes, "state"));

const fetchAllPages = async <T>(apiCall: fetchApiCallback<T>): Promise<T[]> => {
    const items = [];
    let page = await apiCall();
    items.push(...page.body.items);

    let pos = 0;
    while (page.body.next) {
        page = await apiCall({offset: pos});
        items.push(...page.body.items);
        pos += page.body.limit;
    }
    return items;
};

const songIsValid = (track: SavedTrackObject) => track?.track?.type === "track" && !track?.track?.is_local;

const mapArtists = (artists: Artists[]) : string => artists.length <= 2 ?
    (artists.map((artist) => artist.name).join(" & ")) :
    (artists.slice(0, -2).map((artist) => artist.name).join(", ") + mapArtists(artists.slice(-2)));


const mapSong = (song: SavedTrackObject) : GenericSong => ({
    url: song.track.href,
    albumArt: song.track.album.images[0].url,
    providerId: song.track.id,
    name: song.track.name,
    artist: mapArtists(song.track.artists),
    artistList: song.track.artists.map((artist) => artist.name),
    lengthSeconds: song.track.duration_ms / 1000,
    provider: "spotify",
});

const getLikedSongs = async (spotifyApi: SpotifyWebApi) => {
    const results = await fetchAllPages((opts: offsetOpts | undefined) => spotifyApi.getMySavedTracks(opts)) as SavedTrackObject[];
    const songs = results.filter(songIsValid).map(mapSong);
    console.log("spotify songs", songs.length);
    return songs;
};

export {getLikedSongs};
