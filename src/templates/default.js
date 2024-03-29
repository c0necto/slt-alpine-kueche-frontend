import React, {useContext} from "react";
import * as pagesStyles from "../pages/Pages.module.scss";

import PimcoreContext from "~src/context/PimcoreContext"
import HeaderMedia from '~components/HeaderMedia/HeaderMedia'
import ContentArea from '~components/ContentArea/ContentArea'
import Container from '~components/Container/Container'
import Headline from '~components/Headline/Headline'
import Button from '~components/Button/Button'

import { getHierarchy } from '~utils'
import AreabrickList from '~components/Areabricks/AreabrickList'

import Slider from '~components/Slider/Slider'
import TeaserS from '~components/Teaser/TeaserS'

const ArticleTemplate = props => {

    const { author, content, date, h1, subtitle, image, hideDateAuthor } =
        props;
    const { document, pages } = useContext(PimcoreContext);

    // remove empty entries from pages
    const pagesWithoutEmpty = pages.children.filter(
        value => Object.keys(value).length !== 0,
    )

    // filter document.id from pagesWithoutEmpty
    const pagesFiltered = pagesWithoutEmpty.filter(
        page => page.id !== document.id,
    )

    // date & author beneath h1
    const dateFormatted = date?.formatted ? date.formatted + ' ' : '';
    const authorFormatted = author?.text ? 'by ' + author.text : '';
    const h1Desc = hideDateAuthor?.checked
        ? subtitle?.text
        : dateFormatted + authorFormatted;

    return (
        <>
            {!!image && !!image.image && (
                <HeaderMedia
                    portal={false}
                    image={image.image}
                    alt={document.title}
                    meta={image.image.metadata}
                />
            )}

            <main className={pagesStyles.pageMain} role="main" id="main">
                <ContentArea className={'bottom55'}>
                    <Container>
                        <Headline
                            level={'h1'}
                            title={h1?.text ?? ''}
                            description={h1Desc}
                        />
                    </Container>
                </ContentArea>
                <ContentArea className={'bottom55Center'}>
                    <Button
                        to={document?.parent?.fullpath}
                        color={'greyInvertedArrow'}>
                        Übersicht
                    </Button>
                </ContentArea>

                <AreabrickList {...content} />

                {/* Related Articles Slider */}
                <ContentArea className={'top80'} color={'grey'}>
                    <Container>
                        <Headline level={'h2'} title={'Verwandte Artikel'} />
                    </Container>
                </ContentArea>
                <ContentArea className={'grey'}>
                    <Container variant={'mobileFullwidth'}>
                        <Slider noarrows>
                            {pagesFiltered.map((page, i) => {
                                const elements = getHierarchy(page.elements);
                                const elementsByName = {};
                                elements.forEach(element => {
                                    elementsByName[element.name] = element;
                                });
                                return (
                                    <TeaserS
                                        slug={page.fullpath}
                                        key={'article-slider-item-' + page.id}
                                        image={elementsByName.image?.image}
                                        title={elementsByName.h1?.text}
                                        slider={true}
                                        text={elementsByName.subtitle?.text}>
                                        {elementsByName.h1?.text}
                                    </TeaserS>
                                )
                            })}
                        </Slider>
                    </Container>
                </ContentArea>
            </main>

            {process.env.DEPLOY_STATUS_BADGE_URL && (
                <div style={{ position: 'fixed', bottom: '3em', left: '3em', zIndex: 9999, background: 'white' }}>
                    <strong>Preview mode</strong><br />
                    <img src={process.env.DEPLOY_STATUS_BADGE_URL} alt='Netlify Status' />
                </div>
            )}
        </>
    )
}

export default ArticleTemplate
