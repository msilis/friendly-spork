import { useLoaderData } from "@remix-run/react";
import { getAllInvoices, getStudents, getTeachers } from "~/data/data";
import { InvoiceRecord } from "~/types/types";
import { convertToCurrency } from "~/utils/pdf-utils";

export const loader = async () => {
  const [invoices, students, teachers] = await Promise.all([
    getAllInvoices(),
    getStudents(),
    getTeachers(),
  ]);
  return Response.json({ invoices, students, teachers });
};

const Dashboard = () => {
  const { invoices, students, teachers } = useLoaderData<typeof loader>();
  const filteredInvoices: InvoiceRecord[] = invoices.filter(
    (invoice: InvoiceRecord) => invoice.invoice_status !== "paid"
  );

  const totalOutstandingAmount = filteredInvoices.reduce(
    (n: number, { total_amount }) => {
      return n + Number(total_amount);
    },
    0
  );

  const totalStudents = students.length;
  const totalTeachers = teachers.length;

  return (
    <div>
      <h2 className="font-bold text-lg">Dashboard</h2>
      <div className="h-1 border-2 border-black mr-4"></div>
      <section className="flex flex-col gap-2 mt-4">
        <h2 className="text-xl font-bold">At a glance...</h2>
        <div className="flex gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total outstanding invoices</div>
              <div className="stat-value">{`£${convertToCurrency(
                totalOutstandingAmount
              )}`}</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Current Students</div>
              <div className="stat-value">{totalStudents}</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Current Teachers</div>
              <div className="stat-value">{totalTeachers}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
