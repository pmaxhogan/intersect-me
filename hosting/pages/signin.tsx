import {GithubAuthProvider, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import {Typography} from "@mui/material";
import ForwardButton from "../components/ForwardButton";
import useUser from "../hooks/useUser";
import {useRouter} from "next/router";
import ButtonStack from "../components/ButtonStack";

export default function SigninPage() {
    const {user, loading: userLoading, auth} = useUser();
    const router = useRouter();

    if (user && !userLoading) {
        router.push("/");
    }

    const signInGoogle = async () => {
        await signInWithPopup(auth, new GoogleAuthProvider());
    };

    const signInGithub = async () => {
        await signInWithPopup(auth, new GithubAuthProvider());
    };

    if (userLoading) return <main>Loading...</main>;// todo: make this look better

    return <main>
        <ButtonStack elements={[
            <Typography variant={"h1"}>Sign in</Typography>,
            <ForwardButton title={"Sign in with Google"} onClick={signInGoogle} leftIcon={<GoogleIcon/>}/>,
            <ForwardButton title={"Sign in with Github"} onClick={signInGithub} leftIcon={<GitHubIcon/>}/>
        ]}/>
    </main>
}