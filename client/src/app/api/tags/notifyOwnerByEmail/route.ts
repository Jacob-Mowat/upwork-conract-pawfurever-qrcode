import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { MailtrapClient } from "mailtrap";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (token == "") {
        await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: {
                error: "No token was supplied!"
            }
        });
    }

    // Get our tag from the tags table using the token
    const tag = await prisma.tags.findUnique({
        where: {
            TAG_TOKEN: token as string
        }
    });

    // Get the tag_details from the tag_details table using the tag_details_id
    const tag_details = await prisma.tag_details.findUnique({
        where: {
            id: parseInt(tag?.tag_details_id?.toString() ?? "0")
        }
    });

    // Disconnect from the database
    await prisma.$disconnect();

    // Notify owner tag has been viewed/scanned

    const ENDPOINT = "https://send.api.mailtrap.io/";
    const SENDER_EMAIL = "mailtrap@qr.mowat.dev";

    // Send email to owner to notify them the tag has been viewed/scanned.
    const client = new MailtrapClient({
        endpoint: ENDPOINT,
        token: process.env.NEXT_PUBLIC_MAILTRAP_API_TOKEN as string,
    });

    const sender = { name: "Mailtrap Test", email: SENDER_EMAIL };

    client.send({
        from: sender,
        to: [{ email: tag_details?.parent_email as string || tag_details?.parent_email_additional as string }],
        subject: "Hello from Mailtrap!",
        text: "Welcome to Mailtrap Sending!",
    }).then((response) => {
        console.log(response);
        return NextResponse.json({
            status: 200,
            body: {
                notified: true,
                response_from_mailtrap: response
            }
        });
    }, console.error);

    return NextResponse.json({
        status: 200,
        body: {
            notified: false
        }
    });
};