export interface TagType {
    id: String;
    registered: Boolean;
    created_at: String;
    TAG_TOKEN: String;
    setup_key: String;
    owner_id: String;
    tag_details_id: String;
};

export interface TagDetailsType {   
    id: String;
    created_at: String;
    pets_information: String;
    pets_name: String;
    pets_photo_url: String;
    tag_owners_name: String;
    tag_email: String;
    tag_address_line1: String;
    tag_address_line2: String;
    tag_address_zip: String;
    tag_phone_number: String;
    tag_phone_number2: String;
    uses_owners_information: Boolean;
};

export interface OwnerType {
    id: String;
    created_at: String;
    user_id: String;
    admin_flag: Boolean;
    owner_details_id: String;
    tags: TagType[];
};

export interface OwnerDetailsType {
    id: String;
    created_at: String;
    owner_firstname: String;
    owner_lastname: String;
    owner_email: String;
    owner_phone_number: String;
    owner_phone_number2: String;
    owner_address_line1: String;
    owner_address_line2: String;    
    owner_address_zip: String;
    owner: OwnerType;
}

export interface ZipDownloadUrlsType {
    id: String;
    created_at: String;
    zip_file_name: String;
    zip_file_url: String;
    num_of_tags: Number;

    // tags: TagType[];
}