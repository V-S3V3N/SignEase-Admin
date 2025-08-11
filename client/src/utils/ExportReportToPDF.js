import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportReportToPDF = (
  data,
  stats,
  config,
  reportType,
  fromDate,
  toDate
) => {
  const doc = new jsPDF();
  const columnStyles = {};
  const pageWidth = doc.internal.pageSize.getWidth();
  let tableWidth = 0;
  config.columns.forEach((col, idx) => {
    if (col.minWidth) {
      columnStyles[idx] = { cellWidth: col.minWidth };
      tableWidth += col.minWidth;
    } else if (col.maxWidth) {
      columnStyles[idx] = { cellWidth: col.maxWidth };
      tableWidth += col.maxWidth;
    } else {
      columnStyles[idx] = { cellWidth: "auto" };
    }
  });

  // Header
  doc.setFontSize(28);
  doc.text(`SignEase©`, 105, 20, { align: "center" });

  // Date range
  doc.setFontSize(20);
  doc.text(`Title: ${config.title} for ${fromDate} to ${toDate}`, 105, 30, {
    align: "center",
  });
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 45);
  doc.text(`Total Records: ${data.length}`, 20, 55);

  let finalY = 65;

  // Table
  if (stats?.length) {
    if (reportType == "revenue") {
      const statHeaders = ["Metric", "", ""];
      const statRows = stats.map((s) => [s.metric, s.count, s.percentage]);
      autoTable(doc, {
        head: [statHeaders],
        body: statRows,
        startY: finalY,
      });
      finalY = doc.lastAutoTable.finalY + 10;
    }
    else{
      const statHeaders = ["Metric", "Count", "Percentage"];
      const statRows = stats.map((s) => [s.metric, s.count, s.percentage]);
      autoTable(doc, {
        head: [statHeaders],
        body: statRows,
        startY: finalY,
      });
      finalY = doc.lastAutoTable.finalY + 10;
    }
  }
  const headers = config.columns.map((col) => col.Header);
  const rows = data.map((row) =>
    config.columns.map((col) => {
      const value = row[col.accessor];
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      if (col.Cell && typeof value === "boolean") {
        return value ? "Yes" : "No";
      }
      return value || "N/A";
    })
  );

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: finalY,
    columnStyles,
    margin: { left: (pageWidth - tableWidth) / 2 },
  });

  doc.save(
    `${config.title
      .toLowerCase()
      .replace(/\s+/g, "-")}-${fromDate}-to-${toDate}.pdf`
  );
};

export default exportReportToPDF;
