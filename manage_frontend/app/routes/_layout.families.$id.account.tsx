import {
  Link,
  useSearchParams,
  useLoaderData,
  useParams,
  useRevalidator,
} from "@remix-run/react";
import { useState } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getFamily, getFamilyTransactions, saveTransaction } from "~/data/data";
import { FamilyRecord, TransactionRecord } from "~/types/types";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const [family, transactions] = await Promise.all([
    getFamily(name),
    getFamilyTransactions(params.id),
  ]);
  return Response.json({ family, transactions });
};

const FamilyAccount = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const date = new Date();
  const param = searchParams.get("name");
  const [transactionData, setTransactionData] = useState<TransactionRecord>({
    transaction_date: date.toISOString().split("T")[0].toString(),
    account_id: Number(params.id),
    transaction_type: "payment",
    transaction_amount: "",
  });
  const revalidator = useRevalidator();
  const convertAmount = (amount: number) => {
    return Math.round(amount * 100);
  };
  const convertToCurrency = (amount: number) => {
    return amount / 100;
  };

  const { family, transactions } = useLoaderData<typeof loader>();
  const familyAccount: FamilyRecord = family[0];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let newValue: string | number = value;
    if (name === "transaction_amount") {
      newValue = Number(value);
    }

    setTransactionData({ ...transactionData, [name]: newValue });
  };

  const handleSave = () => {
    if (
      typeof transactionData.transaction_date !== "string" ||
      typeof transactionData.account_id !== "number" ||
      typeof transactionData.transaction_amount !== "number" ||
      typeof transactionData.transaction_type !== "string"
    ) {
      throw new Error("Invalid data");
    }
    saveTransaction({
      account_id: transactionData.account_id,
      transaction_date: transactionData.transaction_date,
      transaction_type: transactionData.transaction_type,
      transaction_amount: convertAmount(transactionData.transaction_amount),
    });
    revalidator.revalidate();
    setTransactionData({
      transaction_date: date.toISOString().split("T")[0].toString(),
      account_id: Number(params.id),
      transaction_type: "payment",
      transaction_amount: "",
    });
  };

  return (
    <>
      <Link to={`/families/${param}`} viewTransition>
        <button className="btn-link">Back</button>
      </Link>
      <h2 className="mt-4 font-bold">{`Account for ${familyAccount.family_last_name} Family`}</h2>
      <div className="h-1 border-2 border-black w-2/3"></div>
      <section className="mt-2 flex gap-2 items-center">
        <h2 className="font-semibold">Add transaction:</h2>
        <label htmlFor="transaction_type">Transaction Type</label>
        <select
          name="transaction_type"
          id="transaction_type"
          className="select select-bordered w-fit max-w-xs"
          defaultValue={"payment"}
        >
          <option value={"payment"}>Payment</option>
          <option value={"charge"}>Charge</option>
          <option value={"refund"}>Refund</option>
          <option value={"discount"}>Discount</option>
        </select>
        <label htmlFor="transaction_amount">Amount</label>
        <input
          type="number"
          className="input input-bordered"
          style={{ width: 100 }}
          placeholder="£"
          name="transaction_amount"
          value={transactionData.transaction_amount}
          onChange={handleChange}
        />
        <label htmlFor="transaction_date">Date</label>
        <input
          type="date"
          className="input input-bordered"
          name="transaction_date"
          id="transaction_date"
          onChange={handleChange}
          defaultValue={date.toISOString().split("T")[0].toString()}
        />
        <button className="btn btn-info" onClick={handleSave}>
          Save
        </button>
      </section>
    </>
  );
};

export default FamilyAccount;
