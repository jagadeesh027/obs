export const api = {
  getProperties: async () => {
    const res = await fetch("/api/properties");
    return res.json();
  },
  getProperty: async (id: string) => {
    const res = await fetch(`/api/properties/${id}`);
    return res.json();
  },
  addProperty: async (property: any) => {
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(property),
    });
    return res.json();
  },
  deleteProperty: async (id: string) => {
    const res = await fetch(`/api/properties/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
  getNeighborhoods: async () => {
    const res = await fetch("/api/neighborhoods");
    return res.json();
  },
  sendInquiry: async (inquiry: any) => {
    const res = await fetch("/api/inquire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry),
    });
    return res.json();
  },
  getInquiries: async () => {
    const res = await fetch("/api/inquiries");
    return res.json();
  },
  getMarketInsights: async () => {
    const res = await fetch("/api/market-insights");
    return res.json();
  },
  getFavorites: async (userId: string) => {
    const res = await fetch(`/api/favorites/${userId}`);
    return res.json();
  },
  toggleFavorite: async (userId: string, propertyId: number) => {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, propertyId }),
    });
    return res.json();
  },
};
