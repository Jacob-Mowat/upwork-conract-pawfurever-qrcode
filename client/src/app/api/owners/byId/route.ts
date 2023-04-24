import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const  { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id == "") {
        await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: {
                error: "No owner ID | id wasn't supplied!"
            }
        });
    }

    const owner = await prisma.owners.findUnique({
        where: { id: parseInt(id as string) },
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
        console.log(`Found owner with ID: ${owner.user_id}`);
        return NextResponse.json({
            status: 200, 
            body: {
                owner: owner
            }
        });
    }
};