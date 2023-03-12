import {compareSongs} from "../util/compareSongs";
import GenericSong from "../types/genericSong";

test("compareSongs provider ids", () => {
    expect(compareSongs({provider: "apple", providerId: "b"} as GenericSong, {
        provider: "apple",
        providerId: "b"
    } as GenericSong)).toBeTruthy();// same ids
    expect(compareSongs({
        provider: "spotify",
        providerId: "b",
        name: "123",
        artist: "234",
    } as GenericSong, {provider: "apple", providerId: "b", name: "345", artist: "456"} as GenericSong)).toBeFalsy();// same ids, different providers
    expect(compareSongs({
        provider: "apple",
        providerId: "a",
        name: "123",
        artist: "234",
    } as GenericSong, {provider: "apple", providerId: "b", name: "345", artist: "456"} as GenericSong)).toBeFalsy();// same ids, different providers
});

test("compareSongs identical tracks on spotify", () => {
    expect(compareSongs({
        "providerId": "1234",
        "name": "dashstar*",
        "artist": "Knock2",
        "artistList": ["Knock2"],
        "provider": "spotify",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Dashstar*",
        "artist": "knock2",
        "artistList": ["knock2"],
        "provider": "spotify",
    } as GenericSong)).toBeTruthy();

    expect(compareSongs({
        "providerId": "1234",
        "name": "All Night Alone - Chris Lake Edit",
        "artist": "Josement & Chris Lake",
        "artistList": ["Josement", "Chris Lake"],
        "provider": "spotify",
    } as GenericSong, {
        "providerId": "2345",
        "name": "All Night Alone - Chris Lake Edit",
        "artist": "Josement & Chris Lake",
        "artistList": ["Chris Lake", "Josement"],
        "provider": "spotify",
    } as GenericSong)).toBeTruthy();
});

test("VIP mixes are different", () => {
    expect(compareSongs({
        "providerId": "1234",
        "name": "Disconnected",
        "artist": "Pegboard Nerds",
        "artistList": ["Pegboard Nerds"],
        "provider": "spotify",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Disconnected VIP",
        "artist": "Pegboard Nerds",
        "artistList": ["Pegboard Nerds"],
        "provider": "spotify",
    } as GenericSong)).toBeFalsy();
});

test("remixes are different", () => {
    expect(compareSongs({
        "providerId": "1234",
        "name": "Aria Math",
        "artist": "C418",
        "artistList": ["C418"],
        "provider": "apple",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Aria Math (Protostar Remix)",
        "artist": "C418 & Protostar",
        "provider": "apple",
    } as GenericSong)).toBeFalsy();

    expect(compareSongs({
        "providerId": "1234",
        "name": "Disconnected",
        "artist": "Pegboard Nerds",
        "artistList": ["Pegboard Nerds"],
        "provider": "spotify",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Disconnected VIP",
        "artist": "Pegboard Nerds",
        "artistList": ["Pegboard Nerds"],
        "provider": "spotify",
    } as GenericSong)).toBeFalsy();
});

test("VIP indication can differ between providers", () => {
    expect(compareSongs({
        "providerId": "1234",
        "name": "Aftershock (Boombox Cartel VIP)",
        "artist": "Boombox Cartel & NGHTMRE",
        "provider": "apple",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Aftershock - Boombox Cartel VIP",
        "artist": "Boombox Cartel & NGHTMRE",
        "artistList": ["Boombox Cartel", "NGHTMRE"],
        "provider": "spotify",
    } as GenericSong)).toBeTruthy();

    expect(compareSongs({
        "providerId": "1234",
        "name": "Aftershock",
        "artist": "Boombox Cartel & NGHTMRE",
        "provider": "apple",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Aftershock - Boombox Cartel VIP",
        "artist": "Boombox Cartel & NGHTMRE",
        "artistList": ["Boombox Cartel", "NGHTMRE"],
        "provider": "spotify",
    } as GenericSong)).toBeFalsy();
});

test("parentheses and hyphens handled the same", () => {
    expect(compareSongs({
        "providerId": "1234",
        "name": "Sonderling (Radio Edit)",
        "artist": "Zonderling",
        "provider": "apple",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Sonderling - Radio Edit",
        "artist": "Zonderling",
        "artistList": ["Zonderling"],
        "provider": "spotify",
    } as GenericSong)).toBeTruthy();
});

test("radio edits & extended mixes are the same", () => {
    expect(compareSongs({
        "providerId": "1234",
        "name": "Sonderling (Original Mix)",
        "artist": "Zonderling",
        "provider": "apple",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Sonderling (Radio Edit)",
        "artist": "Zonderling",
        "provider": "apple",
    } as GenericSong)).toBeTruthy();

    expect(compareSongs({
        "providerId": "1234",
        "name": "Sonderling",
        "artist": "Zonderling",
        "provider": "apple",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Sonderling (Extended Mix)",
        "artist": "Zonderling",
        "provider": "apple",
    } as GenericSong)).toBeTruthy();
});

test("artist attribution can differ between providers", () => {
    expect(compareSongs({
        "providerId": "1234",
        "name": "A.I. (feat. Peter Gabriel)",
        "artist": "OneRepublic",
        "provider": "apple",
    } as GenericSong, {
        "providerId": "2345",
        "name": "A.I.",
        "artist": "OneRepublic & Peter Gabriel",
        "artistList": ["Peter Gabriel", "OneRepublic"],
        "provider": "spotify",
    } as GenericSong)).toBeTruthy();


    expect(compareSongs({
        "providerId": "1234",
        "name": "Aria Math - Protostar Remix",
        "artist": "C418 & Protostar",
        "artistList": ["C418", "Protostar"],
        "provider": "spotify",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Aria Math (Protostar Remix)",
        "artist": "C418 & Protostar",
        "provider": "apple",
    } as GenericSong)).toBeTruthy();
});

