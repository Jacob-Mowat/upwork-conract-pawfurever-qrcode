export interface TagType {
    id: String;
    registered: Boolean;
    created_at: String;
    TAG_TOKEN: String;
    setup_key: String;
    owner_id: Number;
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
    owner_phone_number: String;
    owner_address_line1: String;
    owner_address_line2: String;    
    owner_address_zip: String;
    owner: OwnerType;
}