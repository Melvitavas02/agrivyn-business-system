import { useEffect, useState } from 'react';
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  Search,
  Boxes
} from 'lucide-react';

function Analytics() {
  const [summary, setSummary] = useState({
    total_customers: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0
  });

  const [productSales, setProductSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProductSales = productSales.filter(product => {
    const search = searchTerm.toLowerCase();

    return (
      product.product_name?.toLowerCase().includes(search) ||
      product.unit?.toLowerCase().includes(search)
    );
  });

  const highestRevenueProduct =
    productSales.length > 0
      ? [...productSales].sort(
          (a, b) =>
            Number(b.total_revenue || 0) -
            Number(a.total_revenue || 0)
        )[0]
      : null;

  const totalSalesQuantity = productSales.reduce(
    (total, product) =>
      total + Number(product.quantity_sold || 0),
    0
  );

  return (
    <div className="min-h-full bg-gray-50">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="mb-8">

        <div className="flex items-center gap-2 mb-2">

          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
          </div>

          <span className="text-sm font-semibold text-emerald-600">
            BUSINESS INSIGHTS
          </span>

        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Analytics
        </h2>

        <p className="text-gray-500 mt-2 max-w-2xl">
          View your business performance, revenue, orders and
          product sales in one place.
        </p>

      </div>


      {/* =========================
          SUMMARY CARDS
      ========================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">

        {/* Customers */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Customers
              </p>

              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {summary.total_customers}
              </h3>

              <p className="text-xs text-emerald-600 font-medium mt-2">
                Customer base
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>

          </div>

        </div>


        {/* Products */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>

              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {summary.total_products}
              </h3>

              <p className="text-xs text-emerald-600 font-medium mt-2">
                Product catalogue
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>

          </div>

        </div>


        {/* Orders */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Orders
              </p>

              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {summary.total_orders}
              </h3>

              <p className="text-xs text-emerald-600 font-medium mt-2">
                Orders processed
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>

          </div>

        </div>


        {/* Revenue */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Revenue
              </p>

              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                ₹{Number(summary.total_revenue || 0).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </h3>

              <p className="text-xs text-emerald-600 font-medium mt-2">
                Overall sales revenue
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-emerald-600" />
            </div>

          </div>

        </div>

      </div>


      {/* =========================
          PERFORMANCE HIGHLIGHTS
      ========================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">

        {/* Total Quantity Sold */}

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-emerald-100 text-sm font-medium">
                Total Quantity Sold
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {totalSalesQuantity.toFixed(2)}
              </h3>

              <p className="text-emerald-100 text-sm mt-2">
                Across all recorded product sales
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>

          </div>

        </div>


        {/* Top Product */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Top Revenue Product
              </p>

              {highestRevenueProduct ? (

                <>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">
                    {highestRevenueProduct.product_name}
                  </h3>

                  <p className="text-sm text-emerald-600 font-semibold mt-1">
                    ₹{Number(
                      highestRevenueProduct.total_revenue || 0
                    ).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} revenue
                  </p>
                </>

              ) : (

                <h3 className="text-lg font-semibold text-gray-400 mt-2">
                  No sales data yet
                </h3>

              )}

            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Boxes className="w-5 h-5 text-emerald-600" />
            </div>

          </div>

        </div>

      </div>


      {/* =========================
          PRODUCT SALES
      ========================== */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Section Header */}

        <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <div className="flex items-center gap-2">

                <h3 className="text-lg font-bold text-gray-900">
                  Product Sales
                </h3>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  {productSales.length}
                </span>

              </div>

              <p className="text-sm text-gray-500 mt-1">
                Sales performance and revenue generated by each product.
              </p>

            </div>


            {/* Search */}

            <div className="relative w-full lg:w-80">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
              />

            </div>

          </div>

        </div>


        {/* =========================
            SALES TABLE
        ========================== */}

        {filteredProductSales.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>

                <tr className="bg-gray-50 border-b border-gray-100">

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Quantity Sold
                  </th>

                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {filteredProductSales.map(product => (

                  <tr
                    key={product.product_id}
                    className="hover:bg-gray-50/70 transition"
                  >

                    {/* Product */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Package className="w-4 h-4" />
                        </div>

                        <div>

                          <p className="font-semibold text-gray-800">
                            {product.product_name}
                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
                            Product #{product.product_id}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Unit */}

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.unit}
                    </td>


                    {/* Quantity */}

                    <td className="px-6 py-4">

                      <span className="font-semibold text-gray-800">
                        {Number(product.quantity_sold || 0).toFixed(2)}
                      </span>

                    </td>


                    {/* Revenue */}

                    <td className="px-6 py-4 text-right">

                      <span className="font-bold text-gray-800">
                        ₹{Number(product.total_revenue || 0).toLocaleString(
                          'en-IN',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">

            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">

              {searchTerm ? (
                <Search className="w-7 h-7 text-emerald-500" />
              ) : (
                <BarChart3 className="w-7 h-7 text-emerald-500" />
              )}

            </div>

            <h4 className="text-lg font-bold text-gray-800">
              {searchTerm
                ? 'No products found'
                : 'No sales data available'}
            </h4>

            <p className="text-sm text-gray-400 mt-1 max-w-sm">
              {searchTerm
                ? 'Try changing your search to find another product.'
                : 'Product sales information will appear here once orders are recorded.'}
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Analytics;