import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Leaf,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://agrivyn-backend.onrender.com/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');

    } catch (error) {
      console.error('Login error:', error);
      setError('Unable to connect to server');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* =====================================================
          LEFT BRANDING SECTION
      ====================================================== */}

      <div className="hidden lg:flex lg:w-1/2 bg-emerald-700 relative overflow-hidden">

        {/* Decorative circles */}

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600 rounded-full opacity-40" />

        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-emerald-800 rounded-full opacity-50" />

        <div className="absolute top-1/3 right-20 w-32 h-32 bg-emerald-500 rounded-full opacity-20" />


        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16 text-white">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/10">

              <Leaf className="w-6 h-6 text-white" />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight">
                Agrivyn
              </h1>

              <p className="text-xs text-emerald-100 uppercase tracking-widest">
                Business Management System
              </p>

            </div>

          </div>


          {/* Main Message */}

          <div className="max-w-lg">

            <p className="text-emerald-200 text-sm font-semibold uppercase tracking-widest mb-4">
              Welcome back
            </p>

            <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
              Manage your business
              <span className="text-emerald-200">
                {' '}with confidence.
              </span>
            </h2>

            <p className="text-emerald-100 mt-6 text-base xl:text-lg leading-relaxed max-w-md">
              Manage customers, products, orders, inventory,
              deliveries and business insights from one
              centralized platform.
            </p>


            {/* Features */}

            <div className="mt-8 space-y-3">

              <div className="flex items-center gap-3">

                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">

                  <ShieldCheck className="w-4 h-4" />

                </div>

                <span className="text-sm text-emerald-50">
                  Centralized business management
                </span>

              </div>


              <div className="flex items-center gap-3">

                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">

                  <ShieldCheck className="w-4 h-4" />

                </div>

                <span className="text-sm text-emerald-50">
                  Real-time inventory and order tracking
                </span>

              </div>


              <div className="flex items-center gap-3">

                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">

                  <ShieldCheck className="w-4 h-4" />

                </div>

                <span className="text-sm text-emerald-50">
                  Business performance insights
                </span>

              </div>

            </div>

          </div>


          {/* Footer */}

          <p className="text-xs text-emerald-200">
            Agrivyn Business Management System
          </p>

        </div>

      </div>


      {/* =====================================================
          LOGIN SECTION
      ====================================================== */}

      <div className="flex-1 flex items-center justify-center px-5 py-10">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}

          <div className="lg:hidden flex flex-col items-center mb-8">

            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-sm">

              <Leaf className="w-7 h-7 text-white" />

            </div>

            <h1 className="text-2xl font-bold text-gray-900 mt-3">
              Agrivyn
            </h1>

            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
              Business Management System
            </p>

          </div>


          {/* Login Card */}

          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 sm:p-8">

            {/* Heading */}

            <div className="mb-7">

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">

                <Lock className="w-5 h-5 text-emerald-600" />

              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Sign in
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Enter your credentials to access Agrivyn.
              </p>

            </div>


            {/* Error */}

            {error && (

              <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 mb-5">

                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">

                  <span className="text-xs font-bold">
                    !
                  </span>

                </div>

                <p className="text-sm font-medium">
                  {error}
                </p>

              </div>

            )}


            {/* Form */}

            <form onSubmit={handleSubmit}>

              {/* Username */}

              <div className="mb-5">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>

                <div className="relative">

                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                  <input
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    required
                    autoComplete="username"
                    placeholder="Enter your username"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-11 pr-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                  />

                </div>

              </div>


              {/* Password */}

              <div className="mb-6">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-11 pr-12 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >

                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}

                  </button>

                </div>

              </div>


              {/* Login Button */}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl font-semibold shadow-sm hover:bg-emerald-700 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition"
              >

                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}

              </button>

            </form>


            {/* Bottom */}

            <div className="mt-7 pt-5 border-t border-gray-100 text-center">

              <p className="text-xs text-gray-400">
                Authorized users only
              </p>

            </div>

          </div>


          {/* Mobile Footer */}

          <p className="lg:hidden text-center text-xs text-gray-400 mt-6">
            Agrivyn Business Management System
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;