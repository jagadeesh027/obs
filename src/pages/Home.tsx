import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronRight, MapPin } from "lucide-react";
import { Property } from "../types";
import { api } from "../services/api";

const Home = () => {
  const [featured, setFeatured] = useState<Property[]>([]);
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
    fetchFeatured();
  }, []);

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
                rotateY: idx % 2 === 0 ? 5 : -5,
                rotateX: 2,
                z: 50,
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
                <div className="absolute top-4 right-4 bg-[#C5A059]/80 backdrop-blur-md px-4 py-1 rounded-full text-[10px] uppercase tracking-widest text-white">
                  Featured
                </div>
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
    </div>
  );
};

export default Home;
