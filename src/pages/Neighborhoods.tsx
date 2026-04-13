import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Neighborhood } from "../types";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

const Neighborhoods = () => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "neighborhoods"), 
      (snapshot) => {
        setNeighborhoods(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "neighborhoods");
      }
    );
    return unsubscribe;
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
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className={`flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-16 items-center`}
            >
              <div className="w-full md:w-1/2 aspect-[4/3] overflow-hidden">
                <img 
                  src={n.image_url} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
                  alt={n.name}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-8">
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Neighborhoods;
