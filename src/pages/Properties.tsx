import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Bed, Bath, Maximize, Search, SlidersHorizontal, X, Heart, ArrowUpDown, Info, Check, Copy, Share2, ArrowLeft } from "lucide-react";
import { Property } from "../types";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const SkeletonCard = () => (
  <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden animate-pulse">
    <div className="aspect-[4/5] bg-white/10" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/10 rounded w-1/2" />
      <div className="h-8 bg-white/10 rounded w-full" />
    </div>
  </div>
);

const Properties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [neighborhoodDetails, setNeighborhoodDetails] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [quickViewProperty, setQuickViewProperty] = useState<Property | null>(null);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000000);
  const [minBeds, setMinBeds] = useState<number>(0);
  const [minBaths, setMinBaths] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [propsData, neighData] = await Promise.all([
          api.getProperties(),
          api.getNeighborhoods()
        ]);
        setProperties(propsData);
        setNeighborhoodDetails(neighData);
        
        if (user) {
          const favs = await api.getFavorites(user.uid);
          setFavorites(favs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  const toggleCompare = (property: Property) => {
    if (compareList.find(p => p.id === property.id)) {
      setCompareList(prev => prev.filter(p => p.id !== property.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare up to 3 properties at a time.");
        return;
      }
      setCompareList(prev => [...prev, property]);
    }
  };

  const filtered = properties
    .filter(p => {
      const matchesNeighborhood = filter === "All" || p.neighborhood === filter;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
      const matchesBeds = p.beds >= minBeds;
      const matchesBaths = p.baths >= minBaths;
      const matchesFavorites = !showFavoritesOnly || favorites.includes(Number(p.id));
      
      return matchesNeighborhood && matchesSearch && matchesPrice && matchesBeds && matchesBaths && matchesFavorites;
    })
    .sort((a, b) => {
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "size") return b.sqft - a.sqft;
      return 0; // newest/default
    });

  const neighborhoods = ["All", ...new Set(properties.map(p => p.neighborhood))];
  const activeNeighborhood = neighborhoodDetails.find(n => n.name === filter);

  const clearFilters = () => {
    setFilter("All");
    setSearchQuery("");
    setMinPrice(0);
    setMaxPrice(1000000000);
    setMinBeds(0);
    setMinBaths(0);
    setShowFavoritesOnly(false);
  };

  const saveSearch = () => {
    const newSearch = {
      id: Date.now(),
      query: searchQuery,
      filter,
      minPrice,
      maxPrice,
      timestamp: new Date().toLocaleDateString()
    };
    setSavedSearches(prev => [newSearch, ...prev]);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="bg-black text-white pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-4">The Collection</p>
          <h1 className="text-5xl font-light tracking-tight mb-12">Exclusive Properties</h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
            <div className="w-full max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
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
            <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />
            <button 
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center space-x-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all border ${showFavoritesOnly ? "bg-red-500/20 text-red-500 border-red-500/30" : "border-white/20 text-white/60 hover:border-white/40"}`}
            >
              <Heart className={`w-3 h-3 ${showFavoritesOnly ? "fill-current" : ""}`} />
              <span>My Favorites</span>
            </button>
            {showFavoritesOnly && favorites.length > 0 && (
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href + "?favorites=" + favorites.join(","));
                  alert("Private collection link copied to clipboard!");
                }}
                className="flex items-center space-x-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white"
              >
                <Share2 className="w-3 h-3" />
                <span>Share Collection</span>
              </button>
            )}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all border ${showFilters ? "bg-[#C5A059] text-white border-[#C5A059]" : "border-white/20 text-white/60 hover:border-white/40"}`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Advanced Filters</span>
            </button>
            <button 
              onClick={saveSearch}
              className="flex items-center space-x-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all border border-white/20 text-white/60 hover:border-white/40"
            >
              <Share2 className="w-3 h-3" />
              <span>Save Search</span>
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

          <AnimatePresence>
            {activeNeighborhood && filter !== "All" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-4xl mx-auto mb-12 overflow-hidden"
              >
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center text-left">
                  <div className="w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden">
                    <img src={activeNeighborhood.image_url} className="w-full h-full object-cover" alt={activeNeighborhood.name} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-light">{activeNeighborhood.name}</h2>
                      <span className="text-[8px] uppercase tracking-widest bg-[#C5A059]/20 text-[#C5A059] px-2 py-1 rounded">Neighborhood Profile</span>
                    </div>
                    <p className="text-white/60 text-sm font-light leading-relaxed">{activeNeighborhood.description}</p>
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-white/40 mb-1">Avg. Investment</p>
                        <p className="text-sm font-medium">₹{(activeNeighborhood.avg_price / 10000000).toFixed(0)} Cr+</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-white/40 mb-1">Vibe</p>
                        <p className="text-sm font-medium">Exclusive & Serene</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center max-w-7xl mx-auto mb-8">
            <p className="text-white/40 text-[10px] uppercase tracking-widest">
              Showing {filtered.length} of {properties.length} properties
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60">
                <ArrowUpDown className="w-3 h-3" />
                <span>Sort By:</span>
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-[10px] uppercase tracking-widest text-white focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-black">Just Commissioned</option>
                <option value="price-high" className="bg-black">Prestige (High to Low)</option>
                <option value="price-low" className="bg-black">Value (Low to High)</option>
                <option value="size" className="bg-black">Largest Estates</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {loading ? (
            Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length > 0 ? (
            filtered.map((property, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  y: -10,
                  scale: 1.01
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25 
                }}
                key={property.id}
                className="group relative"
              >
                <div className="relative aspect-[4/5] mb-6 shadow-2xl rounded-2xl overflow-hidden">
                  {/* Image Container */}
                  <img 
                    src={property.image_url} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={property.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  
                  <div className="absolute top-6 left-6 flex gap-2 z-20">
                    {property.featured && (
                      <span className="bg-[#C5A059] text-white text-[8px] uppercase tracking-widest px-3 py-1 rounded-full">Featured</span>
                    )}
                    <span className="bg-white/10 backdrop-blur-md text-white text-[8px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">New Listing</span>
                  </div>

                  <button 
                    onClick={(e) => toggleFavorite(e, Number(property.id))}
                    className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md border transition-all z-40 cursor-pointer ${
                      favorites.includes(Number(property.id)) 
                        ? "bg-[#C5A059] border-[#C5A059] text-white" 
                        : "bg-black/40 border-white/10 text-white/60 hover:text-white hover:border-white/30"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(Number(property.id)) ? "fill-current" : ""}`} />
                  </button>

                  <div 
                    className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 pointer-events-none"
                  >
                    <div className="flex gap-2 w-full pointer-events-auto">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setQuickViewProperty(property);
                        }}
                        className="flex-1 py-3 bg-white text-black text-[10px] uppercase tracking-widest font-bold text-center rounded-lg cursor-pointer hover:bg-[#C5A059] hover:text-white transition-colors"
                      >
                        Quick View
                      </button>
                      <Link 
                        to={`/properties/${property.id}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="p-3 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/40 transition-all cursor-pointer"
                      >
                        <Info className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleCompare(property);
                        }}
                        className={`p-3 rounded-lg border backdrop-blur-md transition-all cursor-pointer ${compareList.find(p => p.id === property.id) ? "bg-[#C5A059] border-[#C5A059] text-white" : "bg-black/40 border-white/20 text-white hover:bg-[#C5A059] hover:border-[#C5A059]"}`}
                      >
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </div>
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

        {/* Comparison Bar */}
        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6"
            >
              <div className="bg-white text-black p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-4">
                    {compareList.map(p => (
                      <div key={p.id} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-black">
                        <img src={p.image_url} className="w-full h-full object-cover" alt={p.title} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold">{compareList.length} Properties Selected</p>
                    <p className="text-[8px] uppercase tracking-widest text-black/40">Compare technical specifications</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setCompareList([])}
                    className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={() => setShowCompareModal(true)}
                    className="px-8 py-3 bg-black text-white text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-[#C5A059] transition-all"
                  >
                    Compare Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Modal */}
        <AnimatePresence>
          {showCompareModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-6xl w-full bg-[#111] border border-white/10 p-12 rounded-3xl relative overflow-x-auto"
              >
                <div className="flex justify-end items-center mb-12">
                  <button 
                    onClick={() => {
                      setCompareList([]);
                      setShowCompareModal(false);
                    }}
                    className="text-[10px] uppercase tracking-[0.5em] text-red-500/60 hover:text-red-500 transition-colors"
                  >
                    Clear Comparison
                  </button>
                </div>
                
                <div className="text-center mb-12">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A059] mb-4">Side-by-Side Analysis</p>
                  <h2 className="text-3xl font-light tracking-tight">Property Comparison</h2>
                </div>

                <div className={`grid gap-8 ${
                  compareList.length === 1 ? "grid-cols-2" : 
                  compareList.length === 2 ? "grid-cols-3" : 
                  "grid-cols-4"
                }`}>
                  <div className="pt-48 space-y-12">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 h-8 flex items-center">Investment</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 h-8 flex items-center">Location</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 h-8 flex items-center">Bedrooms</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 h-8 flex items-center">Bathrooms</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 h-8 flex items-center">Living Area</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 h-8 flex items-center">Price per Sqft</p>
                  </div>
                  {compareList.map(p => (
                    <div key={p.id} className="space-y-12 text-center">
                      <div className="space-y-4">
                        <div className="aspect-[4/5] rounded-xl overflow-hidden border border-white/10">
                          <img src={p.image_url} className="w-full h-full object-cover" alt={p.title} />
                        </div>
                        <h3 className="text-sm font-medium h-8 flex items-center justify-center">{p.title}</h3>
                      </div>
                      <p className="text-lg font-light h-8 flex items-center justify-center">₹{(p.price / 10000000).toFixed(1)} Cr</p>
                      <p className="text-[10px] uppercase tracking-widest text-white/60 h-8 flex items-center justify-center">{p.neighborhood}</p>
                      <p className="text-sm font-light h-8 flex items-center justify-center">{p.beds}</p>
                      <p className="text-sm font-light h-8 flex items-center justify-center">{p.baths}</p>
                      <p className="text-sm font-light h-8 flex items-center justify-center">{p.sqft.toLocaleString()} Sqft</p>
                      <p className="text-sm font-light h-8 flex items-center justify-center">₹{Math.round(p.price / p.sqft).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Quick View Modal - Enhanced Property Dossier */}
        <AnimatePresence>
          {quickViewProperty && (
            <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 md:p-10 bg-black/95 backdrop-blur-md overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="max-w-6xl w-full bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden relative my-auto"
              >
                <button 
                  onClick={() => setQuickViewProperty(null)}
                  className="absolute top-8 left-8 z-50 flex items-center text-[10px] uppercase tracking-[0.5em] text-white/40 hover:text-white transition-all bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-4" /> Back to Collection
                </button>

                <button 
                  onClick={() => setQuickViewProperty(null)}
                  className="absolute top-8 right-8 z-50 p-4 bg-black/50 backdrop-blur-md rounded-full text-white/40 hover:text-white transition-all border border-white/10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col lg:flex-row h-full">
                  {/* Left: Visuals */}
                  <div className="w-full lg:w-1/2 relative h-[400px] lg:h-auto">
                    <img src={quickViewProperty.image_url} className="w-full h-full object-cover" alt={quickViewProperty.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-10 left-10">
                      <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A059] mb-4">The Collection</p>
                      <h2 className="text-4xl font-light tracking-tight text-white">{quickViewProperty.title}</h2>
                    </div>
                  </div>

                  {/* Right: Detailed Dossier */}
                  <div className="flex-1 p-8 md:p-16">
                    <div className="space-y-12">
                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Investment Value</p>
                          <p className="text-4xl font-light">₹{(quickViewProperty.price / 10000000).toFixed(1)} Cr</p>
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={(e) => toggleFavorite(e, Number(quickViewProperty.id))}
                            className={`p-4 rounded-full border transition-all ${favorites.includes(Number(quickViewProperty.id)) ? "bg-red-500/20 border-red-500 text-red-500" : "bg-white/5 border-white/10 text-white/40 hover:text-white"}`}
                          >
                            <Heart className={`w-5 h-5 ${favorites.includes(Number(quickViewProperty.id)) ? "fill-current" : ""}`} />
                          </button>
                          <button className="p-4 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-white/10">
                        <div className="space-y-2 text-center md:text-left">
                          <p className="text-[8px] uppercase tracking-widest text-white/40">Bedrooms</p>
                          <div className="flex items-center justify-center md:justify-start gap-2">
                            <Bed className="w-4 h-4 text-[#C5A059]" />
                            <p className="text-xl font-light">{quickViewProperty.beds}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                          <p className="text-[8px] uppercase tracking-widest text-white/40">Bathrooms</p>
                          <div className="flex items-center justify-center md:justify-start gap-2">
                            <Bath className="w-4 h-4 text-[#C5A059]" />
                            <p className="text-xl font-light">{quickViewProperty.baths}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                          <p className="text-[8px] uppercase tracking-widest text-white/40">Living Area</p>
                          <div className="flex items-center justify-center md:justify-start gap-2">
                            <Maximize className="w-4 h-4 text-[#C5A059]" />
                            <p className="text-xl font-light">{quickViewProperty.sqft.toLocaleString()} <span className="text-xs text-white/40">Sqft</span></p>
                          </div>
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                          <p className="text-[8px] uppercase tracking-widest text-white/40">Location</p>
                          <div className="flex items-center justify-center md:justify-start gap-2">
                            <MapPin className="w-4 h-4 text-[#C5A059]" />
                            <p className="text-xl font-light">{quickViewProperty.neighborhood}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-sm uppercase tracking-[0.3em] text-white/60">Estate Overview</h3>
                        <p className="text-white/40 font-light leading-relaxed text-sm">
                          This magnificent {quickViewProperty.beds}-bedroom estate in {quickViewProperty.neighborhood} represents the pinnacle of luxury living. 
                          Spanning over {quickViewProperty.sqft.toLocaleString()} square feet, the property features bespoke architectural details, 
                          expansive living spaces, and world-class amenities designed for the most discerning investors.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                          <h3 className="text-sm uppercase tracking-[0.3em] text-white/60">Key Amenities</h3>
                          <ul className="grid grid-cols-1 gap-4">
                            {['Private Infinity Pool', 'Smart Home Integration', 'Designer Kitchen', '24/7 Concierge Service'].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-xs text-white/40 font-light">
                                <div className="w-1 h-1 bg-[#C5A059] rounded-full"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-6">
                          <h3 className="text-sm uppercase tracking-[0.3em] text-white/60">Investment Potential</h3>
                          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Projected Appreciation</p>
                            <p className="text-2xl font-light text-[#C5A059]">12.5% <span className="text-xs text-white/40">Annually</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-10 flex flex-col sm:flex-row gap-4">
                        <Link 
                          to={`/properties/${quickViewProperty.id}`}
                          className="flex-1 py-5 bg-white text-black text-[10px] uppercase tracking-widest font-bold text-center rounded-xl hover:bg-[#C5A059] hover:text-white transition-all"
                        >
                          View Full Dossier
                        </Link>
                        <button className="flex-1 py-5 border border-white/10 text-[10px] uppercase tracking-widest text-white hover:bg-white/5 transition-all rounded-xl">
                          Request Private Tour
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Saved Search Toast */}
        <AnimatePresence>
          {showSavedToast && (
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed top-32 right-8 z-[120] bg-[#C5A059] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4"
            >
              <Check className="w-5 h-5" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold">Search Saved</p>
                <p className="text-[8px] uppercase tracking-widest opacity-80">We'll notify you of new matches</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Properties;
