import React from "react";
import {GenericSong} from "../types/api";
import Card from "@mui/material/Card";
import ResultsStack from "./ResultsStack";
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FilledInput from '@mui/material/FilledInput';
import SearchIcon from '@mui/icons-material/Search';
import ButtonStack from "./ButtonStack";
import SongCard from "./SongCard";
import {Alert} from "@mui/material";
import sortSongs from "../lib/sortSongs";


export default function SongsResults({songs}: { songs: GenericSong[] }) {
    const [search, setSearch] = React.useState("");

    // TODO: improve this
    const filterSong = (song: GenericSong, search: string) => {
        return !search || (song.name.toLowerCase().includes(search.toLowerCase()) || song.artist.toLowerCase().includes(search.toLowerCase()));
    };

    const songCards = songs.length ? sortSongs(songs).filter(song => filterSong(song, search))
        .map((song, i) => (
            <SongCard key={i} song={song}/>
        )) : [<Card><Alert severity="info">Nothing found :(</Alert></Card>];

    return <div>
        <ButtonStack elements={[
            <FormControl fullWidth variant="filled">
                <InputLabel htmlFor="filter-results">Filter</InputLabel>
                <FilledInput
                    id="filter-results"
                    endAdornment={<InputAdornment position="end"><SearchIcon/></InputAdornment>}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </FormControl>,
            <ResultsStack sx={{marginLeft: "-16px !important"}}
                          elements={songCards}/>
        ]}/>
    </div>;
}