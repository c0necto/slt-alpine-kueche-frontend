import React, { useContext } from "react"
import { graphql, Link, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import Icon from "~components/Icon/Icon"
import cn from "classnames"
import { layoutContext, menuAction } from "~layout/context"
import * as styles from "./Nav.module.scss"

const Nav = () => {

  const { layoutState, dispatch } = useContext(layoutContext)

  const onClick = () => {
    // only proceed when no info element is opened
    if ( !layoutState.infoOpen ) {
      if ( !layoutState.menuOpen ) {
        // menu is not open - open it
        dispatch({type: menuAction.OPEN_MENU})
      } else {
        // menu is open - close it
        dispatch({type: menuAction.CLOSE_MENU })
      }
    } else {
      // when an info element is open, close them
      dispatch({type: menuAction.CLOSE_EVERYTHING})
    }
  }

  const data = useStaticQuery(graphql`
    query {
      image: file(relativePath: { eq: "placeholder.jpg" }) {
        childImageSharp {
          gatsbyImageData(
              placeholder: BLURRED
              formats: [AUTO, WEBP]
              layout: CONSTRAINED
              width: 80
              height: 80
          )
        }
      }
    }
  `)

  return (
    <>
      <button
        className={layoutState.burgerOpen ? cn(styles.mainNavBurger, styles.mainNavActive) : styles.mainNavBurger}
        onClick={() => onClick()}
      >
        <span>Hauptmenü</span>
      </button>
      <div className={layoutState.menuOpen ? cn(styles.navContainer, styles.navContainerOpen) : styles.navContainer}>

        <div className={styles.specialDesktop}>
          <ul>
            <li>
              <Link to="/skiatlas">
                <span className={styles.navImage}>
                  <GatsbyImage image={data.image.childImageSharp.gatsbyImageData} alt={''} />
                </span>
                Skiatlas
              </Link>
            </li>
            <li>
              <Link to="/404">
                <span className={styles.navImage}>
                  <GatsbyImage image={data.image.childImageSharp.gatsbyImageData} alt={''} />
                </span>
                404-Seite
              </Link>
            </li>
            <li>
              <Link to="/">
                <span className={styles.navImage}>
                  <GatsbyImage image={data.image.childImageSharp.gatsbyImageData} alt={''} />
                </span>
                Livecams
              </Link>
            </li>
            <li>
              <Link to="/">
                <span className={styles.navImage}>
                  <GatsbyImage image={data.image.childImageSharp.gatsbyImageData} alt={''} />
                </span>
                Seenbericht
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.navInnerContainer}>
          <nav className={styles.mainNav} role="navigation">
            <ul className={styles.specialMobile}>
              <li>
                <input type="checkbox" id="special1" className={styles.dropdown} />
                <label htmlFor="special1" className={styles.next}>
                  <span className={styles.arrow}></span>
                </label>
                <Icon name={"regions"} />
                <label htmlFor={'special1'}>Regionen</label>
                <ul className={styles.mainNavSub}>
                  <li><Link to="/">Orte</Link></li>
                  <li><Link to="/">Regionen</Link></li>
                </ul>
              </li>
              <li>
                <Icon name={"accomodation"} />
                <label htmlFor="element2">Buchen</label>
                {/*Anmerkung: Auf Wunsch von Martin soll sich bei Klick
                            auf dieses Element mobil ebenfalls der Buchen-Overlay
                            öffnen, deshalb hier das Label*/}
              </li>
              <li className={styles.language}>
                <input type="checkbox" id="special3" className={styles.dropdown} />
                <label htmlFor="special3" className={styles.next}>
                  <span className={styles.arrow}></span>
                </label>
                <Icon name={"language"} />
                <label htmlFor={'special3'}>Sprache</label>
                <ul className={styles.mainNavSub}>
                  <li className={styles.active}><Link to="/">DE</Link></li>
                  <li><Link to="/">EN</Link></li>
                  <li><Link to="/">IT</Link></li>
                  <li><Link to="/">NL</Link></li>
                  <li><Link to="/">DA</Link></li>
                  <li><Link to="/">PL</Link></li>
                  <li><Link to="/">CS</Link></li>
                  <li><Link to="/">HU</Link></li>
                </ul>
              </li>
            </ul>

            <ul className={styles.main}>
              <li className={styles.li1}>
                <input type="checkbox" id="main1" className={styles.dropdown} />
                <label htmlFor="main1" className={styles.next}>
                  <span className={styles.arrow}></span>
                </label>
                <Icon name={"arrowmenu"} />
                <div className={styles.headline}>Reisethema</div>
                <ul className={styles.mainNavSub}>
                  <li><Link to="/">Startseite</Link></li>
                  {/*<li><Link to="/landingpage">Landingpage</Link></li>*/}
                  <li><Link to="/post">Beitrag</Link></li>
                  <li><Link to="/competition">Gewinnspiel</Link></li>
                  {/*<li><Link to="/page">Seite</Link></li>*/}
                  {/*<li><Link to="/region">Region</Link></li>*/}
                  {/*<li><Link to="/place">Ort</Link></li>*/}
                  <li><Link to="/list">Liste</Link></li>
                  <li><Link to="/flexible">Flexible Inhalte</Link></li>
                  {/*<li><Link to="/searchresults">Suchergebnisse</Link></li>*/}
                </ul>
              </li>

              <li>
                <input type="checkbox" id="main2" className={styles.dropdown} />
                <label htmlFor="main2" className={styles.next}>
                  <span className={styles.arrow}></span>
                </label>
                <Icon name={"arrowmenu"} />
                <div className={styles.headline}>Reiseziel</div>
                <ul className={styles.mainNavSub}>
                  <li><Link to="/">Golfurlaub</Link></li>
                  <li><Link to="/">Gruppenreisen</Link></li>
                  <li><Link to="/">Cooles Salzburgerland</Link></li>
                  <li><Link to="/">Alpine Gastgeber</Link></li>
                  <li><Link to="/">Urlaub am Bauernhof</Link></li>
                  <li><Link to="/">Die Salzburgerland Hotels</Link></li>
                </ul>
              </li>

              <li className={styles.mainNavActive}>
                <input type="checkbox" id="main3" className={styles.dropdown} />
                <label htmlFor="main3" className={styles.next}>
                  <span className={styles.arrow}></span>
                </label>
                <Icon name={"arrowmenu"} />
                <div className={styles.headline}>Urlaubsspezialisten</div>
                <ul className={styles.mainNavSub}>
                  <li><Link to="/">Golfurlaub</Link></li>
                  <li><Link to="/">Gruppenreisen</Link></li>
                  <li><Link to="/">Cooles Salzburgerland</Link></li>
                  <li><Link to="/">Alpine Gastgeber</Link></li>
                  <li><Link to="/">Urlaub am Bauernhof</Link></li>
                  <li><Link to="/">Die Salzburgerland Hotels</Link></li>
                </ul>
              </li>

              <li>
                <input type="checkbox" id="main4" className={styles.dropdown} />
                <label htmlFor="main4" className={styles.next}>
                  <span className={styles.arrow}></span>
                </label>
                <Icon name={"arrowmenu"} />
                <div className={styles.headline}>Service</div>
                <ul className={styles.mainNavSub}>
                  <li><Link to="/">Golfurlaub</Link></li>
                  <li><Link to="/">Gruppenreisen</Link></li>
                  <li><Link to="/">Cooles Salzburgerland</Link></li>
                  <li><Link to="/">Alpine Gastgeber</Link></li>
                  <li><Link to="/">Urlaub am Bauernhof</Link></li>
                  <li><Link to="/">Die Salzburgerland Hotels</Link></li>
                </ul>
              </li>

            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Nav