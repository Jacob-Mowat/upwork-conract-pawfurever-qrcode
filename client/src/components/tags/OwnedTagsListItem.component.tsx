import { TagDetailsType, TagType } from "@/src/app/models/types";
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
        <div>
            <h1
                className="hover:bg-purple"
                onClick={(e) => {
                    router.push(`/?token=${tag.TAG_TOKEN}`);
                }}
            >
                {tag_details.pets_name}
            </h1>
        </div>
    );
};
