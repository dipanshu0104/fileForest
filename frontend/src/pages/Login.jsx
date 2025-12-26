import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/authcomp/Input";
import { Link } from "react-router-dom";
import { Mail, Lock, Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(identifier, password);
  };

  return (
    <div className="min-h-screen text-gray-400 bg-gray-800 sm:bg-gray-900 flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 max-w-md w-full  rounded-2xl"
      >
        <div className="p-8 flex-grow flex flex-col justify-center">
          <h1 className="text-center text-white text-3xl mb-6 font-bold">
            Welcome Back
          </h1>

          <form onSubmit={handleLogin}>
            <Input
              icon={Mail}
              type="text"
              placeholder="Email Address / Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center mb-6">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-red-500 font-semibold mt-2">{error}</p>
            )}

            <motion.button
              className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-sky-600 text-white 
                  font-bold rounded-lg shadow-lg hover:from-blue-600
                  hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   focus:ring-offset-gray-900 transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
        </div>

        <div className="px-8 py-4 bg-gray-950 bg-opacity-50 flex justify-center md:rounded-b-2xl rounded-none">
          <p className="text-sm text-gray-400 text-center">
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-blue-400 hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
