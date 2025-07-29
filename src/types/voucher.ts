export interface VoucherProject {
  id: number;
  name: string;
  description?: string;
  periode_start?: string;
  periode_end?: string;
  is_active: boolean;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  voucher_limits?: VoucherLimit[];
  total_allocated?: number;
  total_used?: number;
}

export interface VoucherLimit {
  id: number;
  description?: string;
  limit: number;
  current_count: number;
  remaining?: number;
  percentage_used?: number;
  voucher_project?: number; // API returns project ID as number
  voucher_project_id?: number;
  voucher_project_name?: string;
  created_at: string;
}

export interface VoucherRetailerDiscount {
  id: number;
  discount_amount: number;
  discount_percentage: number;
  agen_fee?: number;
  total_discount?: {
    discount_amount: number;
    discount_percentage: number;
    agen_fee: number;
  };
  voucher_project?: VoucherProject | number; // Can be object or ID number
  voucher_project_id?: number;
  voucher_project_name?: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface VoucherDashboardStats {
  total_projects: number;
  active_projects: number;
  inactive_projects: number;
  total_allocated_vouchers: number;
  total_used_vouchers: number;
  total_remaining_vouchers: number;
  usage_percentage: number;
}

export interface VoucherLimitUpdateData {
  increment: number;
}

export interface CreateVoucherProjectData {
  name: string;
  description?: string;
  periode_start?: string;
  periode_end?: string;
  is_active?: boolean;
}

export interface CreateVoucherLimitData {
  description?: string;
  limit: number;
  current_count?: number;
  voucher_project_id?: number;
}

export interface CreateVoucherDiscountData {
  discount_amount: number;
  discount_percentage: number;
  agen_fee?: number;
  voucher_project_id?: number;
}
