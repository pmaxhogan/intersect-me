import Container from "@mui/material/Container";
import React, {Component} from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useUser from "../hooks/useUser";
import useFirestoreDocument from "../hooks/useFirestoreDocument";
import UsernameEditor from "../components/UsernameEditor";

export default function MyApp({Component, pageProps} : {Component: new() => React.Component<any, any>, pageProps: any}) {
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



    return <ThemeProvider theme={themeObj}>
        <Container>
            <CssBaseline/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Intersect Me
                    </Typography>
                    <UsernameEditor/>
                </Toolbar>
            </AppBar>
            <Component {...pageProps} />
        </Container>
    </ThemeProvider>
};