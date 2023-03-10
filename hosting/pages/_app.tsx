import Container from "@mui/material/Container";
import React, {Component} from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useUser from "../hooks/useUser";
import LogoutIcon from '@mui/icons-material/Logout';
import UsernameEditor from "../components/UsernameEditor";
import HomeIcon from '@mui/icons-material/Home';
import {useRouter} from "next/router";
import {initializeApp} from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD69xHBIGVYb4WQ8X3bzgI3mCj4qI7KipI",
    authDomain: "intersect-me.firebaseapp.com",
    projectId: "intersect-me",
    storageBucket: "intersect-me.appspot.com",
    messagingSenderId: "38166487240",
    appId: "1:38166487240:web:08c41e3ffbef22e87205fd",
    measurementId: "G-VB1Y72TB5L"
};

initializeApp(firebaseConfig);

export default function MyApp(
    {Component, pageProps}:
        { Component: new() => React.Component<any, any>, pageProps: any }
) {
    const {auth, user, loading} = useUser();
    const router = useRouter();
    const themeObj = createTheme({
        palette: {
            mode: "dark"
        },
        components: {
            MuiCardHeader: {
                // variants: [
                //     {
                //         props: {variant: "single-line"},
                //         style: {
                //             action: {
                //                 alignSelf: "center"
                //             }
                //         }
                //     }
                // ]
                styleOverrides: {
                    action: {
                        alignSelf: "center"
                    }
                }
            }
        }
    });

    const logout = async () => {
        await auth.signOut();
    };

    if (!loading && !user && router.pathname !== "/signin") {
        router.push("/signin");
    }

    return <ThemeProvider theme={themeObj}>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                    onClick={() => router.push("/")}
                >
                    <HomeIcon/>
                </IconButton>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    Intersect Me
                </Typography>
                <UsernameEditor/>
                {user &&
                    <IconButton color="inherit" onClick={logout}>
                        <LogoutIcon/>
                    </IconButton>
                }
            </Toolbar>
        </AppBar>
        <Container>
            <CssBaseline/>

            <Component {...pageProps} />
        </Container>
    </ThemeProvider>
};