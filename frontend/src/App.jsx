import { useState } from 'react';
import {
  Link,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';

import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Boxes,
  Truck,
  BarChart3,
  LogOut,
  Menu,
  X,
  Leaf,
  ChevronRight
} from 'lucide-react';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Deliveries from './pages/Deliveries';
import Analytics from './pages/Analytics';

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const user = localStorage.getItem('user');

  // Login page has no dashboard layout
  if (location.pathname === '/login') {
    return <Login />;
  }

  // Protect dashboard routes
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Customers',
      path: '/customers',
      icon: Users
    },
    {
      name: 'Products',
      path: '/products',
      icon: Package
    },
    {
      name: 'Orders',
      path: '/orders',
      icon: ShoppingCart
    },
    {
      name: 'Inventory',
      path: '/inventory',
      icon: Boxes
    },
    {
      name: 'Deliveries',
      path: '/deliveries',
      icon: Truck
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3
    }
  ];

  const currentPage =
    navigationItems.find(item => item.path === location.pathname)
      ?.name || 'Dashboard';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}


      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed md:sticky
          top-0 left-0
          z-50
          w-64
          h-screen
          flex flex-col
          bg-white
          border-r border-gray-200
          shadow-xl md:shadow-none
          transform
          transition-transform
          duration-300
          ease-in-out
          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full md:translate-x-0'
          }
        `}
      >

        {/* =========================
            BRAND
        ========================== */}

        <div className="h-20 px-5 flex items-center justify-between border-b border-gray-100">

          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-3"
          >

            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">

              <Leaf className="w-5 h-5 text-white" />

            </div>

            <div>

              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Agrivyn
              </h1>

              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                Business System
              </p>

            </div>

          </Link>


          {/* Mobile Close */}

          <button
            onClick={closeSidebar}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
            aria-label="Close menu"
          >

            <X className="w-5 h-5" />

          </button>

        </div>


        {/* =========================
            NAVIGATION
        ========================== */}

        <div className="flex-1 px-4 py-6 overflow-y-auto">

          <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Main Menu
          </p>


          <nav className="space-y-1.5">

            {navigationItems.map(item => {

              const Icon = item.icon;

              const isActive =
                location.pathname === item.path;

              return (

                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`
                    group
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-xl
                    text-sm
                    font-semibold
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >

                  <div
                    className={`
                      w-9
                      h-9
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      transition
                      ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                      }
                    `}
                  >

                    <Icon className="w-4 h-4" />

                  </div>


                  <span className="flex-1">
                    {item.name}
                  </span>


                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-emerald-500" />
                  )}

                </Link>

              );

            })}

          </nav>

        </div>


        {/* =========================
            SIDEBAR FOOTER
        ========================== */}

        <div className="p-4 border-t border-gray-100">

          {/* System Card */}

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-3">

            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">

                <Leaf className="w-4 h-4 text-emerald-600" />

              </div>

              <div className="min-w-0">

                <p className="text-xs font-semibold text-emerald-800">
                  Agrivyn System
                </p>

                <p className="text-[11px] text-emerald-600 truncate">
                  Business management
                </p>

              </div>

            </div>

          </div>


          {/* Logout */}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
          >

            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">

              <LogOut className="w-4 h-4" />

            </div>

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <main className="flex-1 min-w-0">

        {/* =========================
            TOP HEADER
        ========================== */}

        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200">

          <div className="h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

            {/* Left */}

            <div className="flex items-center gap-3">

              {/* Mobile Menu */}

              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition"
                aria-label="Open menu"
              >

                <Menu className="w-5 h-5" />

              </button>


              <div>

                <div className="flex items-center gap-2">

                  <span className="text-sm text-gray-400 hidden sm:inline">
                    Workspace
                  </span>

                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 hidden sm:inline" />

                  <h2 className="text-sm sm:text-base font-bold text-gray-900">
                    {currentPage}
                  </h2>

                </div>

                <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                  Agrivyn Business Management System
                </p>

              </div>

            </div>


            {/* Right */}

            <div className="flex items-center gap-3">

              {/* Status */}

              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100">

                <span className="relative flex h-2.5 w-2.5">

                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>

                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>

                </span>

                <span className="text-xs font-semibold text-emerald-700">
                  System Online
                </span>

              </div>


              {/* User */}

              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                A
              </div>

            </div>

          </div>

        </header>


        {/* =========================
            PAGE CONTENT
        ========================== */}

        <section className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">

          <Routes>

            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/customers"
              element={<Customers />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/inventory"
              element={<Inventory />}
            />

            <Route
              path="/deliveries"
              element={<Deliveries />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

          </Routes>

        </section>

      </main>

    </div>
  );
}

export default App;