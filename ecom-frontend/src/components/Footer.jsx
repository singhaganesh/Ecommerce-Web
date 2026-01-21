import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">ShopEase</h2>
          <p className="text-sm">
            Your one-stop online shop for electronics, fashion, home and more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>Home</li>
            <li>Shop</li>
            <li>Cart</li>
            <li>My Orders</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2">
            <li>Help Center</li>
            <li>Returns</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-4 text-2xl">
            <FaFacebook className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
            <FaTwitter className="hover:text-white cursor-pointer" />
            <FaLinkedin className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm">
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </div>
    </footer>
  );
}
