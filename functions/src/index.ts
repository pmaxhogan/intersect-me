import {config} from "dotenv";
config();

console.log(process.env.TEST);

// import * as functions from "firebase-functions";

// import {songs} from "./apple.js";
import {intersect} from "./intersect.js";

console.log("hello");
import appleSongs from "./applesongs.json" assert { type: "json" };
console.log(appleSongs);
import {songs} from "./spotify.js";
const spotifySongs = songs;
// import spotifySongs from "./spotifySongs.json" assert { type: "json" };
import GenericSong from "./genericSong.js";

console.log("spotify", spotifySongs.length, "intersections:", intersect(appleSongs as GenericSong[], spotifySongs as GenericSong[]).length);
debugger;

// export const helloWorld = functions.https.onRequest(async (request, response) => {
//   response.send("Hello from Firebase!");
// });


// tracks
