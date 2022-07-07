import React from 'react';
import TeaserMVariant from "~components/Teaser/TeaserMVariant"
import TeaserCluster from "~components/Teaser/TeaserCluster"
import * as styles from './Cluster.module.scss';

/*todo: check for empty relations*/

const Cluster = props => {
    //console.log(props)
    const teasers = props.elements.teasers.relations
    //console.log(teasers)
    return (
        <div className={styles.cluster}>
            {teasers[0] && (
                <div className={styles.m1}>
                    <TeaserMVariant
                        title={teasers[0].title}
                        text={teasers[0].text}
                        image={teasers[0].image}
                        blank={true}
                        internal={teasers[0].internal?.path}
                        slug={teasers[0].slug[0]?.slug}>
                        {teasers[0].title}
                    </TeaserMVariant>
                </div>
            )}
            {teasers[1] && (
                <div className={styles.m2}>
                    <TeaserMVariant
                        title={teasers[1].title}
                        text={teasers[1].text}
                        image={teasers[1].image}
                        blank={true}
                        internal={teasers[1].internal?.path}
                        slug={teasers[1].slug[0]?.slug}>
                        {teasers[1].title}
                    </TeaserMVariant>
                </div>
            )}
            {teasers[2] && (
                <div className={styles.clusterTeaser}>
                    <TeaserCluster
                        title={teasers[2].title}
                        buttontext={'Weiterlesen'}
                        fakebutton={true}
                        text={teasers[2].text}
                        image={teasers[2].image}
                        blank={true}
                        internal={teasers[2].internal?.path}
                        slug={teasers[2].slug[0]?.slug}>
                        {teasers[2].title}
                    </TeaserCluster>
                </div>
            )}
            {teasers[3] && (
                <div className={styles.m3}>
                    <TeaserMVariant
                        title={teasers[3].title}
                        text={teasers[3].text}
                        image={teasers[3].image}
                        blank={true}
                        internal={teasers[3].internal?.path}
                        slug={teasers[3].slug[0]?.slug}>
                        {teasers[3].title}
                    </TeaserMVariant>
                </div>
            )}
            {teaser[4] && (
                <div className={styles.m4}>
                    <TeaserMVariant
                        title={teasers[4].title}
                        text={teasers[4].text}
                        image={teasers[4].image}
                        blank={true}
                        internal={teasers[4].internal?.path}
                        slug={teasers[4].slug[0]?.slug}>
                        {teasers[4].title}
                    </TeaserMVariant>
                </div>
            )}
        </div>
    );
};

export default Cluster;
