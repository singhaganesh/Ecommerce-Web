import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/user/Home";
import Categories from "./pages/user/Categories";
import Search from "./pages/user/Search";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Seller Register Pages
import SellerRegisterStep1 from "./auth/SellerRegisterStep1";
import SellerRegisterStep2 from "./auth/SellerRegisterStep2";
import SellerRegisterStep3 from "./auth/SellerRegisterStep3";

// Seller Panel
import SellerLayout from "./components/layout/SellerLayout";
import Dashboard from "./pages/seller/Dashboard";
import Inventory from "./pages/seller/Inventory";
import Orders from "./pages/seller/Orders";
import Customers from "./pages/seller/Customers";
import Reports from "./pages/seller/Reports";


// ---------- Layout Wrapper ----------
function Layout({ children }) {
  const location = useLocation();

  // Hide Navbar & Footer on seller pages
  const hideLayout =
    location.pathname.startsWith("/seller/register") ||
    location.pathname.startsWith("/seller");

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}


// ---------- App ----------
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* ================= USER PAGES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<Search />} />


          {/* ================= SELLER REGISTER ================= */}
          <Route path="/seller/register" element={<SellerRegisterStep1 />} />
          <Route path="/seller/register/bank" element={<SellerRegisterStep2 />} />
          <Route path="/seller/register/security" element={<SellerRegisterStep3 />} />


          {/* ================= SELLER PANEL ================= */}
          <Route path="/seller" element={<SellerLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
          </Route>

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
