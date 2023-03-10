import React from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FluidButton from "./FluidButton";
import {useRouter} from "next/navigation";

export default function BackButton({onClick}: { onClick?: () => void }) {
    const router = useRouter();
    return <FluidButton leftIcon={<ArrowBackIosNewIcon/>} title="Back" mainAction={onClick ?? (() => router.back())}/>;
}