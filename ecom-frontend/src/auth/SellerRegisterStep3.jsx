export default function SellerRegisterStep3() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold mb-4">Create Your Password</h2>

        <div className="space-y-4">
          <input className="input" type="password" placeholder="New Password" />
          <input className="input" type="password" placeholder="Confirm Password" />

          <div className="flex items-center gap-2 text-sm">
            <input type="checkbox" />
            <span>I agree to Seller Terms & Privacy Policy</span>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Complete Registration →
          </button>
        </div>
      </div>
    </div>
  );
}
