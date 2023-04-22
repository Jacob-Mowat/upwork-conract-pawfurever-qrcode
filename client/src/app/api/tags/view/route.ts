import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const  { searchParams } = new URL(request.url);
    const tagID = searchParams.get('tagID');

    // Get our tag from the tags table using the token
    const tag = await prisma.tags.findUnique({
        where: {
            id: parseInt(tagID?.toString() ?? "0")
        }
    });

    // Get the tag_details from the tag_details table using the tag_details_id
    const tag_details = await prisma.tag_details.findUnique({
        where: {
            id: parseInt(tag?.tag_details_id?.toString() ?? "0")
        }
    });

    // Get the owner from the owners table using the owner_id
    const owner = await prisma.owners.findUnique({
        where: {
            id: parseInt(tag?.owner_id?.toString() ?? "0")
        }
    });

    // Get the owner_details from the owner_details table using the owner_details_id
    const owner_details = await prisma.owner_details.findUnique({
        where: {
            id: parseInt(owner?.owner_details_id?.toString() ?? "0")
        }
    });

    // Disconnect from the database
    await prisma.$disconnect();

    return NextResponse.json({
        status:200,
        body: {
            tag: tag,
            tag_details: tag_details,
            owner: owner,
            owner_details: owner_details
        }
    });
};