test("remasters and year mixes are the same", () => {
    expect(compareSongs({
        "providerId": "1234",
        "name": "Alive",
        "artist": "Pearl Jam",
        "provider": "apple",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Alive (2004 Remix)",
        "artist": "Pearl Jam",
        "provider": "apple",
    } as GenericSong)).toBeTruthy();

    expect(compareSongs({
        "providerId": "1234",
        "name": "Alive",
        "artist": "Pearl Jam",
        "provider": "apple",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Alive (2004 Remix)",
        "artist": "Pearl Jam",
        "provider": "apple",
    } as GenericSong)).toBeTruthy();

    expect(compareSongs({
        "providerId": "1234",
        "name": "Across The Universe",
        "artist": "The Beatles",
        "artistList": ["The Beatles"],
        "provider": "spotify",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Across The Universe - 2021 Mix",
        "artist": "The Beatles",
        "artistList": ["The Beatles"],
        "provider": "spotify",
    } as GenericSong)).toBeTruthy();

    expect(compareSongs({
        "providerId": "1234",
        "name": "Across The Universe",
        "artist": "The Beatles",
        "artistList": ["The Beatles"],
        "provider": "spotify",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Across The Universe - Remastered 2009",
        "artist": "The Beatles",
        "artistList": ["The Beatles"],
        "provider": "spotify",
    } as GenericSong)).toBeTruthy();

    expect(compareSongs({
        "providerId": "1234",
        "name": "Across The Universe (2021 Mix)",
        "artist": "The Beatles",
        "provider": "apple",
    } as GenericSong, {
        "providerId": "2345",
        "name": "Across The Universe - Remastered 2009",
        "artist": "The Beatles",
        "artistList": ["The Beatles"],
        "provider": "spotify",
    } as GenericSong)).toBeTruthy();
});

test("artist order does not matter", () => {
    expect(compareSongs({
        "providerId": "1234",
        "name": "A.I.",
        "artist": "Peter Gabriel & OneRepublic",
        "artistList": ["Peter Gabriel", "OneRepublic"],
        "provider": "spotify",
    } as GenericSong, {
        "providerId": "2345",
        "name": "A.I.",
        "artist": "OneRepublic & Peter Gabriel",
        "artistList": ["OneRepublic", "Peter Gabriel"],
        "provider": "spotify",
    } as GenericSong)).toBeTruthy();

    expect(compareSongs({
        "providerId": "1234",
        "name": "Aftershock",
        "artist": "NGHTMRE & Boombox Cartel",
        "provider": "apple",
        "lengthSeconds": 200,
    } as GenericSong, {
        "providerId": "2345",
        "name": "Aftershock - Boombox Cartel",
        "artist": "Boombox Cartel & NGHTMRE",
        "artistList": ["Boombox Cartel", "NGHTMRE"],
        "provider": "spotify",
        "lengthSeconds": 200,
    } as GenericSong)).toBeTruthy();
});

/*
expect(compareSongs({
        "url": "https://api.spotify.com/v1/tracks/0dAfw35k2hBsnbSl74AVJF",
        "albumArt": "https://i.scdn.co/image/ab67616d0000b273a8ff23b559dfbba6ca8b5175",
        "providerId": "0dAfw35k2hBsnbSl74AVJF",
        "name": "dashstar*",
        "artist": "Knock2",
        "artistList": [
            "Knock2",
        ],
        "lengthSeconds": 198.095,
        "provider": "spotify",
    }, {
        "url": "https://api.spotify.com/v1/tracks/0dAfw35k2hBsnbSl74AVJF",
        "albumArt": "https://i.scdn.co/image/ab67616d0000b273a8ff23b559dfbba6ca8b5175",
        "providerId": "0dAfw35k2hBsnbSl74AVJF",
        "name": "dashstar*",
        "artist": "Knock2",
        "artistList": [
            "Knock2",
        ],
        "lengthSeconds": 198.095,
        "provider": "spotify",
    })).toBeTruthy();
    expect(compareSongs({
        "url": "https://api.spotify.com/v1/tracks/0dAfw35k2hBsnbSl74AVJF",
        "albumArt": "https://i.scdn.co/image/ab67616d0000b273a8ff23b559dfbba6ca8b5175",
        "providerId": "0dAfw35k2hBsnbSl74AVJF",
        "name": "dashstar*",
        "artist": "Knock2",
        "artistList": [
            "Knock2",
        ],
        "lengthSeconds": 198.095,
        "provider": "spotify",
    }, {
        "url": "https://music.apple.com/us/song/_/1549282459",
        "albumArt": "https://is2-ssl.mzstatic.com/image/thumb/Music124/v4/c3/7c/35/c37c350b-307c-4314-1808-dead82e0fb99/cover.jpg/1200x1200bb.jpg",
        "providerId": "i.PkdJ18AuPabK0gN",
        "name": "Dashstar*",
        "artist": "Knock2",
        "lengthSeconds": 198.095,
        "provider": "apple"
    })).toBeTruthy();
 */
