import {
  useParams,
  Link,
  useSearchParams,
  useLoaderData,
  useRevalidator,
  useFetcher,
} from "@remix-run/react";
import {
  LoaderFunctionArgs,
  ActionFunction,
  ActionFunctionArgs,
} from "@remix-run/node";
import { convertToCurrency, formatter, generatePdf } from "~/utils/pdf-utils";
import {
  getFamily,
  getFamilyTransactions,
  getInvoiceForFamily,
  getLastInvoice,
} from "~/data/data.server";
import {
  FamilyRecord,
  TransactionRecord,
  InvoiceRecord,
  IntentHandler,
} from "~/types/types";
import { useEffect, useRef, useState } from "react";
import { useToast } from "~/hooks/hooks";
import {
  handleDeleteInvoice,
  handleSaveInvoice,
  handleUpdateInvoice,
  handleGetTransactionsFromInvoice,
  handleGetTransactionsForInvoice,
} from "~/handlers/invoiceHandlers";

const intentHandler: Record<string, IntentHandler> = {
  save_invoice: handleSaveInvoice,
  update_invoice: handleUpdateInvoice,
  delete_invoice: handleDeleteInvoice,
  get_transactions_for_invoice: handleGetTransactionsForInvoice,
  get_transactions_from_invoice: handleGetTransactionsFromInvoice,
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (!intent || typeof intent !== "string")
    return Response.json({ success: false, message: "No intent provided" });

  const handler = intentHandler[intent];
  if (!handler)
    return Response.json({ success: false, message: "Unknown intent" });
  try {
    const result = await handler(formData);

    return result;
  } catch (error) {
    console.error("There was a server error: ", error);
    return Response.json({
      success: false,
      message:
        "That was not supposed to happen! There was an unexpected error.",
    });
  }
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const [family, transactions, invoices, lastInvoice] = await Promise.all([
    getFamily(name),
    getFamilyTransactions(params.id),
    getInvoiceForFamily(params.id),
    getLastInvoice(),
  ]);
  return Response.json({ family, transactions, invoices, lastInvoice });
};

type Transaction = {
  [key: string]: string | number;
};

interface InvoiceRecreationPayload {
  family: FamilyRecord[];
  transactions: TransactionRecord[];
  invoices: InvoiceRecord[];
  lastInvoice: InvoiceRecord[];
}

