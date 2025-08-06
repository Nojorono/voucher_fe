import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Textarea, Typography, Switch } from '@material-tailwind/react';
import DataTable from 'react-data-table-component';
import { voucherService } from '../../services/voucherService';
import { VoucherProject } from '../../types/voucher';

const VoucherProjectManagement: React.FC = () => {
  const [data, setData] = useState<VoucherProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<VoucherProject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    periode_start: '',
    periode_end: '',
    is_active: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const projects = await voucherService.getVoucherProjects();
      setData(projects);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      periode_start: '',
      periode_end: '',
      is_active: true,
    });
    setOpenModal(true);
  };

  const handleEdit = (item: VoucherProject) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      periode_start: item.periode_start ? item.periode_start.split('T')[0] : '',
      periode_end: item.periode_end ? item.periode_end.split('T')[0] : '',
      is_active: item.is_active,
    });
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        periode_start: formData.periode_start || undefined,
        periode_end: formData.periode_end || undefined,
        is_active: formData.is_active,
      };

      if (editingItem) {
        await voucherService.updateVoucherProject(editingItem.id, payload);
        alert('Project berhasil diupdate!');
      } else {
        await voucherService.createVoucherProject(payload);
        alert('Project berhasil ditambahkan!');
      }

      setOpenModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus project ini?')) {
      try {
        await voucherService.deleteVoucherProject(id);
        alert('Project berhasil dihapus!');
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
        alert('Error deleting data');
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await voucherService.toggleProjectStatus(id);
      alert('Status project berhasil diubah!');
      fetchData();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Error toggling status');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const columns = [
    {
      name: 'Project Name',
      selector: (row: VoucherProject) => row.name,
      sortable: true,
      cell: (row: VoucherProject) => (
        <div className="py-2">
          <div className="font-medium text-gray-900">{row.name}</div>
          {row.description && (
            <div className="text-sm text-gray-500 break-words whitespace-pre-line max-w-xs">
              {row.description}
            </div>
          )}
        </div>
      ),
      width: '250px',
    },
    {
      name: 'Period',
      cell: (row: VoucherProject) => (
        <div className="py-2 text-sm">
          <div>Start: {formatDate(row.periode_start || '')}</div>
          <div>End: {formatDate(row.periode_end || '')}</div>
        </div>
      ),
      width: '150px',
    },
    {
      name: 'Status',
      selector: (row: VoucherProject) => row.is_active,
      sortable: true,
      cell: (row: VoucherProject) => (
        <div className="py-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {row.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      ),
      width: '100px',
    },
    {
      name: 'Voucher Stats',
      cell: (row: VoucherProject) => (
        <div className="py-2 text-sm">
          <div>Allocated: {row.total_allocated?.toLocaleString() || 0}</div>
          <div>Used: {row.total_used?.toLocaleString() || 0}</div>
          <div className="text-xs text-gray-500">
            {row.total_allocated && row.total_allocated > 0 
              ? `${((row.total_used || 0) / row.total_allocated * 100).toFixed(1)}%`
              : '0%'
            } usage
          </div>
        </div>
      ),
      width: '150px',
    },
    {
      name: 'Created',
      selector: (row: VoucherProject) => row.created_at,
      sortable: true,
      cell: (row: VoucherProject) => (
        <div className="py-2 text-sm text-gray-600">
          {formatDate(row.created_at)}
        </div>
      ),
      width: '120px',
    },
    {
      name: 'Actions',
      cell: (row: VoucherProject) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            color={row.is_active ? "orange" : "green"}
            onClick={() => handleToggleStatus(row.id)}
            className="px-2 py-1 text-xs min-w-[70px]"
          >
            {row.is_active ? 'Disable' : 'Enable'}
          </Button>
          <Button 
            size="sm" 
            color="blue" 
            onClick={() => handleEdit(row)}
            className="px-2 py-1 text-xs"
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            color="red" 
            onClick={() => handleDelete(row.id)}
            className="px-2 py-1 text-xs min-w-[70px]"
          >
            Delete
          </Button>
        </div>
      ),
      width: '240px',
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f8fafc',
        fontWeight: 'bold',
      },
    },
    rows: {
      style: {
        minHeight: '70px',
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h5" color="blue-gray" className="font-bold">
            Voucher Projects
          </Typography>
          <Typography color="gray" className="mt-1">
            Manage voucher campaign projects
          </Typography>
        </div>
        <Button onClick={handleCreate} color="blue" className="flex items-center space-x-2">
          <span>+</span>
          <span>Add New Project</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <DataTable
          columns={columns}
          data={data}
          pagination
          progressPending={loading}
          progressComponent={
            <div className="py-8">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            </div>
          }
          highlightOnHover
          striped
          customStyles={customStyles}
          noDataComponent={
            <div className="py-8 text-center text-gray-500">
              No voucher projects found
            </div>
          }
        />
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={openModal} handler={() => setOpenModal(false)} size="md">
        <DialogHeader>
          {editingItem ? 'Edit Voucher Project' : 'Add New Voucher Project'}
        </DialogHeader>
        <DialogBody className="space-y-4 max-h-96 overflow-y-auto">
          <Input
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Start Date
              </Typography>
              <Input
                type="date"
                value={formData.periode_start}
                onChange={(e) => setFormData({ ...formData, periode_start: e.target.value })}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                End Date
              </Typography>
              <Input
                type="date"
                value={formData.periode_end}
                onChange={(e) => setFormData({ ...formData, periode_end: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Switch
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            <Typography color="blue-gray">
              Active Project
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default VoucherProjectManagement;
