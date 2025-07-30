import { stagingURL } from '../utils/API';
import { 
  VoucherProject, 
  VoucherLimit, 
  VoucherRetailerDiscount, 
  VoucherDashboardStats,
  CreateVoucherProjectData,
  CreateVoucherLimitData,
  CreateVoucherDiscountData,
} from '../types/voucher';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const voucherService = {
  // Dashboard
  getDashboardStats: async (): Promise<VoucherDashboardStats> => {
    const response = await fetch(`${stagingURL}/api/voucher-projects/dashboard/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  // VoucherProject CRUD
  getVoucherProjects: async (): Promise<VoucherProject[]> => {
    const response = await fetch(`${stagingURL}/api/voucher-projects/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch voucher projects');
    const result = await response.json();
    return Array.isArray(result) ? result : result.results || [];
  },

  getVoucherProject: async (id: number): Promise<VoucherProject> => {
    const response = await fetch(`${stagingURL}/api/voucher-projects/${id}/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch voucher project');
    return response.json();
  },

  createVoucherProject: async (data: CreateVoucherProjectData): Promise<VoucherProject> => {
    const response = await fetch(`${stagingURL}/api/voucher-projects/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create voucher project');
    return response.json();
  },

  updateVoucherProject: async (id: number, data: Partial<CreateVoucherProjectData>): Promise<VoucherProject> => {
    const response = await fetch(`${stagingURL}/api/voucher-projects/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update voucher project');
    return response.json();
  },

  deleteVoucherProject: async (id: number): Promise<boolean> => {
    const response = await fetch(`${stagingURL}/api/voucher-projects/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.ok;
  },

  toggleProjectStatus: async (id: number): Promise<{ message: string; is_active: boolean }> => {
    const response = await fetch(`${stagingURL}/api/voucher-projects/${id}/toggle_status/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to toggle project status');
    return response.json();
  },

  getActiveProjects: async (): Promise<VoucherProject[]> => {
    const response = await fetch(`${stagingURL}/api/voucher-projects/active/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch active projects');
    const result = await response.json();
    return result.results || [];
  },

  // VoucherLimit CRUD
  getVoucherLimits: async (): Promise<VoucherLimit[]> => {
    const response = await fetch(`${stagingURL}/api/voucherlimit/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch voucher limits');
    const result = await response.json();
    return Array.isArray(result) ? result : result.results || [];
  },

  getVoucherLimit: async (id: number): Promise<VoucherLimit> => {
    const response = await fetch(`${stagingURL}/api/voucherlimit/${id}/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch voucher limit');
    return response.json();
  },

  createVoucherLimit: async (data: CreateVoucherLimitData): Promise<VoucherLimit> => {
    const response = await fetch(`${stagingURL}/api/voucherlimit/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create voucher limit');
    return response.json();
  },

  updateVoucherLimit: async (id: number, data: Partial<CreateVoucherLimitData>): Promise<VoucherLimit> => {
    const response = await fetch(`${stagingURL}/api/voucherlimit/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update voucher limit');
    return response.json();
  },

  deleteVoucherLimit: async (id: number): Promise<boolean> => {
    const response = await fetch(`${stagingURL}/api/voucherlimit/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.ok;
  },

  incrementVoucherLimit: async (id: number, increment: number): Promise<any> => {
    const response = await fetch(`${stagingURL}/api/voucherlimit/${id}/increment/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ increment }),
    });
    if (!response.ok) throw new Error('Failed to increment voucher limit');
    return response.json();
  },

  getVoucherLimitSummary: async (): Promise<any> => {
    const response = await fetch(`${stagingURL}/api/voucherlimit/summary/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch voucher limit summary');
    return response.json();
  },

  // VoucherRetailerDiscount CRUD
  getVoucherDiscounts: async (): Promise<VoucherRetailerDiscount[]> => {
    const response = await fetch(`${stagingURL}/api/voucher-discounts/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch voucher discounts');
    const result = await response.json();
    return Array.isArray(result) ? result : result.results || [];
  },

  getVoucherDiscount: async (id: number): Promise<VoucherRetailerDiscount> => {
    const response = await fetch(`${stagingURL}/api/voucher-discounts/${id}/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch voucher discount');
    return response.json();
  },

  createVoucherDiscount: async (data: CreateVoucherDiscountData): Promise<VoucherRetailerDiscount> => {
    const response = await fetch(`${stagingURL}/api/voucher-discounts/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create voucher discount');
    return response.json();
  },

  updateVoucherDiscount: async (id: number, data: Partial<CreateVoucherDiscountData>): Promise<VoucherRetailerDiscount> => {
    const response = await fetch(`${stagingURL}/api/voucher-discounts/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update voucher discount');
    return response.json();
  },

  deleteVoucherDiscount: async (id: number): Promise<boolean> => {
    const response = await fetch(`${stagingURL}/api/voucher-discounts/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.ok;
  },

  getVoucherDiscountSummary: async (): Promise<any> => {
    const response = await fetch(`${stagingURL}/api/voucher-discounts/summary/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch voucher discount summary');
    return response.json();
  },

  getDiscountsByProject: async (projectId: number): Promise<any> => {
    const response = await fetch(`${stagingURL}/api/voucher-discounts/by_project/?project_id=${projectId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch discounts by project');
    return response.json();
  },

  getDiscountsByVoucherCode: async (voucherCode: string): Promise<any> => {
    const response = await fetch(`${stagingURL}/api/voucher-discounts/by_voucher/?voucher_code=${encodeURIComponent(voucherCode)}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch discounts by voucher');
    return response.json();
  },
};
