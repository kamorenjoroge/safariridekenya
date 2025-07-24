// lib/types.ts
export interface Car {
  _id: string;
  model: string;
  type: string;
  features?: string[];
  registrationNumber: string;
  location: string;
  pricePerDay: number;
  status: "available" | "rented" | "maintenance";
  image: string;
  year: number;
  transmission: "manual" | "automatic";
  fuel: "petrol" | "diesel" | "hybrid" | "electric";
  seats: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Enhanced fields (can be added later to your DB)
  rating?: number;
  reviews?: number;
  popular?: boolean;
  mileage?: number;
  description?: string;
  images?: string[]; // Multiple images
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface BookingData {
  carId: string;
  pickupDate: string;
  dropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    drivingLicense?: string;
  };
  additionalInfo?: {
    specialRequests?: string;
    insurance?: boolean;
    gps?: boolean;
    childSeat?: boolean;
  };
}

export interface Booking {
  _id: string;
  carId: string;
  car?: Car; // Populated car data
  customerId: string;
  pickupDate: string;
  dropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    drivingLicense?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Filter and sort types
export type CategoryKey = "all" | "economy-cars" | "family-suvs" | "safari-4x4-vehicles" | "vip-luxury";
export type PriceFilter = "all" | "budget" | "mid" | "premium";
export type SortOption = "popular" | "price-low" | "price-high" | "rating";

// lib/services/carService.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

export class CarService {
  private static async fetchWithErrorHandling<T>(
    url: string, 
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  // Get all cars
  static async getAllCars(): Promise<ApiResponse<Car[]>> {
    return this.fetchWithErrorHandling<Car[]>(`${API_BASE_URL}/api/cars`);
  }

  // Get car by ID
  static async getCarById(id: string): Promise<ApiResponse<Car>> {
    return this.fetchWithErrorHandling<Car>(`${API_BASE_URL}/api/cars/${id}`);
  }

  // Get cars by category
  static async getCarsByCategory(category: string): Promise<ApiResponse<Car[]>> {
    return this.fetchWithErrorHandling<Car[]>(`${API_BASE_URL}/api/cars?category=${category}`);
  }

  // Search cars
  static async searchCars(query: string): Promise<ApiResponse<Car[]>> {
    return this.fetchWithErrorHandling<Car[]>(`${API_BASE_URL}/api/cars?search=${encodeURIComponent(query)}`);
  }

  // Get featured/popular cars
  static async getFeaturedCars(): Promise<ApiResponse<Car[]>> {
    return this.fetchWithErrorHandling<Car[]>(`${API_BASE_URL}/api/cars?featured=true`);
  }
}

// lib/services/bookingService.ts
export class BookingService {
  private static async fetchWithErrorHandling<T>(
    url: string, 
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Booking API Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  // Create booking
  static async createBooking(bookingData: BookingData): Promise<ApiResponse<Booking>> {
    return this.fetchWithErrorHandling<Booking>(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Get booking by ID
  static async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    return this.fetchWithErrorHandling<Booking>(`${API_BASE_URL}/api/bookings/${id}`);
  }

  // Update booking status
  static async updateBookingStatus(id: string, status: Booking['status']): Promise<ApiResponse<Booking>> {
    return this.fetchWithErrorHandling<Booking>(`${API_BASE_URL}/api/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Cancel booking
  static async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    return this.fetchWithErrorHandling<Booking>(`${API_BASE_URL}/api/bookings/${id}/cancel`, {
      method: 'POST',
    });
  }
}

// lib/utils/carUtils.ts
export class CarUtils {
  // Calculate rental duration in days
  static calculateRentalDays(pickupDate: string, dropoffDate: string): number {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays); // Minimum 1 day
  }

  // Calculate total price
  static calculateTotalPrice(pricePerDay: number, pickupDate: string, dropoffDate: string): number {
    const days = this.calculateRentalDays(pickupDate, dropoffDate);
    return pricePerDay * days;
  }

  // Format price with currency
  static formatPrice(amount: number): string {
    return `KES ${amount.toLocaleString()}`;
  }

  // Generate car slug for URLs
  static generateCarSlug(car: Car): string {
    return `${car.model.toLowerCase().replace(/\s+/g, '-')}-${car._id.slice(-6)}`;
  }

  // Parse car slug to get ID
  static parseCarSlug(slug: string): string {
    const parts = slug.split('-');
    return parts[parts.length - 1];
  }

  // Check if dates are valid for booking
  static validateBookingDates(pickupDate: string, dropoffDate: string): {
    isValid: boolean;
    error?: string;
  } {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pickup < today) {
      return { isValid: false, error: 'Pickup date cannot be in the past' };
    }

    if (dropoff <= pickup) {
      return { isValid: false, error: 'Drop-off date must be after pickup date' };
    }

    return { isValid: true };
  }

  // Filter cars based on criteria
  static filterCars(
    cars: Car[],
    filters: {
      category?: CategoryKey;
      search?: string;
      priceRange?: PriceFilter;
      status?: Car['status'];
    }
  ): Car[] {
    return cars.filter(car => {
      // Category filter
      if (filters.category && filters.category !== 'all') {
        const carTypeSlug = car.type.toLowerCase().replace(/\s+/g, '-');
        if (carTypeSlug !== filters.category) return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!car.model.toLowerCase().includes(searchLower) &&
            !car.type.toLowerCase().includes(searchLower) &&
            !car.location.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Price range filter
      if (filters.priceRange && filters.priceRange !== 'all') {
        switch (filters.priceRange) {
          case 'budget':
            if (car.pricePerDay > 3000) return false;
            break;
          case 'mid':
            if (car.pricePerDay <= 3000 || car.pricePerDay > 6000) return false;
            break;
          case 'premium':
            if (car.pricePerDay <= 6000) return false;
            break;
        }
      }

      // Status filter
      if (filters.status && car.status !== filters.status) {
        return false;
      }

      return true;
    });
  }

  // Sort cars based on criteria
  static sortCars(cars: Car[], sortBy: SortOption): Car[] {
    const sortedCars = [...cars];
    
    switch (sortBy) {
      case 'price-low':
        return sortedCars.sort((a, b) => a.pricePerDay - b.pricePerDay);
      case 'price-high':
        return sortedCars.sort((a, b) => b.pricePerDay - a.pricePerDay);
      case 'rating':
        return sortedCars.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'popular':
      default:
        return sortedCars.sort((a, b) => {
          // First sort by popular status, then by rating
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }
  }
}

// lib/constants/categories.ts
export const CATEGORIES = {
  all: "All Vehicles",
  "economy-cars": "Economy Cars",
  "family-suvs": "Family SUVs",
  "safari-4x4-vehicles": "Safari 4x4 Vehicles",
  "vip-luxury": "VIP Luxury",
} as const;

export const PRICE_RANGES = {
  all: "All Prices",
  budget: "Under KES 3,000",
  mid: "KES 3,000 - 6,000",
  premium: "Above KES 6,000",
} as const;

export const SORT_OPTIONS = {
  popular: "Most Popular",
  "price-low": "Price: Low to High",
  "price-high": "Price: High to Low",
  rating: "Highest Rated",
} as const;