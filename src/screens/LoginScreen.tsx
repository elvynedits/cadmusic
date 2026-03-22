import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'motion/react';
import { Music } from 'lucide-react';

export default function LoginScreen() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, name);
      }
    } catch (error) {
      // Error is handled in store
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a2e] to-[#0F0F0F] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-[120px] animate-pulse" />
      
      {/* Grid background effect */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#fff_25%,transparent_25%,transparent_75%,#fff_75%,#fff),linear-gradient(45deg,#fff_25%,transparent_25%,transparent_75%,#fff_75%,#fff)] bg-[length:60px_60px] bg-[position:0_0,30px_30px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10 relative"
      >
        {/* Logo & Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col items-center mb-12"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl blur-2xl opacity-40" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-xl border border-white/20">
              <Music className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-white mt-6 mb-2"
          >
            Cadence
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-gray-400 text-sm font-light"
          >
            {isLogin ? 'Stream music like never before' : 'Join millions listening to music'}
          </motion.p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative group"
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/50 via-purple-500/30 to-blue-500/50 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Main glass container */}
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-[32px] p-8 shadow-2xl">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-semibold mb-8 text-center text-white tracking-tight relative z-10"
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-sm font-medium"
                    required
                  />
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isLogin ? 0.5 : 0.6 }}
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-sm font-medium"
                  required
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isLogin ? 0.6 : 0.7 }}
              >
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-sm font-medium"
                  required
                />
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isLogin ? 0.7 : 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold rounded-2xl py-3.5 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">
                  {loading ? 'Signing in...' : (isLogin ? 'Sign In' : 'Create Account')}
                </span>
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: isLogin ? 0.8 : 0.9 }}
              className="mt-8 relative"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gradient-to-br from-[#0A0A0A] via-[#1a1a2e] to-[#0F0F0F] text-xs text-gray-400 font-light">or continue</span>
              </div>
            </motion.div>

            {/* Google Sign In */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isLogin ? 0.9 : 1.0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loginWithGoogle}
              className="mt-6 w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold rounded-2xl py-3.5 hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="relative z-10">Google</span>
            </motion.button>

            {/* Toggle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: isLogin ? 1.0 : 1.1 }}
              className="mt-8 text-center text-xs text-gray-400 font-light relative z-10"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white hover:text-pink-400 transition-colors duration-300 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </motion.p>
          </div>
        </motion.div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-[11px] text-gray-500 mt-8 font-light tracking-wide"
        >
          Secure • Fast • Beautiful
        </motion.p>
      </motion.div>
    </div>
  );
}
