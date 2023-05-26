import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { MailtrapClient } from "mailtrap";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Log the token and uID
    console.log("[notifyOwnerByEmail] token: ", token);

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
    const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL as string;

    // Send email to owner to notify them the tag has been viewed/scanned.
    const client = new MailtrapClient({
        endpoint: ENDPOINT,
        token: process.env.NEXT_PUBLIC_MAILTRAP_API_TOKEN as string,
    });

    const sender = { name: "PawFurEver QR Tag", email: SENDER_EMAIL };

    if (tag_details?.parent_email == "" && tag_details?.parent_email_additional == "") {
        // Log the error
        console.log("[notifyOwnerByEmail] No email address to notify!");

        return NextResponse.json({
            status: 500,
            body: {
                notified: false,
                response_from_mailtrap: "No email address to notify!"
            }
        });
    }

    if (tag_details?.parent_email != "" && tag_details?.parent_email_additional == "") {
        // Log that we are sending an email to the owner
        console.log("[notifyOwnerByEmail] Sending email to: ", tag_details?.parent_email);

        client.send({
            from: sender,
            to: [{ email: tag_details?.parent_email as string }],
            subject: `${tag_details?.name} has been viewed/scanned!`,
            text: `
                Hello ${tag_details?.name}'s qr tag has been viewed/scanned!

                You can view the details of ${tag_details?.name} by clicking the link below:
                ${process.env.DOMAIN_ADDRESS}view/${tag?.TAG_TOKEN}

                If you wish to edit the details of ${tag_details?.name} you can do so by clicking the link below:
                ${process.env.DOMAIN_ADDRESS}edit/${tag?.TAG_TOKEN}

                Thank you for using QR Pet Tags!

                - QR Pet Tags

                This is an automated message, please do not reply to this email.
            `
        }).then((response) => {
            console.log(response);
            return NextResponse.json({
                status: 200,
                body: {
                    notified: true,
                    response_from_mailtrap: response
                }
            });
        }, (error) => {
            console.log(error);
            return NextResponse.json({
                status: 200,
                body: {
                    notified: false,
                    response_from_mailtrap: error
                }
            });
        });
    } else {
        if (tag_details?.parent_email == tag_details?.parent_email_additional) {
            // Send to just the parent email
            // Log that we are sending an email to the owner
            console.log("[notifyOwnerByEmail] Sending email to: ", tag_details?.parent_email);
    
            client.send({
                from: sender,
                to: [{ email: tag_details?.parent_email as string }],
                subject: `${tag_details?.name} has been viewed/scanned!`,
                text: `
                    Hello ${tag_details?.name}'s qr tag has been viewed/scanned!
    
                    You can view the details of ${tag_details?.name} by clicking the link below:
                    ${process.env.DOMAIN_ADDRESS}view/${tag?.TAG_TOKEN}
    
                    If you wish to edit the details of ${tag_details?.name} you can do so by clicking the link below:
                    ${process.env.DOMAIN_ADDRESS}edit/${tag?.TAG_TOKEN}
    
                    Thank you for using QR Pet Tags!
    
                    - QR Pet Tags
    
                    This is an automated message, please do not reply to this email.
                `
            }).then((response) => {
                console.log(response);
                return NextResponse.json({
                    status: 200,
                    body: {
                        notified: true,
                        response_from_mailtrap: response
                    }
                });
            }, (error) => {
                console.log(error);
                return NextResponse.json({
                    status: 200,
                    body: {
                        notified: false,
                        response_from_mailtrap: error
                    }
                });
            });
        } else if (tag_details?.parent_email != "" && tag_details?.parent_email_additional != "" && (tag_details?.parent_email != tag_details?.parent_email_additional)) {
            // Log that we are sending an email to the owner
            console.log("[notifyOwnerByEmail] Sending email to: ", tag_details?.parent_email);
            console.log("[notifyOwnerByEmail] Sending email to: ", tag_details?.parent_email_additional);
    
            client.send({
                from: sender,
                to: [{ email: tag_details?.parent_email as string }, { email: tag_details?.parent_email_additional as string }],
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
            }, (error) => {
                console.log(error);
                return NextResponse.json({
                    status: 200,
                    body: {
                        notified: false,
                        response_from_mailtrap: error
                    }
                });
            });
        }
    }

};