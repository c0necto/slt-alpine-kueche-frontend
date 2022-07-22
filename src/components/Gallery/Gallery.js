import React from 'react';
import Grid from '~components/Grid/Grid';
import { GatsbyImage } from 'gatsby-plugin-image';
import { artDirection } from '~utils';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import * as styles from './Gallery.module.scss';

const Gallery = props => {
    const cols = 3;
    return (
        <div className={styles.gallery}>
            <SimpleReactLightbox>
                <SRLWrapper>
                    <Grid cols={cols}>
                        {props.nodes.map((node, key) => {
                            let altText = '';
                            if (node.metadata) {
                                if (node.metadata[0]) {
                                    if ( node.metadata[0].data) {
                                        altText = node.metadata[0].data
                                    }
                                }
                            }
                            const lightbox =
                                node.lightbox.childImageSharp
                                    .gatsbyImageData.images.fallback.src;
                            const images = artDirection(
                                node.desktop.childImageSharp,
                                node.mobile.childImageSharp,
                            );
                            return (
                                <a key={'gallery-' + key} href={lightbox}>
                                    <GatsbyImage
                                        className={styles.imageS}
                                        image={images}
                                        alt={altText}
                                        key={key}
                                    />
                                </a>
                            );
                        })}
                    </Grid>
                </SRLWrapper>
            </SimpleReactLightbox>
        </div>
    );
};

export default Gallery;
