/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */
import React from 'react';

const HeadComponents = [<script key="usercentrics-key" dangerouslySetInnerHTML={{__html: `    
    window.addEventListener("load", () => {
      const script = document.createElement("script")
      script.src = '//app.usercentrics.eu/browser-ui/latest/loader.js'
      script.async = true
      script.id = "usercentrics-cmp"
      script.setAttribute("data-settings-id", "aPOg73vzE")
      document.body.appendChild(script)
     });
`}}/>];

export const onRenderBody = ({ setBodyAttributes, setHeadComponents }) => {
    let uc = true
    if ( uc === true ) {
        if (process.env.NODE_ENV === 'production') {
            setHeadComponents(HeadComponents);
        }
    }
}