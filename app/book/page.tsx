"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCalendarAlt, FaIdCard, FaCar, FaUser, FaMoneyBillWave, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

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
}

interface BookingFormData {
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  drivingLicense: string;
  specialRequests: string;
  agreeTerms: boolean;
}

interface BookingResponse {
  success: boolean;
  data?: {
    _id: string;
    bookingId: string;
  };
  message?: string;
}

// Service function to fetch car data
async function fetchCarById(id: string): Promise<Car | null> {
  try {
    const response = await fetch(`/api/cars/${id}`);
    if (!response.ok) throw new Error('Failed to fetch car');
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching car:', error);
    return null;
  }
}

// Service function to create booking
interface CreateBookingData {
  carId: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  totalAmount: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    idNumber: string;
    drivingLicense: string;
  };
  specialRequests: string;
}

async function createBooking(bookingData: CreateBookingData): Promise<BookingResponse> {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      message: 'Failed to create booking',
    };
  }
}

// Utility functions
const calculateRentalDays = (pickupDate: string, returnDate: string): number => {
  if (!pickupDate || !returnDate) return 0;
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const validateDates = (pickupDate: string, returnDate: string): { isValid: boolean; error?: string } => {
  if (!pickupDate || !returnDate) {
    return { isValid: false, error: 'Please select both pickup and return dates' };
  }

  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (pickup < today) {
    return { isValid: false, error: 'Pickup date cannot be in the past' };
  }

  if (returnD <= pickup) {
    return { isValid: false, error: 'Return date must be after pickup date' };
  }

  return { isValid: true };
};

// Loading component
function BookingPageLoading() {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-earth/20 rounded w-1/3"></div>
          <div className="bg-secondary/10 p-6 rounded-lg">
            <div className="h-6 bg-earth/20 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-20 bg-earth/20 rounded"></div>
              <div className="h-20 bg-earth/20 rounded"></div>
            </div>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-secondary/10 p-6 rounded-lg">
              <div className="h-6 bg-earth/20 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-10 bg-earth/20 rounded"></div>
                <div className="h-10 bg-earth/20 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main booking content component
function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get car data from URL parameters
  const carId = searchParams.get('carId');
  const carModel = searchParams.get('model');
  const carPrice = searchParams.get('price');
  const carLocation = searchParams.get('location');

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isLoadingCar, setIsLoadingCar] = useState(!!carId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    pickupDate: '',
    returnDate: '',
    pickupTime: '09:00',
    returnTime: '17:00',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    drivingLicense: '',
    specialRequests: '',
    agreeTerms: false,
  });

  // Fetch car details if carId is provided
  useEffect(() => {
    if (carId) {
      fetchCarById(carId).then(car => {
        setSelectedCar(car);
        setIsLoadingCar(false);
      });
    }
  }, [carId]);

  // Calculate rental details
  const rentalDays = useMemo(() => {
    return calculateRentalDays(formData.pickupDate, formData.returnDate);
  }, [formData.pickupDate, formData.returnDate]);

  const dailyPrice = selectedCar?.pricePerDay || (carPrice ? Number(carPrice) : 0);
  const totalPrice = useMemo(() => {
    return rentalDays * dailyPrice;
  }, [rentalDays, dailyPrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const dateValidation = validateDates(formData.pickupDate, formData.returnDate);
    if (!dateValidation.isValid) {
      toast.error(dateValidation.error!);
      return;
    }

    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (!selectedCar && !carId) {
      toast.error('No car selected for booking');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        carId: (selectedCar?._id || carId || '') as string,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        pickupTime: formData.pickupTime,
        returnTime: formData.returnTime,
        totalAmount: totalPrice,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          idNumber: formData.idNumber,
          drivingLicense: formData.drivingLicense,
        },
        specialRequests: formData.specialRequests,
      };

      const response = await createBooking(bookingData);
      
      if (response.success && response.data) {
        // Store booking data temporarily for confirmation page
        const tempBookingData = {
          ...bookingData,
          bookingId: response.data.bookingId,
          car: selectedCar || {
            _id: carId,
            model: carModel,
            pricePerDay: dailyPrice,
            location: carLocation,
          },
          rentalDays,
        };
        
        sessionStorage.setItem('tempBookingData', JSON.stringify(tempBookingData));
        
        toast.success('Booking created successfully!');
        router.push(`/booking/${response.data._id}`);
      } else {
        throw new Error(response.message || 'Failed to create booking');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error if no car data available
  if (!isLoadingCar && !selectedCar && !carModel) {
    return (
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <FaCar className="h-16 w-16 text-earth/30 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-earth mb-2">No Car Selected</h1>
            <p className="text-earth/60 mb-6">
              Please select a car first before making a booking.
            </p>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FaArrowLeft className="h-4 w-4" />
              Browse Cars
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={selectedCar ? `/cars/${selectedCar._id}` : '/cars'}
            className="inline-flex items-center gap-2 text-earth/70 hover:text-earth transition-colors mb-4"
          >
            <FaArrowLeft className="h-4 w-4" />
            Back to {selectedCar ? 'Car Details' : 'Cars'}
          </Link>
          <h1 className="text-3xl font-bold text-earth mb-2">Complete Your Booking</h1>
          <p className="text-earth/80">Fill in your details to reserve your vehicle</p>
        </div>
        
        {/* Vehicle Details Section */}
        <div className="bg-secondary/10 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-earth mb-4 flex items-center gap-2">
            <FaCar className="text-primary" />
            Vehicle Details
          </h2>
          
          {isLoadingCar ? (
            <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-20 bg-earth/20 rounded"></div>
              <div className="h-20 bg-earth/20 rounded"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {selectedCar?.image && (
                <div className="lg:col-span-1">
                  <div className="relative h-48 lg:h-32 rounded-lg overflow-hidden">
                    <Image
                      src={selectedCar.image}
                      alt={selectedCar.model}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                </div>
              )}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-earth">
                      {selectedCar?.model || carModel}
                    </h3>
                    <p className="text-earth/70">
                      {selectedCar?.type || 'Selected Vehicle'}
                    </p>
                    {selectedCar?.location && (
                      <p className="text-earth/60 text-sm mt-1">📍 {selectedCar.location}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-earth/70">Daily Rate:</p>
                    <p className="text-xl font-bold text-primary">
                      KES {dailyPrice.toLocaleString()}
                      <span className="text-sm font-normal text-earth/60">/day</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection & Price Summary */}
          <div className="bg-secondary/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-earth mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-primary" />
              Rental Period
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label htmlFor="pickupDate" className="block text-sm font-medium text-earth mb-1">
                  Pickup Date
                </label>
                <input
                  type="date"
                  id="pickupDate"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="pickupTime" className="block text-sm font-medium text-earth mb-1">
                  Pickup Time
                </label>
                <input
                  type="time"
                  id="pickupTime"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="returnDate" className="block text-sm font-medium text-earth mb-1">
                  Return Date
                </label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="returnTime" className="block text-sm font-medium text-earth mb-1">
                  Return Time
                </label>
                <input
                  type="time"
                  id="returnTime"
                  name="returnTime"
                  value={formData.returnTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Price Summary */}
            {rentalDays > 0 && (
              <div className="bg-white p-4 rounded-lg border border-earth/20">
                <h3 className="text-lg font-semibold text-earth mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-primary" />
                  Rental Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-earth/70">Daily Rate:</span>
                    <span className="font-medium">KES {dailyPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth/70">Rental Duration:</span>
                    <span className="font-medium">{rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="border-t border-earth/20 pt-2 flex justify-between">
                    <span className="text-earth font-medium">Total Amount:</span>
                    <span className="text-xl font-bold text-primary">KES {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="bg-secondary/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-earth mb-4 flex items-center gap-2">
              <FaUser className="text-primary" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-earth mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-earth mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-earth mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-earth mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254..."
                  className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Identification */}
          <div className="bg-secondary/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-earth mb-4 flex items-center gap-2">
              <FaIdCard className="text-primary" />
              Identification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-earth mb-1">
                  National ID/Passport Number *
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="drivingLicense" className="block text-sm font-medium text-earth mb-1">
                  Driving License Number *
                </label>
                <input
                  type="text"
                  id="drivingLicense"
                  name="drivingLicense"
                  value={formData.drivingLicense}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="bg-secondary/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-earth mb-4 flex items-center gap-2">
              <FaCar className="text-primary" />
              Additional Information
            </h2>
            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium text-earth mb-1">
                Special Requests (Optional)
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={3}
                placeholder="Any special requirements or requests..."
                className="w-full px-4 py-2 rounded-lg border border-earth/20 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Terms and Submit */}
          <div className="space-y-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
                className="mt-1 mr-2"
              />
              <label htmlFor="agreeTerms" className="text-sm text-earth/80">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms and Conditions
                </Link>{' '}
                and confirm that all information provided is accurate. *
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || rentalDays === 0}
              className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="h-4 w-4 animate-spin" />
                  Processing Booking...
                </>
              ) : (
                `Confirm Booking ${totalPrice > 0 ? `- KES ${totalPrice.toLocaleString()}` : ''}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main page component with Suspense wrapper
export default function BookingPage() {
  return (
    <Suspense fallback={<BookingPageLoading />}>
      <BookingContent />
    </Suspense>
  );
}