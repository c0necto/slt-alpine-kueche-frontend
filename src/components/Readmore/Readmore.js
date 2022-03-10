import React, { useState } from "react"
import * as styles from "./Readmore.module.scss"
import cn from "classnames"

const Readmore = props => {

  const [isActive, setActive] = useState(false);
  const onClick = () => {
    setActive(!isActive)
  }

  return (
    <div className={isActive ? cn(styles.readMore, styles.readmoreActive) : styles.readMore}>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => onClick()}
          className={styles.readmoreButton}>
          <i className={styles.buttonArrow}></i>
          <span className={styles.more}>Mehr lesen</span>
          <span className={styles.less}>Weniger lesen</span>
        </button>
      </div>
      <div className={styles.readmoreContent}>
        <div className={styles.readmoreContentContainer}>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default Readmore