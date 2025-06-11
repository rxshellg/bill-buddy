import { Link } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

import './Home.css';

const Home = () => {
    const isMobile = useIsMobile();
    const button = (<Link to="/Calculator"><button className="getStartedButton">Get started</button></Link>)

    return (
        <>
            <div className={isMobile ? "mobileHome" : "desktopHome"}>
                <div className="textContainer">
                    <h1>Bill buddy</h1>
                    <h2>For when the check comes and no one wants to think.
                    Enter your numbers, split the bill, done.</h2>
                    {!isMobile && button}
                </div>
                <div className="imageContainer">
                </div>
                {isMobile && button}
            </div>
        </>
    )
}

export default Home;