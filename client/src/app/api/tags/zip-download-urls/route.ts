import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BigIntProto = BigInt.prototype as any;
BigIntProto.toJSON = function () {
    // return Number(this);
    return this.toString();
};

export async function GET(request: Request) {
    // const  { searchParams } = new URL(request.url);
    // const uID = searchParams.get('uID');

    // Log that we got a request to get all zip_download_urls
    console.log("[getZipDownloadURLs] Got a request to get all zip_download_urls");

    // Get all zip_download_urls from the database descending by created_at
    const zip_download_urls = await prisma.zip_download_urls.findMany(
        {
            orderBy: {
                created_at: "desc"
            }
        }
    );

    console.log(zip_download_urls);

    // Disconnect from the database
    await prisma.$disconnect();

    return NextResponse.json({
        status: 200,
        body: {
            zip_download_urls: zip_download_urls
        }
    });
};