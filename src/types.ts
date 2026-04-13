export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  neighborhood: string;
  beds: number;
  baths: number;
  sqft: number;
  image_url: string;
  description: string;
  featured: boolean;
}

export interface Neighborhood {
  id: number;
  name: string;
  description: string;
  image_url: string;
  avg_price: number;
}

export interface MarketData {
  month: string;
  price: number;
  inventory: number;
}

export interface User {
  uid: string;
  email: string;
  role: "admin" | "client";
  name?: string;
}
