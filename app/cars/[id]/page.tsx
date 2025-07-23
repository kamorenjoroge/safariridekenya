// app/cars/[id]/page.tsx
import { notFound } from 'next/navigation';
import { FaStar, FaUsers, FaGasPump, FaCog, FaMapMarkerAlt, FaWhatsapp, FaPhone } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import axios from 'axios';

// Define the car interface based on your MongoDB data
interface Car {
  _id: string;
  model: string;
  type: string;
  regestrationNumber: string;
  location: string;
  pricePerDay: number;
  status: string;
  image: string;
  year: number;
  transmission: string;
  fuel: string;
  seats: number;
  category?: string; // Optional for now, in case it's not in all records
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data?: Car;
  error?: string;
}

interface CarsListResponse {
  success: boolean;
  data?: Car[];
  error?: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Loading component for car details
function CarDetailsLoading() {
  return (
    <div className="bg-white">
      <div className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 bg-earth/20 rounded animate-pulse mb-2"></div>
          <div className="h-6 bg-earth/10 rounded animate-pulse w-1/3"></div>
        </div>
      </div>
      
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="h-96 bg-earth/20 rounded-xl animate-pulse"></div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-earth/20 rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Details skeleton */}
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="h-6 bg-earth/20 rounded animate-pulse w-1/3"></div>
                <div className="h-8 bg-earth/20 rounded animate-pulse w-1/4"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-earth/10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-earth/20 rounded animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-earth/20 rounded animate-pulse w-16"></div>
                      <div className="h-4 bg-earth/20 rounded animate-pulse w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <div className="h-6 bg-earth/20 rounded animate-pulse w-1/4"></div>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-4 bg-earth/20 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 space-y-3">
                <div className="h-12 bg-primary/20 rounded-lg animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="flex-1 h-10 bg-earth/20 rounded-lg animate-pulse"></div>
                  <div className="flex-1 h-10 bg-earth/20 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Similar cars loading skeleton */}
          <div className="mt-16">
            <div className="h-8 bg-earth/20 rounded animate-pulse w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-earth/10">
                  <div className="h-48 bg-earth/20 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-earth/20 rounded animate-pulse"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-earth/20 rounded animate-pulse w-1/3"></div>
                      <div className="h-4 bg-earth/20 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Function to fetch car data from API
async function fetchCarById(id: string): Promise<Car | null> {
  try {
    const response = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cars/${id}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching car:', error);
    return null;
  }
}

// Function to fetch all cars from API
async function fetchAllCars(): Promise<Car[]> {
  try {
    const response = await axios.get<CarsListResponse>(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cars`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching all cars:', error);
    return [];
  }
}

// Similar cars component
function SimilarCars({ currentCar, allCars }: { currentCar: Car; allCars: Car[] }) {
  // Filter similar cars based on category or type
  const similarCars = allCars.filter(car => {
    // Exclude the current car
    if (car._id === currentCar._id) return false;
    
    // If category exists, use it for comparison
    if (currentCar.category && car.category) {
      return car.category === currentCar.category;
    }
    
    // Fallback to type if category doesn't exist
    return car.type === currentCar.type;
  }).slice(0, 3); // Show only 3 similar cars

  if (similarCars.length === 0) {
    return null; // Don't show the section if no similar cars found
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-earth mb-6">Similar Vehicles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarCars.map(similarCar => (
          <div key={similarCar._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-earth/10 hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={similarCar.image}
                alt={similarCar.model}
                fill
                className="object-cover"
              />
              {similarCar.status === "available" && (
                <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Available
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-earth mb-1">{similarCar.model}</h3>
              <p className="text-sm text-earth/60 mb-2">{similarCar.type}</p>
              
              {/* Quick specs */}
              <div className="flex items-center gap-4 text-xs text-earth/60 mb-3">
                <div className="flex items-center gap-1">
                  <FaUsers className="h-3 w-3" />
                  <span>{similarCar.seats}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaGasPump className="h-3 w-3" />
                  <span className="capitalize">{similarCar.fuel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCog className="h-3 w-3" />
                  <span className="capitalize">{similarCar.transmission}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-primary font-bold">
                  KES {similarCar.pricePerDay.toLocaleString()}
                  <span className="text-xs font-normal text-earth/60">/day</span>
                </div>
                <Link
                  href={`/cars/${similarCar._id}`}
                  className="px-3 py-1 text-sm text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Car details content component
async function CarDetailsContent({ params }: PageProps) {
  // Await the params since it's now a Promise in Next.js 15
  const { id } = await params;
  
  // Fetch the car data and all cars concurrently
  const [car, allCars] = await Promise.all([
    fetchCarById(id),
    fetchAllCars()
  ]);
  
  // Return 404 if car not found
  if (!car) {
    return notFound();
  }

  // Mock features since they're not in your DB schema yet
  const mockFeatures = [
    'Air Conditioning',
    'GPS Navigation',
    'Bluetooth',
    'USB Charging',
    'Premium Sound System',
    'Leather Seats'
  ];

  // Mock rating data since it's not in your DB schema yet
  const mockRating = 4.5;
  const mockReviews = 25;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-earth mb-2">{car.model}</h1>
          <p className="text-earth/80">{car.type}</p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Car Images */}
            <div className="space-y-4">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <Image
                  src={car.image}
                  alt={car.model}
                  fill
                  className="object-cover"
                  priority
                />
                {car.status === "available" && (
                  <span className="absolute top-4 left-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Available
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {/* Thumbnail images - using same image for now */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative h-20 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={car.image}
                      alt={`${car.model} thumbnail ${i}`}
                      fill
                      className="object-cover opacity-70"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Car Details */}
            <div className="space-y-6">
              {/* Rating and Price */}
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <FaStar className="h-5 w-5 text-yellow-400" />
                  <span className="font-medium">{mockRating}</span>
                  <span className="text-earth/60">({mockReviews} reviews)</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    KES {car.pricePerDay.toLocaleString()}
                    <span className="text-sm font-normal text-earth/60">/day</span>
                  </div>
                  {car.status !== "available" && (
                    <div className="text-sm text-red-500 mt-1">Currently unavailable</div>
                  )}
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-earth/10">
                <div className="flex items-center space-x-3">
                  <FaUsers className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-earth/60">Seats</div>
                    <div className="font-medium">{car.seats}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCog className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-earth/60">Transmission</div>
                    <div className="font-medium capitalize">{car.transmission}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaGasPump className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-earth/60">Fuel Type</div>
                    <div className="font-medium capitalize">{car.fuel}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-earth/60">Location</div>
                    <div className="font-medium">{car.location}</div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-earth">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-earth/60">Year</div>
                    <div className="font-medium">{car.year}</div>
                  </div>
                  <div>
                    <div className="text-sm text-earth/60">Registration</div>
                    <div className="font-medium">{car.regestrationNumber}</div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-earth">Features</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {mockFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-earth/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                {car.status === "available" ? (
                  <>
                    <Link
                      href={`/booking/${car._id}`}
                      className="w-full block text-center px-4 py-3 rounded-lg font-medium bg-primary hover:bg-primary-dark text-white"
                    >
                      Book Now
                    </Link>
                    <div className="flex space-x-2">
                      <a
                        href="https://wa.me/254700000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-earth/20 text-earth hover:bg-earth/5"
                      >
                        <FaWhatsapp className="h-4 w-4" />
                        WhatsApp
                      </a>
                      <a
                        href="tel:+254700000000"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-earth/20 text-earth hover:bg-earth/5"
                      >
                        <FaPhone className="h-4 w-4" />
                        Call Now
                      </a>
                    </div>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full px-4 py-3 rounded-lg font-medium bg-earth/20 text-earth/60 cursor-not-allowed"
                  >
                    Currently Unavailable
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Similar Vehicles Section */}
          <SimilarCars currentCar={car} allCars={allCars} />
        </div>
      </section>
    </div>
  );
}

// Main page component with Suspense wrapper
async function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<CarDetailsLoading />}>
      <CarDetailsContent params={params} />
    </Suspense>
  );
}

export default Page;