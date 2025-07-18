// lib/data.ts
export interface CarCategory {
  title: string;
    description: string;
    image: string;
    priceFrom: string;
    features: string[];
    popular?: boolean;
}

export const carCategories = [
  {
    title: "Safari 4x4 Vehicles",
    description: "Rugged off-road vehicles perfect for Kenyan terrain",
    image: "/suv-prado.jpg",
    priceFrom: "12,000",
    features: [
      "4WD capability",
      "High ground clearance",
      "Spacious for gear",
      "Experienced safari drivers"
    ],
    popular: true
  },
  {
    title: "Economy Cars",
    description: "Fuel-efficient options for city driving",
    image: "/sedan-corolla.jpg",
    priceFrom: "4,500",
    features: [
      "Great fuel economy",
      "Compact size",
      "AC & modern features",
      "Ideal for 1-3 passengers"
    ]
  },
  {
    title: "Luxury Sedans",
    description: "Premium comfort for business or leisure",
    image: "/sedan-corolla.jpg",
    priceFrom: "15,000",
    features: [
      "Leather interiors",
      "Premium sound system",
      "Executive class",
      "Chauffeur available"
    ]
  },
  {
    title: "Family SUVs",
    description: "Spacious vehicles for family trips",
    image: "/suv-prado.jpg",
    priceFrom: "8,000",
    features: [
      "7-8 passenger capacity",
      "Child seat options",
      "Ample luggage space",
      "Comfortable for long drives"
    ]
  },
  {
    title: "VIP Luxury",
    description: "Top-tier vehicles for special occasions",
    image: "/luxury-mercedes.jpg",
    priceFrom: "25,000",
    features: [
      "Latest model luxury cars",
      "Privacy features",
      "Professional chauffeur",
      "Airport transfers"
    ]
  },
 
];

export interface Car {
  id: number;
  name: string;
  category: string;
  image: string;
  pricePerDay: number;
  rating: number;
  reviews: number;
  seats: number;
  transmission: string;
  fuel: string;
  features: string[];
  popular: boolean;
  available: boolean;
  location: string;
}

