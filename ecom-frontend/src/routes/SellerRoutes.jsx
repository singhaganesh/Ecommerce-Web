import { Route } from "react-router-dom";
import SellerLayout from "../components/layout/SellerLayout";
import Dashboard from "../pages/seller/Dashboard";
import Inventory from "../pages/seller/Inventory";
import Orders from "../pages/seller/Orders";
import Customers from "../pages/seller/Customers";
import Reports from "../pages/seller/Reports";

export default function SellerRoutes() {
  return (
    <Route path="/seller" element={<SellerLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="orders" element={<Orders />} />
      <Route path="customers" element={<Customers />} />
      <Route path="reports" element={<Reports />} />
    </Route>
  );
}
