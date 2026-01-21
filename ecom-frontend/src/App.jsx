import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import Categories from './pages/Categories'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Search from './pages/Search';

function App() {
  const [count, setCount] = useState(0)

    return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/search" element={<Search />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );

}

export default App
