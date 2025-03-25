import { calculateTotal } from "~/routes/_layout.families.$id.account";
import { expect, test } from "vitest";
import { TransactionRecord } from "~/types/types";

const testTransactionArrayCharges: TransactionRecord[] = [
  {
    id: 1,
    account_id: 1234,
    transaction_date: "01/01/2020",
    transaction_amount: 100,
    transaction_type: "charge",
  },
  {
    id: 2,
    account_id: 1234,
    transaction_date: "01/01/2020",
    transaction_amount: 100,
    transaction_type: "charge",
  },
  {
    id: 3,
    account_id: 1234,
    transaction_date: "01/01/2020",
    transaction_amount: 100,
    transaction_type: "charge",
  },
];

const testTransactionArrayPayments: TransactionRecord[] = [
  {
    id: 1,
    account_id: 1234,
    transaction_date: "01/01/2020",
    transaction_amount: 100,
    transaction_type: "payment",
  },
  {
    id: 2,
    account_id: 1234,
    transaction_date: "01/01/2020",
    transaction_amount: 100,
    transaction_type: "charge",
  },
  {
    id: 3,
    account_id: 1234,
    transaction_date: "01/01/2020",
    transaction_amount: 100,
    transaction_type: "charge",
  },
];

test("calculates total correctly", () => {
  expect(calculateTotal(testTransactionArrayCharges)).toEqual(-300);
  expect(calculateTotal(testTransactionArrayPayments)).toEqual(-100);
});
