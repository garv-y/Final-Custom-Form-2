import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ correct for v5+

export const exportAsCSV = (title: string, data: Record<string, any>) => {
  const rows = Object.entries(data).map(([key, value]) => ({
    Field: key,
    Value: Array.isArray(value) ? value.join(", ") : value,
  }));

  const csv = [
    "Field,Value",
    ...rows.map((r) => `"${r.Field}","${r.Value}"`)
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${title}.csv`);
};

export const exportAsXLSX = (title: string, data: Record<string, any>) => {
  const rows = Object.entries(data).map(([key, value]) => ({
    Field: key,
    Value: Array.isArray(value) ? value.join(", ") : value,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

  const xlsxBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([xlsxBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, `${title}.xlsx`);
};

export const exportAsPDF = (title: string, data: Record<string, any>) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 10, 10);

  const rows = Object.entries(data).map(([key, value]) => [
    key,
    Array.isArray(value) ? value.join(", ") : value,
  ]);

  // ✅ Use autoTable function directly from the import (NOT doc.autoTable)
  autoTable(doc, {
    head: [["Field", "Value"]],
    body: rows,
    startY: 20,
  });

  doc.save(`${title}.pdf`);
};
