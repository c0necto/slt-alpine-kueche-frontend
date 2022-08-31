import React, {useContext, useState} from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Container from '~components/Container/Container'
import cn from "classnames"
import * as styles from "./Iframe.module.scss"

// https://www.npmjs.com/package/react-lite-youtube-embed
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
//import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import './Iframe.LiteYouTubeEmbed.css'

// https://www.npmjs.com/package/react-cookie
import {useCookies} from "react-cookie"

import { CookieContext } from "../../context/CookieContext";

const IframeAreabrick = props => {

    const {elements} = props
    const grey = elements.grey?.checked

    const [cookies, setCookie, removeCookie] = useCookies(['agreedtoyoutube']);
    const [marketing, setMarketing] = useContext(CookieContext);

    if (cookies.agreedtoyoutube) {
        console.log('agreedtoyoutube cookie is set');
        setMarketing(true)
    }

    const isBrowser = () => typeof window !== "undefined"
    const enableYoutube = () => {
        console.log('enableyoutube')
        setCookie("agreedtoyoutube", true, {path: "/"})
        setMarketing(true)
    }

    const disableYoutube = () => {
        console.log('disableyoutube')
        removeCookie("agreedtoyoutube")
        setMarketing(false)
    }

    const youtubeParser = url => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    }
    const videoId = youtubeParser(elements.iframe_url?.text)
    const isYoutube = elements.iframe_url?.text?.includes('youtube')

    if ( isBrowser() ) {
        if (typeof window.Cookiebot !== "undefined") {

            /*['CookiebotOnTagsExecuted',/!*'CookiebotOnAccept', 'CookiebotOnDecline'*!/].forEach(event => {
                window.addEventListener(event, ev => {
                    console.log(event)
                    console.log('-----')
                    if ( window.Cookiebot.consent.marketing ) {
                        enableYoutube()
                    } else {
                        disableYoutube()
                    }
                }, false)
            })
            */
                window.addEventListener('CookiebotOnConsentReady', ev => {
                    console.log('window.Cookiebot.consent.marketing: ', window.Cookiebot.consent.marketing)
                    console.log(cookies.agreedtoyoutube)
                    if ( cookies.agreedtoyoutube ) {
                        // COOKIE GESETZT
                        if ( !window.Cookiebot.consent.marketing ) {
                            disableYoutube()
                        }
                    } else {
                        // COOKIE NICHT GESETZT
                        if ( !window.Cookiebot.consent.marketing ) {
                            enableYoutube()
                        }
                    }
                    /*if ( window.Cookiebot.consent.marketing ) {
                        enableYoutube()
                    } else {
                        /!*if (!cookies.agreedtoyoutube) {*!/
                        disableYoutube()
                        /!*}*!/
                    }*/
                })


            /*window.addEventListener('CookiebotOnDecline', ev => {
                disableYoutube()
            })*/
        }
    }

    return (
        <ContentArea className={'bottom80'} color={grey ? 'grey' : null}>

            <Container>
                <div className={styles.iframeWrapper}>
                    {isYoutube
                        ?
                        <div>
                            <div className={styles.youtubeRatio}>
                                {marketing
                                    ?
                                    <iframe
                                        loading={'lazy'}
                                        className={styles.iframe}
                                        title={elements?.iframe_url?.text}
                                        src={elements?.iframe_url?.text}
                                        height={elements?.iframe_height?.text}
                                        width="100%"
                                        frameBorder="0"></iframe>
                                    :
                                    <LiteYouTubeEmbed
                                        id={videoId}
                                        adNetwork={true} // Default true, to preconnect or not to doubleclick addresses called by YouTube iframe (the adnetwork from Google)
                                        params="" // any params you want to pass to the URL, assume we already had '&' and pass your parameters string
                                        playlist={false} // Use  true when your ID be from a playlist
                                        playlistCoverId="L2vS_050c-M" // The ids for playlists did not bring the cover in a pattern to render so you'll need pick up a video from the playlist (or in fact, whatever id) and use to render the cover. There's a programmatic way to get the cover from YouTube API v3 but the aim of this component is do not make any another call and reduce requests and bandwidth usage as much as possibe
                                        poster="maxresdefault" // Defines the image size to call on first render as poster image. Possible values are "default","mqdefault",  "hqdefault", "sddefault" and "maxresdefault". Default value for this prop is "hqdefault". Please be aware that "sddefault" and "maxresdefault", high resolution images are not always avaialble for every video. See: https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
                                        title="YouTube Embed" // a11y, always provide a title for iFrames: https://dequeuniversity.com/tips/provide-iframe-titles Help the web be accessible ;)
                                        noCookie={true} //Default false, connect to YouTube via the Privacy-Enhanced Mode using https://www.youtube-nocookie.com
                                        activeClass='lyt-activated' // Default as "lyt-activated", gives control to wrapper once clicked
                                        iframeClass="" // Default none, gives control to add a class to iframe element itself
                                        playerClass={cn('lty-playbtn', styles.playbutton)} // Default as "lty-playbtn" to control player button styles
                                        wrapperClass='yt-lite' // Default as "yt-lite" for the div wrapping the area, the most important class and needs extra attention, please refer to LiteYouTubeEmbed.css for a reference.
                                        onIframeAdded={() => {
                                            enableYoutube()
                                            //setMarketing(true)
                                            //setCookie("agreedtoyoutube", true, {path: "/"})
                                            //setNotice(!notice)
                                        }}
                                    />
                                }
                            </div>
                            {!marketing
                                ?
                                <div className={styles.notice}>
                                    Sie können die Anzeige dieses Elements über den Button aktivieren. Durch die
                                    Aktivierung der Einbindung tauscht der Browser Daten mit den jeweiligen Anbietern
                                    aus. Die aktuelle Seite hat keinen Zugriff oder Einfluss auf die Inhalte, Art,
                                    Speicherung und Verarbeitung dieser Daten.
                                </div>
                                : null
                            }
                        </div>
                        :
                        <div>
                            <iframe
                                loading={'lazy'}
                                className={styles.iframe}
                                title={elements?.iframe_url?.text}
                                src={elements?.iframe_url?.text}
                                height={elements?.iframe_height?.text}
                                width="100%"
                                frameBorder="0"></iframe>
                        </div>
                    }
                </div>
            </Container>
        </ContentArea>
    )
}

export default IframeAreabrick