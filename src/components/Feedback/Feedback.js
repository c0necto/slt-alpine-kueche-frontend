import React from "react"
import Headline from "~components/Headline/Headline"
import Button from "~components/Button/Button"
import * as styles from "./Feedback.module.scss"

const Feedback = props => {
  return (
    <>
      <div className={styles.headline}>
        <Headline
          level={"h2"}
          title={props.title}
          description={props.description}
        />
      </div>
      <div className={styles.centered}>
        <Button to={props.to} color={props.color}>{props.buttonText}</Button>
      </div>
    </>
  )
}

export default Feedback