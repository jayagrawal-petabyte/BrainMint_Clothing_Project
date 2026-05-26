import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Shop from './pages/Shop';
import Home from './pages/Home';
import Navbar from './components/Navbar';
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<div style={{padding: '2rem'}}>Product Detail Placeholder</div>} />
          <Route path="/cart" element={<div style={{padding: '2rem'}}>Cart Placeholder</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
