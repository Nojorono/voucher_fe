import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Typography, Card, CardBody, CardHeader } from '@material-tailwind/react';
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
        voucher_project: 0
    });

    // Fetch data
    const fetchData = async () => {
        try {
            setLoading(true);
            const [discountsResult, projectsResult] = await Promise.all([
                voucherService.getVoucherDiscounts(),
                voucherService.getVoucherProjects()
            ]);
            
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

    // Sync form data when editingItem or projects change
    useEffect(() => {
        if (editingItem && projects.length > 0) {
            // Get project ID with multiple fallbacks
            let projectId = 0;
            
            if (typeof editingItem.voucher_project === 'number') {
                projectId = editingItem.voucher_project;
                // console.log('Using voucher_project as number:', projectId);
            } else if (typeof editingItem.voucher_project === 'object' && editingItem.voucher_project?.id) {
                projectId = editingItem.voucher_project.id;
            } else if (editingItem.voucher_project) {
                projectId = editingItem.voucher_project;
            } else if (editingItem.voucher_project_name) {
                const foundProject = projects.find(p => p.name === editingItem.voucher_project_name);
                if (foundProject) {
                    projectId = foundProject.id;
                }
            } else {
                // Fallback: Cari project berdasarkan data yang ter-update
                // Karena backend tidak return project relation dengan benar,
                // kita akan set default ke project pertama untuk testing
                // console.log('⚠️ No project data found, check backend response structure');
                // console.log('Available fields in editingItem:', Object.keys(editingItem));
            }
            
            // Validate project exists
            const projectExists = projects.find(p => p.id === projectId);            
            
            // Force update form data
            const newFormData = {
                discount_amount: parseFloat(editingItem.discount_amount?.toString() || '0'),
                discount_percentage: parseFloat(editingItem.discount_percentage?.toString() || '0'),
                agen_fee: parseFloat(editingItem.agen_fee?.toString() || '0'),
                voucher_project: projectId
            };
            
            setFormData(newFormData);
        }
    }, [editingItem, projects]);

    // Handle form submission
    const handleSubmit = async () => {
        
        // Validasi form
        if (!formData.voucher_project) {
            alert('Pilih project terlebih dahulu');
            return;
        }
        
        if (formData.discount_amount <= 0 && formData.discount_percentage <= 0) {
            alert('Masukkan jumlah diskon atau persentase diskon');
            return;
        }
        
        // Double check project exists in projects list
        const projectExists = projects.find(p => p.id === formData.voucher_project);
        if (!projectExists) {
            alert('Project yang dipilih tidak valid. Silakan refresh halaman dan coba lagi.');
            return;
        }

        try {
            let result;
            if (editingItem) {
                result = await voucherService.updateVoucherDiscount(editingItem.id, formData);
                alert('Diskon voucher berhasil diperbarui');
            } else {
                result = await voucherService.createVoucherDiscount(formData);
                alert('Diskon voucher berhasil ditambahkan');
            }
            
            setIsModalOpen(false);
            resetForm();
            
            await fetchData();
            
        } catch (error) {
            console.error('ERROR in handleSubmit:', error);
            alert('Gagal menyimpan diskon voucher: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
            voucher_project: 0
        });
        setEditingItem(null);
    };

    // Open edit modal
    const openEditModal = (item: VoucherRetailerDiscount) => {
        // Set editing item - useEffect akan handle form sync
        setEditingItem(item);
        setIsModalOpen(true);
        
    };

    // Get project name
    const getProjectName = (projectId?: number) => {
        if (!projectId) return 'N/A';
        const project = projects.find(p => p.id === projectId);
        const result = project ? project.name : 'Unknown Project';
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
                    : row.voucher_project || row.voucher_project;
                return getProjectName(projectId);
            },
            sortable: true,
            width: '200px',
            cell: (row: VoucherRetailerDiscount) => {
                const projectId = typeof row.voucher_project === 'object'
                    ? row.voucher_project?.id
                    : row.voucher_project || row.voucher_project;
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
                        className="px-2 py-1"
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        color="red"
                        onClick={() => handleDelete(row.id)}
                        className="px-2 py-1"
                    >
                        Delete
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
                    Add new Discount
                </Button>
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
                                Project <span className="text-red-500">*</span>
                            </Typography>
                            <select
                                key={`project-select-${editingItem?.id || 'new'}-${formData.voucher_project}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.voucher_project || ''}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value) || 0;
                                    setFormData({
                                        ...formData,
                                        voucher_project: selectedId
                                    });
                                }}
                                required
                            >
                                <option value="">Pilih Project</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                Persentase Diskon (%)
                            </Typography>
                            <Input
                                type="number"
                                value={formData.discount_percentage}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    discount_percentage: parseFloat(e.target.value) || 0
                                })}
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
                                onChange={(e) => setFormData({
                                    ...formData,
                                    discount_amount: parseFloat(e.target.value) || 0
                                })}
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
                                onChange={(e) => setFormData({
                                    ...formData,
                                    agen_fee: parseFloat(e.target.value) || 0
                                })}
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
                    <Button
                        color="blue"
                        onClick={() => {
                            handleSubmit();
                        }}
                        disabled={!formData.voucher_project}
                    >
                        {editingItem ? 'Perbarui' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default VoucherDiscountManagement;
