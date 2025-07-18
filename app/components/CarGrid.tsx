import { FaCheckCircle, FaCar } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { carCategories } from '@/lib/data';



const CarGrid = () => {
  return (
    <section className="py-20 px-4 bg-secondary/10">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-earth mb-4">
            Choose Your Perfect Ride
          </h2>
          <p className="text-xl text-earth/80 max-w-2xl mx-auto">
            From rugged safari 4x4s to luxurious executive vehicles, 
            find the perfect car for your Kenyan adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {carCategories.map((category) => (
            <div 
              key={category.title} 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100"
            >
              <div className="relative">
                {category.popular && (
                  <div className="absolute top-4 left-4 z-10 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <div className="h-48 overflow-hidden">
                  <Image
                  width={500}
                  height={500}
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-earth mb-2">
                    {category.title}
                  </h3>
                  <p className="text-earth/70 text-sm">
                    {category.description}
                  </p>
                </div>
                
                <div className="mb-4">
                  <div className="text-2xl font-bold text-primary">
                    KES {category.priceFrom}
                    <span className="text-sm font-normal text-earth/70">/day</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {category.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <FaCheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm text-earth/70">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  href={`/cars?category=${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-300"
                >
                  <FaCar className="h-4 w-4" />
                  View {category.title.split(' ')[0]}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarGrid;