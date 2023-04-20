import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

BigInt.prototype.toJSON = function() { return this.toString() };

export async function POST(request: Request) {
    const { user_id } = await request.json();
    
    try {
        // Create the owner if it doesn't exist
        const owner = await prisma.owners.create({
            data: {
                user_id: user_id
            }
        });

        console.log(`Creating new user with user_id: ${owner.user_id}`);

        await prisma.$disconnect();

        return NextResponse.json({
            status: 200,
            body: owner,
        });

    } catch (error) {
        await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: error,
        });
    }
}
  
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

    if (!owner) {
        await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: {
                error: "No Owner found"
            }
        })
    } else {
        console.log(`Found user with user_id: ${owner.user_id}`);

        await prisma.$disconnect();

        return NextResponse.json({
            status: 200, 
            body: {
                owner: owner
            }
        });
    }
};