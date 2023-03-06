import React, {Fragment, ReactNode} from "react";
import {Stack} from "@mui/material";

export default function ButtonStack({elements}: { elements: ReactNode[] }) {
    return <Stack spacing={2}>
        {elements.map((element, index) =>  <Fragment key={index}>{element}</Fragment>)}
    </Stack>;
};