export const allCars: Car[] = [
  // Economy Cars
  {
    id: 1,
    name: "Toyota Corolla",
    category: "economy-cars",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    pricePerDay: 2500,
    rating: 4.8,
    reviews: 124,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Air Conditioning", "Insurance", "GPS Navigation", "Bluetooth"],
    popular: true,
    available: true,
    location: "Westlands"
  },
  {
    id: 2,
    name: "Nissan Sentra",
    category: "economy-cars",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    pricePerDay: 2200,
    rating: 4.6,
    reviews: 98,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    features: ["Air Conditioning", "Insurance", "Radio", "Power Steering"],
    popular: false,
    available: true,
    location: "CBD"
  },
  {
    id: 3,
    name: "Honda Civic",
    category: "economy-cars",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    pricePerDay: 2800,
    rating: 4.7,
    reviews: 156,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Air Conditioning", "Insurance", "GPS Navigation", "Bluetooth", "USB Charging"],
    popular: true,
    available: true,
    location: "Kilimani"
  },
  {
    id: 4,
    name: "Hyundai Accent",
    category: "economy-cars",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=600&fit=crop",
    pricePerDay: 2300,
    rating: 4.5,
    reviews: 87,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Air Conditioning", "Insurance", "Radio", "Power Windows"],
    popular: false,
    available: true,
    location: "Kasarani"
  },
  
  // Family SUVs
  {
    id: 5,
    name: "Toyota Prado",
    category: "family-suvs",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop",
    pricePerDay: 4500,
    rating: 4.9,
    reviews: 89,
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    features: ["4WD", "Air Conditioning", "Insurance", "Professional Driver Available", "Spacious"],
    popular: true,
    available: true,
    location: "Karen"
  },
  {
    id: 6,
    name: "Nissan X-Trail",
    category: "family-suvs",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    pricePerDay: 3800,
    rating: 4.6,
    reviews: 112,
    seats: 7,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["AWD", "Air Conditioning", "Insurance", "GPS Navigation", "Roof Rails"],
    popular: true,
    available: true,
    location: "Westlands"
  },
  {
    id: 7,
    name: "Honda CR-V",
    category: "family-suvs",
    image: "https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=800&h=600&fit=crop",
    pricePerDay: 3600,
    rating: 4.7,
    reviews: 94,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["AWD", "Air Conditioning", "Insurance", "Sunroof", "Rear Camera"],
    popular: false,
    available: true,
    location: "Kilimani"
  },
  {
    id: 8,
    name: "Mazda CX-5",
    category: "family-suvs",
    image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop",
    pricePerDay: 3400,
    rating: 4.8,
    reviews: 76,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["AWD", "Air Conditioning", "Insurance", "Bluetooth", "Keyless Entry"],
    popular: false,
    available: false,
    location: "Langata"
  },
  
  // Luxury Sedans
  {
    id: 9,
    name: "Mercedes-Benz C-Class",
    category: "luxury-sedans",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
    pricePerDay: 6500,
    rating: 4.9,
    reviews: 67,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Leather Seats", "Premium Sound", "Insurance", "GPS Navigation", "Climate Control"],
    popular: true,
    available: true,
    location: "Westlands"
  },
  {
    id: 10,
    name: "BMW 3 Series",
    category: "luxury-sedans",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
    pricePerDay: 7000,
    rating: 4.8,
    reviews: 54,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Leather Seats", "Premium Sound", "Insurance", "Sunroof", "Sport Mode"],
    popular: true,
    available: true,
    location: "Karen"
  },
  {
    id: 11,
    name: "Audi A4",
    category: "luxury-sedans",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    pricePerDay: 6800,
    rating: 4.7,
    reviews: 43,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Leather Seats", "Premium Sound", "Insurance", "Virtual Cockpit", "Quattro AWD"],
    popular: false,
    available: true,
    location: "Kilimani"
  },
  {
    id: 12,
    name: "Lexus ES",
    category: "luxury-sedans",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
    pricePerDay: 6200,
    rating: 4.9,
    reviews: 38,
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    features: ["Leather Seats", "Premium Sound", "Insurance", "Hybrid Engine", "Massage Seats"],
    popular: false,
    available: false,
    location: "Westlands"
  },
  
  // VIP Luxury
  {
    id: 13,
    name: "Mercedes-Benz S-Class",
    category: "vip-luxury",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop",
    pricePerDay: 12000,
    rating: 5.0,
    reviews: 23,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Chauffeur Service", "Premium Leather", "Insurance", "Massage Seats", "Champagne Bar"],
    popular: true,
    available: true,
    location: "Westlands"
  },
  {
    id: 14,
    name: "BMW 7 Series",
    category: "vip-luxury",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
    pricePerDay: 11500,
    rating: 4.9,
    reviews: 18,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Chauffeur Service", "Premium Leather", "Insurance", "Executive Lounge", "Gesture Control"],
    popular: true,
    available: true,
    location: "Karen"
  },
  {
    id: 15,
    name: "Rolls-Royce Ghost",
    category: "vip-luxury",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop",
    pricePerDay: 25000,
    rating: 5.0,
    reviews: 12,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Chauffeur Service", "Handcrafted Interior", "Insurance", "Starlight Headliner", "Bespoke Audio"],
    popular: false,
    available: true,
    location: "Westlands"
  },
  {
    id: 16,
    name: "Bentley Continental",
    category: "vip-luxury",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop",
    pricePerDay: 22000,
    rating: 4.9,
    reviews: 15,
    seats: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Chauffeur Service", "Handcrafted Interior", "Insurance", "Diamond Quilted Seats", "Naim Audio"],
    popular: false,
    available: false,
    location: "Karen"
  },
  
  // Safari 4x4 Vehicles
  {
    id: 17,
    name: "Toyota Land Cruiser",
    category: "safari-4x4-vehicles",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop",
    pricePerDay: 5500,
    rating: 4.9,
    reviews: 145,
    seats: 8,
    transmission: "Automatic",
    fuel: "Diesel",
    features: ["4WD", "Roof Rack", "Insurance", "Safari Equipment", "High Ground Clearance"],
    popular: true,
    available: true,
    location: "Langata"
  },
  {
    id: 18,
    name: "Nissan Patrol",
    category: "safari-4x4-vehicles",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
    pricePerDay: 5200,
    rating: 4.7,
    reviews: 98,
    seats: 8,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["4WD", "Roof Rack", "Insurance", "Safari Equipment", "Tow Hook"],
    popular: true,
    available: true,
    location: "Karen"
  },
  {
    id: 19,
    name: "Mitsubishi Pajero",
    category: "safari-4x4-vehicles",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop",
    pricePerDay: 4800,
    rating: 4.6,
    reviews: 76,
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    features: ["4WD", "Roof Rack", "Insurance", "Safari Equipment", "Snorkel"],
    popular: false,
    available: true,
    location: "Langata"
  },
  {
    id: 20,
    name: "Ford Ranger",
    category: "safari-4x4-vehicles",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop",
    pricePerDay: 4200,
    rating: 4.5,
    reviews: 63,
    seats: 5,
    transmission: "Manual",
    fuel: "Diesel",
    features: ["4WD", "Pickup Bed", "Insurance", "Safari Equipment", "Tow Bar"],
    popular: false,
    available: true,
    location: "Kasarani"
  }
];