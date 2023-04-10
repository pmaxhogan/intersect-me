import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import React from "react";
import {GenericSong} from "../types/api";
import CardActionArea from "@mui/material/CardActionArea";

export default function SongCard({song}: { song: GenericSong }) {
    const openExt = () => {
        if (song.url) window.open(song.url, "_blank");
    }

    return <Card>
        <CardActionArea onClick={openExt} sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "smaller"
        }}>
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
        </CardActionArea>
    </Card>;
}