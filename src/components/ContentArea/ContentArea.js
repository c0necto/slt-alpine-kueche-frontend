import React from "react"
import classNames from "classnames"
import * as styles from "./ContentArea.module.scss"

const ContentArea = props => {
  return (
    <div className={classNames(styles.contentArea, {
      [styles[props.className]]: props.className,
      [styles[props.color]]: props.color,
    })}>
      {props.children}
    </div>
  )
}

export default ContentArea