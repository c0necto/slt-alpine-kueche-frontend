import React from 'react';
import TeaserMVariant from "~components/Teaser/TeaserMVariant"
import TeaserCluster from "~components/Teaser/TeaserCluster"
import * as styles from './Cluster.module.scss';

const Cluster = () => {
    return (
        <div className={styles.cluster}>

            <div className={styles.m1}>
                <TeaserMVariant
                    slug="/skiatlas"
                    image={data.teaserMVariant}
                    text="Von idyllischen Seen bis zu majestätischen Gipfeln sorgen die Salzburger Urlaubsregionen für unvergessliche Momente"
                >Headline (H4) - max 2 Zeilen</TeaserMVariant>
            </div>
            <div className={styles.m2}>
                <TeaserMVariant
                    slug="/skiatlas"
                    image={data.teaserMVariant}
                    text="Von idyllischen Seen bis zu majestätischen Gipfeln sorgen die Salzburger Urlaubsregionen für unvergessliche Momente"
                >Headline (H4) - max 2 Zeilen</TeaserMVariant>
            </div>
            <div className={styles.clusterTeaser}>
                <TeaserCluster
                    title={'Cluster-Teaser'}
                    to={"/skiatlas"}
                    image={data.teaserL}
                    clusterImage={data.cluster}
                    subtitle={"Subheadline"}
                    buttontext={'CTA Button'}
                    fakebutton={true}
                    withinCluster={true}
                />
            </div>
            <div className={styles.m3}>
                <TeaserMVariant
                    slug="/skiatlas"
                    image={data.teaserMVariant}
                    text="Von idyllischen Seen bis zu majestätischen Gipfeln sorgen die Salzburger Urlaubsregionen für unvergessliche Momente"
                >Headline (H4) - max 2 Zeilen</TeaserMVariant>
            </div>
            <div className={styles.m4}>
                <TeaserMVariant
                    slug="/skiatlas"
                    image={data.teaserMVariant}
                    text="Von idyllischen Seen bis zu majestätischen Gipfeln sorgen die Salzburger Urlaubsregionen für unvergessliche Momente"
                >Headline (H4) - max 2 Zeilen</TeaserMVariant>
            </div>
        </div>
    );
};

export default Cluster;
