import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

// Initialize vfs fonts with flexible structure detection
try {
  // Try multiple possible structures for the vfs object
  if (pdfFonts?.pdfMake?.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  } else if (pdfFonts?.vfs) {
    pdfMake.vfs = pdfFonts.vfs;
  } else if (pdfFonts && typeof pdfFonts === 'object' && Object.keys(pdfFonts).length > 0) {
    // If it's an object with vfs data directly
    pdfMake.vfs = pdfFonts;
  }
  console.log("✅ VFS initialized successfully");
} catch (error) {
  console.error("⚠️ Error initializing VFS, PDF export may fail:", error);
}

/**
 * Convert array of objects to CSV string
 */
export const convertToCSV = (data, columns) => {
  if (!data || data.length === 0) return "";

  // Create header
  const headers = columns.map(col => `"${col.label}"`).join(",");

  // Create rows
  const rows = data.map(record =>
    columns
      .map(col => {
        const value = record[col.key];
        // Escape quotes and wrap in quotes
        return `"${value !== undefined && value !== null ? String(value).replace(/"/g, '""') : ""}"`;
      })
      .join(",")
  );

  return [headers, ...rows].join("\n");
};

/**
 * Download CSV file
 */
export const downloadCSV = (data, columns, filename = "export.csv") => {
  const csv = convertToCSV(data, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Download PDF file with table using pdfMake
 */
export const downloadPDF = (data, columns, filename = "export.pdf") => {
  try {
    console.log("📄 Generating PDF...", { dataLength: data?.length, columnsLength: columns?.length });

    if (!data || data.length === 0) {
      console.error("❌ No data to export");
      alert("Немає даних для експорту");
      return;
    }

    if (!columns || columns.length === 0) {
      console.error("❌ No columns defined");
      alert("Визначте колонки для експорту");
      return;
    }

    // Prepare table header
    const tableHeader = columns.map(col => ({
      text: col.label || col.key,
      style: "tableHeader",
    }));

    // Prepare table body
    const tableBody = data.map(record =>
      columns.map(col => {
        const value = record[col.key];
        const displayValue = value !== undefined && value !== null ? String(value) : "";
        return {
          text: displayValue,
          style: "tableCell",
        };
      })
    );

    console.log("✅ Table prepared", { headerLength: tableHeader.length, bodyLength: tableBody.length });

    // Create document definition
    const docDefinition = {
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargins: [15, 15, 15, 15],
      content: [
        {
          text: "Експорт даних",
          style: "title",
        },
        {
          text: `Дата експорту: ${new Date().toLocaleString("uk-UA")}`,
          style: "subtitle",
          margin: [0, 0, 0, 15],
        },
        {
          table: {
            headerRows: 1,
            widths: Array(columns.length).fill("*"),
            body: [tableHeader, ...tableBody],
          },
          style: "dataTable",
        },
      ],
      styles: {
        title: {
          fontSize: 18,
          bold: true,
          color: "black",
          margin: [0, 0, 0, 10],
        },
        subtitle: {
          fontSize: 11,
          color: "#333",
          margin: [0, 0, 0, 15],
        },
        tableHeader: {
          bold: true,
          color: "white",
          fillColor: "#4876ee",
          alignment: "left",
          fontSize: 10,
          padding: [8, 8, 8, 8],
        },
        tableCell: {
          fontSize: 9,
          color: "black",
          padding: [6, 6, 6, 6],
          alignment: "left",
          border: [1, 1, 1, 1],
          borderColor: "#ddd",
        },
        dataTable: {
          margin: [0, 15, 0, 0],
        },
      },
      defaultStyle: {
        color: "black",
      },
    };

    // Generate and download PDF
    const pdf = pdfMake.createPdf(docDefinition);
    console.log("✅ PDF created, downloading...");
    pdf.download(filename);
    console.log("✅ PDF download triggered");
  } catch (error) {
    console.error("❌ PDF generation error:", error);
    alert(`Помилка експорту: ${error.message}`);
  }
};

/**
 * Prepare columns from react-admin Datagrid children
 */
export const getColumnsFromRecords = (records, defaultColumns = []) => {
  if (!records || records.length === 0) return defaultColumns;

  const firstRecord = records[0];
  return Object.keys(firstRecord).map(key => ({
    key,
    label: key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .toUpperCase()
      .trim(),
  }));
};
