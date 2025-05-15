import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/lib/models/Contact';
import { FilterQuery } from 'mongoose';
import { Contact as ContactType } from '@/types/contact';
import { MongoError } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Basic search query
    const query = searchParams.get('query') || '';
    
    // Status filter
    const status = searchParams.get('status');
    
    // Tags filter (multiple tags supported)
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    
    // Company filter
    const company = searchParams.get('company');
    
    // Job title filter
    const jobTitle = searchParams.get('jobTitle');
    
    // Location filters
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const country = searchParams.get('country');
    
    // Date range filters
    const createdAfter = searchParams.get('createdAfter');
    const createdBefore = searchParams.get('createdBefore');
    
    // Sorting
    const sortField = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    await dbConnect();

    const filterQuery: FilterQuery<ContactType> = {};

    // Text search across multiple fields
    if (query) {
      filterQuery.$or = [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { jobTitle: { $regex: query, $options: 'i' } },
        { notes: { $regex: query, $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      filterQuery.status = status;
    }

    // Tags filter (matches any of the provided tags)
    if (tags && tags.length > 0) {
      filterQuery.tags = { $in: tags };
    }

    // Company filter
    if (company) {
      filterQuery.company = { $regex: company, $options: 'i' };
    }

    // Job title filter
    if (jobTitle) {
      filterQuery.jobTitle = { $regex: jobTitle, $options: 'i' };
    }

    // Location filters using dot notation for nested fields
    if (city) {
      filterQuery['address.city'] = { $regex: city, $options: 'i' };
    }
    if (state) {
      filterQuery['address.state'] = { $regex: state, $options: 'i' };
    }
    if (country) {
      filterQuery['address.country'] = { $regex: country, $options: 'i' };
    }

    // Date range filters
    if (createdAfter || createdBefore) {
      filterQuery.createdAt = {};
      if (createdAfter) filterQuery.createdAt.$gte = new Date(createdAfter);
      if (createdBefore) filterQuery.createdAt.$lte = new Date(createdBefore);
    }

    // Get total count for pagination
    const total = await Contact.countDocuments(filterQuery);

    // Execute query with sorting and pagination
    const contacts = await Contact.find(filterQuery)
      .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    // Return response with pagination metadata
    return NextResponse.json({
      contacts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + contacts.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const contact = await Contact.create(body);
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    if (error instanceof MongoError && error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 