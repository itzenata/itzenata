import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Column {
  title?: string;
  dataKey: string;
}

export const exportToPDF = (
  title: string,
  columns: Column[],
  data: Record<string, any>[]
): void => {
  const doc = new jsPDF();

  // Set title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Prepare table data
  const tableData = data.map((item) => {
    const formattedItem: Record<string, any> = {};
    columns.forEach((column) => {
      formattedItem[column.dataKey] = item[column.dataKey] || 'N/A';
    });
    return formattedItem;
  });

  // Add table to PDF
  autoTable(doc, {
    columns: columns,
    body: tableData,
    startY: 30
  });

  // Generate filename from title - replace spaces with hyphens and add .pdf extension
  const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;

  // Save PDF file
  doc.save(filename);
};
