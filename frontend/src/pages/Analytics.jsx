import { useEffect, useState } from 'react';

function Analytics() {
  const [summary, setSummary] = useState({
    total_customers: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0
  });

  const [productSales, setProductSales] = useState([]);

  const fetchSummary = () => {
    fetch('https://agrivyn-backend.onrender.com/api/analytics/summary')
      .then(response => response.json())
      .then(data => {
        setSummary(data);
      })
      .catch(error => {
        console.error('Failed to fetch analytics summary:', error);
      });
  };

  const fetchProductSales = () => {
    fetch('https://agrivyn-backend.onrender.com/api/analytics/product-sales')
      .then(response => response.json())
      .then(data => {
        setProductSales(data);
      })
      .catch(error => {
        console.error('Failed to fetch product sales:', error);
      });
  };

  useEffect(() => {
    fetchSummary();
    fetchProductSales();
  }, []);

  return (
    <div>

      {/* Header */}
      <div className="mb-6">

        <h2 className="text-2xl font-semibold text-gray-800">
          Analytics
        </h2>

        <p className="text-gray-500 mt-1">
          View customers, products, orders, revenue, and product sales performance.
        </p>

      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">

        {/* Customers */}
        <div className="bg-white rounded-xl shadow p-5 sm:p-6">

          <p className="text-gray-500 text-sm">
            Total Customers
          </p>

          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {summary.total_customers}
          </h3>

        </div>


        {/* Products */}
        <div className="bg-white rounded-xl shadow p-5 sm:p-6">

          <p className="text-gray-500 text-sm">
            Total Products
          </p>

          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {summary.total_products}
          </h3>

        </div>


        {/* Orders */}
        <div className="bg-white rounded-xl shadow p-5 sm:p-6">

          <p className="text-gray-500 text-sm">
            Total Orders
          </p>

          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {summary.total_orders}
          </h3>

        </div>


        {/* Revenue */}
        <div className="bg-white rounded-xl shadow p-5 sm:p-6">

          <p className="text-gray-500 text-sm">
            Total Revenue
          </p>

          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            ₹{Number(summary.total_revenue).toFixed(2)}
          </h3>

        </div>

      </div>


      {/* Product Sales */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-4 sm:p-6 border-b">

          <h3 className="text-xl font-semibold text-gray-800">
            Product Sales
          </h3>

          <p className="text-gray-500 mt-1">
            Sales performance by product
          </p>

        </div>


        {/* Responsive Table */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[650px]">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Product
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Unit
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Quantity Sold
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Revenue
                </th>

              </tr>

            </thead>


            <tbody>

              {productSales.map(product => (

                <tr
                  key={product.product_id}
                  className="border-t"
                >

                  <td className="px-6 py-4 font-medium text-gray-800">
                    {product.product_name}
                  </td>

                  <td className="px-6 py-4">
                    {product.unit}
                  </td>

                  <td className="px-6 py-4">
                    {Number(product.quantity_sold).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    ₹{Number(product.total_revenue).toFixed(2)}
                  </td>

                </tr>

              ))}


              {productSales.length === 0 && (

                <tr>

                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No sales data available.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Analytics;