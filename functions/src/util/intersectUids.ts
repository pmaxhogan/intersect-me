import {getLikes} from "./db.js";
import {ApiIntersectResult, fastIntersect} from "./intersect.js";

export const intersectUids = async (uid1: string, uid2: string): Promise<ApiIntersectResult> => {
    const [likesU1, likesU2] = await Promise.all([getLikes(uid1), getLikes(uid2)]);

    return {intersection: fastIntersect(likesU1, likesU2), numSongs1: likesU1.length, numSongs2: likesU2.length};
};
