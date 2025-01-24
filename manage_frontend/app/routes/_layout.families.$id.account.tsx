import {
  Link,
  useSearchParams,
  useLoaderData,
  useParams,
  useRevalidator,
} from "@remix-run/react";
import { useState, useRef } from "react";
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
  const [modalTransaction, setModalTransaction] = useState<TransactionRecord>({
    id: 0,
    transaction_date: "",
    account_id: 0,
    transaction_type: "",
    transaction_amount: 0,
  });

  const [showToast, setShowToast] = useState(false);
  const revalidator = useRevalidator();
  const editRef = useRef<HTMLDialogElement>(null);
  const convertAmount = (amount: number) => {
    return Math.round(amount * 100);
  };
  const convertToCurrency = (amount: number) => {
    return amount / 100;
  };

  const { family, transactions } = useLoaderData<typeof loader>();
  const familyAccount: FamilyRecord = family[0];

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    let newValue: string | number = value;
    if (name === "transaction_amount") {
      newValue = Number(value);
    }

    setTransactionData({ ...transactionData, [name]: newValue });
  };

  const showToastMessage = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const calculateTotal = (transactionArray: TransactionRecord) => {
    let total = 0;
    for (const transaction of transactionArray) {
      if (transaction.transaction_type === "payment") {
        total = total - transaction.transaction_amount;
      } else if (transaction.transaction_type === "charge") {
        total = total + transaction.transaction_amount;
      }
    }

    return total;
  };

  const findTransactions = (id: number | undefined) => {
    return transactions.find((transaction: TransactionRecord) => {
      return transaction.id === id;
    });
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
    showToastMessage();
  };

  const calculatedTotal = convertToCurrency(calculateTotal(transactions));

  const handleEditClick = async (id: number | undefined) => {
    const data = findTransactions(id);
    setModalTransaction({
      id: data.id,
      account_id: data.account_id,
      transaction_date: data.transaction_date,
      transaction_amount: data.transaction_amount,
      transaction_type: data.transaction_type,
      description: null,
    });
    editRef.current?.showModal();
  };

  const handleModalChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    let newValue: string | number = value;
    if (name === "transaction_amount") {
      newValue = Number(value);
    }

    setModalTransaction({ ...modalTransaction, [name]: newValue });
  };

  const isFormDirty =
    JSON.stringify(modalTransaction) !==
    JSON.stringify(findTransactions(modalTransaction.id))
      ? true
      : false;

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
          onChange={handleChange}
          className="select select-bordered w-fit max-w-xs"
          value={transactionData.transaction_type}
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
      <section className="mt-4">
        <h2 className="font-bold mt-2">Recent Transactions</h2>
        <h3
          className={`${
            calculatedTotal >= 0 ? "text-green-400" : "text-red-700"
          }`}
        >
          Balance: £{calculatedTotal}
        </h3>
        <div className="h-1 border-2 border-black w-2/3"></div>
        <div className="overflow-x-auto mt-6">
          <table className="table table-xs table-zebra w-2/3">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map(
                (transaction: TransactionRecord, index: number) => {
                  const transactionType = transaction.transaction_type;
                  return (
                    <tr key={`${transaction.id}-${index}`}>
                      <td>{transaction.transaction_date}</td>
                      <td>
                        {transactionType[0]?.toUpperCase()}
                        {transactionType?.substring(1)}
                      </td>
                      <td
                        onClick={() => handleEditClick(transaction?.id)}
                        className={`${
                          transaction.transaction_type === "charge"
                            ? "text-red-700"
                            : ""
                        } ${
                          transaction.transaction_type === "payment"
                            ? "text-green-400"
                            : ""
                        } ${"hover:cursor-pointer"}`}
                      >
                        £
                        {convertToCurrency(
                          Number(transaction.transaction_amount)
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </section>
      <dialog ref={editRef} className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => editRef.current?.close()}
          >
            ✕
          </button>
          <h2 className="font-bold">Edit Transaction</h2>
          <div className="flex flex-col">
            <label htmlFor="transaction_type">Transaction Type</label>
            <select
              name="transaction_type"
              id="transaction_type"
              onChange={handleModalChange}
              className="select select-bordered w-fit max-w-xs"
              value={modalTransaction.transaction_type}
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
              value={convertToCurrency(
                Number(modalTransaction.transaction_amount)
              )}
              onChange={handleModalChange}
            />
            <label htmlFor="transaction_date">Date</label>
            <input
              type="date"
              className="input input-bordered"
              name="transaction_date"
              id="transaction_date"
              onChange={handleModalChange}
              value={modalTransaction.transaction_date}
            />
            <button
              className={
                isFormDirty
                  ? "btn btn-sm btn-info text-white mt-4 w-fit"
                  : "btn btn-disabled btn-sm mt-4 w-fit"
              }
            >
              Update
            </button>
          </div>
        </div>
      </dialog>
      {showToast ? (
        <div className="toast">
          <div className="alert alert-info">
            <span>Transaction saved</span>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FamilyAccount;
