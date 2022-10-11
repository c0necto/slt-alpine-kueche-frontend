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
import CookieContext from "./src/context/CookieContext";

export const wrapRootElement = ({element}) => {
    return (
        <CookieContext>
            <CookiesProvider>
                <SimpleReactLightbox>{element}</SimpleReactLightbox>
            </CookiesProvider>
        </CookieContext>
    )
}

export const onClientEntry = () => {

    // usercentric handling
    window.addEventListener("load", () => {
        console.log('entry')
        const initGTM = () => {
            const script = document.createElement("script")
            script.type = "text/javascript"
            script.async = true
            script.onload = () => {
                // check if dataLayer exists
                if (typeof window.dataLayer !== "undefined") {
                    window.dataLayer.push({ event: "gtm.js", "gtm.start": new Date().getTime(), "gtm.uniqueEventId": 0 })
                }
            }
            script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-T6HVCHW"
            document.head.appendChild(script)
        }
        const checkallServices = () => {
            // check if UC_UI exists
            if (typeof window.UC_UI !== "undefined") {
                let services = window.UC_UI.getServicesBaseInfo()
                console.log(services)
                // get all services whose categorySlug is either 'marketing' or 'functional'
                let filteredServices = services.filter(service => service.categorySlug === "marketing" || service.categorySlug === "functional")
                console.log(filteredServices)
                // check if one of the filtered services is accepted
                let hasConsent = filteredServices.some(service => service.consent.status === true)
                console.log(hasConsent)
                if (hasConsent) {
                    localStorage.setItem("GtmLoadable", "true")
                } else {
                    localStorage.removeItem("GtmLoadable")
                }
                if (localStorage.getItem("GtmLoadable") === "true") {
                    initGTM()
                }
            }

        }
        window.addEventListener("UC_UI_INITIALIZED", ev => {
            checkallServices()
            window.addEventListener("UC_UI_VIEW_CHANGED", ev => {
                checkallServices()
            })
            // add event listener for all a tags with #uc-corner-modal-show href attribute
            if (typeof window.UC_UI !== "undefined") {
                document.querySelectorAll("a[href=\"#uc-corner-modal-show\"]").forEach(el => {
                    el.addEventListener("click", ev => {
                        ev.preventDefault()
                        window.UC_UI.showFirstLayer()
                    })
                })
            }
        })
    })

}

