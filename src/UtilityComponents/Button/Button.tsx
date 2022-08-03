import styles from "./styles.module.scss";

interface Props {
  classes: string;
  title?: string;
  icon?: string;
  onClickHandler: () => void;
}

const Button = ({ classes, title, icon, onClickHandler }: Props) => {
  return (
    <button
      className={`${styles.btn} ${styles[classes]}`}
      onClick={onClickHandler}
    >
      {title}
      {icon && <img src={icon} height="auto" width="auto" />}
    </button>
  );
};

export default Button;
