import { Routes, Route } from 'react-router-dom';

import Calculator from './pages/Calculator';
import Footer from './components/Footer';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Receipt from './pages/Receipt';
import Upload from './pages/Upload';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Calculator" element={<Calculator />} />
        <Route path="/Upload" element={<Upload />} />
        <Route path="/Receipt" element={<Receipt />} />
      </Routes>
      <Footer />
    </>
  )
};

export default App;
