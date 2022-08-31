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
import BasicContext from "./src/context/CookieContext";

export const wrapRootElement = ({element}) => {
    return (
        <BasicContext>
            <CookiesProvider>
                <SimpleReactLightbox>{element}</SimpleReactLightbox>
            </CookiesProvider>
        </BasicContext>
    )
}

