import {ReactNode} from "react";
import {Grid} from "@mui/material";

export default function ResultsStack({elements}: { elements: ReactNode[] }) {
    return <Grid container spacing={2}>
        {elements.map((element, index) => <Grid item xs={12} sm={6} md={4} key={index}>
            {element}
        </Grid>)}
    </Grid>;
};