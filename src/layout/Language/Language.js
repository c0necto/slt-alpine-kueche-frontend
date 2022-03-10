import React, { useContext } from "react"
import cn from "classnames"
import { layoutContext, menuAction } from "~layout/context"
import Icon from "~components/Icon/Icon"
import * as styles from "./Language.module.scss"
import { Link } from "gatsby"

const LanguageLinks = () => {
  return (
    <ul className={styles.languageLinks}>
      <li><Link to={'/'}>EN</Link></li>
      <li><Link to={'/'}>IT</Link></li>
      <li><Link to={'/'}>NL</Link></li>
      <li><Link to={'/'}>DA</Link></li>
      <li><Link to={'/'}>PL</Link></li>
      <li><Link to={'/'}>CS</Link></li>
      <li><Link to={'/'}>HU</Link></li>
    </ul>
  )
}

const Language = () => {

  const { layoutState, dispatch } = useContext(layoutContext)

  const onClick = () => {
    if ( !layoutState.infoOpen ) {
      dispatch({type: menuAction.OPEN_LANGUAGES})
    } else {
      dispatch({type: menuAction.CLOSE_EVERYTHING})
      dispatch({type: menuAction.OPEN_LANGUAGES})
    }
  }

  return (
    <>
      <button
        onClick={() => onClick()}
        className={layoutState.languageOpen ? cn(styles.symbol, styles.active) : styles.symbol}>
        <span>Sprache</span>
        {!layoutState.languageOpen
          ? <Icon name="language" />
          : 'DE'
        }

      </button>
      {layoutState.languageOpen
        ? <LanguageLinks />
        : null
      }

      <div className={layoutState.languageOpen ? cn(styles.language, styles.languageOpen) : styles.language}></div>
    </>
  )
}

export default Language
