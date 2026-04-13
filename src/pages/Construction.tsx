import React, { useState } from "react";
import { motion } from "motion/react";
import { Layers, Paintbrush, ArrowRight, CheckCircle, X } from "lucide-react";

const BUILDUP_SAMPLES = {
  basic: [
    "https://picsum.photos/seed/const1/800/600",
    "https://picsum.photos/seed/const2/800/600",
    "https://picsum.photos/seed/const3/800/600",
    "https://picsum.photos/seed/const4/800/600",
    "https://picsum.photos/seed/const5/800/600",
    "https://picsum.photos/seed/const6/800/600"
  ],
  premium: [
    "https://picsum.photos/seed/const7/800/600",
    "https://picsum.photos/seed/const8/800/600",
    "https://picsum.photos/seed/const9/800/600",
    "https://picsum.photos/seed/const10/800/600",
    "https://picsum.photos/seed/const11/800/600",
    "https://picsum.photos/seed/const12/800/600"
  ],
  ultra: [
    "https://picsum.photos/seed/const13/800/600",
    "https://picsum.photos/seed/const14/800/600",
    "https://picsum.photos/seed/const15/800/600",
    "https://picsum.photos/seed/const16/800/600",
    "https://picsum.photos/seed/const17/800/600",
    "https://picsum.photos/seed/const18/800/600"
  ]
};

const INTERIOR_SAMPLES = {
  basic: [
    "https://picsum.photos/seed/int1/800/600",
    "https://picsum.photos/seed/int2/800/600",
    "https://picsum.photos/seed/int3/800/600",
    "https://picsum.photos/seed/int4/800/600",
    "https://picsum.photos/seed/int5/800/600",
    "https://picsum.photos/seed/int6/800/600"
  ],
  premium: [
    "https://picsum.photos/seed/int7/800/600",
    "https://picsum.photos/seed/int8/800/600",
    "https://picsum.photos/seed/int9/800/600",
    "https://picsum.photos/seed/int10/800/600",
    "https://picsum.photos/seed/int11/800/600",
    "https://picsum.photos/seed/int12/800/600"
  ],
  ultra: [
    "https://picsum.photos/seed/int13/800/600",
    "https://picsum.photos/seed/int14/800/600",
    "https://picsum.photos/seed/int15/800/600",
    "https://picsum.photos/seed/int16/800/600",
    "https://picsum.photos/seed/int17/800/600",
    "https://picsum.photos/seed/int18/800/600"
  ]
};

const MODEL_DESIGNS = {
  basic: [
    {
      name: "Urban Loft",
      image: "https://picsum.photos/seed/model1/800/600",
      desc: "Compact luxury for premium urban plots."
    },
    {
      name: "Modern Cottage",
      image: "https://picsum.photos/seed/model2/800/600",
      desc: "Cozy yet sophisticated architectural design."
    },
    {
      name: "Glass Pavilion",
      image: "https://picsum.photos/seed/model3/800/600",
      desc: "Minimalist structure with maximum natural light."
    }
  ],
  premium: [
    {
      name: "Modern Minimalist",
      image: "https://picsum.photos/seed/model4/800/600",
      desc: "Clean lines, open spaces, and floor-to-ceiling glass."
    },
    {
      name: "Rajputana Grandeur",
      image: "https://picsum.photos/seed/model5/800/600",
      desc: "Traditional stone carvings with modern luxury amenities."
    },
    {
      name: "Tropical Zen",
      image: "https://picsum.photos/seed/model6/800/600",
      desc: "Seamless indoor-outdoor living with natural materials."
    }
  ],
  ultra: [
    {
      name: "Grand Estate",
      image: "https://picsum.photos/seed/model7/800/600",
      desc: "Sprawling luxury with multiple wings and grand halls."
    },
    {
      name: "Palatial Manor",
      image: "https://picsum.photos/seed/model8/800/600",
      desc: "Classic architectural elegance on a massive scale."
    },
    {
      name: "Modern Fortress",
      image: "https://picsum.photos/seed/model9/800/600",
      desc: "Bold concrete and glass design for the ultimate statement."
    }
  ]
};

