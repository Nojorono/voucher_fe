  import React from 'react';
  import { saveAs } from 'file-saver';
  import XLSX from 'xlsx';

// Define the types for the props
interface ExcelExportProps {
  data: any[]; // Assuming 'data' is an array of objects, you can define a more specific type if needed
  fileName: string;
}

const ExcelExport: React.FC<ExcelExportProps> = ({ data, fileName }) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <button onClick={exportToExcel}>Export to Excel</button>
  );
};

export default ExcelExport;
