import { db } from "./firebase";
import { collection, addDoc, getDocs, query, limit } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "./lib/firestore-errors";

const properties = [
// ... (omitted for brevity in edit_file, but I'll include it in the actual call)
  { title: "The Lotus Pavilion", price: 450000000, location: "Alibaug, Maharashtra", neighborhood: "Alibaug", beds: 6, baths: 8, sqft: 12000, image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80", description: "A masterpiece of tropical modernism with private beach access and lush coconut groves.", featured: true },
  { title: "Himalayan Sanctuary", price: 180000000, location: "Rishikesh, Uttarakhand", neighborhood: "Rishikesh", beds: 5, baths: 6, sqft: 8500, image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", description: "A serene retreat overlooking the Ganges with private yoga shala and infinity pool.", featured: true },
  { title: "Skyline Penthouse", price: 350000000, location: "Worli, Mumbai", neighborhood: "South Mumbai", beds: 4, baths: 4, sqft: 5200, image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", description: "Unrivaled views of the Arabian Sea from the highest residential tower in Mumbai.", featured: false },
  { title: "Heritage Haveli", price: 280000000, location: "Udaipur, Rajasthan", neighborhood: "Udaipur", beds: 8, baths: 10, sqft: 15000, image_url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80", description: "A meticulously restored 18th-century haveli with intricate stone carvings and lake views.", featured: false },
  { title: "Coffee Estate Villa", price: 120000000, location: "Coorg, Karnataka", neighborhood: "Coorg", beds: 5, baths: 5, sqft: 6800, image_url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80", description: "Luxury living amidst a 50-acre private coffee plantation with colonial elegance.", featured: false },
  { title: "Coastal Zen Retreat", price: 220000000, location: "Goa", neighborhood: "North Goa", beds: 4, baths: 5, sqft: 7200, image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80", description: "Modern minimalist architecture meets Goan charm, featuring a private lap pool and sunset deck.", featured: false },
  { title: "Royal Jaipur Manor", price: 310000000, location: "Jaipur, Rajasthan", neighborhood: "Jaipur", beds: 7, baths: 9, sqft: 13500, image_url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80", description: "A grand estate inspired by Rajputana architecture with sprawling courtyards and marble finishes.", featured: false }
];

const neighborhoods = [
  { name: "South Mumbai", description: "The historic heart of Mumbai, home to iconic Art Deco buildings and the city's most prestigious addresses.", image_url: "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&w=800&q=80", avg_price: 250000000 },
  { name: "Alibaug", "description": "The Hamptons of Mumbai, offering coastal luxury and private beach estates just a ferry ride away.", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", avg_price: 150000000 },
  { name: "Udaipur", "description": "The City of Lakes, where royal heritage meets modern luxury in a breathtaking landscape.", image_url: "https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&w=1200&q=80", avg_price: 120000000 },
  { name: "North Goa", "description": "Vibrant coastal living with a mix of Portuguese heritage and modern luxury villas.", image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", avg_price: 80000000 }
];

export async function seedFirestore() {
  try {
    const propSnap = await getDocs(query(collection(db, "properties"), limit(1)));
    if (propSnap.empty) {
      console.log("Seeding properties...");
      for (const p of properties) {
        await addDoc(collection(db, "properties"), p);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "properties");
  }

  try {
    const neighSnap = await getDocs(query(collection(db, "neighborhoods"), limit(1)));
    if (neighSnap.empty) {
      console.log("Seeding neighborhoods...");
      for (const n of neighborhoods) {
        await addDoc(collection(db, "neighborhoods"), n);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "neighborhoods");
  }
}