const Invoices = () => {
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get("name");
  const [dateState, setDateState] = useState({
    invoice_start_date: "",
    invoice_end_date: "",
  });

  const revalidator = useRevalidator();
  const fetcher = useFetcher();
  const getUpdateDeleteFetcher = useFetcher();
  const getTransactionsFetcher = useFetcher<InvoiceRecreationPayload>();
  const generateInvoiceFetcher = useFetcher();
  const { family, invoices, lastInvoice } = useLoaderData<typeof loader>();
  const familyAccount: FamilyRecord = family[0];
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDateState({ ...dateState, [name]: value });
  };
  const statusDialogRef = useRef<HTMLDialogElement>(null);
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceRecord>();
  const toast = useToast();
  const [invoiceToView, setInvoiceToView] = useState<InvoiceRecord | null>(
    null
  );

  const generateInvoice = async () => {
    if (!params.id) throw new Error("Id is missing");
    const transactionQueryData = {
      invoice_start_date: dateState.invoice_start_date,
      invoice_end_date: dateState.invoice_end_date,
      account_id: params.id,
    };
    if (transactionQueryData !== undefined) {
      generateInvoiceFetcher.submit(
        {
          intent: "get_transactions_for_invoice",
          invoice_start_date: transactionQueryData.invoice_start_date,
          invoice_end_date: transactionQueryData.invoice_end_date,
          account_id: Number(transactionQueryData.account_id),
        },
        {
          method: "POST",
        }
      );
    }
  };

  const generateInvoiceNumber = () => {
    const lastInvoiceNumber = lastInvoice[0].invoice_number
      ? lastInvoice[0].invoice_number
      : "001";
    // const invoiceNumber = `${new Date().getMonth() + 1}${new Date().getDate()}${
    //   lastInvoiceNumber + 1
    // }`;
    const invoiceNumber = lastInvoiceNumber + 1;

    return String(invoiceNumber);
  };

  const calculateTotal = (transactions: TransactionRecord[]) => {
    if (!transactions) return;
    let total = 0;
    for (const item of transactions) {
      const amount = Number(item.transaction_amount);
      if (isNaN(amount))
        throw new Error(
          `Amount is not a valid number: ${item.transaction_amount}`
        );
      if (item.transaction_type === "payment") {
        total -= amount;
      } else if (item.transaction_type === "charge") {
        total += amount;
      } else if (item.transaction_type === "refund") {
        total -= amount;
      } else if (item.transaction_amount === "discount") {
        total -= amount;
      }
    }
    return total;
  };

  const filteredInvoices = invoices.filter(
    (invoice: InvoiceRecord) => invoice.invoice_number !== null
  );

  const handleInvoiceDelete = (invoiceId: number | undefined) => {
    if (invoiceId !== undefined) {
      getUpdateDeleteFetcher.submit(
        {
          intent: "delete_invoice",
          delete_invoice_id: invoiceId,
        },
        {
          method: "POST",
        }
      );
      revalidator.revalidate();
    } else {
      toast.error("Unable to delete invoice");
      throw new Error("InvoiceId is not valid");
    }
  };

  const prepareInvoiceInputs = (
    familyAcc: FamilyRecord,
    invoiceNumber: string,
    invoiceDate: string,
    transactionsArray: TransactionRecord[],
    calculatedTotal: number
  ) => {
    const convertedAmountArray = transactionsArray.map(
      (transaction: TransactionRecord) => {
        return {
          ...transaction,
          transaction_description: transaction?.transaction_description ?? "",
          transaction_amount: formatter
            .format(convertToCurrency(Number(transaction.transaction_amount)))
            .toString(),
        };
      }
    );

    const keysForList = [
      "transaction_description",
      "transaction_type",
      "transaction_amount",
    ];
    const transactionsToList = convertedAmountArray.map((transaction) => {
      return keysForList
        .filter((key) => Object.hasOwn(transaction, key))
        .map((key) => transaction[key as keyof typeof transaction]);
    });

    const formattedTotal = formatter.format(convertToCurrency(calculatedTotal));

    return {
      head: "Lauderdale Invoice",
      billedToInput: `${familyAcc.parent1_first_name} ${familyAcc.parent1_last_name} \n${familyAcc.parent1_address}`,
      info: JSON.stringify({
        InvoiceNo: invoiceNumber,
        Date: invoiceDate,
      }),
      orders: transactionsToList,
      total: formattedTotal,
      thankyou: "Thank you",
      paymentInfoInput:
        "Lloyds Bank\nAccount Name: Lauderdale Groups\nAccount Number: 123456",
    };
  };

  useEffect(() => {
    if (
      generateInvoiceFetcher.state === "idle" &&
      generateInvoiceFetcher.data
    ) {
      const result = generateInvoiceFetcher.data as {
        success: boolean;
        data?: TransactionRecord[];
        message?: string;
      };
      const submittedFormData = generateInvoiceFetcher.formData;
      let submittedIntent: FormDataEntryValue | null = null;
      if (submittedFormData) {
        submittedIntent = (submittedFormData as FormData)?.get("intent");
      }
      if (result.success) {
        if (
          // submittedIntent === "get_transactions_for_invoice" &&
          result?.data
        ) {
          // toast.success(result.message || "Transactions retrieved.");

          const invoiceNumber = generateInvoiceNumber();
          const invoiceDate = new Date().toLocaleString();
          const calculatedTotal = Number(calculateTotal(result.data));
          const invoiceInputs = prepareInvoiceInputs(
            familyAccount,
            invoiceNumber,
            invoiceDate,
            result.data,
            calculatedTotal
          );
          generatePdf(invoiceInputs);

          const invoiceToSave: InvoiceRecord = {
            invoice_number: invoiceNumber,
            total_amount: Number(calculatedTotal),
            account_id: Number(params.id),
            invoice_date: invoiceDate,
          };

          const transactionsToSave = result.data.map(
            (transaction: TransactionRecord) => ({
              ...transaction,
              item_description:
                transaction.transaction_description ??
                transaction.transaction_type,
              item_type: transaction.transaction_type,
              item_amount: transaction.transaction_amount,
              invoice_number: invoiceNumber,
            })
          );

          const saveData = {
            invoice: invoiceToSave,
            transactions: transactionsToSave,
          };

          generateInvoiceFetcher.submit(
            {
              intent: "save_invoice",
              save_invoice_data: JSON.stringify(saveData),
            },
            { method: "POST" }
          );
        } else if (submittedIntent === "save_invoice") {
          toast.success(result.message || "Invoice saved successfully!");
          revalidator.revalidate();
        }
      } else {
        toast.error(result.message || "Invoice generation process failed.");
      }
    }
    // Disabling dependencies for next line because adding in toast would cause endless re-renders, it handleShowStatusModal
    // doesn't need to run on revalidate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    generateInvoiceFetcher.state,
    generateInvoiceFetcher.data,
    generateInvoiceFetcher.formData,
    familyAccount,
    params.id,
    lastInvoice,
  ]);

  const handleInvoiceView = (invoice: InvoiceRecord) => {
    if (invoice.invoice_id !== undefined) {
      getTransactionsFetcher.submit({
        intent: "get_transactions_for_invoice",
        invoice_id: invoice.invoice_id,
      });
      setInvoiceToView(invoice);
    }
  };

  useEffect(() => {
    if (
      getTransactionsFetcher.state === "idle" &&
      getTransactionsFetcher.data
    ) {
      const invoiceData = getTransactionsFetcher.data;
      const transactions = invoiceData.transactions;
      const formattedTransactions = transactions?.map(
        (transaction: TransactionRecord) => {
          return {
            ...transaction,
            item_description: transaction?.transaction_description ?? "",
            item_type: transaction?.transaction_type,
            item_amount: formatter
              .format(
                convertToCurrency(
                  transaction.transaction_amount as number // TODO fix this casting
                )
              )
              .toString(),
          };
        }
      );
      const keysForList = ["item_description", "item_type", "item_amount"];

      const transactionsToList = formattedTransactions?.map(
        (transaction: Transaction) => {
          return keysForList
            .filter((key) => Object.hasOwn(transaction, key))
            .map((key) => transaction[key]);
        }
      );
      const viewTotal = convertToCurrency(Number(invoiceToView?.total_amount));
      const formattedTotal = formatter.format(viewTotal);
      const invoiceViewInputs = {
        head: "Lauderdale Invoice",
        billedToInput: `${familyAccount.parent1_first_name} ${familyAccount.parent1_last_name} \n${familyAccount.parent1_address}`,
        info: JSON.stringify({
          InvoiceNo: invoiceToView?.invoice_number,
          Date: invoiceToView?.invoice_date,
        }),
        orders: transactionsToList,
        total: formattedTotal,
        thankyou: "Thank you",
        paymentInfoInput:
          "Lloyds Bank\nAccount Name: Lauderdale Groups\nAccount Number: 123456",
      };
      generatePdf(invoiceViewInputs);
      setInvoiceToView(null);
    }
    // Disabling dependencies for next line because adding in toast would cause endless re-renders, it handleShowStatusModal
    // doesn't need to run on revalidate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getTransactionsFetcher.state,
    getTransactionsFetcher.data,
    getTransactionsFetcher.formData,
    familyAccount,
    params.id,
    lastInvoice,
  ]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (invoiceStatus) {
      setInvoiceStatus({ ...invoiceStatus, [name]: value });
    }
  };

  const handleShowStatusModal = (invoice: InvoiceRecord) => {
    if (invoice && invoice.invoice_status) {
      setInvoiceStatus(invoice);
      statusDialogRef.current?.showModal();
    } else {
      console.warn("Invoice did not contain a status");
      return;
    }
  };

  const handleModalSave = () => {
    if (invoiceStatus !== undefined) {
      fetcher.submit(
        {
          intent: "update_invoice",
          update_invoice_data: JSON.stringify(invoiceStatus),
        },
        { method: "POST" }
      );

      revalidator.revalidate();
      statusDialogRef.current?.close();
    } else
      toast.error("There was a problem updating the status of this invoice");
  };

  // TODO - fix conditional icons based on theme

  // const deleteIcon = () => {
  //   if (typeof window !== "undefined") {
  //     const theme = sessionStorage.getItem("colour-theme");
  //     if (theme === "dark") {
  //       return "/icons8-trash-can-light.svw";
  //     }
  //     return "/icons8-trash-can-black.svg";
  //   }
  // };

  const findInvoice = invoices.filter(
    (invoice: InvoiceRecord) => invoice.invoice_id === invoiceStatus?.invoice_id
  );
  const isFormDirty =
    JSON.stringify(invoiceStatus) !== JSON.stringify(findInvoice[0])
      ? true
      : false;

  return (
    <>
      <Link to={`/families/${param}`} viewTransition>
        <button className="btn-link">Back</button>
      </Link>
      <h2 className="mt-4 font-bold">{`Invoices for ${familyAccount.family_last_name} Family`}</h2>
      <div className="h-1 border-2 border-black mr-4"></div>
      <section className="mt-2 flex gap-2 items-center">
        <h2 className="font-semibold">Create invoice:</h2>
        <label htmlFor="invoice_start_date">Start Date</label>
        <input
          type="date"
          name="invoice_start_date"
          className="input input-bordered"
          onChange={handleDateChange}
        />
        <label htmlFor="invoice_end_date">End Date</label>
        <input
          type="date"
          name="invoice_end_date"
          className="input input-bordered"
          onChange={handleDateChange}
        />
        <button className="btn btn-accent w-fit" onClick={generateInvoice}>
          Generate invoice
        </button>
      </section>
      <section>
        <h2 className="mt-4 font-bold">Previous Invoices</h2>
        <div className="h-1 border-2 border-black mr-4"></div>
        {invoices?.length === 0 ? (
          <div className="w-fit mr-auto ml-auto mt-5 font-bold text-cyan-500">
            ...no invoices found
          </div>
        ) : (
          <table className="table table-xs table-zebra w-2/3">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Invoice Date</th>
                <th>Invoice Amont</th>
                <th>Invoice Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice: InvoiceRecord) => {
                return (
                  <tr key={invoice.invoice_number}>
                    <td>{invoice.invoice_number}</td>
                    <td>{invoice.invoice_date}</td>
                    <td>£{convertToCurrency(Number(invoice.total_amount))}</td>
                    <td
                      className="capitalize hover:cursor-pointer"
                      onClick={() => handleShowStatusModal(invoice)}
                    >
                      {invoice.invoice_status}
                    </td>
                    <td className="flex gap-1">
                      <button
                        onClick={() => handleInvoiceDelete(invoice.invoice_id)}
                      >
                        <img
                          src="/delete.svg"
                          title="Delete invoice"
                          alt="Delete invoice"
                          className="hover:cursor-pointer pl-2"
                          style={{ height: "20px" }}
                        />
                      </button>
                      <button onClick={() => handleInvoiceView(invoice)}>
                        <img
                          src="/view.svg"
                          alt="View invoice"
                          title="View invoice"
                          style={{ height: "20px" }}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
      <dialog ref={statusDialogRef} className="modal">
        <div className="modal-box flex flex-col gap-4">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => statusDialogRef.current?.close()}
          >
            ✕
          </button>

          <h2 className="font-bold mb-4">Change Status</h2>
          <select
            name="invoice_status"
            className="select select-bordered"
            onChange={handleStatusChange}
            value={invoiceStatus?.invoice_status}
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <button
            className={
              isFormDirty ? "btn btn-primary ml-4" : "btn btn-disabled ml-4"
            }
            onClick={handleModalSave}
          >
            Save
          </button>
        </div>
      </dialog>
    </>
  );
};

export default Invoices;
