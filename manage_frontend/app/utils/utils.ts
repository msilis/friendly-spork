import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export const getWednesdays = (startDate: string, endDate: string) => {
  const wednesdays = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  currentDate.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const dayOfWeek = currentDate.getDay();
  const daysToNextWednesday = (3 - dayOfWeek + 7) % 7;
  currentDate.setDate(currentDate.getDate() + daysToNextWednesday);

  while (currentDate <= end) {
    wednesdays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return wednesdays;
};

export const convertToCurrency = (amount: number) => {
  return amount / 100;
};

export const formatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export const handleSaveClick = async (
  element: string,
  pdfName: string,
  shrinkAmount?: number
) => {
  const elementToSave = document.getElementById(element);

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [842, 595],
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  if (!elementToSave) {
    console.error("Element not found");
    return;
  }

  const canvas = await html2canvas(elementToSave, { scale: 2 });
  const tableData = canvas.toDataURL("image/png");

  const elementWidth = canvas.width - 10;
  const elementHeight = canvas.height;
  const scaleX = pageWidth / elementWidth;
  const scaleY = pageHeight / elementHeight;
  const scale = Math.min(scaleX, scaleY);

  const tableWidth = (elementWidth - (shrinkAmount ? shrinkAmount : 0)) * scale;
  const tableHeight = elementHeight * scale;

  // the add image has the following format: (imageToAdd, imageType, xOffset, yOffset, imageWidth, imageHeight)
  pdf.addImage(tableData, "PNG", 5, 20, tableWidth, tableHeight);
  pdf.save(`${pdfName}.pdf`);
};

const getPdfMe = async () => {
  if (typeof window !== "undefined") {
    const { generate } = await import("@pdfme/generator");
    return generate;
  }
  return null;
};
const getBlankPdf = async () => {
  if (typeof window !== "undefined") {
    const { BLANK_PDF } = await import("@pdfme/common");
    return BLANK_PDF;
  }
  return null;
};

const getSchemas = async () => {
  if (typeof window !== "undefined") {
    const { text, multiVariableText, table, line } = await import(
      "@pdfme/schemas"
    );
    return { text, multiVariableText, table, line };
  }
  return null;
};

export const generatePdf = async (invoiceInputs) => {
  const generate = await getPdfMe();
  const BLANK_PDF = await getBlankPdf();
  const { text, multiVariableText, table, line } = await getSchemas();
  if (generate && BLANK_PDF) {
    const template = {
      schemas: [
        [
          {
            type: "text",
            position: { x: 120.13, y: 20 },
            content: "Lauderdale Invoice",
            width: 69.87,
            height: 22.68,
            rotate: 0,
            alignment: "right",
            verticalAlignment: "middle",
            fontSize: 40,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            readOnly: true,
            fontName: "",
            name: "head",
          },
          {
            type: "text",
            position: { x: 20, y: 57.88 },
            content: "Billed to:",
            width: 84.69,
            height: 9.42,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            readOnly: true,
            fontName: "",
            name: "billedToLabel",
          },
          {
            type: "text",
            content:
              "Imani Olowe \n+123-456-7890 \n63 Ivy Road, Hawkville, GA, USA 31036",
            position: { x: 20, y: 67.94 },
            width: 84.95,
            height: 34.07,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            dynamicFontSize: { min: 3, max: 13, fit: "vertical" },
            fontName: "",
            name: "billedToInput",
          },
          {
            type: "multiVariableText",
            position: { x: 119.87, y: 67.88 },
            content: '{"InvoiceNo":"12345","Date":"16 June 2025"}',
            width: 70.13,
            height: 33.52,
            rotate: 0,
            alignment: "right",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1.5,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            strikethrough: false,
            underline: false,
            text: "Invoice No.{InvoiceNo}\n{Date}",
            variables: ["InvoiceNo", "Date"],
            fontName: "",
            name: "info",
          },
          {
            type: "table",
            position: { x: 20, y: 110.81 },
            width: 170,
            height: 45.75920000000001,
            content:
              '[["Eggshell Camisole Top","1","123","123"],["Cuban Collar Shirt","2","127","254"]]',
            showHead: true,
            head: ["Item", "Total"],
            headWidthPercentages: [
              49.538325694806396, 17.962830593295262, 19.26354959425127,
              13.23529411764708,
            ],
            fontName: "",
            tableStyles: { borderWidth: 0, borderColor: "#000000" },
            headStyles: {
              fontName: "",
              fontSize: 13,
              characterSpacing: 0,
              alignment: "center",
              verticalAlignment: "middle",
              lineHeight: 1,
              fontColor: "#000000",
              borderColor: "#000000",
              backgroundColor: "",
              borderWidth: { top: 0.1, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 5, bottom: 5, left: 5 },
            },
            bodyStyles: {
              fontName: "",
              fontSize: 13,
              characterSpacing: 0,
              alignment: "center",
              verticalAlignment: "middle",
              lineHeight: 1,
              fontColor: "#000000",
              borderColor: "#000000",
              backgroundColor: "",
              alternateBackgroundColor: "",
              borderWidth: { top: 0.1, right: 0, bottom: 0.1, left: 0 },
              padding: { top: 6, right: 5, bottom: 5, left: 5 },
            },
            columnStyles: { alignment: { "0": "left", "3": "right" } },
            name: "orders",
            readOnly: false,
          },
          {
            type: "line",
            position: { x: 132.09, y: 174.35 },
            width: 52.91,
            height: 0.1,
            rotate: 0,
            opacity: 1,
            readOnly: true,
            color: "#000000",
            name: "line",
            content: "",
          },
          {
            type: "text",
            position: { x: 131.94, y: 174.64 },
            content: "Total",
            width: 27.01,
            height: 11,
            rotate: 0,
            alignment: "right",
            verticalAlignment: "middle",
            fontSize: 20,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            fontName: "",
            backgroundColor: "",
            opacity: 1,
            readOnly: true,
            name: "totalLabel",
          },
          {
            name: "total",
            type: "text",
            content: "total amount",
            position: { x: 160.07999999999998, y: 175.94 },
            width: 29.92,
            height: 10,
            rotate: 0,
            alignment: "center",
            verticalAlignment: "middle",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#0079ff",
            backgroundColor: "",
            opacity: 1,
            strikethrough: false,
            underline: false,
            required: false,
            readOnly: false,
          },
          {
            type: "text",
            position: { x: 20, y: 191.58 },
            content: "Thank you!",
            width: 52.67,
            height: 20,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 20,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            fontName: "",
            backgroundColor: "",
            opacity: 1,
            readOnly: true,
            name: "thankyou",
          },
          {
            type: "text",
            position: { x: 20, y: 232.67 },
            content: "Payment Information",
            width: 84.69,
            height: 9.42,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            readOnly: true,
            fontName: "",
            name: "paymentInfoLabel",
          },
          {
            type: "text",
            content:
              "Briard Bank\nAccount Name: Samira Hadid\nAccount No.: 123-456-7890\nPay by: 5 July 2025",
            position: { x: 20, y: 242.83 },
            width: 84.95,
            height: 34.07,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            dynamicFontSize: { min: 3, max: 13, fit: "vertical" },
            fontName: "",
            name: "paymentInfoInput",
          },
          {
            type: "text",
            position: { x: 119.33, y: 248.39 },
            content: "Lauderdale Suzuki Group",
            width: 70.67,
            height: 8.36,
            rotate: 0,
            alignment: "right",
            verticalAlignment: "top",
            fontSize: 18,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            readOnly: true,
            fontName: "",
            name: "shopName",
          },
          {
            type: "text",
            position: { x: 107.69, y: 256.9 },
            content: "Lauderdale House, Highgate N6",
            width: 82.31,
            height: 20,
            rotate: 0,
            alignment: "right",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            readOnly: true,
            fontName: "",
            name: "shopAddress",
          },
        ],
      ],
      basePdf: {
        width: 210,
        height: 297,
        padding: [20, 20, 20, 20],
        staticSchema: [
          {
            name: "line",
            type: "line",
            position: { x: 20, y: 279 },
            width: 170,
            height: 0.2,
            rotate: 0,
            opacity: 1,
            readOnly: true,
            color: "#999999",
            required: false,
            content: "",
          },
          {
            name: "pageNumber",
            type: "text",
            content: "Page {currentPage} of {totalPages}",
            position: { x: 145, y: 282 },
            width: 45,
            height: 10,
            rotate: 0,
            alignment: "right",
            verticalAlignment: "middle",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            strikethrough: false,
            underline: false,
            required: false,
            readOnly: true,
          },
        ],
      },
    };
    const inputs = [invoiceInputs];
    generate({
      template,
      inputs,
      plugins: { text, multiVariableText, table, line },
    }).then((pdf) => {
      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob));
    });
  }
};
