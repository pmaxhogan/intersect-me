import fetch from "node-fetch";
import GenericSong from "./genericSong";

const extractItems = (response: any) => {
    return response.data.map((songs: {id: string }) => response.resources["library-songs"][songs.id]);
};

const fetchAllPages = async (url: string, headers: { [key: string]: string }) => {
    const items = [];
    let page : any = await (await fetch(url, { headers })).json();
    items.push(...extractItems(page));

    while (page.data.length && page.meta.total > items.length) {
        console.log(page.data.length, items.length, page.meta.total);
        console.log(url + "&offset=" + items.length);
        page = await (await fetch(url + "&offset=" + items.length, { headers })).json();
        items.push(...extractItems(page));
    }
    return items;
};

const mapSong = (song: any): GenericSong => ({
    url: song?.attributes?.playParams?.catalogId ? `https://music.apple.com/us/song/_/${song.attributes.playParams.catalogId}` : null ?? null,
    albumArt: song?.attributes?.artwork?.url?.replace("{w}", song.attributes.artwork.width).replace("{h}", song.attributes.artwork.height).replace("{f}", "jpg") ?? null,
    providerId: song?.id ?? null,
    name: song?.attributes?.name ?? null,
    artist: song?.attributes?.artistName ?? null,
    lengthSeconds: song?.attributes?.durationInMillis / 1000 ?? null,
    provider: "apple",
});

const songs = (await fetchAllPages("https://amp-api.music.apple.com/v1/me/library/songs?art%5Burl%5D=f&format%5Bresources%5D=map&l=en-US&platform=web&limit=100", {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "authorization": "Bearer " + process.env.APPLE_AUTH_TOKEN,
        "cache-control": "no-cache",
        "cookie": process.env.APPLE_COOKIE!,
        "media-user-token": process.env.MEDIA_USER_TOKEN!,
        "origin": "https://beta.music.apple.com",
        "pragma": "no-cache",
        "referer": "https://beta.music.apple.com/",
        "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
})).map(mapSong);
console.log(songs);
debugger;

export { songs };