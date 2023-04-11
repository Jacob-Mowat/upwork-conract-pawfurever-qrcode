import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { email } = await request.json();

    // await prisma.$connect();
    
    try {
        // Create the owner if it doesn't exist
        const owner = await prisma.owners.upsert({
            where: { email: email as string | "" },
            update: {},
            create: {
                email: email,
            }
        });

        // await prisma.$disconnect();

        return NextResponse.json({
            status: 200,
            body: owner,
        });

    } catch (error) {
        // await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: error,
        });
    }
  }
  