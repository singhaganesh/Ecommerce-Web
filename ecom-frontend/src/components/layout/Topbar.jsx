export default function Topbar() {
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h2 className="font-semibold text-lg">Inventory</h2>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search orders, SKU..."
          className="border rounded-lg px-3 py-2"
        />
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
      </div>
    </header>
  );
}
