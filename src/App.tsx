import { Routes, Route } from 'react-router-dom';

import Calculator from './pages/Calculator';
import Footer from './components/Footer';
import Home from './pages/Home';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Calculator" element={<Calculator />} />
      </Routes>
      <Footer />
    </>
  )
};

export default App;
