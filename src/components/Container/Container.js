import React from "react"
import cn from "classnames"
import * as styles from "./Container.module.scss"

const Container = props => {
  return (
    <div
      className={cn(styles.container, {
        [styles[props.variant]]: props.variant
      })}
    >
      {props.children}
    </div>
  )
}

export default Container
