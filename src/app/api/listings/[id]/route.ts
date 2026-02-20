import { NextRequest, NextResponse } from "next/server";
import { updateListingStatus, deleteListing } from "@/backend/firestore";

export async function PATCH(
     request: NextRequest,
     { params }: { params: Promise<{ id: string }> }
) {
     try {
          const { id } = await params;
          const body = await request.json();
          const { status } = body;

          if (!status || !["Active", "Paused", "Sold"].includes(status)) {
               return NextResponse.json(
                    { error: "Invalid status" },
                    { status: 400 }
               );
          }

          await updateListingStatus(id, status);
          return NextResponse.json({ success: true }, { status: 200 });
     } catch (error) {
          console.error("Error updating listing:", error);
          return NextResponse.json(
               { error: "Failed to update listing" },
               { status: 500 }
          );
     }
}

export async function DELETE(
     request: NextRequest,
     { params }: { params: Promise<{ id: string }> }
) {
     try {
          const { id } = await params;
          await deleteListing(id);
          return NextResponse.json({ success: true }, { status: 200 });
     } catch (error) {
          console.error("Error deleting listing:", error);
          return NextResponse.json(
               { error: "Failed to delete listing" },
               { status: 500 }
          );
     }
}
