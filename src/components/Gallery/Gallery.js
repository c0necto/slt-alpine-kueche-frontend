import React from 'react';
import Grid from '~components/Grid/Grid';
import { GatsbyImage } from 'gatsby-plugin-image';
import { artDirection } from '~utils';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import * as styles from './Gallery.module.scss';

// todo: change alt attribute

const Gallery = props => {
    const cols = 3;
    return (
        <div className={styles.gallery}>
            <SimpleReactLightbox>
                <SRLWrapper>
                    <Grid cols={cols}>
                        {props.nodes.map((node, key) => {
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
                                        alt={'alt'}
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
