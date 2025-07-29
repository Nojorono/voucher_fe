import React, { useState, useEffect } from 'react';
import { Card, Typography } from '@material-tailwind/react';
import { VoucherDashboardStats } from '../../types/voucher';
import { voucherService } from '../../services/voucherService';
import VoucherProjectManagement from './VoucherProjectManagement';
import VoucherLimitManagement from './VoucherLimitManagement';
import VoucherDiscountManagement from './VoucherDiscountManagement';

const VoucherManagementDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState<VoucherDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const stats = await voucherService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  const tabsData = [
    { label: 'Dashboard', value: 'dashboard', icon: '📊' },
    { label: 'Voucher Projects', value: 'projects', icon: '📋' },
    { label: 'Voucher Limits', value: 'limits', icon: '🎫' },
    { label: 'Voucher Discounts', value: 'discounts', icon: '💰' },
  ];

  const StatCard = ({ title, value, subtitle, color = 'blue', icon }: any) => (
    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100 mr-4`}>
          <div className={`text-2xl text-${color}-600`}>{icon}</div>
        </div>
        <div className="flex-1">
          <Typography variant="small" className="font-normal text-gray-600 mb-1">
            {title}
          </Typography>
          <Typography variant="h4" color="blue-gray" className="mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
          {subtitle && (
            <Typography variant="small" className="font-normal text-gray-500">
              {subtitle}
            </Typography>
          )}
        </div>
      </div>
    </Card>
  );

  const DashboardContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!dashboardStats) {
      return (
        <div className="text-center text-gray-500 py-8">
          No data available
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Projects"
            value={dashboardStats.total_projects}
            subtitle={`${dashboardStats.active_projects} active`}
            color="blue"
            icon="📋"
          />
          <StatCard
            title="Total Allocated"
            value={dashboardStats.total_allocated_vouchers}
            subtitle="vouchers"
            color="green"
            icon="🎫"
          />
          <StatCard
            title="Total Used"
            value={dashboardStats.total_used_vouchers}
            subtitle={`${dashboardStats.usage_percentage.toFixed(1)}% usage`}
            color="orange"
            icon="✅"
          />
          <StatCard
            title="Remaining"
            value={dashboardStats.total_remaining_vouchers}
            subtitle="vouchers"
            color="purple"
            icon="📦"
          />
        </div>

        {/* Charts & Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Project Status Distribution
            </Typography>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Projects</span>
                <span className="font-medium text-green-600">
                  {dashboardStats.active_projects}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inactive Projects</span>
                <span className="font-medium text-red-600">
                  {dashboardStats.inactive_projects}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm font-medium">
                  <span>Active Rate</span>
                  <span className="text-green-600">
                    {dashboardStats.total_projects > 0 
                      ? ((dashboardStats.active_projects / dashboardStats.total_projects) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Voucher Usage Overview
            </Typography>
            <div className="space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(dashboardStats.usage_percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Used: {dashboardStats.total_used_vouchers.toLocaleString()}
                </span>
                <span className="text-gray-600">
                  Total: {dashboardStats.total_allocated_vouchers.toLocaleString()}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-center">
                  <span className="text-lg font-bold text-blue-600">
                    {dashboardStats.usage_percentage.toFixed(1)}%
                  </span>
                  <div className="text-sm text-gray-600">Usage Rate</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <Typography variant="h6" color="blue-gray" className="mb-4">
            Quick Actions
          </Typography>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('projects')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Manage Projects
            </button>
            <button
              onClick={() => setActiveTab('limits')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Manage Limits
            </button>
            <button
              onClick={() => setActiveTab('discounts')}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Manage Discounts
            </button>
            <button
              onClick={fetchDashboardStats}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          Voucher Management
        </Typography>
        <Typography color="gray" className="text-lg">
          Manage voucher projects, limits, and discount configurations
        </Typography>
      </div>

      {/* Custom Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabsData.map(({ label, value, icon }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === value
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === 'dashboard' && <DashboardContent />}
        {activeTab === 'projects' && <VoucherProjectManagement />}
        {activeTab === 'limits' && <VoucherLimitManagement />}
        {activeTab === 'discounts' && <VoucherDiscountManagement />}
      </div>
    </div>
  );
};

export default VoucherManagementDashboard;
