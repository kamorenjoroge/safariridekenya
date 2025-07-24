"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import {
  FaCar,
  FaUsers,
  FaGasPump,
  FaCog,
  FaStar,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaHeart,
  FaWhatsapp,
  FaPhone,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

// Types
interface Car {
  _id: string;
  model: string;
  type: string;
  registrationNumber: string;
  location: string;
  pricePerDay: number;
  status: "available" | "rented";
  image: string;
  year: number;
  transmission: string;
  fuel: string;
  seats: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  rating?: number;
  reviews?: number;
  popular?: boolean;
}

interface ApiResponse {
  success: boolean;
  data: Car[];
  message?: string;
}

// Define category mappings
const CATEGORIES = {
  all: "All Vehicles",
  "economy-cars": "Economy Cars",
  "family-suvs": "Family SUVs",
  "safari-4x4-vehicles": "Safari 4x4 Vehicles",
  "vip-luxury": "VIP Luxury",
} as const;

type CategoryKey = keyof typeof CATEGORIES;

// Custom hook for car data fetching
function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cars', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        
        if (data.success) {
          setCars(data.data.map(car => ({
            ...car,
            rating: car.rating || 4.5,
            reviews: car.reviews || Math.floor(Math.random() * 50) + 5,
            popular: car.popular || Math.random() > 0.7
          })));
        } else {
          throw new Error(data.message || 'Failed to fetch cars');
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return { cars, loading, error, refetch: () => fetchCars() };
}

