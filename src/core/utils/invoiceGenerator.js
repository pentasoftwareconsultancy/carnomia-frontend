import jsPDF from "jspdf";
import "jspdf-autotable";

// Utility: Currency formatter for INR
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

// Generate Invoice PDF
export const generateInvoicePdf = (payment) => {
  if (!payment) {
    console.error("No payment data provided for invoice generation.");
    return;
  }

  const doc = new jsPDF();

  // Dynamic branding/logo
  const logoUrl = "/assets/logo.png"; // place your logo in public/assets
  const companyName = "AutoDrive PDI Services";
  const companyAddress = "123 Auto Street, New Delhi, India";
  const companyPhone = "+91-9876543210";

  // Add Logo (if available)
  const addLogo = async () => {
    try {
      const img = new Image();
      img.src = logoUrl;
      img.onload = () => {
        doc.addImage(img, "PNG", 10, 8, 30, 30);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(companyName, 45, 15);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(companyAddress, 45, 20);
        doc.text(`Phone: ${companyPhone}`, 45, 25);
        addInvoiceDetails();
      };
    } catch (err) {
      console.warn("Logo not found or failed to load:", err);
      addInvoiceDetails();
    }
  };

  const addInvoiceDetails = () => {
    doc.setFontSize(14);
    doc.text("INVOICE", 150, 15);

    doc.setFontSize(10);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 150, 20);
    doc.text(`Invoice No: INV-${payment.bookingId || "N/A"}`, 150, 25);

    // Customer Details
    doc.setFontSize(12);
    doc.text("Bill To:", 10, 45);
    doc.setFontSize(10);
    doc.text(payment.customerName || "N/A", 10, 50);
    doc.text(payment.customerMobile || "N/A", 10, 55);
    doc.text(payment.address || "N/A", 10, 60);

    // Payment Details Table
    doc.autoTable({
      startY: 70,
      head: [["Description", "Amount", "Payment Status"]],
      body: [
        [
          `${payment.brand || ""} ${payment.model || ""} ${payment.variant || ""}`,
          formatCurrency(payment.amount || 0),
          payment.paymentStatus || "Unpaid",
        ],
      ],
      theme: "grid",
      styles: { fontSize: 10 },
    });

    // Footer Notes
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.text(
      "Thank you for choosing AutoDrive PDI Services. Please retain this invoice for your records.",
      10,
      finalY
    );

    // Save PDF
    doc.save(`Invoice-${payment.bookingId || "N/A"}.pdf`);
  };

  // Try to load logo, else fallback to plain invoice
  addLogo();
};
