export default function Reports() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Sales Report</h3>
          <p className="text-gray-500">Monthly sales analytics...</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Product Performance</h3>
          <p className="text-gray-500">Top selling products...</p>
        </div>
      </div>
    </div>
  );
}
