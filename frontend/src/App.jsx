import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';

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

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white min-h-screen p-6">

        <h1 className="text-2xl font-bold mb-8">
          Agrivyn
        </h1>

        <nav className="space-y-3">

          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded hover:bg-green-700"
          >
            Dashboard
          </Link>

          <Link
            to="/customers"
            className="block px-4 py-2 rounded hover:bg-green-700"
          >
            Customers
          </Link>

          <Link
            to="/products"
            className="block px-4 py-2 rounded hover:bg-green-700"
          >
            Products
          </Link>

          <Link
            to="/orders"
            className="block px-4 py-2 rounded hover:bg-green-700"
          >
            Orders
          </Link>

          <Link
            to="/inventory"
            className="block px-4 py-2 rounded hover:bg-green-700"
          >
            Inventory
          </Link>

          <Link
            to="/deliveries"
            className="block px-4 py-2 rounded hover:bg-green-700"
          >
            Deliveries
          </Link>

          <Link
            to="/analytics"
            className="block px-4 py-2 rounded hover:bg-green-700"
          >
            Analytics
          </Link>

        </nav>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="mt-8 w-full bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>

      </aside>


      {/* Main Area */}
      <main className="flex-1">

        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-5">

          <h2 className="text-2xl font-semibold text-gray-800">
            Agrivyn
          </h2>

          <p className="text-gray-500 mt-1">
            Business Management System
          </p>

        </header>


        {/* Content */}
        <section className="p-8">

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