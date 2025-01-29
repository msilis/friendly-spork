import {
  useParams,
  Link,
  useSearchParams,
  useLoaderData,
} from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { generatePdf } from "~/utils/utils";
import {
  getFamily,
  getFamilyTransactions,
  getTransactionsForInvoice,
} from "~/data/data";
import { FamilyRecord } from "~/types/types";
import { useState } from "react";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const [family, transactions] = await Promise.all([
    getFamily(name),
    getFamilyTransactions(params.id),
  ]);
  return Response.json({ family, transactions });
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

  const { family, transactions } = useLoaderData<typeof loader>();
  const familyAccount: FamilyRecord = family[0];

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDateState({ ...dateState, [name]: value });
  };

  console.log(dateState, "dateState");
  console.log(params, "params");

  const getTransactions = async () => {
    if (!params.id) throw new Error("Id is missing");
    const transactionQueryData = {
      invoice_start_date: dateState.invoice_start_date,
      invoice_end_date: dateState.invoice_end_date,
      account_id: params.id,
    };
    const transactions = await getTransactionsForInvoice(transactionQueryData);
    console.log(transactions, "transactions");
    return transactions;
  };

  const handleGenerateClick = () => {
    getTransactions();
    // generatePdf();
  };

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
    </>
  );
};

export default Invoices;
