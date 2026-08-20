import { useEffect, useState } from 'react';
import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  ArrowUpRight,
  Boxes,
  Truck,
  BarChart3,
  Leaf,
  Clock3,
  AlertTriangle
} from 'lucide-react';

function Dashboard() {
  const [summary, setSummary] = useState({
    total_customers: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {

    // Fetch dashboard summary
    fetch('https://agrivyn-backend.onrender.com/api/analytics/summary')
      .then(response => response.json())
      .then(data => {
        setSummary(data);
      })
      .catch(error => {
        console.error('Failed to fetch dashboard data:', error);
      });


    // Fetch orders
    fetch('https://agrivyn-backend.onrender.com/api/orders')
      .then(response => response.json())
      .then(data => {

        const sortedOrders = [...data]
          .sort((a, b) => {

            const dateA = new Date(a.order_date);
            const dateB = new Date(b.order_date);

            if (dateB - dateA !== 0) {
              return dateB - dateA;
            }

            return Number(b.order_id) - Number(a.order_id);

          })
          .slice(0, 5);

        setRecentOrders(sortedOrders);

      })
      .catch(error => {
        console.error('Failed to fetch recent orders:', error);
      });


    // Fetch inventory stock
    fetch('https://agrivyn-backend.onrender.com/api/inventory/stock')
      .then(response => response.json())
      .then(data => {

        const lowStock = data
          .filter(item => Number(item.current_stock) <= 10)
          .sort(
            (a, b) =>
              Number(a.current_stock) - Number(b.current_stock)
          )
          .slice(0, 5);

        setLowStockProducts(lowStock);

      })
      .catch(error => {
        console.error('Failed to fetch inventory:', error);
      });

  }, []);


  const summaryCards = [
    {
      title: 'Total Customers',
      value: summary.total_customers,
      icon: Users,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      description: 'Registered customers'
    },
    {
      title: 'Total Products',
      value: summary.total_products,
      icon: Package,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      description: 'Products in catalogue'
    },
    {
      title: 'Total Orders',
      value: summary.total_orders,
      icon: ShoppingCart,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      description: 'Orders placed'
    },
    {
      title: 'Total Revenue',
      value: `₹${Number(summary.total_revenue || 0).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      description: 'Total sales generated'
    }
  ];


  const getStatusStyle = (status) => {

    switch (status) {

      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';

      case 'Confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-100';

      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-100';

      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100';

    }

  };


  const formatDate = (date) => {

    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

  };


  return (
    <div className="min-h-full bg-gray-50">


      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="mb-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 mb-2">

              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-600" />
              </div>

              <span className="text-sm font-semibold text-emerald-600">
                AGRIVYN BUSINESS MANAGEMENT
              </span>

            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Dashboard
            </h2>

            <p className="text-gray-500 mt-2 max-w-2xl">
              Get a quick overview of your customers, products, orders,
              inventory and business performance.
            </p>

          </div>


          {/* System Status */}

          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm w-fit">

            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>

            <div>

              <p className="text-xs text-gray-400 font-medium">
                SYSTEM STATUS
              </p>

              <p className="text-sm font-semibold text-gray-700">
                All systems operational
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          SUMMARY CARDS
      ========================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {summaryCards.map((card) => {

          const Icon = card.icon;

          return (

            <div
              key={card.title}
              className="group bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >

              <div className="flex items-start justify-between">

                <div
                  className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>


                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-emerald-50 transition">

                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />

                </div>

              </div>


              <div className="mt-5">

                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 tracking-tight">
                  {card.value}
                </h3>

                <p className="text-xs text-gray-400 mt-2">
                  {card.description}
                </p>

              </div>

            </div>

          );

        })}

      </div>


      {/* =========================
          QUICK OVERVIEW
      ========================== */}

      <div className="mt-8">

        <div className="mb-4">

          <h3 className="text-lg font-bold text-gray-900">
            Quick Overview
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Access the main areas of your business management system.
          </p>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


          {/* Inventory */}

          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-200 hover:shadow-sm transition">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Boxes className="w-5 h-5 text-emerald-600" />
              </div>

              <div>

                <h4 className="font-semibold text-gray-800">
                  Inventory
                </h4>

                <p className="text-xs text-gray-500 mt-0.5">
                  Monitor stock levels
                </p>

              </div>

            </div>

          </div>


          {/* Orders */}

          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-200 hover:shadow-sm transition">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>

              <div>

                <h4 className="font-semibold text-gray-800">
                  Orders
                </h4>

                <p className="text-xs text-gray-500 mt-0.5">
                  Manage customer orders
                </p>

              </div>

            </div>

          </div>


          {/* Deliveries */}

          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-200 hover:shadow-sm transition">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>

              <div>

                <h4 className="font-semibold text-gray-800">
                  Deliveries
                </h4>

                <p className="text-xs text-gray-500 mt-0.5">
                  Track deliveries
                </p>

              </div>

            </div>

          </div>


          {/* Analytics */}

          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-200 hover:shadow-sm transition">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>

              <div>

                <h4 className="font-semibold text-gray-800">
                  Analytics
                </h4>

                <p className="text-xs text-gray-500 mt-0.5">
                  View business insights
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          RECENT ORDERS + LOW STOCK
      ========================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">


        {/* =========================
            RECENT ORDERS
        ========================== */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Clock3 className="w-5 h-5 text-blue-600" />
                </div>

                <div>

                  <h3 className="font-bold text-gray-900">
                    Recent Orders
                  </h3>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Latest customer orders
                  </p>

                </div>

              </div>

              <span className="hidden sm:block text-xs font-medium text-gray-400">
                Latest 5
              </span>

            </div>

          </div>


          <div className="p-4 sm:p-5">

            {recentOrders.length > 0 ? (

              <div className="space-y-2">

                {recentOrders.map((order) => (

                  <div
                    key={order.order_id}
                    className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition"
                  >

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <ShoppingCart className="w-4 h-4 text-emerald-600" />
                      </div>

                      <div className="min-w-0">

                        <p className="font-semibold text-gray-800 text-sm">
                          Order #{order.order_id}
                        </p>

                        <p className="text-xs text-gray-500 mt-1 truncate">
                          Customer #{order.customer_id}
                        </p>

                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(order.order_date)}
                        </p>

                      </div>

                    </div>


                    <div className="text-right shrink-0">

                      <p className="font-semibold text-gray-800 text-sm">
                        ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                      </p>

                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-semibold mt-1 ${getStatusStyle(order.status)}`}
                      >
                        {order.status || 'Pending'}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="flex flex-col items-center justify-center py-10 text-center">

                <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6 text-gray-400" />
                </div>

                <h4 className="font-semibold text-gray-700">
                  No orders yet
                </h4>

                <p className="text-sm text-gray-400 mt-1 max-w-sm">
                  Orders will appear here once customers place
                  orders through the system.
                </p>

              </div>

            )}

          </div>

        </div>


        {/* =========================
            LOW STOCK
        ========================== */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>

                <div>

                  <h3 className="font-bold text-gray-900">
                    Low Stock
                  </h3>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Products requiring attention
                  </p>

                </div>

              </div>

              <span className="hidden sm:block text-xs font-medium text-gray-400">
                Stock ≤ 10
              </span>

            </div>

          </div>


          <div className="p-4 sm:p-5">

            {lowStockProducts.length > 0 ? (

              <div className="space-y-2">

                {lowStockProducts.map((item) => {

                  const currentStock = Number(item.current_stock);

                  return (

                    <div
                      key={item.product_id}
                      className="flex items-center justify-between gap-4 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition"
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-red-500" />
                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {item.product_name}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            Unit: {item.unit}
                          </p>

                        </div>

                      </div>


                      <div className="text-right shrink-0">

                        <p className="text-lg font-bold text-red-600">
                          {currentStock.toFixed(2)}
                        </p>

                        <p className="text-[11px] text-gray-400">
                          remaining
                        </p>

                      </div>

                    </div>

                  );

                })}

              </div>

            ) : (

              <div className="flex flex-col items-center justify-center py-10 text-center">

                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                  <Boxes className="w-6 h-6 text-emerald-500" />
                </div>

                <h4 className="font-semibold text-gray-700">
                  Stock levels look good
                </h4>

                <p className="text-sm text-gray-400 mt-1 max-w-sm">
                  There are currently no products that need
                  immediate stock attention.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>


      {/* =========================
          WELCOME / SYSTEM INFO
      ========================== */}

      <div className="mt-8 bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div className="max-w-2xl">

            <div className="flex items-center gap-2 mb-3">

              <Leaf className="w-5 h-5" />

              <span className="text-sm font-medium text-emerald-100">
                AGRIVYN
              </span>

            </div>

            <h3 className="text-xl sm:text-2xl font-bold">
              Welcome to your business dashboard
            </h3>

            <p className="text-emerald-100 mt-2 text-sm sm:text-base leading-relaxed">
              Manage customers, products, orders, inventory and
              deliveries from one centralized platform.
            </p>

          </div>


          <div className="hidden md:flex w-16 h-16 rounded-2xl bg-white/10 items-center justify-center">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;