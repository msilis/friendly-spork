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

export const handleSaveClick = async (
  element: string,
  pdfName: string,
  shrinkAmount?: number
) => {
  console.log(element, "element");
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

export const generatePdf = async () => {
  const generate = await getPdfMe();
  const BLANK_PDF = await getBlankPdf();
  if (generate && BLANK_PDF) {
    const template = {
      basePdf: BLANK_PDF,
      schemas: [
        [
          {
            position: { x: 10, y: 10 },
            width: 200,
            height: 30,
            type: "text",
            name: "title",
          },
        ],
      ],
    };
    const inputs = [{ title: "My PDF" }];
    generate({ template, inputs }).then((pdf) => {
      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob));
    });
  }
};
