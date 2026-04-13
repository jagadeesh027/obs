import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Neighborhoods", path: "/neighborhoods" },
    { name: "Construction", path: "/construction" },
    { name: "About", path: "/about" },
  ];

  if (isAdmin) {
    navLinks.push({ name: "Admin", path: "/admin" });
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-8"}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className={`text-2xl font-light tracking-[0.2em] uppercase ${isScrolled ? "text-[#C5A059]" : "text-white"}`}>
          Omni<span className="font-semibold"> Build Solutions</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs uppercase tracking-widest transition-colors ${isScrolled ? (location.pathname === link.path ? "text-[#C5A059]" : "text-[#C5A059]/60 hover:text-[#C5A059]") : (location.pathname === link.path ? "text-white" : "text-white/60 hover:text-white")}`}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center space-x-6">
              <div className={`flex items-center gap-2 ${isScrolled ? "text-[#C5A059]/60" : "text-white/60"}`}>
                <UserIcon className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-widest">{user.name || user.email.split('@')[0]}</span>
              </div>
              <button 
                onClick={handleLogout}
                className={`${isScrolled ? "text-[#C5A059]/60 hover:text-[#C5A059]" : "text-white/60 hover:text-white"} transition-colors`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className={`px-6 py-2 border rounded-full text-xs uppercase tracking-widest transition-all ${isScrolled ? "border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059] hover:text-white" : "border-white/30 text-white hover:bg-white hover:text-black"}`}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className={`md:hidden ${isScrolled ? "text-[#C5A059]" : "text-white"}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-full left-0 w-full p-8 flex flex-col space-y-6 md:hidden border-t ${isScrolled ? "bg-white border-[#C5A059]/10" : "bg-black border-white/10"}`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-light tracking-widest ${isScrolled ? "text-[#C5A059]/80" : "text-white/80"}`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className={`text-lg font-light tracking-widest text-left ${isScrolled ? "text-[#C5A059]/80" : "text-white/80"}`}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className={`text-lg font-light tracking-widest ${isScrolled ? "text-[#C5A059]/80" : "text-white/80"}`}
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
