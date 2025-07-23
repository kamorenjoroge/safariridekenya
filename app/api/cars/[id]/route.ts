// /app/api/cars/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Car } from '@/models/cars';

// GET single car by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const car = await Car.findById(id).lean();
    
    if (!car) {
      return NextResponse.json({
        success: false,
        error: 'Car not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: car
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error fetching car:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}