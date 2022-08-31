/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */
// You can delete this file if you're not using it
import '@fontsource/eb-garamond/400-italic.css';
import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/500.css';
import '@fontsource/prata';

import React from 'react';
import { CookiesProvider } from "react-cookie";

import SimpleReactLightbox from 'simple-react-lightbox';
// USE THE IMPORT BELOW INSTEAD IF YOU ARE USING THE PRO VERSION
// import SimpleReactLightbox from 'simple-react-lightbox-pro'

// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({ element }) => (
    <CookiesProvider>
        <SimpleReactLightbox>{element}</SimpleReactLightbox>
    </CookiesProvider>
)

// https://www.npmjs.com/package/react-cookie
import {useCookies} from "react-cookie"
const [cookies, setCookie] = useCookies(['agreedtoyoutube']);

const handleClick = () => {
    setCookie("agreedtoyoutube", true, {path: "/"})
    console.log("cookie set")
}

const isBrowser = () => typeof window !== "undefined";
if ( isBrowser() ) {
    // if Cookiebot is defined
    if (typeof window.Cookiebot !== "undefined") {
        console.log(window.Cookiebot.consent.marketing)

        window.addEventListener('CookiebotOnAccept', function (e) {
            if (window.Cookiebot.consent.marketing)
            {
                handleClick()
            }
        }, false);

        if ( window.Cookiebot.consent.marketing) {
            handleClick()
        }
    }
}