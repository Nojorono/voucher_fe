import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Typography } from '@material-tailwind/react';
import DataTable from 'react-data-table-component';
import { voucherService } from '../../services/voucherService';
import { VoucherLimit, VoucherProject } from '../../types/voucher';

const VoucherLimitManagement: React.FC = () => {
  const [data, setData] = useState<VoucherLimit[]>([]);
  const [projects, setProjects] = useState<VoucherProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openIncrementModal, setOpenIncrementModal] = useState(false);
  const [editingItem, setEditingItem] = useState<VoucherLimit | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    limit: '',
    current_count: '',
    voucher_project_id: '',
  });
  const [incrementData, setIncrementData] = useState({
    id: 0,
    increment: 1,
    currentCount: 0,
    limit: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch voucher limits
      const limits = await voucherService.getVoucherLimits();
      console.log('Voucher limits loaded:', limits); // Debug log
      setData(limits);

      // Fetch projects untuk dropdown
      const projectsList = await voucherService.getVoucherProjects();
      console.log('Projects loaded:', projectsList); // Debug log
      setProjects(projectsList);

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
      description: '',
      limit: '',
      current_count: '0',
      voucher_project_id: '',
    });
    setOpenModal(true);
  };

  const handleEdit = (item: VoucherLimit) => {
    setEditingItem(item);
    console.log('Editing item:', item); // Debug log
    console.log('Available projects:', projects); // Debug log
    
    const projectId = (item.voucher_project || item.voucher_project_id)?.toString() || '';
    console.log('Project ID to set:', projectId); // Debug log
    
    setFormData({
      description: item.description || '',
      limit: item.limit.toString(),
      current_count: item.current_count.toString(),
      voucher_project_id: projectId,
    });
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        description: formData.description,
        limit: parseInt(formData.limit),
        current_count: parseInt(formData.current_count),
        voucher_project_id: formData.voucher_project_id ? parseInt(formData.voucher_project_id) : undefined,
      };

      if (editingItem) {
        await voucherService.updateVoucherLimit(editingItem.id, payload);
        alert('Data berhasil diupdate!');
      } else {
        await voucherService.createVoucherLimit(payload);
        alert('Data berhasil ditambahkan!');
      }

      setOpenModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await voucherService.deleteVoucherLimit(id);
        alert('Data berhasil dihapus!');
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
        alert('Error deleting data');
      }
    }
  };

  const handleIncrement = (item: VoucherLimit) => {
    setIncrementData({
      id: item.id,
      increment: 1,
      currentCount: item.current_count,
      limit: item.limit,
    });
    setOpenIncrementModal(true);
  };

  const handleSaveIncrement = async () => {
    try {
      await voucherService.incrementVoucherLimit(incrementData.id, incrementData.increment);
      alert('Count berhasil ditambahkan!');
      setOpenIncrementModal(false);
      fetchData();
    } catch (error) {
      console.error('Error incrementing:', error);
      alert('Error incrementing data');
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const columns = [
    {
      name: 'Project',
      selector: (row: VoucherLimit) => row.voucher_project_name || 'No Project',
      sortable: true,
      cell: (row: VoucherLimit) => (
        <div className="py-2">
          <div className="font-medium text-gray-900">
            {row.voucher_project_name || 'No Project'}
          </div>
        </div>
      ),
    },
    {
      name: 'Description',
      selector: (row: VoucherLimit) => row.description || '-',
      sortable: true,
      cell: (row: VoucherLimit) => (
        <div className="py-2">
          <div className="text-sm text-gray-900">{row.description || '-'}</div>
        </div>
      ),
    },
    {
      name: 'Limit Voucher',
      selector: (row: VoucherLimit) => row.limit,
      sortable: true,
      cell: (row: VoucherLimit) => (
        <div className="py-2">
          <div className="font-medium text-blue-600">
            {row.limit.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      name: 'Verified Voucher Count',
      selector: (row: VoucherLimit) => row.current_count,
      sortable: true,
      cell: (row: VoucherLimit) => {
        const percentage = (row.current_count / row.limit) * 100;
        const remaining = row.limit - row.current_count;
        return (
          <div className="py-2 w-full">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="font-medium">{row.current_count.toLocaleString()}</span>
              <span className="text-gray-500">{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Remaining: {remaining.toLocaleString()}
            </div>
          </div>
        );
      },
      width: '250px',
    },
    {
      name: 'Actions',
      cell: (row: VoucherLimit) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            color="blue"
            onClick={() => handleIncrement(row)}
            disabled={row.current_count >= row.limit}
            className="px-3 py-1 text-xs"
          >
            +
          </Button>
          <Button 
            size="sm" 
            color="green" 
            onClick={() => handleEdit(row)}
            className="px-3 py-1 text-xs"
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            color="red" 
            onClick={() => handleDelete(row.id)}
            className="px-3 py-1 text-xs"
          >
            Delete
          </Button>
        </div>
      ),
      width: '180px',
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
        minHeight: '60px',
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h5" color="blue-gray" className="font-bold">
            Voucher Limits
          </Typography>
          <Typography color="gray" className="mt-1">
            Manage voucher allocation limits
          </Typography>
        </div>
        <Button onClick={handleCreate} color="blue" className="flex items-center space-x-2">
          <span>+</span>
          <span>Add New Limit</span>
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
              No voucher limits found
            </div>
          }
        />
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={openModal} handler={() => setOpenModal(false)} size="md">
        <DialogHeader>
          {editingItem ? 'Edit Voucher Limit' : 'Add New Voucher Limit'}
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Voucher Project
            </Typography>
            <select
              value={formData.voucher_project_id}
              onChange={(e) => setFormData({ ...formData, voucher_project_id: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">No Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id.toString()}>
                  {project.name}
                </option>
              ))}
            </select>
            {/* Debug info */}
            <div className="text-xs text-gray-500 mt-1">
              Current value: {formData.voucher_project_id} | Projects count: {projects.length}
            </div>
          </div>
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            label="Limit"
            type="number"
            value={formData.limit}
            onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
          />
          <Input
            label="Current Count"
            type="number"
            value={formData.current_count}
            onChange={(e) => setFormData({ ...formData, current_count: e.target.value })}
          />
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

      {/* Increment Modal */}
      <Dialog open={openIncrementModal} handler={() => setOpenIncrementModal(false)} size="sm">
        <DialogHeader>Increment Voucher Count</DialogHeader>
        <DialogBody className="space-y-4">
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <div className="flex justify-between">
              <span>Current Count:</span>
              <span className="font-medium">{incrementData.currentCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Limit:</span>
              <span className="font-medium">{incrementData.limit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining:</span>
              <span className="font-medium">{(incrementData.limit - incrementData.currentCount).toLocaleString()}</span>
            </div>
          </div>
          <Input
            label="Increment Amount"
            type="number"
            min="1"
            max={incrementData.limit - incrementData.currentCount}
            value={incrementData.increment}
            onChange={(e) => setIncrementData({
              ...incrementData,
              increment: parseInt(e.target.value) || 1
            })}
          />
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
            <div className="flex justify-between">
              <span>New Count:</span>
              <span className="font-medium text-blue-600">
                {(incrementData.currentCount + incrementData.increment).toLocaleString()}
              </span>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpenIncrementModal(false)}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleSaveIncrement}>
            Increment
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default VoucherLimitManagement;
