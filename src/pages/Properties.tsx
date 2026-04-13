import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { MapPin, Bed, Bath, Maximize, Search, SlidersHorizontal, X } from "lucide-react";
import { Property } from "../types";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000000); // 100 Cr default
  const [minBeds, setMinBeds] = useState<number>(0);
  const [minBaths, setMinBaths] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "properties"), 
      (snapshot) => {
        setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "properties");
      }
    );
    return unsubscribe;
  }, []);

  const filtered = properties.filter(p => {
    const matchesNeighborhood = filter === "All" || p.neighborhood === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    const matchesBeds = p.beds >= minBeds;
    const matchesBaths = p.baths >= minBaths;
    
    return matchesNeighborhood && matchesSearch && matchesPrice && matchesBeds && matchesBaths;
  });

  const neighborhoods = ["All", ...new Set(properties.map(p => p.neighborhood))];

  const clearFilters = () => {
    setFilter("All");
    setSearchQuery("");
    setMinPrice(0);
    setMaxPrice(1000000000);
    setMinBeds(0);
    setMinBaths(0);
  };

  return (
    <div className="bg-black text-white pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-4">The Collection</p>
          <h1 className="text-5xl font-light tracking-tight mb-12">Exclusive Properties</h1>
          
          <div className="max-w-2xl mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            {neighborhoods.map(n => (
              <button
                key={n}
                onClick={() => setFilter(n)}
                className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all border ${filter === n ? "bg-white text-black border-white" : "border-white/20 text-white/60 hover:border-white/40"}`}
              >
                {n}
              </button>
            ))}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all border ${showFilters ? "bg-[#C5A059] text-white border-[#C5A059]" : "border-white/20 text-white/60 hover:border-white/40"}`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Advanced Filters</span>
            </button>
          </div>

          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto p-8 bg-white/5 border border-white/10 rounded-2xl mb-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4 text-left">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Price Range (Cr)</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="number" 
                      placeholder="Min"
                      value={minPrice / 10000000 || ""}
                      onChange={(e) => setMinPrice(Number(e.target.value) * 10000000)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-white/30"
                    />
                    <span className="text-white/20">-</span>
                    <input 
                      type="number" 
                      placeholder="Max"
                      value={maxPrice / 10000000 || ""}
                      onChange={(e) => setMaxPrice(Number(e.target.value) * 10000000)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Min Bedrooms</label>
                  <select 
                    value={minBeds}
                    onChange={(e) => setMinBeds(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-white/30 appearance-none"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n} className="bg-black">{n === 0 ? "Any" : `${n}+ Beds`}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4 text-left">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Min Bathrooms</label>
                  <select 
                    value={minBaths}
                    onChange={(e) => setMinBaths(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-white/30 appearance-none"
                  >
                    {[0, 1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n} className="bg-black">{n === 0 ? "Any" : `${n}+ Baths`}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button 
                    onClick={clearFilters}
                    className="w-full py-2 border border-white/10 rounded-lg text-[10px] uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center justify-center space-x-2"
                  >
                    <X className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <p className="text-white/40 text-[10px] uppercase tracking-widest">
            Showing {filtered.length} of {properties.length} properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {filtered.length > 0 ? (
            filtered.map((property) => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={property.id}
                className="group"
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-6">
                  <img 
                    src={property.image_url} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={property.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <Link to={`/properties/${property.id}`} className="block w-full py-3 bg-white text-black text-[10px] uppercase tracking-widest font-bold text-center">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-light tracking-tight">{property.title}</h3>
                    <p className="text-lg font-light">₹{(property.price / 10000000).toFixed(1)} Cr</p>
                  </div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest flex items-center">
                    <MapPin className="w-3 h-3 mr-1" /> {property.location}
                  </p>
                  <div className="flex space-x-6 pt-2 border-t border-white/10">
                    <div className="flex items-center text-[10px] text-white/60 uppercase tracking-widest">
                      <Bed className="w-3 h-3 mr-2" /> {property.beds} Beds
                    </div>
                    <div className="flex items-center text-[10px] text-white/60 uppercase tracking-widest">
                      <Bed className="w-3 h-3 mr-2" /> {property.baths} Baths
                    </div>
                    <div className="flex items-center text-[10px] text-white/60 uppercase tracking-widest">
                      <Maximize className="w-3 h-3 mr-2" /> {property.sqft.toLocaleString()} Sqft
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-white/40 text-sm font-light tracking-widest uppercase">No properties match your criteria</p>
              <button 
                onClick={clearFilters}
                className="mt-6 text-[#C5A059] text-[10px] uppercase tracking-[0.3em] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
