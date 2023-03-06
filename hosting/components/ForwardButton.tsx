import React, {ReactElement} from "react";
import FluidButton from "./FluidButton";
import {ArrowForwardIos} from "@mui/icons-material";
import {useRouter} from "next/navigation";

export default function ForwardButton({onClick, title, leftIcon, to}: {onClick: () => void, title: string, leftIcon?: ReactElement, to?: never} | {onClick?: never, title: string, leftIcon?: ReactElement, to: string}) {
    const router = useRouter();

    return to ? <FluidButton leftIcon={leftIcon} title={title} mainAction={() => router.push(to)} rightIcon={<ArrowForwardIos/>}/> : <FluidButton leftIcon={leftIcon} title={title} mainAction={onClick} rightIcon={<ArrowForwardIos/>}/>;
}