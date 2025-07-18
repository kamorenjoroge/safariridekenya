// app/cars/[id]/page.tsx
import { notFound } from 'next/navigation';
import { allCars } from '@/lib/data';
import { FaStar, FaUsers, FaGasPump, FaCog, FaMapMarkerAlt, FaWhatsapp, FaPhone } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function Page({ params }: PageProps) {
  // Await the params since it's now a Promise in Next.js 15
  const { id } = await params;
  
  // Find the car with matching ID
  const car = allCars.find(car => car.id === Number(id));
  // Return 404 if car not found
  if (!car) {
    return notFound();
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-earth mb-2">{car.name}</h1>
          <p className="text-earth/80">{car.category}</p>
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
                  alt={car.name}
                  fill
                  className="object-cover"
                  priority
                />
                {car.popular && (
                  <span className="absolute top-4 left-4 z-10 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                    Popular Choice
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {/* Thumbnail images would go here */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative h-20 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={car.image}
                      alt={`${car.name} thumbnail ${i}`}
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
                  <span className="font-medium">{car.rating}</span>
                  <span className="text-earth/60">({car.reviews} reviews)</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    KES {car.pricePerDay.toLocaleString()}
                    <span className="text-sm font-normal text-earth/60">/day</span>
                  </div>
                  {!car.available && (
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
                    <div className="font-medium">{car.transmission}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaGasPump className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-earth/60">Fuel Type</div>
                    <div className="font-medium">{car.fuel}</div>
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

              {/* Features List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-earth">Features</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {car.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-earth/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                {car.available ? (
                  <>
                    <Link
                        href={`/booking/${car.id}`}
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
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-earth mb-6">Similar Vehicles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCars
                .filter(c => c.category === car.category && c.id !== car.id)
                .slice(0, 3)
                .map(similarCar => (
                  <div key={similarCar.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-earth/10">
                    <div className="relative h-48">
                      <Image
                        src={similarCar.image}
                        alt={similarCar.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-earth">{similarCar.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-primary font-bold">
                          KES {similarCar.pricePerDay.toLocaleString()}/day
                        </div>
                        <Link 
                          href={`/cars/${similarCar.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          View Details
                        </Link>
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

export default Page;