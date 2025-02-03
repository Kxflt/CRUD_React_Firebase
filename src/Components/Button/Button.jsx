import styles from "./Button.module.css";
import PropTypes from "prop-types";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      type={type}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
};

export default Button;
