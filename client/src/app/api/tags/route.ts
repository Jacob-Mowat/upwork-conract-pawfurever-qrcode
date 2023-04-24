import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

BigInt.prototype.toJSON = function() { return this.toString() };

export async function POST(request: Request) {
    const { numOfTagsToGenerate } = await request.json();

    var tags: any = [];
    
    for (let i = 0; i < numOfTagsToGenerate; i++) {
        // Create a new tag
        const tag = await prisma.tags.create({
            data: {}
        });

        console.log(tag);

        tags = [...tags, tag];
    }

    // Disconnect from the database
    await prisma.$disconnect();

    return NextResponse.json({
        status:200,
        body: {
            tags: tags
        }
    });
}

export async function GET(request: Request) {
    const  { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    try {
        const tag = await prisma.tags.findUnique({
            where: {
                TAG_TOKEN: token as string
            }
        });
    
        // Disconnect from the database
        await prisma.$disconnect();
    
        return NextResponse.json({
            status: 200,
            body: {
                tag: tag
            }
        });
    } catch (error) {
        // Disconnect from the database
        await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: error
        });
    }
}


  