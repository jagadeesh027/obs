import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronRight, MapPin, Heart } from "lucide-react";
import { Property } from "../types";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [featured, setFeatured] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.getProperties();
        setFeatured(data.filter((p: Property) => p.featured));
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    const fetchFavorites = async () => {
      if (user) {
        try {
          const favs = await api.getFavorites(user.uid);
          setFavorites(favs);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      }
    };

    fetchFeatured();
    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (e: React.MouseEvent, propertyId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert("Please login to favorite properties");
      return;
    }

    try {
      const res = await api.toggleFavorite(user.uid, propertyId);
      if (res.favorited) {
        setFavorites(prev => [...prev, propertyId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== propertyId));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="bg-white text-[#C5A059]">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden perspective-1000">
        <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover"
            alt="Hero"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white"></div>
        </motion.div>
        
        <motion.div style={{ opacity }} className="relative z-10 text-center px-6">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.5em] mb-6 text-[#C5A059]"
          >
            Where Vision Meets Precision
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-light tracking-tighter mb-12 leading-none text-[#C5A059]"
          >
            Crafting Your <br /> <span className="italic font-serif text-[#C5A059]">Ultimate Legacy</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6"
          >
            <Link to="/properties" className="px-10 py-4 bg-[#C5A059] text-white text-xs uppercase tracking-widest font-bold hover:bg-[#B38F4D] transition-all shadow-lg">
              View Collection
            </Link>
            <Link to="/construction" className="px-10 py-4 bg-white text-black text-xs uppercase tracking-widest font-bold hover:bg-white/90 transition-all shadow-lg">
              Build Custom Estate
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Properties */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059]/60 mb-2">Curated Selection</p>
            <h2 className="text-4xl font-light tracking-tight text-[#C5A059]">Featured Estates</h2>
          </div>
          <Link to="/properties" className="text-xs uppercase tracking-widest flex items-center group text-[#C5A059]">
            View All <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {featured.map((property, idx) => (
            <motion.div 
              key={property.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                scale: 1.02
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: idx * 0.1 
              }}
              viewport={{ once: true }}
              className="group cursor-pointer preserve-3d"
            >
              <div className="relative aspect-[16/10] overflow-hidden mb-6 shadow-2xl">
                <motion.img 
                  src={property.image_url} 
                  className="w-full h-full object-cover transition-transform duration-1000" 
                  alt={property.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#C5A059]/80 backdrop-blur-md px-4 py-1 rounded-full text-[10px] uppercase tracking-widest text-white">
                  Featured
                </div>
                <button 
                  onClick={(e) => toggleFavorite(e, Number(property.id))}
                  className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md border transition-all z-20 ${
                    favorites.includes(Number(property.id)) 
                      ? "bg-[#C5A059] border-[#C5A059] text-white" 
                      : "bg-white/40 border-white/10 text-white/60 hover:text-white hover:border-white/30"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(Number(property.id)) ? "fill-current" : ""}`} />
                </button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-light mb-1 text-[#C5A059]">{property.title}</h3>
                  <p className="text-[#C5A059]/60 text-xs uppercase tracking-widest flex items-center">
                    <MapPin className="w-3 h-3 mr-1" /> {property.location}
                  </p>
                </div>
                <p className="text-xl font-light text-[#C5A059]">₹{(property.price / 10000000).toFixed(1)} Cr</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Construction Section */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/omni-const-home/1920/1080"
            className="w-full h-full object-cover opacity-10"
            alt="Construction"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059]/60 mb-4">Bespoke Architectural Execution</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#C5A059] mb-8">Build Your Vision</h2>
            <p className="text-[#C5A059]/60 text-lg font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              From foundation to finishing, we execute with uncompromising precision and artisanal craft. 
              Our construction division specializes in ultra-luxury custom estates.
            </p>
            <Link to="/construction" className="inline-block px-12 py-4 border border-[#C5A059] text-[#C5A059] text-xs uppercase tracking-widest font-bold hover:bg-[#C5A059] hover:text-white transition-all">
              Explore Construction Services
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
