import React from "react";

const About = () => (
  <div className="bg-black text-white pt-32 pb-20 px-6 min-h-screen">
    <div className="max-w-4xl mx-auto text-center">
      <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-8">Our Heritage</p>
      <h1 className="text-6xl font-light tracking-tight mb-16 leading-tight">
        Crafting Legacies in <br /> <span className="italic font-serif">Luxury Real Estate</span>
      </h1>
      <div className="space-y-12 text-xl font-light text-white/60 leading-relaxed text-left">
        <p>
          Founded in 1998, Omni Build Solutions has consistently set the benchmark for luxury real estate services. We believe that a home is more than just a place to live—it's a masterpiece of personal expression and a legacy for generations to come.
        </p>
        <p>
          Our team of elite advisors brings together decades of expertise in architecture, finance, and high-end hospitality to provide a service that is as exceptional as the properties we represent.
        </p>
        <div className="grid grid-cols-2 gap-12 pt-12">
          <div>
            <h3 className="text-4xl font-light text-white mb-2">₹95K Cr+</h3>
            <p className="text-xs uppercase tracking-widest">Total Sales Volume</p>
          </div>
          <div>
            <h3 className="text-4xl font-light text-white mb-2">25+</h3>
            <p className="text-xs uppercase tracking-widest">Global Markets</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About;
