import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: "eu-central-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
    },
    endpoint: process.env.AWS_ENDPOINT || "https://s3.eu-central-1.amazonaws.com"
});