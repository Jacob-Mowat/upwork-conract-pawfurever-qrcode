import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BigIntProto = BigInt.prototype as any;
BigIntProto.toJSON = function () {
    // return Number(this);
    return this.toString();
};

export async function POST(request: Request) {
    const { numOfTagsToGenerate } = await request.json();

    var tags: any = [];

    // Create numOfTagsToGenerate number of tags and add them to the tags array
    const tagsData = Array.from({length: numOfTagsToGenerate}).map(() => ({}));
    console.log(tagsData);

    const tagsCreated = await prisma.$transaction(
        tagsData.map((tag) => prisma.tags.create({ data: tag }))
    );

    console.log("tagsCreated", tagsCreated);

    // Disconnect from the database
    await prisma.$disconnect();

    return NextResponse.json({
        status:200,
        body: {
            tags: tagsCreated
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


  