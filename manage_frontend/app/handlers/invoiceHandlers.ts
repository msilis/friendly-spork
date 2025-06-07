import { saveInvoice, updateInvoice } from "~/data/data.server";

export const handleSaveInvoice = async (formData: FormData) => {
  const invoiceData = formData.get("save_invoice_data");
  if (!invoiceData)
    return Response.json({ success: false, message: "No data provided" });
  if (typeof invoiceData === "string" && invoiceData) {
    const parsedInvoiceData = JSON.parse(invoiceData);
    try {
      const result = await saveInvoice(parsedInvoiceData);
      if (result?.success) {
        return Response.json({ success: true, message: "Invoice saved" });
      } else
        return Response.json({
          success: false,
          message: "There was an error saving this invoice",
        });
    } catch (error) {
      console.error("Error saving invoice: ", error);
      return Response.json({
        success: false,
        message: "Error saving invoice",
      });
    }
  }
};

export const handleUpdateInvoice = async (formData: FormData) => {
  const updateInvoiceData = formData.get("update_invoice_data");
  if (!updateInvoiceData) {
    return Response.json({
      success: false,
      message: "There was no data to save",
    });
  }
  if (typeof updateInvoiceData === "string" && updateInvoiceData) {
    const parsedUpdateInvoiceData = JSON.parse(updateInvoiceData);
    try {
      const result = await updateInvoice(parsedUpdateInvoiceData);
      if (result?.success) {
        return Response.json({ success: true, message: "Invoice updated." });
      }
    } catch (error) {
      console.error("Error updaing invoice: ", error);
      return Response.json({
        success: false,
        message: "Error updating invoice.",
      });
    }
  }
};
