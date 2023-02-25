import {config} from "dotenv";

import SpotifyWebApi from "spotify-web-api-node";
import GenericSong from "./genericSong";
const spotifyApi = new SpotifyWebApi();
config({debug: true});
spotifyApi.setAccessToken(process.env.SPOTIFY_TOKEN as string);


const fetchAllPages = async (apiCall: any) => {
    const items = [];
    let page = await apiCall();
    items.push(...page.body.items);

    let pos = 0;
    while (page.body.next) {
        page = await apiCall({ offset: pos });
        items.push(...page.body.items);
        pos += page.body.limit;
    }
    return items;
};

const songIsValid = (track: any) => track?.track?.type === "track" && !track?.track?.is_local;

const mapArtists = (artists: any) : string => artists.length <= 2 ? (artists.map((artist: any) => artist.name).join(" & ")) : (artists.slice(0, -2).map((artist: any) => artist.name).join(", ") + mapArtists(artists.slice(-2)));


const mapSong = (song: any) : GenericSong => ({
    url: song.track.href,
    albumArt: song.track.album.images[0].url,
    providerId: song.track.id,
    name: song.track.name,
    artist: mapArtists(song.track.artists),
    lengthSeconds: song.track.duration_ms / 1000,
    provider: "spotify"
})

const songs = (await fetchAllPages((opts: any) => spotifyApi.getMySavedTracks(opts))).filter(songIsValid).map(mapSong);
console.log("spotify songs", songs);

export {songs};