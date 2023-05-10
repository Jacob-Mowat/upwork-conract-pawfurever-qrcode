import { TagDetailsType, TagType } from "@/src/models/types";
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
        <div className="relative my-1 flex w-full flex-col border border-lightest-purple bg-cream p-2 md:w-[85%] md:flex-row lg:w-[65%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={
                    (tag_details.photo_url as string) ||
                    "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
                }
                alt="Pet Photo"
                className="h-[200px] w-[200px] border-spacing-0 place-self-center overflow-hidden rounded-full border-2 border-dashed border-lightest-purple object-cover p-2 md:h-[175px] md:w-[175px] lg:h-[250px] lg:w-[250px]"
            />

            <div className="flex flex-col p-2 md:ml-8 md:align-middle">
                <h1 className="text-center text-3xl md:text-left md:align-middle">
                    {tag_details.name}
                </h1>
                <p className="text-lg md:align-middle">
                    {tag_details.parent_street_address}
                    <br />
                    {tag_details.parent_apt_suite_unit}
                    <br />
                    {tag_details.parent_city}
                    <br />
                    {tag_details.parent_state}
                    <br />
                    {tag_details.parent_zipcode}
                </p>
            </div>

            <div className="absolute bottom-0 right-0 justify-between p-2">
                <Link
                    className="p-2 underline hover:bg-lightest-purple"
                    href={`/view/${tag.TAG_TOKEN}`}
                >
                    <span className="text-2xl">View</span>
                </Link>
                <Link
                    className="p-2 underline hover:bg-lightest-purple"
                    href={`/edit/${tag.TAG_TOKEN}`}
                >
                    <span className="text-2xl">Edit</span>
                </Link>
            </div>
        </div>
    );
};
