import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

BigInt.prototype.toJSON = function() { return this.toString() };

export async function GET(request: Request) {
    const  { searchParams } = new URL(request.url);
    const uID = searchParams.get('uID');

    // First get the owner
    const owner = await prisma.owners.findUnique({
        where: {
            user_id: uID as string
        }
    });

    if (owner == null) {
        return NextResponse.json({
            status: 404,
            body: {
                message: "Owner not found"
            }
        });
    }

    // Get all tags that are registered and owned by the owner
    const tags = await prisma.tags.findMany({
        where: {
            registered: true,
            owner_id: owner.id
        }
    });

    const tagDetailsIDs: number[] = tags.filter(tag => tag.tag_details_id).map(tag => tag.tag_details_id);

    // Get all the tag_details for the tags
    const tag_details = await prisma.tag_details.findMany({
        where: {
            id: {
                in: [...tagDetailsIDs]
            }
        }
    });

    return NextResponse.json({
        status:200,
        body: {
            tags: tags,
            tag_details: tag_details
        }
    });
};



  