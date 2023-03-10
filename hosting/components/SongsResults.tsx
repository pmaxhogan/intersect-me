import React from "react";
import {useRouter} from "next/navigation";
import {GenericSong} from "../types/api";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import ResultsStack from "./ResultsStack";
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FilledInput from '@mui/material/FilledInput';
import SearchIcon from '@mui/icons-material/Search';
import ButtonStack from "./ButtonStack";


export default function SongsResults({songs}: { songs: GenericSong[] }) {
    const router = useRouter();
    const [search, setSearch] = React.useState("");

    // TODO: improve this
    const filterSong = (song: GenericSong, search: string) => {
        return !search || (song.name.toLowerCase().includes(search.toLowerCase()) || song.artist.toLowerCase().includes(search.toLowerCase()));
    };

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
                          elements={songs.filter(song => filterSong(song, search))
                              .map((song, i) => (
                                  <Card sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      fontSize: "smaller"
                                  }} key={i}>
                                      <Box sx={{display: "flex", flexDirection: "column", height: 151}}>
                                          <CardContent sx={{flex: "1 0 auto"}}>
                                              <Typography component="div" variant="subtitle1">
                                                  {song.name}
                                              </Typography>
                                              <Typography variant="subtitle2" color="text.secondary" component="div">
                                                  {song.artist}
                                              </Typography>
                                          </CardContent>
                                      </Box>
                                      <CardMedia
                                          component="img"
                                          sx={{width: 151}}
                                          image={song.albumArt}
                                          alt={song.name + " by " + song.artist}
                                      />
                                  </Card>
                                  /*<div key={i} className={"intersection-row"}>
                                      <img src={song.albumArt} width={100} height={100}
                                           alt={song.name + " by " + song.artist}/>
                                      <p>{song.name}</p>
                                      <p>{song.artist}</p>
                                  </div>*/
                              ))}/>
        ]}/>
    </div>;
}