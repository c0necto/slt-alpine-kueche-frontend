import React from "react"
import cn from "classnames"
import * as styles from "./Icon.module.scss"

const Icon = props => {
  let tooltip = props.tooltip
  if (props.additional) {
    tooltip = props.tooltip + " " + props.additional
  }
  return (
    <>
      <i
        data-tip={tooltip}
        className={cn(styles.icon, {
          [styles[props.name]]: props.name,
        })}
      />
    </>
  )
}

export default Icon