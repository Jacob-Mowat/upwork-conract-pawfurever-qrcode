import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const  { searchParams } = new URL(request.url);
    const user_id = searchParams.get('uID');

    if (user_id == "") {
        await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: {
                error: "No user_id | uID was supplied!"
            }
        });
    }

    const owner = await prisma.owners.findUnique({
        where: { user_id: user_id as string },
        include: {
            tags: true
        }
    });

    // Disconnect from the database
    await prisma.$disconnect();

    if (!owner) {
        return NextResponse.json({
            status: 500,
            body: {
                error: "No Owner found"
            }
        })
    } else {
        console.log(`Found owner with user_id: ${owner.user_id}`);
        return NextResponse.json({
            status: 200, 
            body: {
                owner: owner
            }
        });
    }
};