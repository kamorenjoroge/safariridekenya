// app/booking-confirmation/page.tsx
"use client";

import { useEffect } from 'react';
import { FaCheckCircle, FaCar, FaCalendarAlt, FaUser, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function BookingConfirmationPage() {
  // In a real app, you would get this data from the booking API response or context
  const bookingDetails = {
    bookingId: `#${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    car: {
      name: "Toyota Prado",
      category: "suv",
      image: "/luxury-mercedes.jpg",
      pricePerDay: 4500,
    },
    dates: {
      pickup: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      return: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days from now
    },
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+254700000000",
      idNumber: "12345678",
      license: "DL12345678"
    },
    totalPrice: 13500,
    duration: 3
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 ">
        {/* Confirmation Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <FaCheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-earth mb-2">Booking Confirmed!</h1>
          <p className="text-earth/80 mb-4">Your booking reference: {bookingDetails.bookingId}</p>
          <p className="text-earth/80">We&apos;ve sent the confirmation details to your email.</p>
        </div>

        {/* Booking Summary */}
        <div className="bg-secondary/10 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-earth mb-6 flex items-center gap-2">
            <FaCar className="text-primary" />
            Booking Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vehicle Details */}
            <div>
              <h3 className="text-lg font-semibold text-earth mb-4">Vehicle Information</h3>
              <div className="bg-white p-4 rounded-lg border border-earth/20">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      width={960}
                      height={960}
                      src={bookingDetails.car.image} 
                      alt={bookingDetails.car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-earth">{bookingDetails.car.name}</h4>
                    <p className="text-sm text-earth/60 capitalize">{bookingDetails.car.category}</p>
                    <p className="text-primary font-bold mt-2">
                      KES {bookingDetails.car.pricePerDay.toLocaleString()}
                      <span className="text-sm font-normal text-earth/60">/day</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Period */}
            <div>
              <h3 className="text-lg font-semibold text-earth mb-4">Rental Period</h3>
              <div className="bg-white p-4 rounded-lg border border-earth/20">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-2 text-earth/70">
                    <FaCalendarAlt className="text-primary" />
                    <span>Pickup Date:</span>
                  </div>
                  <span className="font-medium">{bookingDetails.dates.pickup}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-2 text-earth/70">
                    <FaCalendarAlt className="text-primary" />
                    <span>Return Date:</span>
                  </div>
                  <span className="font-medium">{bookingDetails.dates.return}</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-earth/70">
                    <FaCalendarAlt className="text-primary" />
                    <span>Duration:</span>
                  </div>
                  <span className="font-medium">{bookingDetails.duration} day{bookingDetails.duration !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white p-4 rounded-lg border border-earth/20 mt-6">
            <h3 className="text-lg font-semibold text-earth mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-earth/70">Daily Rate:</span>
                <span className="font-medium">KES {bookingDetails.car.pricePerDay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth/70">Rental Duration:</span>
                <span className="font-medium">{bookingDetails.duration} day{bookingDetails.duration !== 1 ? 's' : ''}</span>
              </div>
              <div className="border-t border-earth/20 pt-2 flex justify-between">
                <span className="text-earth font-medium">Total Amount:</span>
                <span className="text-xl font-bold text-primary">KES {bookingDetails.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-secondary/10 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-earth mb-6 flex items-center gap-2">
            <FaUser className="text-primary" />
            Your Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-earth mb-4">Contact Details</h3>
              <div className="bg-white p-4 rounded-lg border border-earth/20 space-y-3">
                <div className="flex items-center gap-3">
                  <FaUser className="text-primary" />
                  <span>{bookingDetails.customer.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-primary" />
                  <span>{bookingDetails.customer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-primary" />
                  <span>{bookingDetails.customer.phone}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-earth mb-4">Identification</h3>
              <div className="bg-white p-4 rounded-lg border border-earth/20 space-y-3">
                <div className="flex items-center gap-3">
                  <FaIdCard className="text-primary" />
                  <span>ID: {bookingDetails.customer.idNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaIdCard className="text-primary" />
                  <span>License: {bookingDetails.customer.license}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-secondary/10 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-earth mb-4">What&lsquo;s Next?</h2>
          <div className="space-y-4">
            <p className="text-earth/80">
              Your booking is now confirmed. Here&lsquo;s what you need to know:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-earth/80">
              <li>We&lsquo;ll contact you within 24 hours to confirm pickup details</li>
              <li>Please bring your original ID and driving license when picking up the vehicle</li>
              <li>A refundable security deposit will be required at pickup</li>
              <li>Review our <Link href="/terms" className="text-primary hover:underline">Terms and Conditions</Link></li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/cars"
              className="px-6 py-3 rounded-lg font-medium bg-primary hover:bg-primary-dark text-white text-center"
            >
              Browse More Vehicles
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-lg font-medium border border-primary text-primary hover:bg-primary/10 text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}