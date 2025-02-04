import {
  useParams,
  Link,
  useSearchParams,
  useLoaderData,
} from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { convertToCurrency, formatter, generatePdf } from "~/utils/pdf-utils";
import {
  getAllInvoices,
  getFamily,
  getFamilyTransactions,
  getInvoiceForFamily,
  getTransactionsForInvoice,
  saveInvoice,
} from "~/data/data";
import {
  FamilyRecord,
  TransactionRecord,
  InvoiceRecord,
  InvoiceItemRecord,
} from "~/types/types";
import { useState } from "react";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const [family, transactions, invoices] = await Promise.all([
    getFamily(name),
    getFamilyTransactions(params.id),
    getInvoiceForFamily(params.id),
  ]);
  return Response.json({ family, transactions, invoices });
};

type Transaction = {
  [key: string]: string | number;
};

const Invoices = () => {
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get("name");
  const [dateState, setDateState] = useState({
    invoice_start_date: "",
    invoice_end_date: "",
  });

  const { family, invoices } = useLoaderData<typeof loader>();
  const familyAccount: FamilyRecord = family[0];
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDateState({ ...dateState, [name]: value });
  };

  const getTransactions = async () => {
    if (!params.id) throw new Error("Id is missing");
    const transactionQueryData = {
      invoice_start_date: dateState.invoice_start_date,
      invoice_end_date: dateState.invoice_end_date,
      account_id: params.id,
    };
    const transactions = await getTransactionsForInvoice(transactionQueryData);
    if (!transactions.length)
      throw new Error(
        "No transactions for this family or no transactions for this date range"
      );
    return transactions;
  };

  const calculateTotal = (transactions: TransactionRecord[]) => {
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

  const handleGenerateClick = async () => {
    const transactionArray = await getTransactions();
    const convertedAmountArray = transactionArray.map(
      (transaction: Transaction) => {
        return {
          ...transaction,
          transaction_description: transaction?.transaction_description ?? "",
          transaction_amount: convertToCurrency(
            transaction.transaction_amount as number // TODO fix this casting
          ).toString(),
        };
      }
    );
    const keysForList = [
      "transaction_description",
      "transaction_type",
      "transaction_amount",
    ];
    const transactionsToList = convertedAmountArray.map(
      (transaction: Transaction) => {
        return keysForList
          .filter((key) => Object.hasOwn(transaction, key))
          .map((key) => transaction[key]);
      }
    );
    const calculatedTotal = calculateTotal(transactionArray);
    const invoiceTotal = convertToCurrency(calculatedTotal);
    const formattedTotal = formatter.format(invoiceTotal);
    const invoiceNumber = Date.now();
    const invoiceDate = new Date().toLocaleString();

    const invoiceInputs = {
      head: "Lauderdale Invoice",
      billedToInput: `${familyAccount.parent1_first_name} ${familyAccount.parent1_last_name} \n${familyAccount.parent1_address}`,
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

    const invoiceToSave: InvoiceRecord = {
      invoice_number: invoiceNumber,
      total_amount: calculatedTotal,
      account_id: Number(params.id),
      invoice_date: invoiceDate,
    };

    const removeNullsArray = transactionArray.map(
      (transaction: TransactionRecord) => {
        return {
          ...transaction,
          item_description:
            transaction?.transaction_description ??
            transaction.transaction_type,
          item_type: transaction.transaction_type,
          item_amount: transaction.transaction_amount,
          invoice_number: invoiceNumber,
        };
      }
    );

    const saveData = {
      invoice: invoiceToSave,
      transactions: removeNullsArray,
    };

    saveInvoice(saveData);

    generatePdf(invoiceInputs);
  };

  const filteredInvoices = invoices.filter(
    (invoice: InvoiceRecord) => invoice.invoice_number !== null
  );

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
        <button className="btn btn-accent w-fit" onClick={handleGenerateClick}>
          Generate invoice
        </button>
      </section>
      <section>
        <h2 className="mt-4 font-bold">Previous Invoices</h2>
        <div className="h-1 border-2 border-black mr-4"></div>
        {invoices.length === 0 ? (
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
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice: InvoiceRecord) => {
                return (
                  <tr key={invoice.invoice_number}>
                    <td>{invoice.invoice_number}</td>
                    <td>{invoice.invoice_date}</td>
                    <td>{invoice.total_amount}</td>
                    <td className="capitalize">{invoice.invoice_status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
};

export default Invoices;
