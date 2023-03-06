import {Card, CardActionArea, CardHeader, Typography} from "@mui/material";
import {ReactElement, ReactNode} from "react";

export default function FluidButton(
    {
        mainAction,
        leftIcon,
        rightIcon,
        title,
        subtitle
    }: { mainAction?: (() => void), leftIcon?: ReactElement, rightIcon?: ReactNode, title?: string, subtitle?: ReactNode }): ReactElement {

    const cardContents = <CardHeader
        avatar={
            leftIcon
        }
        action={// align-self center
            rightIcon
        }
        title={
            <Typography variant="h5" component="div">
                {title}
            </Typography>
        }
        subheader={subtitle}
    />;

    return <Card>
        {mainAction ? <CardActionArea onClick={mainAction}>
                {cardContents} </CardActionArea> :
            cardContents}
    </Card>;

}