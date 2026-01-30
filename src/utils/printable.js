import { jsPDF } from "jspdf";

export const generatePrintablePDF = (title, headers, data) => {
  const printWindow = window.open("", "_blank");
  const tableRows = data
    .map(
      (row) =>
        `<tr>${row
          .map(
            (cell) =>
              `<td style="padding: 12px; border: 1px solid #ddd;">${cell}</td>`
          )
          .join("")}</tr>`
    )
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
          }
          h1 {
            color: #EF4444;
            margin-bottom: 10px;
          }
          .date {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #EF4444;
            color: white;
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="date">Generated: ${new Date().toLocaleString()}</div>
        <table>
          <thead>
            <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export const downloadReportPDF = (title, headers, rows) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const lineHeight = 16;
  const headerHeight = 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, margin, margin);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, margin + 18);

  let cursorY = margin + 36;
  const tableWidth = pageWidth - margin * 2;
  const colCount = headers.length || 1;
  const colWidth = tableWidth / colCount;

  const drawHeader = () => {
    doc.setFillColor(205, 25, 47);
    doc.rect(margin, cursorY, tableWidth, headerHeight, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255);
    headers.forEach((header, index) => {
      const textX = margin + index * colWidth + 6;
      const textY = cursorY + 17;
      doc.text(String(header), textX, textY);
    });
    cursorY += headerHeight;
  };

  const ensureSpace = (height) => {
    if (cursorY + height > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
      drawHeader();
    }
  };

  drawHeader();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(40);

  rows.forEach((row, rowIndex) => {
    const rowValues = row.length ? row : [""];
    const wrappedCells = rowValues.map((cell) =>
      doc.splitTextToSize(String(cell), colWidth - 10)
    );
    const maxLines = Math.max(...wrappedCells.map((lines) => lines.length), 1);
    const rowHeight = Math.max(lineHeight * maxLines + 8, lineHeight + 8);

    ensureSpace(rowHeight);

    if (rowIndex % 2 === 0) {
      doc.setFillColor(248, 249, 249);
      doc.rect(margin, cursorY, tableWidth, rowHeight, "F");
    }

    wrappedCells.forEach((lines, colIndex) => {
      const textX = margin + colIndex * colWidth + 6;
      const textY = cursorY + lineHeight;
      doc.text(lines, textX, textY);
    });

    cursorY += rowHeight;
  });

  const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  doc.save(`${safeTitle || "report"}.pdf`);
};
