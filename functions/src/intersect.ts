import GenericSong from "./genericSong";

// const startsWithCross = (a: string, b: string) => a.startsWith(b) || b.startsWith(a);

const intersect = (songs: GenericSong[], songs2: GenericSong[]): GenericSong[][] => {
    const intersectedSongs: GenericSong[][] = [];
    songs.forEach(song => {
        let found = false;

        songs2.forEach(song2 => {
            if(!found && song.name.toLowerCase() === song2.name.toLowerCase() && song.artist.toLowerCase() === song2.artist.toLowerCase()){
                intersectedSongs.push([song, song2]);
                found = true;
            }
        })
    });
    return intersectedSongs;
};

export {intersect};