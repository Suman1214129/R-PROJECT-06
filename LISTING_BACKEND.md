# Listing Backend Implementation

## Overview
This implementation adds full backend functionality for creating, managing, and displaying product listings in the marketplace.

## Features Implemented

### 1. **Database Schema (Firestore)**
- **Collection**: `listings`
- **Fields**:
  - `id`: Auto-generated document ID
  - `title`: Product title
  - `description`: Product description
  - `price`: Price in ALGO
  - `category`: Product category
  - `condition`: "Like New" | "Good" | "Fair"
  - `images`: Array of image URLs
  - `sellerId`: User ID of the seller
  - `tags`: Array of tags
  - `views`: Number of views (default: 0)
  - `status`: "Active" | "Paused" | "Sold"
  - `createdAt`: Timestamp

### 2. **Backend Functions** (`src/backend/firestore.ts`)
- `createListing()`: Create a new listing
- `getListingsBySeller()`: Fetch all listings for a specific user
- `getListingById()`: Get a single listing by ID
- `updateListingStatus()`: Update listing status (Active/Paused/Sold)
- `deleteListing()`: Delete a listing

### 3. **API Routes**

#### POST `/api/listings`
Create a new listing
```json
{
  "uid": "user-id",
  "title": "Product Title",
  "description": "Product description",
  "price": 100,
  "category": "electronics",
  "condition": "Like New",
  "images": ["url1", "url2"],
  "tags": ["tag1", "tag2"]
}
```

#### GET `/api/listings?uid=user-id`
Fetch all listings for a user

#### PATCH `/api/listings/[id]`
Update listing status
```json
{
  "status": "Paused"
}
```

#### DELETE `/api/listings/[id]`
Delete a listing

### 4. **Frontend Integration**

#### Create Listing Page (`/dashboard/listings/new`)
- Multi-step form (Details → Photos & Pricing → Review)
- Image upload support
- Category selection with custom category option
- Saves to Firebase on publish
- Redirects to "My Listings" after successful creation

#### My Listings Page (`/dashboard/listings`)
- Fetches user's listings from Firebase
- Displays listings in grid or list view
- Real-time stats (Active Listings, Total Views)
- Actions:
  - **Pause/Activate**: Toggle listing visibility
  - **Mark as Sold**: Mark listing as sold
  - **Delete**: Remove listing permanently
- Empty state for new users

## Usage Flow

1. **User creates a listing**:
   - Navigate to `/dashboard/listings/new`
   - Fill in product details (title, description, category, condition)
   - Upload images and set price
   - Add tags
   - Review and publish
   - Listing is saved to Firestore with user's UID

2. **View listings**:
   - Navigate to `/dashboard/listings`
   - See all your listings with stats
   - Switch between grid and list view

3. **Manage listings**:
   - Pause listings to temporarily hide them
   - Mark as sold when item is sold
   - Delete listings you no longer need

## Database Structure
```
firestore/
├── users/
│   └── {uid}/
│       ├── profile data
│       ├── savedListings/
│       └── searchHistory/
└── listings/
    └── {listingId}/
        ├── title
        ├── description
        ├── price
        ├── category
        ├── condition
        ├── images[]
        ├── sellerId
        ├── tags[]
        ├── views
        ├── status
        └── createdAt
```

## Authentication
- Uses Zustand auth store (`useAuthStore`)
- Requires user to be logged in to create listings
- User UID is automatically attached to listings

## Next Steps (Optional Enhancements)
- Add image upload to Firebase Storage
- Implement listing search and filters
- Add listing analytics (views over time)
- Enable listing editing
- Add listing expiration dates
- Implement featured listings
