import React, {useContext, useMemo, useState} from "react"
import * as pagesStyles from "../pages/Pages.module.scss"

import HeaderMedia from '~components/HeaderMedia/HeaderMedia'
import ContentArea from '~components/ContentArea/ContentArea'
import Container from '~components/Container/Container'
import Headline from '~components/Headline/Headline'

import PimcoreContext from "~src/context/PimcoreContext"
import { getHierarchy } from '~utils'
import AreabrickList from '~components/Areabricks/AreabrickList'
import Pagination from '~components/Pagination/Pagination'

import TeaserL from '~components/Teaser/TeaserL'

const OverviewTemplate = props => {
    const { content, h1, sub } = props;
    const { document, pages, locale } = useContext(PimcoreContext)

    // TODO Use library for translations
    const buttonText =
        locale === 'de' || locale === undefined ? 'weiterlesen' : 'Read more'

    // Get the editables as an object with the names of the editables as keys
    // They are then passed to the template component as individual props.
    // For example, if the editable is named 'headline', it will be accessible as props.headline in the TemplateComponent
    const elementsByName = {};
    document.elements?.forEach(element => {
        elementsByName[element._editableName] = element;
    })

    /* List */

    // Get all pages and remove empty entries
    const subpages = pages.children.filter(
        value => Object.keys(value).length !== 0,
    )

    /* Hero */
    const heroId = elementsByName.hero?.id
    const heroElementsByName = {};
    const hero = subpages.find(obj => {
        return parseInt(obj.id) === heroId
    })
    if (hero?.elements) {
        const heroElements = getHierarchy(hero.elements);
        heroElements.forEach(element => {
            heroElementsByName[element.name] = element
        });
    }

    /* Pagination stuff */
    const ITEMSPERPAGE = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const paginatedPages = useMemo(() => {
        // Slicing
        const firstPageIndex = (currentPage - 1) * ITEMSPERPAGE;
        const lastPageIndex = firstPageIndex + ITEMSPERPAGE;
        return subpages.slice(firstPageIndex, lastPageIndex)
    }, [currentPage, subpages, ITEMSPERPAGE]);

    return (
        <>
            {heroElementsByName.image?.image && heroElementsByName.h1 ? (
                <HeaderMedia
                    portal={true}
                    image={heroElementsByName.image?.image}
                    alt={heroElementsByName.h1?.text}
                    title={heroElementsByName.h1?.text}
                    buttoncolor="green"
                    buttontext={buttonText}
                    buttonlink={hero?.fullpath}
                    meta={heroElementsByName.image?.image?.metadata}
                />
            ) : null}
            <main className={pagesStyles.pageMain} role="main" id="main">
                {!!h1?.text && (
                    <ContentArea className={'bottom30'}>
                        <Container>
                            <Headline
                                level={'h1'}
                                title={h1.text}
                                description={sub?.text}
                            />
                        </Container>
                    </ContentArea>
                )}

                <AreabrickList {...content} />

                <Pagination
                    currentPage={currentPage}
                    totalCount={subpages.length}
                    pageSize={ITEMSPERPAGE}
                    onPageChange={page => setCurrentPage(page)}
                />

                <ContentArea className={'bottom30'}>
                    <Container>
                        {paginatedPages.map((page, i) => {
                            const elements = getHierarchy(page.elements);
                            const elementsByName = {};
                            elements.forEach(element => {
                                elementsByName[element.name] = element;
                            });
                            return (
                                <TeaserL
                                    key={
                                        'homepage-article-' + page.id + '-' + i
                                    }
                                    title={elementsByName.h1?.text}
                                    internal={page.fullpath}
                                    image={elementsByName.image?.image}
                                    text={elementsByName.subtitle?.text}
                                    buttontext={buttonText}
                                    fakebutton={true}
                                />
                            );
                        })}
                    </Container>
                </ContentArea>

                <Pagination
                    currentPage={currentPage}
                    totalCount={subpages.length}
                    pageSize={ITEMSPERPAGE}
                    className={'noMarginTop'}
                    onPageChange={page => setCurrentPage(page)}
                />
            </main>
        </>
    )
}

export default OverviewTemplate