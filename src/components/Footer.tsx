import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, ArrowRight } from "lucide-react";

const Footer = () => (
  <footer className="bg-white border-t border-[#C5A059]/10 py-20 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="space-y-6">
        <h3 className="text-xl font-light tracking-widest text-[#C5A059] uppercase">Omni Build Solutions</h3>
        <p className="text-[#C5A059]/60 text-sm leading-relaxed">
          Defining luxury real estate through architectural excellence and unparalleled service.
        </p>
        <div className="flex space-x-4">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#C5A059]/40 hover:text-[#C5A059] transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#C5A059]/40 hover:text-[#C5A059] transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#C5A059]/40 hover:text-[#C5A059] transition-colors">
            <Facebook className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div>
        <h4 className="text-xs uppercase tracking-widest text-[#C5A059] mb-6">Quick Links</h4>
        <ul className="space-y-4 text-sm text-[#C5A059]/60">
          <li><Link to="/properties" className="hover:text-[#C5A059]">Properties</Link></li>
          <li><Link to="/neighborhoods" className="hover:text-[#C5A059]">Neighborhoods</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs uppercase tracking-widest text-[#C5A059] mb-6">Support</h4>
        <ul className="space-y-4 text-sm text-[#C5A059]/60">
          <li><Link to="/about" className="hover:text-[#C5A059]">About Us</Link></li>
          <li><a href="#" className="hover:text-[#C5A059]">Contact</a></li>
          <li><a href="#" className="hover:text-[#C5A059]">Privacy Policy</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs uppercase tracking-widest text-[#C5A059] mb-6">Newsletter</h4>
        <p className="text-sm text-[#C5A059]/60 mb-4">Subscribe to receive exclusive listings and market updates.</p>
        <div className="flex border-b border-[#C5A059]/30 pb-2">
          <input type="email" placeholder="Email Address" className="bg-transparent text-sm w-full outline-none text-[#C5A059] placeholder:text-[#C5A059]/30" />
          <ArrowRight className="w-4 h-4 text-[#C5A059]/60" />
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[#C5A059]/5 text-center">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059]/20">© 2026 Omni Build Solutions. All Rights Reserved.</p>
    </div>
  </footer>
);

export default Footer;
