import { Schema, model, models } from 'mongoose';

const CarSchema = new Schema({
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    trim: true,
  },
  regestrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    trim: true,
    unique: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [0, 'Price must be a positive number'],
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'maintenance'],
    default: 'available',
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be a valid number'],
  },
  transmission: {
    type: String,
    required: [true, 'Transmission type is required'],
    trim: true,
  },
  fuel: {
    type: String,
    required: [true, 'Fuel type is required'],
    trim: true,
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [1, 'Seats must be at least 1'],
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  }
});

export const Car = models.Car || model('Car', CarSchema);
