// app/cars/page.tsx
"use client";
import { useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
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
  FaPhone
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { allCars } from '@/lib/data';

// Define category mappings
const CATEGORIES = {
  'all': 'All Vehicles',
  'economy-cars': 'Economy Cars',
  'family-suvs': 'Family SUVs',
  'safari-4x4-vehicles': 'Safari 4x4 Vehicles',
  'vip-luxury': 'VIP Luxury'
};

function CarsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const filteredAndSortedCars = useMemo(() => {
    const filtered = allCars.filter(car => {
      // Convert car category to URL-friendly format for comparison
      const carCategorySlug = car.category.toLowerCase().replace(/\s+/g, '-');
      
      // Filter by URL category parameter
      const matchesCategory = categoryParam === 'all' || 
                            carCategorySlug === categoryParam;
      
      // Filter by search term
      const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by price range
      const matchesPrice = priceFilter === 'all' || 
        (priceFilter === 'budget' && car.pricePerDay <= 3000) ||
        (priceFilter === 'mid' && car.pricePerDay > 3000 && car.pricePerDay <= 6000) ||
        (priceFilter === 'premium' && car.pricePerDay > 6000);
      
      return matchesCategory && matchesSearch && matchesPrice;
    });

    // Sort cars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.pricePerDay - b.pricePerDay;
        case 'price-high':
          return b.pricePerDay - a.pricePerDay;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
        default:
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      }
    });

    return filtered;
  }, [categoryParam, searchTerm, priceFilter, sortBy]);

  // Get the display name for the current category
  const categoryDisplayName = CATEGORIES[categoryParam as keyof typeof CATEGORIES] || 'All Vehicles';

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
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="budget">Under KES 3,000</option>
                <option value="mid">KES 3,000 - 6,000</option>
                <option value="premium">Above KES 6,000</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
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

          {/* Results count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-earth/70">
              Showing {filteredAndSortedCars.length} {filteredAndSortedCars.length === 1 ? 'vehicle' : 'vehicles'}
            </p>
            <div className="flex gap-2">
              {Object.entries(CATEGORIES).map(([slug, name]) => (
                <Link 
                  key={slug}
                  href={`/cars${slug === 'all' ? '' : `?category=${slug}`}`}
                  className={`px-3 py-1 rounded-lg text-sm ${categoryParam === slug ? 'bg-primary text-white' : 'bg-earth/10 text-earth hover:bg-earth/20'}`}
                >
                  {name.split(' ')[0]} {/* Show first word of category name */}
                </Link>
              ))}
            </div>
          </div>

          {/* Car Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCars.map((car) => (
              <div key={car.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-earth/10">
                <div className="relative">
                  {car.popular && (
                    <span className="absolute top-3 left-3 z-10 bg-accent text-white px-2 py-1 rounded-full text-xs font-bold">
                      Popular
                    </span>
                  )}
                  {!car.available && (
                    <span className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Booked
                    </span>
                  )}
                  
                  <button className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white p-2 rounded-full">
                    <FaHeart className="h-4 w-4 text-earth" />
                  </button>
                  
                  <div className="h-48 relative overflow-hidden">
                    <Image 
                      src={car.image} 
                      alt={car.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-earth mb-1">
                      {car.name}
                    </h3>
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
                      href={`/cars/${car.id}`}
                      className={`w-full block text-center px-4 py-3 rounded-lg font-medium ${car.available ? 'bg-primary hover:bg-primary-dark text-white' : 'bg-earth/20 text-earth/60 cursor-not-allowed'}`}
                    >
                      {car.available ? 'View Details & Book' : 'Currently Unavailable'}
                    </Link>
                    
                    {car.available && (
                      <div className="flex space-x-2">
                        <a 
                          href="https://wa.me/254700000000" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-earth/20 text-earth hover:bg-earth/5"
                        >
                          <FaWhatsapp className="h-4 w-4" />
                          <span className="text-sm">WhatsApp</span>
                        </a>
                        <a 
                          href="tel:+254700000000"
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-earth/20 text-earth hover:bg-earth/5"
                        >
                          <FaPhone className="h-4 w-4" />
                          <span className="text-sm">Call</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedCars.length === 0 && (
            <div className="text-center py-12">
              <FaCar className="h-16 w-16 text-earth/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-earth mb-2">No vehicles found</h3>
              <p className="text-earth/60 mb-4">
                Try adjusting your search filters to find more options.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setPriceFilter('all');
                }}
                className="px-4 py-2 rounded-lg border border-earth/20 text-earth hover:bg-earth/5"
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

export default CarsPage;