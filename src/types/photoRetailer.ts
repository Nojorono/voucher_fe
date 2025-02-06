export type photoRetailer = {
    id: any;
    retailer_id: number;
    retailer_name: string;
    retailer_phone_number: string
    wholesale_name: string
    retailer_address: string
    retailer_voucher_code: string
    photos: {
      image: string;
      is_verified: boolean;
      is_approved: boolean;
    }[];
  };
  