export default function Dashboard() {
  const stats = [
    { title: "Total Products", value: 120 },
    { title: "Total Orders", value: 340 },
    { title: "Revenue", value: "₹1,25,000" },
    { title: "Customers", value: 210 }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.title} className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">{item.title}</h3>
            <p className="text-2xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
