import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Layers, Paintbrush, ArrowRight, CheckCircle, X, Cpu, Leaf, Mountain, Clock, Download, Eye, Zap, Droplets, Sun, ShieldCheck } from "lucide-react";

const MATERIALS = [
  { id: "standard", name: "Standard Luxury", desc: "Premium Italian Marble & Teak", cost: 0, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
  { id: "calacatta", name: "Calacatta Gold", desc: "Rare Italian Marble with Gold Veining", cost: 1500, image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" },
  { id: "statuary", name: "Statuary Carrara", desc: "Pure White Architectural Grade Marble", cost: 1200, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80" },
  { id: "marquina", name: "Black Marquina", desc: "Deep Spanish Black with White Veins", cost: 1000, image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80" }
];

const SMART_HOME_TIERS = [
  { id: "essential", name: "Essential", desc: "Smart Lighting & Security", cost: 500000, icon: ShieldCheck },
  { id: "integrated", name: "Integrated", desc: "Multi-room Audio & Climate", cost: 1500000, icon: Zap },
  { id: "invisible", name: "Invisible Tech", desc: "Full AI Automation & Hidden Audio", cost: 3500000, icon: Cpu }
];

const SUSTAINABILITY = [
  { id: "solar", name: "Solar Glass", desc: "Energy Generating Windows", cost: 800000, icon: Sun },
  { id: "geothermal", name: "Geothermal", desc: "Underground Climate Control", cost: 1200000, icon: Zap },
  { id: "rainwater", name: "Rainwater", desc: "Advanced Harvesting System", cost: 400000, icon: Droplets },
  { id: "leed", name: "LEED Gold", desc: "Full Green Certification", cost: 600000, icon: Leaf }
];

const TERRAIN = [
  { id: "level", name: "Level Ground", multiplier: 1, desc: "Standard foundation" },
  { id: "sloped", name: "Hillside", multiplier: 1.15, desc: "Advanced structural piling" },
  { id: "coastal", name: "Coastal", multiplier: 1.1, desc: "Anti-corrosive treatments" }
];

const STYLES = [
  { 
    id: "modern", 
    name: "Modern Minimalist", 
    dayImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    nightImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
  },
  { 
    id: "classical", 
    name: "Classical Heritage", 
    dayImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    nightImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
  }
];

const TIER_COMPARISON = [
  { feature: "Primary Flooring", basic: "Vitrified Tiles", premium: "Italian Marble", ultra: "Rare Calacatta Gold" },
  { feature: "Bath Fittings", basic: "Kohler / Jaquar", premium: "Gessi / Toto", ultra: "Laufen / Dornbracht" },
  { feature: "Home Automation", basic: "Basic Lighting", premium: "Full Integrated", ultra: "AI-Driven Invisible Tech" },
  { feature: "Windows", basic: "UPVC Double Glazed", premium: "Slimline Aluminum", ultra: "Solar-Active Smart Glass" },
  { feature: "Structure", basic: "Standard RCC", premium: "High-Grade Concrete", ultra: "Steel-Composite Hybrid" }
];

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [selectedSmartHome, setSelectedSmartHome] = useState(SMART_HOME_TIERS[0]);
  const [selectedSustainability, setSelectedSustainability] = useState<string[]>([]);
  const [selectedTerrain, setSelectedTerrain] = useState(TERRAIN[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedGallery, setSelectedGallery] = useState<"buildup" | "interior" | null>(null);
  const [showVRModal, setShowVRModal] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [unit, setUnit] = useState<"SQFT" | "SQM">("SQFT");

  const exchangeRate = 83; // 1 USD = 83 INR
  const sqmToSqft = 10.764;

  const displaySqft = unit === "SQFT" ? sqft : Math.round(sqft / sqmToSqft);
  const displayInteriorSqft = unit === "SQFT" ? interiorSqft : Math.round(interiorSqft / sqmToSqft);

  const formatPrice = (val: number) => {
    const converted = currency === "INR" ? val : val / exchangeRate;
    const symbol = currency === "INR" ? "₹" : "$";
    
    if (converted >= 10000000 && currency === "INR") {
      return `${symbol}${(converted / 10000000).toFixed(2)} Cr`;
    }
    if (converted >= 100000 && currency === "USD") {
      return `${symbol}${(converted / 1000000).toFixed(2)}M`;
    }
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  };

  const sustainabilityCost = selectedSustainability.reduce((acc, id) => {
    const item = SUSTAINABILITY.find(s => s.id === id);
    return acc + (item?.cost || 0);
  }, 0);

  const effectivePricePerSqft = (pricePerSqft + selectedMaterial.cost) * selectedTerrain.multiplier;
  const buildupCost = sqft * effectivePricePerSqft;
  const interiorCost = interiorSqft * (effectivePricePerSqft * 0.6);
  const totalCost = buildupCost + interiorCost + selectedSmartHome.cost + sustainabilityCost;

  const chartData = [
    { name: 'Structure', value: buildupCost, color: '#C5A059' },
    { name: 'Interior', value: interiorCost, color: '#E5C079' },
    { name: 'Technology', value: selectedSmartHome.cost, color: '#888' },
    { name: 'Green Tech', value: sustainabilityCost, color: '#444' }
  ].filter(d => d.value > 0);

  const timelineMonths = 12 + (selectedMaterial.id !== "standard" ? 3 : 0) + (selectedTerrain.id !== "level" ? 4 : 0);

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
Architectural Style: ${selectedStyle.name}
Construction Tier: ${tier.toUpperCase()}
Base Price per Sqft: ₹${pricePerSqft.toLocaleString()}
Effective Price per Sqft: ₹${effectivePricePerSqft.toFixed(0)}
Buildup Area: ${sqft.toLocaleString()} Sqft
Interior Area: ${interiorSqft.toLocaleString()} Sqft
Terrain Type: ${selectedTerrain.name}
Primary Material: ${selectedMaterial.name}
Smart Home Tier: ${selectedSmartHome.name}
Sustainability Features: ${selectedSustainability.length > 0 ? selectedSustainability.join(", ") : "None"}

-----------------------------------------
TIMELINE ESTIMATE
-----------------------------------------
Estimated Completion: ${timelineMonths} Months
Phases: Design, Permitting, Structure, Interior, Handover

-----------------------------------------
INVESTMENT BREAKDOWN
-----------------------------------------
Buildup Cost:   ₹${(buildupCost / 10000000).toFixed(2)} Cr
Interior Cost:  ₹${(interiorCost / 10000000).toFixed(2)} Cr
Technology:     ₹${(selectedSmartHome.cost / 10000000).toFixed(2)} Cr
Sustainability: ₹${(sustainabilityCost / 10000000).toFixed(2)} Cr

TOTAL ESTIMATED INVESTMENT:
₹${(totalCost / 10000000).toFixed(2)} Cr (₹${totalCost.toLocaleString()})

-----------------------------------------
COMMITMENTS
-----------------------------------------
- ${timelineMonths}-Month Execution Timeline
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

  const toggleSustainability = (id: string) => {
    setSelectedSustainability(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
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
            <div className="bg-white/5 p-10 rounded-2xl border border-white/10 backdrop-blur-xl space-y-12">
              {/* Architectural Style Comparison */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-white/60">Architectural Style</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                      {STYLES.map(style => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style)}
                          className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all ${selectedStyle.id === style.id ? "bg-white text-black" : "text-white/40 hover:text-white"}`}
                        >
                          {style.name}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setIsNight(!isNight)}
                      className={`p-3 rounded-full border transition-all ${isNight ? "bg-[#C5A059] border-[#C5A059] text-white" : "bg-white/5 border-white/10 text-white/40 hover:text-white"}`}
                    >
                      {isNight ? <Zap className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="aspect-[21/9] rounded-2xl overflow-hidden relative group">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${selectedStyle.id}-${isNight}`}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.8 }}
                      src={isNight ? selectedStyle.nightImage : selectedStyle.dayImage}
                      className="w-full h-full object-cover"
                      alt={selectedStyle.name}
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-8">
                    <p className="text-sm font-light tracking-widest uppercase">{selectedStyle.name} {isNight ? "Night" : "Day"} Concept</p>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60">
                      <Clock className="w-3 h-3" /> {isNight ? "Evening Ambiance" : "Natural Daylight"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Tier Selection */}
              <div className="space-y-4 relative overflow-hidden p-8 rounded-xl border border-white/40 group bg-black shadow-2xl min-h-[200px] flex flex-col justify-center">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&w=1200&q=80"
                    alt="Construction Background"
                    className="w-full h-full object-cover opacity-40"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white font-bold block drop-shadow-md">Construction Tier Scale</label>
                      <button 
                        onClick={() => setShowComparison(true)}
                        className="text-[8px] uppercase tracking-widest text-[#C5A059] hover:underline"
                      >
                        Compare Tiers Details
                      </button>
                    </div>
                    <span className="text-2xl font-light text-white drop-shadow-md">{formatPrice(pricePerSqft)}/{unit}</span>
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
                      <span>Basic ({formatPrice(2000)})</span>
                      <span>Ultra Luxury ({formatPrice(5000)})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Buildup Area */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/60">
                      <Layers className="w-4 h-4" />
                      <label className="text-[10px] uppercase tracking-widest block">Buildup Area ({unit})</label>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                      <button onClick={() => setUnit("SQFT")} className={`px-2 py-1 text-[8px] rounded ${unit === "SQFT" ? "bg-white text-black" : "text-white/40"}`}>SQFT</button>
                      <button onClick={() => setUnit("SQM")} className={`px-2 py-1 text-[8px] rounded ${unit === "SQM" ? "bg-white text-black" : "text-white/40"}`}>SQM</button>
                    </div>
                  </div>
                  <input 
                    type="number" 
                    value={displaySqft}
                    onChange={(e) => setSqft(unit === "SQFT" ? Number(e.target.value) : Math.round(Number(e.target.value) * sqmToSqft))}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-3xl font-light outline-none focus:border-white transition-colors"
                  />
                  <p className="text-[10px] text-white/40">Base structure and external finishes</p>
                </div>

                {/* Interior Area */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/60">
                      <Paintbrush className="w-4 h-4" />
                      <label className="text-[10px] uppercase tracking-widest block">Interior Area ({unit})</label>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                      <button onClick={() => setCurrency("INR")} className={`px-2 py-1 text-[8px] rounded ${currency === "INR" ? "bg-white text-black" : "text-white/40"}`}>INR</button>
                      <button onClick={() => setCurrency("USD")} className={`px-2 py-1 text-[8px] rounded ${currency === "USD" ? "bg-white text-black" : "text-white/40"}`}>USD</button>
                    </div>
                  </div>
                  <input 
                    type="number" 
                    value={displayInteriorSqft}
                    onChange={(e) => setInteriorSqft(unit === "SQFT" ? Number(e.target.value) : Math.round(Number(e.target.value) * sqmToSqft))}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-3xl font-light outline-none focus:border-white transition-colors"
                  />
                  <p className="text-[10px] text-white/40">Premium finishes, cabinetry & lighting</p>
                </div>
              </div>

              {/* Terrain Complexity */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase tracking-[0.3em] text-white/60">Terrain & Site Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {TERRAIN.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTerrain(t)}
                      className={`p-6 rounded-2xl border text-left transition-all ${selectedTerrain.id === t.id ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:border-white/20"}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <Mountain className={`w-5 h-5 ${selectedTerrain.id === t.id ? "text-black" : "text-white/40"}`} />
                        {t.multiplier > 1 && <span className="text-[8px] font-bold uppercase tracking-widest bg-black/10 px-2 py-1 rounded">+{Math.round((t.multiplier - 1) * 100)}% Cost</span>}
                      </div>
                      <p className="text-xs font-medium mb-1">{t.name}</p>
                      <p className={`text-[10px] ${selectedTerrain.id === t.id ? "text-black/60" : "text-white/40"}`}>{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Visualizer */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase tracking-[0.3em] text-white/60">Premium Material Selection</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {MATERIALS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMaterial(m)}
                      className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${selectedMaterial.id === m.id ? "border-white" : "border-transparent"}`}
                    >
                      <img src={m.image} className="w-full h-full object-cover" alt={m.name} />
                      <div className={`absolute inset-0 flex flex-col justify-end p-4 transition-all ${selectedMaterial.id === m.id ? "bg-black/40" : "bg-black/60 group-hover:bg-black/40"}`}>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1">{m.name}</p>
                        <p className="text-[8px] text-white/60 uppercase tracking-widest">+{m.cost}/Sqft</p>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-white/40 text-center italic">Selection affects both cost and execution timeline (+3 months for custom stone)</p>
              </div>

              {/* Smart Home & Sustainability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-white/60">Smart Home Ecosystem</h3>
                  <div className="space-y-3">
                    {SMART_HOME_TIERS.map(tier => (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedSmartHome(tier)}
                        className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${selectedSmartHome.id === tier.id ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:border-white/20"}`}
                      >
                        <tier.icon className={`w-5 h-5 ${selectedSmartHome.id === tier.id ? "text-black" : "text-[#C5A059]"}`} />
                        <div className="text-left">
                          <p className="text-xs font-medium">{tier.name}</p>
                          <p className={`text-[10px] ${selectedSmartHome.id === tier.id ? "text-black/60" : "text-white/40"}`}>{tier.desc}</p>
                        </div>
                        <p className="ml-auto text-[10px] font-bold">₹{(tier.cost / 100000).toFixed(0)}L</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-white/60">Sustainability & Green Tech</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {SUSTAINABILITY.map(s => (
                      <button
                        key={s.id}
                        onClick={() => toggleSustainability(s.id)}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${selectedSustainability.includes(s.id) ? "bg-[#C5A059] text-white border-[#C5A059]" : "bg-white/5 border-white/10 hover:border-white/20"}`}
                      >
                        <s.icon className={`w-5 h-5 ${selectedSustainability.includes(s.id) ? "text-white" : "text-white/40"}`} />
                        <p className="text-[10px] font-medium uppercase tracking-widest">{s.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Model Designs Section */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-widest text-white/60">Sample Model Designs</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {modelDesigns.map((design, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ rotateY: i % 2 === 0 ? 5 : -5, rotateX: 2, z: 20 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group cursor-pointer preserve-3d"
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-xl mb-4 border border-white/10 shadow-xl">
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
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-6">
            <div className="bg-white/5 p-10 rounded-2xl border border-white/10 sticky top-32 space-y-8">
              <h3 className="text-xs uppercase tracking-widest text-center">Investment Summary</h3>
              
              <div className="space-y-6">
                {/* Investment Distribution Chart */}
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {chartData.map(d => (
                      <div key={d.name} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-[8px] uppercase tracking-widest text-white/60">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Timeline */}
                <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60">
                    <Clock className="w-3 h-3" /> Execution Timeline
                  </div>
                  <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-[#C5A059]"
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-light">{timelineMonths} <span className="text-xs uppercase tracking-widest text-white/40">Months</span></p>
                    <p className="text-[8px] uppercase tracking-widest text-[#C5A059]">RERA Compliant</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40">Buildup</p>
                      <p className="text-xs text-white/60">{displaySqft} {unit} @ {formatPrice(effectivePricePerSqft)}</p>
                    </div>
                    <p className="text-lg font-light">{formatPrice(buildupCost)}</p>
                  </div>

                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40">Interior</p>
                      <p className="text-xs text-white/60">{displayInteriorSqft} {unit} @ {formatPrice(effectivePricePerSqft * 0.6)}</p>
                    </div>
                    <p className="text-lg font-light">{formatPrice(interiorCost)}</p>
                  </div>

                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40">Tech & Green</p>
                      <p className="text-xs text-white/60">Smart Home + Sustainability</p>
                    </div>
                    <p className="text-lg font-light">{formatPrice(selectedSmartHome.cost + sustainabilityCost)}</p>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Total Estimated Investment</p>
                  <h2 className="text-5xl font-light tracking-tight mb-2">
                    {formatPrice(totalCost)}
                  </h2>
                  {currency === "INR" && (
                    <p className="text-[10px] text-white/40 italic">
                      (₹{totalCost.toLocaleString()})
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleDownload}
                  className="w-full py-5 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2 rounded-full"
                >
                  <Download className="w-3 h-3" /> Download Design Brief
                </button>
                <button 
                  onClick={() => setShowVRModal(true)}
                  className="w-full py-5 bg-white/5 border border-white/10 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 rounded-full"
                >
                  <Eye className="w-3 h-3" /> Request VR Walkthrough
                </button>
              </div>

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

      {/* VR Request Modal */}
      {showVRModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-[#111] border border-white/10 p-12 rounded-3xl text-center space-y-8"
          >
            <div className="w-20 h-20 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto">
              <Eye className="w-10 h-10 text-[#C5A059]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-light tracking-widest uppercase">Request VR Walkthrough</h2>
              <p className="text-white/40 text-[10px] uppercase tracking-widest leading-relaxed">
                Experience your custom configuration in immersive 3D. Our concierge will contact you to schedule a private session.
              </p>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Preferred Contact Number"
                className="w-full bg-white/5 border border-white/10 p-4 text-xs outline-none focus:border-[#C5A059] transition-colors rounded-xl"
              />
              <button 
                onClick={() => setShowVRModal(false)}
                className="w-full py-4 bg-white text-black text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-[#C5A059] hover:text-white transition-all"
              >
                Confirm Request
              </button>
              <button 
                onClick={() => setShowVRModal(false)}
                className="w-full py-4 text-[10px] uppercase tracking-widest text-white/40 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Comparison Table Modal */}
      {showComparison && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl w-full bg-[#111] border border-white/10 p-12 rounded-3xl relative overflow-y-auto max-h-[90vh]"
          >
            <button 
              onClick={() => setShowComparison(false)}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A059] mb-4">Detailed Comparison</p>
              <h2 className="text-3xl font-light tracking-tight">Construction Tiers</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-6 text-[10px] uppercase tracking-widest text-white/40">Feature</th>
                    <th className="py-6 text-[10px] uppercase tracking-widest text-white/60">Basic</th>
                    <th className="py-6 text-[10px] uppercase tracking-widest text-[#C5A059]">Premium</th>
                    <th className="py-6 text-[10px] uppercase tracking-widest text-white">Ultra Luxury</th>
                  </tr>
                </thead>
                <tbody>
                  {TIER_COMPARISON.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-6 text-xs font-medium text-white/80">{row.feature}</td>
                      <td className="py-6 text-[10px] uppercase tracking-widest text-white/40">{row.basic}</td>
                      <td className="py-6 text-[10px] uppercase tracking-widest text-white/60">{row.premium}</td>
                      <td className="py-6 text-[10px] uppercase tracking-widest text-white font-bold">{row.ultra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-12 p-8 bg-white/5 rounded-2xl border border-white/5 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 leading-relaxed">
                All tiers include structural engineering, RERA compliance, and a 5-year warranty. 
                Brands mentioned are representative of the quality standard provided.
              </p>
            </div>
          </motion.div>
        </div>
      )}

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
