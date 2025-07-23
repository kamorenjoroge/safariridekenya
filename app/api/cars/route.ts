// /app/api/cars/route.ts
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import dbConnect from '@/lib/dbConnect';
import { Car } from '@/models/cars';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const formData = await request.formData();

    const model = formData.get('model')?.toString() || '';
    const type = formData.get('type')?.toString() || '';
    const regestrationNumber = formData.get('regestrationNumber')?.toString() || '';
    const location = formData.get('location')?.toString() || '';
    const pricePerDay = parseFloat(formData.get('pricePerDay')?.toString() || '');
    const status = formData.get('status')?.toString() || 'available';
    const year = parseInt(formData.get('year')?.toString() || '');
    const transmission = formData.get('transmission')?.toString() || '';
    const fuel = formData.get('fuel')?.toString() || '';
    const seats = parseInt(formData.get('seats')?.toString() || '');
    const imageFile = formData.get('image') as File | null;

    // Validate required fields
    if (
      !model || !type || !regestrationNumber || !location ||
      isNaN(pricePerDay) || isNaN(year) || !transmission ||
      !fuel || isNaN(seats)
    ) {
      return NextResponse.json({
        success: false,
        error: 'Missing or invalid required fields.'
      }, { status: 400 });
    }

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({
        success: false,
        error: 'Image is required'
      }, { status: 400 });
    }

    const buffer = await imageFile.arrayBuffer();
    const array = new Uint8Array(buffer);

    const imageUrl = await new Promise<string>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'cars',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error || !result) {
            console.error('Cloudinary upload error:', error);
            reject(error || new Error('Image upload failed'));
            return;
          }
          resolve(result.secure_url);
        }
      ).end(array);
    });

    const newCar = await Car.create({
      model,
      type,
      regestrationNumber,
      location,
      pricePerDay,
      status,
      year,
      transmission,
      fuel,
      seats,
      image: imageUrl
    });

    return NextResponse.json({
      success: true,
      data: newCar
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating car:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const cars = await Car.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: cars
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error fetching cars:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
