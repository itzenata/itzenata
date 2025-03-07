import * as XLSX from 'xlsx';

interface Column {
  title?: string;
  dataKey: string;
  header?: string;
}

export const exportToXLSX = (
  title: string,
  columns: Column[],
  data: Record<string, any>[]
): void => {
  // Create worksheet data with headers
  const headers = columns.map((col) => col.header || col.title || col.dataKey);

  // Prepare worksheet data
  const worksheetData = [
    headers, // Add headers as first row
    ...data.map((item) => {
      return columns.map((column) => {
        const value = item[column.dataKey];
        return value ?? 'N/A';
      });
    })
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Auto-size columns with extra padding
  const colWidths = worksheetData[0].map((_, i) => ({
    wch: Math.max(
      ...worksheetData.map((row) => {
        const cell = row[i];
        const length = cell ? String(cell).length : 0;
        return length + 4;
      })
    )
  }));

  // Apply column widths
  worksheet['!cols'] = colWidths;

  // Get the range of the worksheet
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

  // Style headers and data cells
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[address]) continue;

      if (R === 0) {
        // Header row styling
        worksheet[address].s = {
          font: { bold: true },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      } else {
        // Data cells styling
        worksheet[address].s = {
          alignment: { horizontal: 'center', vertical: 'left' }
        };
      }
    }
  }

  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Generate filename from title - replace spaces with hyphens and add .xlsx extension
  const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.xlsx`;

  // Save XLSX file
  XLSX.writeFile(workbook, filename);
};
