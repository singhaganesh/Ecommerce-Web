import { useNavigate } from "react-router-dom";

export default function SellerRegisterStep2() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold mb-2">Step 2 of 3 — Bank Details</h2>
        <p className="text-gray-500 mb-6">Enter your payment information</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <input className="input" placeholder="Account Holder Name" />
          <input className="input" placeholder="Bank Name" />
          <input className="input" placeholder="Account Number" />
          <input className="input" placeholder="IFSC / Routing Code" />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => navigate("/seller/register/step-1")}
            className="border px-6 py-2 rounded-lg"
          >
            ← Previous
          </button>

          <button
            onClick={() => navigate("/seller/register/step-3")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Save & Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
