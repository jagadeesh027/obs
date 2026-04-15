import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Neighborhood } from "../types";
import { api } from "../services/api";

const Neighborhoods = () => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const data = await api.getNeighborhoods();
        setNeighborhoods(data);
      } catch (error) {
        console.error("Error fetching neighborhoods:", error);
      }
    };
    fetchNeighborhoods();
  }, []);

  return (
    <div className="bg-black text-white pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-4">Explore</p>
          <h1 className="text-5xl font-light tracking-tight">Iconic Neighborhoods</h1>
        </div>

        <div className="space-y-32">
          {neighborhoods.map((n, idx) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-16 items-center perspective-1000`}
            >
              <motion.div 
                whileHover={{ rotateY: idx % 2 === 0 ? 5 : -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-full md:w-1/2 aspect-[4/3] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] preserve-3d"
              >
                <img 
                  src={n.image_url} 
                  className="w-full h-full object-cover transition-transform duration-1000" 
                  alt={n.name}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="w-full md:w-1/2 space-y-8"
              >
                <h2 className="text-4xl font-light italic font-serif">{n.name}</h2>
                <p className="text-white/60 leading-loose text-lg font-light">
                  {n.description}
                </p>
                <div className="pt-8 border-t border-white/10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Average Estate Price</p>
                  <p className="text-3xl font-light">₹{(n.avg_price / 10000000).toFixed(1)} Cr+</p>
                </div>
                <button className="px-10 py-4 border border-white/30 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                  Explore Listings
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Neighborhoods;
