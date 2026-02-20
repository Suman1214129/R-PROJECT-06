import { NextRequest, NextResponse } from "next/server";
import { createListing, getListingsBySeller } from "@/backend/firestore";

export async function POST(request: NextRequest) {
     try {
          const body = await request.json();
          const { uid, title, description, price, category, condition, images, tags } = body;

          if (!uid || !title || !price || !category || !condition) {
               return NextResponse.json(
                    { error: "Missing required fields" },
                    { status: 400 }
               );
          }

          const listingId = await createListing(uid, {
               title,
               description: description || "",
               price: parseFloat(price),
               category,
               condition,
               images: images || [],
               tags: tags || [],
          });

          return NextResponse.json({ success: true, listingId }, { status: 201 });
     } catch (error) {
          console.error("Error creating listing:", error);
          return NextResponse.json(
               { error: "Failed to create listing" },
               { status: 500 }
          );
     }
}

export async function GET(request: NextRequest) {
     try {
          const { searchParams } = new URL(request.url);
          const uid = searchParams.get("uid");

          if (!uid) {
               return NextResponse.json(
                    { error: "User ID is required" },
                    { status: 400 }
               );
          }

          const listings = await getListingsBySeller(uid);
          return NextResponse.json({ listings }, { status: 200 });
     } catch (error) {
          console.error("Error fetching listings:", error);
          return NextResponse.json(
               { error: "Failed to fetch listings" },
               { status: 500 }
          );
     }
}
