import { Routes, Route } from "react-router-dom";
import SellerRegisterStep1 from "../auth/SellerRegisterStep1";
import SellerRegisterStep2 from "../auth/SellerRegisterStep2";
import SellerRegisterStep3 from "../auth/SellerRegisterStep3";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/seller/register/step-1" element={<SellerRegisterStep1 />} />
      <Route path="/seller/register/step-2" element={<SellerRegisterStep2 />} />
      <Route path="/seller/register/step-3" element={<SellerRegisterStep3 />} />
    </Routes>
  );
}