const Construction = () => {
  const [sqft, setSqft] = useState<number>(3000);
  const [interiorSqft, setInteriorSqft] = useState<number>(2500);
  const [pricePerSqft, setPricePerSqft] = useState<number>(3000);
  const [selectedGallery, setSelectedGallery] = useState<"buildup" | "interior" | null>(null);
  
  const buildupCost = sqft * pricePerSqft;
  const interiorCost = interiorSqft * (pricePerSqft * 0.6); // Interior is typically 60% of buildup rate for high-end
  const totalCost = buildupCost + interiorCost;

  const tier = pricePerSqft <= 3000 ? "basic" : pricePerSqft <= 4250 ? "premium" : "ultra";
  
  const buildupSamples = BUILDUP_SAMPLES[tier];
  const interiorSamples = INTERIOR_SAMPLES[tier];
  const modelDesigns = MODEL_DESIGNS[tier];

  const handleDownload = () => {
    const proposalContent = `
=========================================
      OMNI BUILD SOLUTIONS
      LUXURY ESTATE PROPOSAL
=========================================

Date: ${new Date().toLocaleDateString()}
Project Type: Custom Estate Construction

-----------------------------------------
SPECIFICATIONS
-----------------------------------------
Construction Tier: ${tier.toUpperCase()}
Price per Sqft: ₹${pricePerSqft.toLocaleString()}
Buildup Area: ${sqft.toLocaleString()} Sqft
Interior Area: ${interiorSqft.toLocaleString()} Sqft

-----------------------------------------
INVESTMENT BREAKDOWN
-----------------------------------------
Buildup Cost:   ₹${(buildupCost / 10000000).toFixed(2)} Cr
Interior Cost:  ₹${(interiorCost / 10000000).toFixed(2)} Cr

TOTAL ESTIMATED INVESTMENT:
₹${(totalCost / 10000000).toFixed(2)} Cr (₹${totalCost.toLocaleString()})

-----------------------------------------
COMMITMENTS
-----------------------------------------
- 12-Month Execution Timeline
- RERA Compliant Documentation
- 5-Year Structural Warranty
- Premium Material Selection

-----------------------------------------
This is a generated estimate. Final pricing 
is subject to site inspection and 
architectural finalization.
=========================================
    `;

    const blob = new Blob([proposalContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Omni_Build_Proposal_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-black text-white pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-4">Build Your Legacy</p>
          <h1 className="text-5xl font-light tracking-tight mb-8">Construction & Interior Estimator</h1>
          <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
            Bespoke architectural execution and interior design. Select your preferred tier and scale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Calculator Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 p-10 rounded-2xl border border-white/10 backdrop-blur-xl space-y-10">
              {/* Price Tier Selection */}
              <div className="space-y-4 relative overflow-hidden p-8 rounded-xl border border-white/40 group bg-black shadow-2xl min-h-[200px] flex flex-col justify-center">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://picsum.photos/seed/const_bg/1200/800"
                    alt="Construction Background"
                    className="w-full h-full object-cover opacity-40"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] uppercase tracking-widest text-white font-bold block drop-shadow-md">Construction Tier Scale (₹/Sqft)</label>
                    <span className="text-2xl font-light text-white drop-shadow-md">₹{pricePerSqft.toLocaleString()}</span>
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="range" 
                      min="2000" 
                      max="5000" 
                      step="250" 
                      value={pricePerSqft}
                      onChange={(e) => setPricePerSqft(Number(e.target.value))}
                      className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <div className="flex justify-between text-[8px] uppercase tracking-widest text-white/60 font-bold">
                      <span>Basic (₹2,000)</span>
                      <span>Ultra Luxury (₹5,000)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Buildup Area */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <Layers className="w-4 h-4" />
                    <label className="text-[10px] uppercase tracking-widest block">Buildup Area (Sqft)</label>
                  </div>
                  <input 
                    type="number" 
                    value={sqft}
                    onChange={(e) => setSqft(Number(e.target.value))}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-3xl font-light outline-none focus:border-white transition-colors"
                  />
                  <p className="text-[10px] text-white/40">Base structure and external finishes</p>
                </div>

                {/* Interior Area */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <Paintbrush className="w-4 h-4" />
                    <label className="text-[10px] uppercase tracking-widest block">Interior Area (Sqft)</label>
                  </div>
                  <input 
                    type="number" 
                    value={interiorSqft}
                    onChange={(e) => setInteriorSqft(Number(e.target.value))}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-3xl font-light outline-none focus:border-white transition-colors"
                  />
                  <p className="text-[10px] text-white/40">Premium finishes, cabinetry & lighting</p>
                </div>
              </div>
            </div>

            {/* Model Designs Section */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-widest text-white/60">Sample Model Designs</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {modelDesigns.map((design, i) => (
                  <div 
                    key={i}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-xl mb-4 border border-white/10">
                      <img 
                        key={design.image}
                        src={design.image} 
                        alt={design.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h4 className="text-sm font-medium mb-1">{design.name}</h4>
                    <p className="text-[10px] text-white/40 leading-relaxed">{design.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-6">
            <div className="bg-white/5 p-10 rounded-2xl border border-white/10 sticky top-32 space-y-8">
              <h3 className="text-xs uppercase tracking-widest text-center">Cost Breakdown</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Buildup</p>
                    <p className="text-xs text-white/60">{sqft} Sqft @ ₹{pricePerSqft}</p>
                  </div>
                  <p className="text-lg font-light">₹{(buildupCost / 10000000).toFixed(2)} Cr</p>
                </div>

                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Interior</p>
                    <p className="text-xs text-white/60">{interiorSqft} Sqft @ ₹{(pricePerSqft * 0.6).toFixed(0)}</p>
                  </div>
                  <p className="text-lg font-light">₹{(interiorCost / 10000000).toFixed(2)} Cr</p>
                </div>

                {/* Visual References */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-white/40 text-center">Buildup Model</p>
                    <div 
                      className="aspect-square rounded-lg overflow-hidden border border-white/10 cursor-pointer group/img"
                      onClick={() => setSelectedGallery("buildup")}
                    >
                      <img 
                        key={buildupSamples[0]}
                        src={buildupSamples[0]} 
                        alt="Buildup Model" 
                        className="w-full h-full object-cover opacity-100 group-hover/img:scale-110 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-white/40 text-center">Interior Model</p>
                    <div 
                      className="aspect-square rounded-lg overflow-hidden border border-white/10 cursor-pointer group/img"
                      onClick={() => setSelectedGallery("interior")}
                    >
                      <img 
                        key={interiorSamples[0]}
                        src={interiorSamples[0]} 
                        alt="Interior Model" 
                        className="w-full h-full object-cover opacity-100 group-hover/img:scale-110 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Total Estimated Investment</p>
                  <h2 className="text-5xl font-light tracking-tight mb-2">
                    ₹{(totalCost / 10000000).toFixed(2)} <span className="text-2xl">Cr</span>
                  </h2>
                  <p className="text-[10px] text-white/40 italic">
                    (₹{totalCost.toLocaleString()})
                  </p>
                </div>
              </div>

              <button 
                onClick={handleDownload}
                className="w-full py-5 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
              >
                Download Detailed Proposal <ArrowRight className="w-3 h-3" />
              </button>

              <div className="space-y-3 pt-4">
                {["12-Month Timeline", "RERA Compliant", "5-Year Structural Warranty"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest">
                    <CheckCircle className="w-3 h-3 text-white/60" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {selectedGallery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <div className="relative w-full max-w-5xl max-h-[80vh] overflow-y-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
            <button 
              onClick={() => setSelectedGallery(null)}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-12 text-center">
              <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-2">Visual Portfolio</p>
              <h2 className="text-3xl font-light tracking-tight capitalize">
                {selectedGallery} Model Samples
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedGallery === "buildup" ? buildupSamples : interiorSamples).map((src, i) => (
                <div 
                  key={src}
                  className="aspect-[4/3] rounded-xl overflow-hidden border border-white/10 group"
                >
                  <img 
                    src={src} 
                    alt={`${selectedGallery} sample ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Construction;
