import { useEffect, useState } from 'react';

function Dashboard() {
  const [summary, setSummary] = useState({
    total_customers: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0
  });

  useEffect(() => {
   fetch('https://agrivyn-backend.onrender.com/api/analytics/summary')
      .then(response => response.json())
      .then(data => {
        setSummary(data);
      })
      .catch(error => {
        console.error('Failed to fetch dashboard data:', error);
      });
  }, []);

  return (
    <div>

      {/* Page Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Dashboard
        </h2>

        <p className="text-gray-500 mt-1">
          View a quick overview of your business activities, orders, inventory, and sales.
        </p>
      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Customers */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">
            Total Customers
          </p>

          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {summary.total_customers}
          </h3>
        </div>


        {/* Products */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">
            Total Products
          </p>

          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {summary.total_products}
          </h3>
        </div>


        {/* Orders */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">
            Total Orders
          </p>

          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {summary.total_orders}
          </h3>
        </div>


        {/* Revenue */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">
            Total Revenue
          </p>

          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            ₹{summary.total_revenue}
          </h3>
        </div>

      </div>


      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow p-8 mt-8">

        <h3 className="text-xl font-semibold text-gray-800">
          Welcome to Agrivyn
        </h3>

        <p className="text-gray-600 mt-2">
          Manage customers, products, orders, inventory and
          deliveries from one place.
        </p>

      </div>

    </div>
  );
}

export default Dashboard;