import React from "react"
import * as styles from "./Intro.module.scss"

const Intro = props => {
  return (
    <div className={styles.intro}>
      {props.children}
    </div>
  )
}

export default Intro
