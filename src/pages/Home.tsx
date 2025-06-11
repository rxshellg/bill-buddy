import { Link } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

import styles from './Home.module.css';

const Home = () => {
    const isMobile = useIsMobile();
    const buttons = (
        <div className={styles.buttonOptions}>
            <Link to="/Upload"><button className="pinkButton">Upload a receipt</button></Link>
            <Link to="/Calculator"><button className="whiteButton">Split manually</button></Link>
        </div>
    );

    return (
        <>
            <div className={isMobile ? styles.mobileHome : styles.desktopHome}>
                <div className={styles.textContainer}>
                    <h1>Bill buddy</h1>
                    <h2>For when the check comes and no one wants to think.
                        Enter your numbers, split the bill, done.</h2>
                    {!isMobile && buttons}
                </div>
                <div className={styles.imageContainer}>
                </div>
                {isMobile && buttons}
            </div>
        </>
    )
};

export default Home;