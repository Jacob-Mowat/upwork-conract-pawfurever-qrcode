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

    name: String;
    photo_url: String;
    bio: String;
    birthday: Datetime;
    breed: String;
    gender: String;
    microchip_number: String;
    neutered_spayed: Boolean;
    behaviour: String;
    allergies: String;

    uses_owners_information: Boolean;
    parent_name: String;
    parent_phone_number: String;
    parent_phone_number_additional_1: String;
    parent_phone_number_additional_2: String;
    parent_email: String;
    parent_email_additional: String;
    parent_street_address: String;
    parent_apt_suite_unit: String;
    parent_city: String;
    parent_state: String;
    parent_zipcode: String;

    tag: TagType;
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
    name: String;
    phone_number: String;
    phone_number_additional_1: String;
    phone_number_additional_2: String;
    email: String;
    email_additional: String;
    street_address: String;
    apt_suite_unit: String;
    city: String;
    state: String;
    zipcode: String;

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