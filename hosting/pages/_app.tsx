import Container from "@mui/material/Container";
import React, {Component} from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";

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
            <Component {...pageProps} />
        </Container>
    </ThemeProvider>
};