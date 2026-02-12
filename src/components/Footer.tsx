import confetti from "canvas-confetti";

import styles from "./Footer.module.css";

const Footer = () => {
  const handleHover = () => {
    confetti({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.6 },
      scalar: 0.6,
    });
  };

  return (
    <footer className={styles.footer}>
      <p>
        Made with ❤️ and a calculator by{" "}
        <a
          href="https://github.com/rxshellg"
          target="_blank"
          onMouseEnter={handleHover}
        >
          Rashell Guerrero
        </a>
      </p>
    </footer>
  );
};

export default Footer;
