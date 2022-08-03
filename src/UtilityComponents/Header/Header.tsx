import React from "react";
import styles from "./styles.module.scss";
interface Props {
  title: string;
}
const Header = ({ ...props }: Props) => {
  return <h1 className={styles.title}>{props.title}</h1>;
};

export default Header;
