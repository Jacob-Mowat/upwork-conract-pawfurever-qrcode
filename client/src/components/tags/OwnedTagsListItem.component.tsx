import { TagDetailsType, TagType } from "@/src/app/models/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface OwnedTagsListItemProps {
    tag: TagType;
    tag_details: TagDetailsType;
}

export const OwnedTagsListItem = ({
    tag,
    tag_details,
}: OwnedTagsListItemProps) => {
    const router = useRouter();
    return (
        <div className="flex flex-col md:flex-row w-full relative bg-cream border border-lightest-purple p-2 my-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={
                    (tag_details.pets_photo_url as string) ||
                    "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
                }
                alt="Pet Photo"
                className="p-2 w-[200px] h-[200px] md:w-[175px] md:h-[175px] lg:w-[250px] lg:h-[250px] place-self-center overflow-hidden rounded-full border-2 border-spacing-0 border-dashed border-lightest-purple"
            />

            <div className="p-2">
                <h1 className="text-welcomeCustom text-center">
                    {tag_details.pets_name}
                </h1>
                <p className="">
                    {tag_details.tag_address_line1}
                    <br />
                    {tag_details.tag_address_line2}
                    <br />
                    {tag_details.tag_address_zip}
                </p>
            </div>

            <div className="absolute bottom-0 right-0 p-2 justify-between">
                <Link
                    className="underline p-2 hover:bg-lightest-purple"
                    href={`/view/${tag.TAG_TOKEN}`}
                >
                    <span>View</span>
                </Link>
                <Link
                    className="underline p-2 hover:bg-lightest-purple"
                    href={`/edit/${tag.TAG_TOKEN}`}
                >
                    <span>Edit</span>
                </Link>
            </div>
        </div>
    );
};
