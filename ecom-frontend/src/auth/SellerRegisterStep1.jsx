import { useNavigate } from "react-router-dom";

export default function SellerRegisterStep1() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-2">Become a Seller</h2>
        <p className="text-center text-gray-500 mb-6">Step 1 of 3 — Business Details</p>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Business Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <input className="input" placeholder="Business Name" />
              <input className="input" placeholder="Owner Full Name" />
              <input className="input" placeholder="Email Address" />
              <input className="input" placeholder="Phone Number" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Business Verification</h3>
            <input className="input mb-3" placeholder="GST / Tax Number" />
            <textarea className="input h-24" placeholder="Business Address"></textarea>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => navigate("/seller/register/step-2")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Next Step →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
