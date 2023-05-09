"use client";

import { LoadingSpinner } from "@/src/components/LoadingSpinner.component";
import { useEffect, useState } from "react";
import { OwnerType, TagType } from "../../../models/types";
import { Navbar } from "@/src/components/NavBar.component";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import TagSetupKeyView from "@/src/components/tags/TagSetupKeyView.component";
import OwnerAddDetailsView from "@/src/components/owner/OwnerAddDetailsView.component";
import TagAddDetailsView from "@/src/components/tags/TagAddDetailsView.component";
import { useRouter } from "next/navigation";

export default function SetupView({ params }: { params: { token: string } }) {
  const [owner, setOwner] = useState<OwnerType>();
  const [tag, setTag] = useState<TagType>();

  const clerkAuth = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkOwnerExistsAndRetrieve = async (user_id: string) => {
      const request = await fetch(`/api/owners/byUserId?uID=${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await request.json();

      console.log(response);

      return response;
    };

    const createNewOwner = async (user_id: string) => {
      const request = await fetch(`/api/owners/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
        }),
      });

      const response = await request.json();

      console.log(response);

      return response;
    };

    const getTagData = async (token: string) => {
      const request = await fetch(`/api/tags?token=${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await request.json();

      console.log(response);

      return response;
    };

    if (clerkAuth.user) {
      if (!owner) {
        checkOwnerExistsAndRetrieve(clerkAuth.user.id).then((data) => {
          if (data.status === 500 && data.body.error === "No Owner found") {
            // Send request to create owner
            createNewOwner(clerkAuth.user.id).then((data) => {
              if (data.status === 200) {
                setOwner(data.body.owner);
              } else {
                return;
              }
            });
          } else {
            setOwner(data.body.owner);
          }
        });
      } else {
        if (owner.owner_details_id != null) {
          // show tag setup key view
          router.push(`/verify-setup-key/${params.token}`);
        } else {
          // show owner add details view
          router.push(`/create/owner_details/${params.token}/${owner.id}`);
        }

        console.log("Owner is set");
      }
    }

    if (!tag) {
      getTagData(params.token).then((data) => {
        if (data.status === 200) {
          if (data.body.tag.registered) {
            router.push(`/create/tag_details/${data.body.tag.TAG_TOKEN}`);
          }

          setTag(data.body.tag);
        } else {
          return;
        }
      });
    } else {
      console.log("Tag is set");
    }
  }, [clerkAuth, owner, params, router, tag]);

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-64px)] items-center justify-center overflow-auto">
        <div className="text-center">
          <div>
            {owner == null || tag == null ? (
              <LoadingSpinner display_text="Loading Owner & Tag data..." />
            ) : (
              <>
                <SignedIn>
                  <LoadingSpinner display_text="Checking data..." />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
