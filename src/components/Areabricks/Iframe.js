import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Container from '~components/Container/Container'
import cn from "classnames"
import * as styles from "./Iframe.module.scss"

// https://www.npmjs.com/package/react-lite-youtube-embed
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

const IframeAreabrick = props => {
    const {elements} = props
    const grey = elements.grey?.checked

    const youtubeParser = url => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    }
    const videoId = youtubeParser(elements.iframe_url?.text)

    // check if elements.iframe_url.text contains 'youtube'
    const isYoutube = elements.iframe_url?.text?.includes('youtube')

    return (
        <ContentArea className={'bottom80'} color={grey ? 'grey' : null}>
            <Container>
                {isYoutube ?
                    <div className={styles.youtubeRatio}>
                        <iframe
                            loading={'lazy'}
                            className={styles.iframe}
                            title={elements?.iframe_url?.text}
                            src={elements?.iframe_url?.text}
                            height={elements?.iframe_height?.text}
                            width="100%"
                            allowFullScreen={true}
                            frameBorder="0"></iframe>
                    </div>
                    /*<div className={styles.iframeYoutubeWrapper}>
                        <LiteYouTubeEmbed
                            id={videoId}
                            adNetwork={true} // Default true, to preconnect or not to doubleclick addresses called by YouTube iframe (the adnetwork from Google)
                            params="" // any params you want to pass to the URL, assume we already had '&' and pass your parameters string
                            playlist={false} // Use  true when your ID be from a playlist
                            playlistCoverId="L2vS_050c-M" // The ids for playlists did not bring the cover in a pattern to render so you'll need pick up a video from the playlist (or in fact, whatever id) and use to render the cover. There's a programmatic way to get the cover from YouTube API v3 but the aim of this component is do not make any another call and reduce requests and bandwidth usage as much as possibe
                            poster="maxresdefault" // Defines the image size to call on first render as poster image. Possible values are "default","mqdefault",  "hqdefault", "sddefault" and "maxresdefault". Default value for this prop is "hqdefault". Please be aware that "sddefault" and "maxresdefault", high resolution images are not always avaialble for every video. See: https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
                            title="YouTube Embed" // a11y, always provide a title for iFrames: https://dequeuniversity.com/tips/provide-iframe-titles Help the web be accessible ;)
                            noCookie={true} //Default false, connect to YouTube via the Privacy-Enhanced Mode using https://www.youtube-nocookie.com

                            activeClass="lyt-activated" // Default as "lyt-activated", gives control to wrapper once clicked
                            iframeClass="" // Default none, gives control to add a class to iframe element itself
                            playerClass={cn('lty-playbtn', styles.playbutton)} // Default as "lty-playbtn" to control player button styles
                            wrapperClass={cn('yt-lite', styles.ytWrapper)} // Default as "yt-lite" for the div wrapping the area, the most important class and needs extra attention, please refer to LiteYouTubeEmbed.css for a reference.
                        />
                    </div>*/
                    : <div className={styles.iframeWrapper}>
                        <iframe
                            loading={'lazy'}
                            className={styles.iframe}
                            title={elements?.iframe_url?.text}
                            src={elements?.iframe_url?.text}
                            height={elements?.iframe_height?.text}
                            width="100%"
                            frameBorder="0"></iframe>
                    </div>}
            </Container>
        </ContentArea>
    )
}

export default IframeAreabrick