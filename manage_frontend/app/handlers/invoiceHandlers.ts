import {
  saveInvoice,
  updateInvoice,
  deleteInvoice,
  getTransactionsFromInvoice,
  getTransactionsForInvoice,
} from "~/data/data.server";

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

export const handleDeleteInvoice = async (formData: FormData) => {
  const idToDelete = formData.get("delete_invoice_id");
  if (!idToDelete)
    return Response.json({ success: false, message: "No id provided" });
  if (typeof idToDelete === "number" && idToDelete) {
    try {
      const result = await deleteInvoice(idToDelete);
      if (result?.success) {
        return Response.json({ success: true, message: "Invoice deleted" });
      } else
        return Response.json({
          success: false,
          message: "Error deleting invoice",
        });
    } catch (error) {
      console.error("Error deleting invoice: ", error);
      return Response.json({
        success: false,
        message: "Error deleting this invoice",
      });
    }
  }
};

export const handleGetTransactionsFromInvoice = async (formData: FormData) => {
  const invoiceId = formData.get("invoice_id");
  if (!invoiceId)
    return Response.json({
      success: false,
      message: "No id provided for invoice",
    });
  if (typeof invoiceId === "number" && invoiceId) {
    try {
      const result = await getTransactionsFromInvoice(invoiceId);
      if (result?.success) {
        return Response.json({
          success: true,
          messsage: "Successfully retreived invoice info",
          data: result.data,
        });
      } else
        return Response.json({
          success: false,
          message: "There was an issue getting the data for this invoice",
        });
    } catch (error) {
      console.error("Error getting invoice info.");
      return Response.json({
        success: false,
        message: "Error getting invoice info",
      });
    }
  }
};

export const handleGetTransactionsForInvoice = async (formData: FormData) => {
  const invoiceStartDate = formData?.get("invoice_start_date");
  const invoiceEndDate = formData?.get("invoice_end_date");
  const accountId = formData?.get("invoice_id");
  if (!invoiceStartDate || !invoiceEndDate || !accountId) {
    return Response.json({
      success: false,
      message: "Not enough info to get transactions",
    });
  }
  if (
    typeof accountId === "number" &&
    typeof invoiceStartDate === "string" &&
    typeof invoiceEndDate === "string" &&
    accountId &&
    invoiceStartDate &&
    invoiceEndDate
  ) {
    try {
      const transactionQueryData = {
        invoice_start_date: invoiceStartDate,
        invoice_end_date: invoiceEndDate,
        account_id: accountId,
      };
      const result = await getTransactionsForInvoice(transactionQueryData);
      if (result?.success) {
        return Response.json({
          success: true,
          message: "Successfully retreived transactions for invoice",
          data: result.data,
        });
      }
    } catch (error) {
      console.error("There was an error getting transactions: ", error);
      return Response.json({
        success: false,
        message: "There was an error getting transactions",
      });
    }
  }
};
