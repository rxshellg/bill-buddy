import { Link } from "react-router-dom";
import styles from './Navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.logo}>
                Bill Buddy
            </Link>
        </nav>
    )
};

export default Navbar;