import React from "react"
import classNames from "classnames"
import * as styles from "./ContentArea.module.scss"
import svg from "./logo-magazin.svg"

const ContentArea = props => {
  return (
    <div className={classNames(styles.contentAreaMagazin, {
      [styles[props.className]]: props.className
    })}>
      <div className={styles.logo}>
        <img src={svg} alt={'SalzburgerLand Tourismus Magazin'} />
      </div>
      {props.children}
    </div>
  )
}

export default ContentArea