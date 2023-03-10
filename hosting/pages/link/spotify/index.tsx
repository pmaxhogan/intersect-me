import {Typography} from "@mui/material";
import ForwardButton from "../../../components/ForwardButton";
import ResultsStack from "../../../components/ResultsStack";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import useUser from "../../../hooks/useUser";

export default function Spotify() {
    const {user} = useUser();

    const linkLibrary = async () => {
        if (user) {
            const token = await user.getIdToken(true);

            location.href = `/api/spotify-sync?token=${encodeURIComponent(token)}`;
        }
    };

    return <div>
        <Typography variant={"h2"} component={"h1"}>Choose What to Link</Typography>
        <ResultsStack elements={[
            <ForwardButton title={"Entire Library"} onClick={linkLibrary} leftIcon={<LibraryMusicIcon/>}/>,
            <ForwardButton title={"Specific Playlist"} to={"/link/spotify/playlist"} leftIcon={<QueueMusicIcon/>}/>
        ]}/>
    </div>
}
