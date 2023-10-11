import React from "react";
import styles from "./LinkButton.module.css";
import Link from "../icons/Link";

const LinkButton = (props) => {
  const { url, icon = <Link width={16} height={16} color="var(--secondaryColor)" />, className, children } = props;

  return (
    <a href={url} target="_blank" rel="noreferrer" className={`${styles.linkButton} ${className}`}>
      {icon} {children}
    </a>
  );
};

export default LinkButton;
