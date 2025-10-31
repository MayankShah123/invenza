import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Left side - Illustration / Branding */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex-col justify-center items-center p-8">
          <h1 className="text-4xl font-bold mb-2">Invenza</h1>
          <p className="text-sm text-indigo-100 text-center px-6">
            Manage your inventory and billing with ease and efficiency.
          </p>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
            Welcome Back 👋
          </h2>

          {error && <p className="text-red-500 text-center text-sm mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <span
                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-500">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
