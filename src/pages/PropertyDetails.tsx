import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Send, Phone, Mail } from "lucide-react";
import { Property } from "../types";
import { api } from "../services/api";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
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
  }, [id, navigate]);

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
    <div className="bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-xs uppercase tracking-widest text-white/40 hover:text-white mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img 
                src={property.image_url} 
                className="w-full h-full object-cover" 
                alt={property.title}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                  <img 
                    src={`${property.image_url}&sig=${i}`} 
                    className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity cursor-pointer" 
                    alt="Gallery"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-4">{property.neighborhood}</p>
              <h1 className="text-5xl font-light tracking-tight mb-4">{property.title}</h1>
              <p className="text-white/40 text-sm uppercase tracking-widest flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> {property.location}
              </p>
            </div>

            <div className="flex items-baseline space-x-4 border-y border-white/10 py-8">
              <p className="text-4xl font-light">₹{(property.price / 10000000).toFixed(1)} Cr</p>
              <p className="text-white/40 text-sm uppercase tracking-widest">Estimated Price</p>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-white/40">Bedrooms</p>
                <p className="text-xl font-light flex items-center"><Bed className="w-5 h-5 mr-2 text-white/60" /> {property.beds}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-white/40">Bathrooms</p>
                <p className="text-xl font-light flex items-center"><Bath className="w-5 h-5 mr-2 text-white/60" /> {property.baths}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-white/40">Living Area</p>
                <p className="text-xl font-light flex items-center"><Maximize className="w-5 h-5 mr-2 text-white/60" /> {property.sqft.toLocaleString()} Sqft</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-white">Description</h3>
              <p className="text-white/60 leading-relaxed font-light text-lg">
                {property.description}
              </p>
            </div>

            <div className="bg-white/5 p-8 rounded-xl border border-white/10 space-y-6">
              <h3 className="text-xs uppercase tracking-widest text-center">Inquire About This Estate</h3>
              
              {inquiryStatus === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                    <Send className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-white/80">Inquiry sent successfully. Our agent will contact you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      required
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})}
                      className="bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-white/30 transition-colors"
                    />
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      required
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                      className="bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                  <textarea 
                    placeholder="Your Message" 
                    rows={4}
                    required
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-white/30 transition-colors resize-none"
                  ></textarea>
                  <button 
                    disabled={inquiryStatus === "sending"}
                    className="w-full py-4 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-white/90 transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {inquiryStatus === "sending" ? "Sending..." : "Send Inquiry"}
                  </button>
                </form>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <button className="flex items-center justify-center py-4 border border-white/30 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  <Phone className="w-4 h-4 mr-2" /> Call Agent
                </button>
                <button className="flex items-center justify-center py-4 border border-white/30 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  <Mail className="w-4 h-4 mr-2" /> Email Agent
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
