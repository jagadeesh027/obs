import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "../contexts/AuthContext";
import { Property } from "../types";
import { api } from "../services/api";
import { Plus, Trash2, Mail, LayoutDashboard, Building2, X, Upload, Image as ImageIcon, Loader2, Lock, ShieldCheck } from "lucide-react";

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"properties" | "inquiries">("properties");
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [newProperty, setNewProperty] = useState({
    title: "",
    price: 0,
    location: "",
    neighborhood: "",
    beds: 0,
    baths: 0,
    sqft: 0,
    image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    description: "",
    featured: false
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [propsData, inqData] = await Promise.all([
        api.getProperties(),
        api.getInquiries()
      ]);
      setProperties(propsData);
      setInquiries(inqData);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let imageUrl = newProperty.image_url;

      if (selectedFile) {
        const storageRef = ref(storage, `properties/${Date.now()}_${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        imageUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      }

      await api.addProperty({
        ...newProperty,
        image_url: imageUrl,
      });

      setIsAdding(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
      setNewProperty({
        title: "",
        price: 0,
        location: "",
        neighborhood: "",
        beds: 0,
        baths: 0,
        sqft: 0,
        image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
        description: "",
        featured: false
      });
      fetchData();
    } catch (error) {
      console.error("Error adding property:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteProperty = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deleteProperty(deleteId);
      setDeleteId(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting property:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminGoogleLogin = async () => {
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (authLoading) {
    return (
      <div className="bg-black h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/5 p-12 border border-white/10 backdrop-blur-xl rounded-3xl"
        >
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-[#C5A059]" />
            </div>
            <h2 className="text-2xl font-light tracking-widest uppercase mb-2">Admin Portal</h2>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/60">Admin Email</label>
              <input 
                type="email" 
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-[#C5A059] transition-colors" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/60">Security Password</label>
              <input 
                type="password" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-[#C5A059] transition-colors" 
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-[10px] uppercase tracking-widest text-center leading-relaxed">{loginError}</p>}
            
            <div className="space-y-4">
              <button 
                type="submit" 
                disabled={isLoggingIn}
                className="w-full py-4 bg-[#C5A059] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#B38F4D] transition-all rounded-full flex items-center justify-center gap-2"
              >
                {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Access Dashboard
              </button>
              
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-[8px] uppercase tracking-widest text-white/20">or</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button 
                type="button"
                onClick={handleAdminGoogleLogin}
                disabled={isLoggingIn}
                className="w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all rounded-full"
              >
                Sign in with Google
              </button>
            </div>
          </form>
          
          <div className="mt-12 text-center">
            <p className="text-[8px] text-white/20 uppercase tracking-[0.3em]">
              Omni Build Solutions &copy; 2026
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white pt-32 pb-20 px-6 min-h-screen">
      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full bg-[#111] border border-white/10 p-10 rounded-3xl relative"
          >
            <button 
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="space-y-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A059] mb-4">Inquiry Details</p>
                <h2 className="text-3xl font-light tracking-tight">{selectedInquiry.name}</h2>
                <p className="text-white/40 text-sm mt-2">{selectedInquiry.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Date Received</p>
                  <p className="text-sm font-light">
                    {new Date(selectedInquiry.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Property Reference</p>
                  <p className="text-sm font-light">{selectedInquiry.propertyId}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-white/40">Message</p>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <p className="text-white/80 leading-relaxed font-light whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href={`mailto:${selectedInquiry.email}`}
                  className="inline-block w-full py-4 bg-white text-black text-[10px] uppercase tracking-widest font-bold text-center rounded-full hover:bg-[#C5A059] hover:text-white transition-all"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white/5 border border-white/10 p-12 rounded-2xl backdrop-blur-xl text-center space-y-8"
          >
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-light tracking-widest uppercase">Confirm Deletion</h2>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                Are you sure you want to remove this property from the portfolio? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteId(null)}
                className="flex-1 py-4 bg-white/10 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteProperty}
                disabled={isDeleting}
                className="flex-1 py-4 bg-red-500 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-2">Management</p>
            <h1 className="text-4xl font-light tracking-tight">Admin Dashboard</h1>
          </div>
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
            <button 
              onClick={() => setActiveTab("properties")}
              className={`px-8 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all ${activeTab === "properties" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-3 h-3" /> Properties
              </div>
            </button>
            <button 
              onClick={() => setActiveTab("inquiries")}
              className={`px-8 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all ${activeTab === "inquiries" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
            >
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" /> Inquiries
              </div>
            </button>
          </div>
        </div>

        {activeTab === "properties" ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-light">Inventory Management</h2>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="flex items-center gap-2 px-6 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-white/90 transition-all rounded-full"
              >
                <Plus className="w-3 h-3" /> Add Property
              </button>
            </div>

            {isAdding && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 p-8 rounded-2xl border border-white/10"
              >
                <form onSubmit={handleAddProperty} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/60">Title</label>
                    <input 
                      type="text" 
                      value={newProperty.title}
                      onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                      className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/60">Price (₹)</label>
                    <input 
                      type="number" 
                      value={newProperty.price}
                      onChange={(e) => setNewProperty({...newProperty, price: Number(e.target.value)})}
                      className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/60">Location</label>
                    <input 
                      type="text" 
                      value={newProperty.location}
                      onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                      className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>

                  <div className="md:col-span-3 space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-white/60 block">Property Image</label>
                    <div 
                      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-4 group/upload ${
                        isDragging ? 'border-[#C5A059] bg-[#C5A059]/10 scale-[1.02]' : 
                        previewUrl ? 'border-[#C5A059]/50 bg-[#C5A059]/5' : 
                        'border-white/10 hover:border-white/20 bg-white/5'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("File size exceeds 5MB limit.");
                            return;
                          }
                          setSelectedFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setPreviewUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    >
                      {previewUrl ? (
                        <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-2xl group/preview">
                          <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-[10px] uppercase tracking-widest font-bold">Change Image</p>
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                              setPreviewUrl(null);
                            }}
                            className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:text-red-400 transition-colors z-10"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <motion.div 
                            animate={isDragging ? { y: -10 } : { y: 0 }}
                            className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/40 group-hover/upload:text-white transition-colors"
                          >
                            <Upload className="w-8 h-8" />
                          </motion.div>
                          <div className="text-center">
                            <p className="text-sm font-light">
                              {isDragging ? "Drop to upload" : (
                                <>Drag and drop property image or <span className="text-[#C5A059] cursor-pointer hover:underline">browse</span></>
                              )}
                            </p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Supports JPG, PNG, WEBP (Max 5MB)</p>
                          </div>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          handleFileChange(e);
                          setIsDragging(false);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        required={!newProperty.image_url}
                      />
                    </div>
                    {isUploading && (
                      <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                          <div className="flex items-center gap-2 text-[#C5A059]">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Uploading to Cloud Storage...</span>
                          </div>
                          <span className="font-bold">{Math.round(uploadProgress)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            className="h-full bg-gradient-to-r from-[#C5A059] to-[#E5C079]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-3 flex justify-end gap-4">
                    <button 
                      type="button" 
                      onClick={() => setIsAdding(false)}
                      className="px-8 py-2 text-[10px] uppercase tracking-widest text-white/60 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-8 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-bold rounded-full"
                    >
                      Save Property
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <div key={property.id} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden group">
                  <div className="aspect-video overflow-hidden relative">
                    <img src={property.image_url} className="w-full h-full object-cover" alt={property.title} referrerPolicy="no-referrer" />
                    <button 
                      onClick={() => setDeleteId(property.id as string)}
                      className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-light mb-2">{property.title}</h3>
                    <p className="text-white/40 text-xs mb-4">{property.location}</p>
                    <p className="text-xl font-light">₹{(property.price / 10000000).toFixed(2)} Cr</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-light mb-8">Client Inquiries</h2>
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div 
                  key={inquiry.id} 
                  onClick={() => setSelectedInquiry(inquiry)}
                  className="bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between gap-6 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-light group-hover:text-[#C5A059] transition-colors">{inquiry.name}</h3>
                      <span className="text-[8px] uppercase tracking-widest bg-white/10 px-2 py-1 rounded">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">{inquiry.email}</p>
                    <p className="text-white/80 mt-4 leading-relaxed italic line-clamp-2">"{inquiry.message}"</p>
                  </div>
                  <div className="flex items-end">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">
                      Property ID: {inquiry.propertyId}
                    </p>
                  </div>
                </div>
              ))}
              {inquiries.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                  <Mail className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/40 uppercase tracking-widest text-[10px]">No inquiries yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