// Loading component
function CarsPageLoading() {
  return (
    <div className="bg-white">
      <div className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 bg-earth/20 rounded animate-pulse mb-2"></div>
          <div className="h-6 bg-earth/10 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="bg-secondary/10 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-earth/20 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-earth/10">
                <div className="h-48 bg-earth/20 animate-pulse"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-earth/20 rounded animate-pulse"></div>
                  <div className="h-4 bg-earth/10 rounded animate-pulse"></div>
                  <div className="h-8 bg-earth/20 rounded animate-pulse"></div>
                  <div className="h-10 bg-primary/20 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Car card component
function CarCard({ car }: { car: Car }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-earth/10">
      <div className="relative">
        {car.popular && (
          <span className="absolute top-3 left-3 z-10 bg-accent text-white px-2 py-1 rounded-full text-xs font-bold">
            Popular
          </span>
        )}
        {car.status !== "available" && (
          <span className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Booked
          </span>
        )}

        <button className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-colors">
          <FaHeart className="h-4 w-4 text-earth" />
        </button>

        <div className="h-48 relative overflow-hidden">
          <Image
            src={car.image}
            alt={car.model}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-earth mb-1">{car.model}</h3>
          <div className="flex items-center space-x-1 mb-2">
            <FaStar className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">{car.rating}</span>
            <span className="text-sm text-earth/60">({car.reviews} reviews)</span>
          </div>
          <div className="flex items-center text-sm text-earth/60">
            <FaMapMarkerAlt className="h-3 w-3 mr-1" />
            {car.location}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-earth/60">
          <div className="flex items-center">
            <FaUsers className="h-3 w-3 mr-1" />
            {car.seats} seats
          </div>
          <div className="flex items-center">
            <FaCog className="h-3 w-3 mr-1" />
            {car.transmission}
          </div>
          <div className="flex items-center">
            <FaGasPump className="h-3 w-3 mr-1" />
            {car.fuel}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-2xl font-bold text-primary">
            KES {car.pricePerDay.toLocaleString()}
            <span className="text-sm font-normal text-earth/60">/day</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href={`/cars/${car._id}`}
            className={`w-full block text-center px-4 py-3 rounded-lg font-medium transition-colors ${
              car.status === "available"
                ? "bg-primary hover:bg-primary-dark text-white"
                : "bg-earth/20 text-earth/60 cursor-not-allowed"
            }`}
          >
            {car.status === "available" ? "View Details & Book" : "Currently Unavailable"}
          </Link>

          {car.status === "available" && (
            <div className="flex space-x-2">
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-earth/20 text-earth hover:bg-earth/5 transition-colors"
              >
                <FaWhatsapp className="h-4 w-4" />
                <span className="text-sm">WhatsApp</span>
              </a>
              <a
                href="tel:+254700000000"
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-earth/20 text-earth hover:bg-earth/5 transition-colors"
              >
                <FaPhone className="h-4 w-4" />
                <span className="text-sm">Call</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main cars content component
function CarsContent() {
  const searchParams = useSearchParams();
  const categoryParam = (searchParams.get("category") || "all") as CategoryKey;

  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<"all" | "budget" | "mid" | "premium">("all");
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "rating">("popular");

  const { cars, loading, error } = useCars();

  const filteredAndSortedCars = useMemo(() => {
    if (loading || error) return [];

    const filtered = cars.filter((car) => {
      const carTypeSlug = car.type.toLowerCase().replace(/\s+/g, "-") as CategoryKey;

      const matchesCategory = categoryParam === "all" || carTypeSlug === categoryParam;
      const matchesSearch = car.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "budget" && car.pricePerDay <= 3000) ||
        (priceFilter === "mid" && car.pricePerDay > 3000 && car.pricePerDay <= 6000) ||
        (priceFilter === "premium" && car.pricePerDay > 6000);

      return matchesCategory && matchesSearch && matchesPrice;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.pricePerDay - b.pricePerDay;
        case "price-high":
          return b.pricePerDay - a.pricePerDay;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "popular":
        default:
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      }
    });

    return filtered;
  }, [categoryParam, searchTerm, priceFilter, sortBy, cars, loading, error]);

  const categoryDisplayName = CATEGORIES[categoryParam] || "All Vehicles";

  if (loading) return <CarsPageLoading />;
  
  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <FaCar className="h-16 w-16 text-earth/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-earth mb-2">Failed to load vehicles</h2>
          <p className="text-earth/60 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-earth mb-2">{categoryDisplayName}</h1>
          <p className="text-earth/80">Browse our selection of {categoryDisplayName.toLowerCase()}</p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          {/* Filters */}
          <div className="bg-secondary/10 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth/60 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-earth/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as "all" | "budget" | "mid" | "premium")}
                className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="budget">Under KES 3,000</option>
                <option value="mid">KES 3,000 - 6,000</option>
                <option value="premium">Above KES 6,000</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "popular" | "price-low" | "price-high" | "rating")}
                className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <button className="w-full px-4 py-2 rounded-lg border border-earth/20 flex items-center justify-center gap-2 text-earth hover:bg-earth/5 transition-colors">
                <FaFilter className="h-4 w-4" />
                Advanced Filters
              </button>
            </div>
          </div>

          {/* Results count and category filters */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
            <p className="text-earth/70 text-sm md:text-base">
              Showing {filteredAndSortedCars.length}{" "}
              {filteredAndSortedCars.length === 1 ? "vehicle" : "vehicles"}
            </p>

            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              {(Object.entries(CATEGORIES) as [CategoryKey, string][]).map(([slug, name]) => (
                <Link
                  key={slug}
                  href={`/cars${slug === "all" ? "" : `?category=${slug}`}`}
                  className={`px-3 py-1 rounded-lg text-xs md:text-sm transition-colors ${
                    categoryParam === slug
                      ? "bg-primary text-white"
                      : "bg-earth/10 text-earth hover:bg-earth/20"
                  }`}
                >
                  {name.split(" ")[0]}
                </Link>
              ))}
            </div>
          </div>

          {/* Car Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>

          {/* Empty state */}
          {filteredAndSortedCars.length === 0 && (
            <div className="text-center py-12">
              <FaCar className="h-16 w-16 text-earth/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-earth mb-2">No vehicles found</h3>
              <p className="text-earth/60 mb-4">
                Try adjusting your search filters to find more options.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setPriceFilter("all");
                }}
                className="px-4 py-2 rounded-lg border border-earth/20 text-earth hover:bg-earth/5 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Main page component with Suspense wrapper
export default function CarsPage() {
  return (
    <Suspense fallback={<CarsPageLoading />}>
      <CarsContent />
    </Suspense>
  );
}

function fetchCars() {
  throw new Error("Function not implemented.");
}
