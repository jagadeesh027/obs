import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Send, Phone, Mail, Heart } from "lucide-react";
import { Property } from "../types";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inquiryStatus, setInquiryStatus] = useState<"idle" | "sending" | "success">("idle");
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const data = await api.getProperty(id);
        if (data) {
          setProperty(data);
          if (user) {
            const favorites = await api.getFavorites(user.uid);
            setIsFavorited(favorites.includes(Number(id)));
          }
        } else {
          navigate("/properties");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate, user]);

  const toggleFavorite = async () => {
    if (!user) {
      alert("Please login to favorite properties");
      return;
    }
    if (!id) return;

    try {
      const res = await api.toggleFavorite(user.uid, Number(id));
      setIsFavorited(res.favorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus("sending");
    try {
      await api.sendInquiry({
        propertyId: id,
        ...inquiryForm,
      });
      setInquiryStatus("success");
      setInquiryForm({ name: "", email: "", message: "" });
      setTimeout(() => setInquiryStatus("idle"), 5000);
    } catch (err) {
      setInquiryStatus("idle");
      console.error("Error sending inquiry:", err);
    }
  };

  if (loading || !property) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Back Button */}
      <div className="fixed top-24 left-10 z-50">
        <button 
          onClick={() => navigate("/properties")}
          className="flex items-center text-[10px] uppercase tracking-[0.5em] text-white/40 hover:text-white transition-colors bg-black/20 backdrop-blur-md p-4 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-4" /> Back to Collection
        </button>
      </div>

      {/* Hero Section - Immersive Parallax */}
      <div className="relative h-[80vh] overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={property.image_url} 
          className="w-full h-full object-cover opacity-60"
          alt={property.title}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-20 px-6">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <p className="text-[#C5A059] text-[10px] uppercase tracking-[0.8em]">{property.neighborhood}</p>
              <h1 className="text-6xl md:text-8xl font-light tracking-tighter max-w-4xl leading-none">
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-8 pt-8">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <p className="text-xs uppercase tracking-widest text-white/60">{property.location}</p>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <p className="text-2xl font-light tracking-tight">₹{(property.price / 10000000).toFixed(1)} Cr</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-24">
            {/* Specifications Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-12 border-y border-white/10">
              <div className="space-y-2">
                <p className="text-[8px] uppercase tracking-widest text-white/40">Bedrooms</p>
                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5 text-[#C5A059]" />
                  <p className="text-2xl font-light">{property.beds}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[8px] uppercase tracking-widest text-white/40">Bathrooms</p>
                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-[#C5A059]" />
                  <p className="text-2xl font-light">{property.baths}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[8px] uppercase tracking-widest text-white/40">Living Area</p>
                <div className="flex items-center gap-3">
                  <Maximize className="w-5 h-5 text-[#C5A059]" />
                  <p className="text-2xl font-light">{property.sqft.toLocaleString()} <span className="text-xs text-white/40">Sqft</span></p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[8px] uppercase tracking-widest text-white/40">Lot Size</p>
                <div className="flex items-center gap-3">
                  <Maximize className="w-5 h-5 text-[#C5A059]" />
                  <p className="text-2xl font-light">0.5 <span className="text-xs text-white/40">Acres</span></p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-8">
              <h2 className="text-sm uppercase tracking-[0.5em] text-white/40">The Narrative</h2>
              <p className="text-2xl font-light leading-relaxed text-white/80">
                {property.description}
              </p>
              <p className="text-white/40 leading-relaxed font-light">
                Every corner of this estate has been meticulously crafted to offer an unparalleled living experience. 
                From the hand-selected Italian marble flooring to the bespoke smart-home integration, no detail has been overlooked. 
                The expansive floor-to-ceiling windows invite natural light while offering breathtaking views of the surrounding landscape.
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img src={`${property.image_url}&sig=1`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Detail 1" />
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden mt-12">
                <img src={`${property.image_url}&sig=2`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Detail 2" />
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden -mt-12">
                <img src={`${property.image_url}&sig=3`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Detail 3" />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img src={`${property.image_url}&sig=4`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Detail 4" />
              </div>
            </div>

            {/* Amenities Section */}
            <div className="space-y-12">
              <h2 className="text-sm uppercase tracking-[0.5em] text-white/40">Curated Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
                {[
                  { title: "Smart Automation", desc: "Full voice and mobile control over lighting, climate, and security." },
                  { title: "Wellness Suite", desc: "Private spa, sauna, and state-of-the-art fitness center." },
                  { title: "Entertainment Hub", desc: "4K Dolby Atmos cinema room and temperature-controlled wine cellar." },
                  { title: "Sustainable Living", desc: "Solar integration and advanced water purification systems." }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <h3 className="text-[#C5A059] text-xs uppercase tracking-widest">{item.title}</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Sticky Inquiry */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm uppercase tracking-[0.3em]">Private Inquiry</h3>
                  <button 
                    onClick={toggleFavorite}
                    className={`p-4 rounded-full border transition-all ${isFavorited ? "bg-red-500/20 border-red-500 text-red-500" : "bg-white/5 border-white/10 text-white/40 hover:text-white"}`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                  </button>
                </div>

                {inquiryStatus === "success" ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send className="w-8 h-8" />
                    </div>
                    <p className="text-sm uppercase tracking-widest font-bold">Inquiry Received</p>
                    <p className="text-xs text-white/40 leading-relaxed">Our relationship manager will contact you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleInquiry} className="space-y-6">
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        required
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs focus:outline-none focus:border-white/30 transition-colors"
                      />
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        required
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs focus:outline-none focus:border-white/30 transition-colors"
                      />
                      <textarea 
                        placeholder="Your Message" 
                        rows={4}
                        required
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs focus:outline-none focus:border-white/30 transition-colors resize-none"
                      ></textarea>
                    </div>
                    <button 
                      disabled={inquiryStatus === "sending"}
                      className="w-full py-5 bg-white text-black text-[10px] uppercase tracking-widest font-bold rounded-xl hover:bg-[#C5A059] hover:text-white transition-all disabled:opacity-50"
                    >
                      {inquiryStatus === "sending" ? "Processing..." : "Request Private Viewing"}
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
                  <button className="flex items-center justify-center gap-3 py-4 border border-white/10 rounded-xl text-[8px] uppercase tracking-widest text-white/60 hover:bg-white/5 transition-all">
                    <Phone className="w-3 h-3" /> Call Agent
                  </button>
                  <button className="flex items-center justify-center gap-3 py-4 border border-white/10 rounded-xl text-[8px] uppercase tracking-widest text-white/60 hover:bg-white/5 transition-all">
                    <Mail className="w-3 h-3" /> Email Agent
                  </button>
                </div>
              </div>

              {/* Neighborhood Insight */}
              <div className="p-10 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-[2rem] space-y-4">
                <h3 className="text-[10px] uppercase tracking-widest text-[#C5A059]">Neighborhood Insight</h3>
                <p className="text-sm font-light leading-relaxed text-white/80">
                  {property.neighborhood} is currently experiencing a 15% year-on-year appreciation, making it one of the most stable luxury markets in the region.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
