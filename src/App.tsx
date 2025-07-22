import { Routes, Route } from 'react-router-dom';

import Calculator from './pages/Calculator';
import Footer from './components/Footer';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Review from './pages/Review';
import Upload from './pages/Upload';
import Split from './pages/Split';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Calculator" element={<Calculator />} />
        <Route path="/Upload" element={<Upload />} />
        <Route path="/Review" element={<Review />} />
        <Route path="/Split" element={<Split />} />
      </Routes>
      <Footer />
    </>
  )
};

export default App;
