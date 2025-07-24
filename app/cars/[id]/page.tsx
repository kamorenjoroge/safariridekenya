import { notFound } from 'next/navigation';
import { FaStar, FaUsers, FaGasPump, FaCog, FaMapMarkerAlt, FaWhatsapp, FaPhone, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

// Types
interface Car {
  _id: string;
  model: string;
  type: string;
  features?: string[];
  registrationNumber: string;
  location: string;
  pricePerDay: number;
  status: string;
  image: string;
  year: number;
  transmission: string;
  fuel: string;
  seats: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data?: Car;
  message?: string;
}

interface CarsListResponse {
  success: boolean;
  data?: Car[];
  message?: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Utility functions
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://safariridekenya-rje7.vercel.app/';
  }
  return 'http://localhost:3000';
};

// Server-side data fetching functions
async function fetchCarById(id: string): Promise<Car | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/cars/${id}`, {
      cache: 'no-store', // Always fetch fresh data for car details
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch car ${id}: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: ApiResponse = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    console.error('API returned unsuccessful response:', data.message);
    return null;
  } catch (error) {
    console.error('Error fetching car:', error);
    return null;
  }
}

async function fetchAllCars(): Promise<Car[]> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/cars`, {
      cache: 'force-cache', // Cache car list for better performance
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch cars: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: CarsListResponse = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    console.error('API returned unsuccessful response:', data.message);
    return [];
  } catch (error) {
    console.error('Error fetching all cars:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const car = await fetchCarById(id);

  if (!car) {
    return {
      title: 'Car Not Found',
      description: 'The requested car could not be found.',
    };
  }

  return {
    title: `${car.model} - Car Rental | Your Car Hire Service`,
    description: `Rent ${car.model} for KES ${car.pricePerDay.toLocaleString()}/day. ${car.seats} seats, ${car.transmission} transmission, ${car.fuel} fuel. Available in ${car.location}.`,
    openGraph: {
      title: `${car.model} - Car Rental`,
      description: `Rent this ${car.model} for KES ${car.pricePerDay.toLocaleString()}/day`,
      images: [car.image],
    },
  };
}

// Similar cars component
function SimilarCars({ currentCar, allCars }: { currentCar: Car; allCars: Car[] }) {
  const similarCars = allCars
    .filter(car => {
      if (car._id === currentCar._id) return false;
      
      // Priority matching: category > type
      if (currentCar.category && car.category) {
        return car.category === currentCar.category;
      }
      
      return car.type === currentCar.type;
    })
    .slice(0, 3);

  if (similarCars.length === 0) return null;

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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {similarCar.status === "available" && (
                <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Available
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-earth mb-1 truncate">{similarCar.model}</h3>
              <p className="text-sm text-earth/60 mb-2">{similarCar.type}</p>
              
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
  const { id } = await params;
  
  // Fetch car data and all cars concurrently
  const [car, allCars] = await Promise.all([
    fetchCarById(id),
    fetchAllCars()
  ]);
  
  if (!car) {
    return notFound();
  }

  // Enhance car data with defaults
  const enhancedCar = {
    ...car,
    features: car.features || [
      'Air Conditioning',
      'GPS Navigation',
      'Bluetooth',
      'USB Charging',
      'Premium Sound System',
      'Comfortable Seats'
    ]
  };

  // Mock data (replace with actual data from your API)
  const mockRating = 4.5;
  const mockReviews = Math.floor(Math.random() * 45) + 5;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/cars" 
              className="flex items-center gap-2 text-earth/70 hover:text-earth transition-colors"
            >
              <FaArrowLeft className="h-4 w-4" />
              <span>Back to Cars</span>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-earth mb-2">{car.model}</h1>
          <p className="text-earth/80">{car.type} • {car.year}</p>
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
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {car.status === "available" && (
                  <span className="absolute top-4 left-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Available
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="relative h-20 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={car.image}
                      alt={`${car.model} view ${i + 1}`}
                      fill
                      className="object-cover opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
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
                    <div className="font-medium">{car.registrationNumber}</div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-earth">Features</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {enhancedCar.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-earth/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
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
                      href={`/booking?carId=${car._id}&model=${encodeURIComponent(car.model)}&price=${car.pricePerDay}&location=${encodeURIComponent(car.location)}`}
                      className="w-full block text-center px-4 py-3 rounded-lg font-medium bg-primary hover:bg-primary-dark text-white transition-colors"
                    >
                      Book Now - KES {car.pricePerDay.toLocaleString()}/day
                    </Link>
                    <div className="flex space-x-2">
                      <a
                        href={`https://wa.me/254700000000?text=Hi, I'm interested in booking the ${car.model} for KES ${car.pricePerDay.toLocaleString()}/day`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-earth/20 text-earth hover:bg-earth/5 transition-colors"
                      >
                        <FaWhatsapp className="h-4 w-4" />
                        WhatsApp
                      </a>
                      <a
                        href="tel:+254700000000"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-earth/20 text-earth hover:bg-earth/5 transition-colors"
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

              {/* Additional Information */}
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-earth mb-2">Important Information</h4>
                <ul className="text-sm text-earth/70 space-y-1">
                  <li>• Valid driving license required</li>
                  <li>• Minimum age: 25 years</li>
                  <li>• Security deposit may be required</li>
                  <li>• Free cancellation up to 24 hours before pickup</li>
                  <li>• Fuel policy: Return with same fuel level</li>
                </ul>
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

// Error boundary component
function CarNotFound() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl text-earth/30 mb-4">🚗</div>
        <h1 className="text-2xl font-bold text-earth mb-2">Car Not Found</h1>
        <p className="text-earth/60 mb-6">
          The car you&lsquo;re looking for doesn&lsquo;t exist or has been removed.
        </p>
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FaArrowLeft className="h-4 w-4" />
          Back to Cars
        </Link>
      </div>
    </div>
  );
}

// Loading component
function CarDetailsLoading() {
  return (
    <div className="bg-white">
      <div className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="h-4 bg-earth/20 rounded animate-pulse mb-4 w-32"></div>
          <div className="h-10 bg-earth/20 rounded animate-pulse mb-2 w-80"></div>
          <div className="h-6 bg-earth/10 rounded animate-pulse w-48"></div>
        </div>
      </div>
      
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="h-96 bg-earth/20 rounded-xl animate-pulse"></div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-earth/20 rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Details skeleton */}
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="h-6 bg-earth/20 rounded animate-pulse w-32"></div>
                <div className="h-8 bg-earth/20 rounded animate-pulse w-40"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-earth/10">
                {Array.from({ length: 4 }).map((_, i) => (
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
                <div className="h-6 bg-earth/20 rounded animate-pulse w-40"></div>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
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
        </div>
      </section>
    </div>
  );
}

// Main page component
export default async function CarDetailPage({ params }: PageProps) {
  return <CarDetailsContent params={params} />;
}