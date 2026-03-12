// lib/export-pdf.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportDashboardAsPDF(
  elementId: string,
  filename: string = "dashboard"
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Elemento #${elementId} não encontrado`);

  const originalOverflow = element.style.overflow;
  const originalHeight = element.style.height;
  element.style.overflow = "visible";
  element.style.height = "auto";

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#f9fafb",
      logging: false,
      windowHeight: element.scrollHeight,
      y: 0,
      height: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const orientation = canvas.width > canvas.height ? "landscape" : "portrait";

    const pdf = new jsPDF({
      orientation,
      unit: "px",
      format: [canvas.width / 2, canvas.height / 2],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`${filename}.pdf`);
  } finally {
    element.style.overflow = originalOverflow;
    element.style.height = originalHeight;
  }
}
