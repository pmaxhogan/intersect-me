import {Box, CircularProgress, CircularProgressProps, Typography} from "@mui/material";
import React from "react";

export default function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number, extraText?: string },
) {
    return (
        <Box sx={{position: 'relative', display: 'inline-flex'}}>
            <CircularProgress variant="determinate" size={200} {...props}/>
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"

                >{`${Math.round(props.value)}%\n${props.extraText ?? ""}`}</Typography>
            </Box>
        </Box>
    );
}