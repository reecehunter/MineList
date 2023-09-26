import React from "react";
import styles from "./SquareImage.module.css";

const SquareImage = (props) => {
  const { src, width = 125, height = 125, id, alt, className } = props;

  return (
    <div className={styles.imgContainer}>
      <img id={id} src={src} style={{ width, height }} alt={alt} className={className} />
    </div>
  );
};

export default SquareImage;
