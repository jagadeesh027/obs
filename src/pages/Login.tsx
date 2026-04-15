import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err: any) {
      if (err.code === "auth/operation-not-allowed") {
        setError("Email/Password login is not enabled in Firebase Console. Please use Google Sign-In or enable it.");
      } else {
        setError(err.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-black text-white h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 p-12 border border-white/10 backdrop-blur-xl"
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl font-light tracking-widest uppercase mb-2">
            {isSignUp ? "Create Account" : "Client Login"}
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-white/40">
            {isSignUp ? "Join our exclusive network" : "Access your private portfolio"}
          </p>
        </div>

        <div className="space-y-6">
          <button 
            onClick={handleGoogleSignIn}
            className="w-full py-4 bg-white/10 border border-white/20 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-3"
          >
            <LogIn className="w-4 h-4" /> Sign in with Google
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-[8px] uppercase tracking-widest text-white/20">or use email</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/60">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-white transition-colors" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/60">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-white transition-colors" 
                required
              />
            </div>
            {error && <p className="text-red-500 text-[10px] uppercase tracking-widest text-center leading-relaxed">{error}</p>}
            <button type="submit" className="w-full py-4 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-white/90 transition-all">
              {isSignUp ? "Register" : "Enter Portal"}
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center space-y-4">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[10px] text-white/60 uppercase tracking-widest hover:text-white transition-colors"
          >
            {isSignUp ? "Already have an account? Login" : "Need an account? Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
