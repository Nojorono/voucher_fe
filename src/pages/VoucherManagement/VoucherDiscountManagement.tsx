import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Select, Option, Typography, Card, CardBody, CardHeader } from '@material-tailwind/react';
import DataTable from 'react-data-table-component';
import { voucherService } from '../../services/voucherService';
import { VoucherRetailerDiscount, VoucherProject, CreateVoucherDiscountData } from '../../types/voucher';

const VoucherDiscountManagement: React.FC = () => {
  const [data, setData] = useState<VoucherRetailerDiscount[]>([]);
  const [projects, setProjects] = useState<VoucherProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VoucherRetailerDiscount | null>(null);

  const [formData, setFormData] = useState<CreateVoucherDiscountData>({
    discount_amount: 0,
    discount_percentage: 0,
    agen_fee: 0,
    voucher_project_id: 0
  });

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [discountsResult, projectsResult] = await Promise.all([
        voucherService.getVoucherDiscounts(),
        voucherService.getVoucherProjects()
      ]);
      console.log('Discounts loaded:', discountsResult); // Debug log
      console.log('Projects loaded:', projectsResult); // Debug log
      setData(discountsResult);
      setProjects(projectsResult);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Gagal memuat data diskon voucher');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await voucherService.updateVoucherDiscount(editingItem.id, formData);
        alert('Diskon voucher berhasil diperbarui');
      } else {
        await voucherService.createVoucherDiscount(formData);
        alert('Diskon voucher berhasil ditambahkan');
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving discount:', error);
      alert('Gagal menyimpan diskon voucher');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus diskon ini?')) {
      try {
        await voucherService.deleteVoucherDiscount(id);
        alert('Diskon voucher berhasil dihapus');
        fetchData();
      } catch (error) {
        console.error('Error deleting discount:', error);
        alert('Gagal menghapus diskon voucher');
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      discount_amount: 0,
      discount_percentage: 0,
      agen_fee: 0,
      voucher_project_id: 0
    });
    setEditingItem(null);
  };

  // Open edit modal
  const openEditModal = (item: VoucherRetailerDiscount) => {
    setEditingItem(item);
    const projectId = typeof item.voucher_project === 'object' 
      ? item.voucher_project?.id 
      : item.voucher_project || item.voucher_project_id;
    
    setFormData({
      discount_amount: item.discount_amount,
      discount_percentage: item.discount_percentage,
      agen_fee: item.agen_fee || 0,
      voucher_project_id: projectId || 0
    });
    setIsModalOpen(true);
  };

  // Get project name
  const getProjectName = (projectId?: number) => {
    console.log('Looking for project ID:', projectId); // Debug log
    console.log('Available projects:', projects); // Debug log
    if (!projectId) return 'N/A';
    const project = projects.find(p => p.id === projectId);
    console.log('Found project:', project); // Debug log
    const result = project ? project.name : 'Unknown Project';
    console.log('Returning project name:', result); // Added debug
    return result;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Columns for DataTable
  const columns = [
    {
      name: 'ID',
      selector: (row: VoucherRetailerDiscount) => row.id,
      sortable: true,
      width: '80px'
    },
    {
      name: 'Project',
      selector: (row: VoucherRetailerDiscount) => {
        const projectId = typeof row.voucher_project === 'object' 
          ? row.voucher_project?.id 
          : row.voucher_project || row.voucher_project_id;
        return getProjectName(projectId);
      },
      sortable: true,
      width: '200px',
      cell: (row: VoucherRetailerDiscount) => {
        console.log('Rendering project for row:', row); // Debug log
        const projectId = typeof row.voucher_project === 'object' 
          ? row.voucher_project?.id 
          : row.voucher_project || row.voucher_project_id;
        return getProjectName(projectId);
      }
    },
    {
      name: 'Diskon (%)',
      selector: (row: VoucherRetailerDiscount) => `${row.discount_percentage}%`,
      sortable: true,
      width: '120px'
    },
    {
      name: 'Jumlah Diskon',
      selector: (row: VoucherRetailerDiscount) => formatCurrency(row.discount_amount),
      sortable: true,
      width: '150px'
    },
    {
      name: 'Fee Agen',
      selector: (row: VoucherRetailerDiscount) => formatCurrency(row.agen_fee || 0),
      sortable: true,
      width: '150px'
    },
    {
      name: 'Tanggal Dibuat',
      selector: (row: VoucherRetailerDiscount) => new Date(row.created_at).toLocaleDateString('id-ID'),
      sortable: true,
      width: '150px'
    },
    {
      name: 'Actions',
      cell: (row: VoucherRetailerDiscount) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            color="blue"
            onClick={() => openEditModal(row)}
            className="px-3 py-1"
          >
            Edit
          </Button>
          <Button
            size="sm"
            color="red"
            onClick={() => handleDelete(row.id)}
            className="px-3 py-1"
          >
            Hapus
          </Button>
        </div>
      ),
      width: '150px'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h4" color="blue-gray">
            Pengelolaan Diskon Retailer
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Kelola diskon voucher untuk retailer berdasarkan project
          </Typography>
        </div>
        <Button 
          color="blue" 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Diskon
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <Typography color="blue-gray" className="font-medium">
              Total Diskon
            </Typography>
            <Typography variant="h4" color="blue">
              {data.length}
            </Typography>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <Typography color="blue-gray" className="font-medium">
              Total Nilai Diskon
            </Typography>
            <Typography variant="h4" color="green">
              {formatCurrency(data.reduce((sum, item) => sum + item.discount_amount, 0))}
            </Typography>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <Typography color="blue-gray" className="font-medium">
              Rata-rata Diskon
            </Typography>
            <Typography variant="h4" color="purple">
              {data.length > 0 
                ? `${(data.reduce((sum, item) => sum + item.discount_percentage, 0) / data.length).toFixed(1)}%`
                : '0%'
              }
            </Typography>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <Typography color="blue-gray" className="font-medium">
              Total Fee Agen
            </Typography>
            <Typography variant="h4" color="orange">
              {formatCurrency(data.reduce((sum, item) => sum + (item.agen_fee || 0), 0))}
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <Typography variant="h6" color="blue-gray">
            Daftar Diskon Voucher Retailer
          </Typography>
        </CardHeader>
        <CardBody className="px-0">
          <DataTable
            columns={columns}
            data={data}
            progressPending={loading}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30]}
            highlightOnHover
            striped
            responsive
            noDataComponent="Tidak ada data diskon voucher"
          />
        </CardBody>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} handler={() => setIsModalOpen(false)} size="lg">
        <DialogHeader>
          {editingItem ? 'Edit Diskon Voucher' : 'Tambah Diskon Voucher'}
        </DialogHeader>
        <DialogBody className="space-y-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Project
              </Typography>
              <Select
                value={formData.voucher_project_id?.toString() || ''}
                onChange={(value) => setFormData({...formData, voucher_project_id: parseInt(value || '0')})}
                placeholder="Pilih Project"
              >
                {projects.map((project) => (
                  <Option key={project.id} value={project.id.toString()}>
                    {project.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Persentase Diskon (%)
              </Typography>
              <Input
                type="number"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({...formData, discount_percentage: parseFloat(e.target.value) || 0})}
                placeholder="Masukkan persentase diskon"
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Jumlah Diskon (IDR)
              </Typography>
              <Input
                type="number"
                value={formData.discount_amount}
                onChange={(e) => setFormData({...formData, discount_amount: parseFloat(e.target.value) || 0})}
                placeholder="Masukkan jumlah diskon"
                min="0"
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Fee Agen (IDR)
              </Typography>
              <Input
                type="number"
                value={formData.agen_fee || 0}
                onChange={(e) => setFormData({...formData, agen_fee: parseFloat(e.target.value) || 0})}
                placeholder="Masukkan fee agen"
                min="0"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="red" onClick={() => setIsModalOpen(false)}>
            Batal
          </Button>
          <Button color="blue" onClick={handleSubmit}>
            {editingItem ? 'Perbarui' : 'Simpan'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default VoucherDiscountManagement;
