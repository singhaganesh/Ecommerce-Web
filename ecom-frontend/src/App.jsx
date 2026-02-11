import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Home from "./pages/user/Home";
import Categories from "./pages/user/Categories";
import Search from "./pages/user/Search";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Auth Pages
import Login from "./auth/Login";

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

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";


// ---------- Layout Wrapper ----------
function Layout({ children }) {
  const location = useLocation();

  // Hide Navbar & Footer on seller pages and login page
  const hideLayout =
    location.pathname.startsWith("/seller/register") ||
    location.pathname.startsWith("/seller") ||
    location.pathname === "/login";

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
  const { isAuthenticated, hasRole, loading } = useAuth();

  // Show loading spinner while auth state is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* ================= PUBLIC PAGES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<Search />} />
          
          
          {/* ================= AUTH PAGES ================= */}
          <Route 
            path="/login" 
            element={
              isAuthenticated() ? (
                hasRole('ROLE_ADMIN') ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : hasRole('ROLE_SELLER') ? (
                  <Navigate to="/seller/dashboard" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Login />
              )
            } 
          />


          {/* ================= SELLER REGISTER ================= */}
          <Route path="/seller/register" element={<SellerRegisterStep1 />} />
          <Route path="/seller/register/bank" element={<SellerRegisterStep2 />} />
          <Route path="/seller/register/security" element={<SellerRegisterStep3 />} />


          {/* ================= SELLER PANEL (Protected) ================= */}
          <Route 
            path="/seller" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_SELLER', 'ROLE_ADMIN']}>
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
          </Route>


          {/* ================= ADMIN PANEL (Protected) ================= */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <div>Admin Panel Layout</div>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<div>Admin Dashboard</div>} />
          </Route>


          {/* ================= 404 - Catch All ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
