import { useState } from 'react';
import { Link, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

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

  // Check whether user is logged in
  const user = localStorage.getItem('user');

  // Login page should have no sidebar/header
  if (location.pathname === '/login') {
    return <Login />;
  }

  // If user is not logged in, send them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static
          top-0 left-0
          z-50
          w-64
          bg-green-800
          text-white
          min-h-screen
          p-6
          transform
          transition-transform
          duration-300
          ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >

        {/* Logo + Mobile Close */}
        <div className="flex items-center justify-between mb-8">

          <h1 className="text-2xl font-bold">
            Agrivyn
          </h1>

          <button
            onClick={closeSidebar}
            className="md:hidden text-white text-2xl"
          >
            ×
          </button>

        </div>


        {/* Navigation */}
        <nav className="space-y-2">

          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded hover:bg-green-700"
          >
            Dashboard
          </Link>

          <Link
            to="/customers"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded hover:bg-green-700"
          >
            Customers
          </Link>

          <Link
            to="/products"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded hover:bg-green-700"
          >
            Products
          </Link>

          <Link
            to="/orders"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded hover:bg-green-700"
          >
            Orders
          </Link>

          <Link
            to="/inventory"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded hover:bg-green-700"
          >
            Inventory
          </Link>

          <Link
            to="/deliveries"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded hover:bg-green-700"
          >
            Deliveries
          </Link>

          <Link
            to="/analytics"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded hover:bg-green-700"
          >
            Analytics
          </Link>

        </nav>


        {/* Logout */}
        <button
  onClick={() => {
    localStorage.removeItem('user');
    navigate('/login');
  }}
  className="mt-8 w-full bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
>
  Logout
</button>

      </aside>


      {/* Main Area */}
      <main className="flex-1 min-w-0">

        {/* Header */}
        <header className="bg-white shadow-sm px-4 sm:px-8 py-4 sm:py-5">

          <div className="flex items-center gap-4">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-green-800 text-3xl leading-none"
              aria-label="Open menu"
            >
              ☰
            </button>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Agrivyn
              </h2>

              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                Business Management System
              </p>
            </div>

          </div>

        </header>


        {/* Content */}
        <section className="p-4 sm:p-6 md:p-8 overflow-x-hidden">

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