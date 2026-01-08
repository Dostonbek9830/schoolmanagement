
import * as XLSX from 'xlsx';

export const exportToFile = (data, fileName) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const exportToCSV = (data, fileName) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Generate CSV and trigger download
    XLSX.writeFile(wb, `${fileName}.csv`, { bookType: 'csv' });
};
