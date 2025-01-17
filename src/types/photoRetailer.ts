export type photoRetailer = {
    retailer_id: number;
    retailer_name: string;
    retailer_phone_number: string
    retailer_address: string
    photos: {
      image: string;
      is_verified: boolean;
      is_approved: boolean;
    }[];
  };
  