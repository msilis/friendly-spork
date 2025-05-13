import { useLoaderData } from "@remix-run/react";
import { getAllInvoices, getStudents, getTeachers } from "~/data/data";
import { InvoiceRecord, StudentRecord, TeacherRecord } from "~/types/types";
import { convertToCurrency } from "~/utils/pdf-utils";

export const loader = async () => {
  try {
    const [invoices, students, teachers] = await Promise.all([
      getAllInvoices(),
      getStudents(),
      getTeachers(),
    ]);
    return Response.json({ invoices, students, teachers });
  } catch (error) {
    console.error(
      "There was an error getting information from the database: ",
      error
    );
    return Response.json(
      {
        message:
          "Sorry, there was an error getting information from the database. Please try again later.",
      },
      { status: 500 }
    );
  }
};

const Dashboard = () => {
  const { invoices, students, teachers, message } = useLoaderData<{
    invoices?: InvoiceRecord[];
    students?: StudentRecord[];
    teachers?: TeacherRecord[];
    message?: string;
  }>();
  const filteredInvoices: InvoiceRecord[] | undefined = invoices?.filter(
    (invoice: InvoiceRecord) => invoice.invoice_status !== "paid"
  );

  const totalOutstandingAmount = filteredInvoices?.reduce(
    (n: number, { total_amount }) => {
      return n + Number(total_amount);
    },
    0
  );
  const errorMessage = message;
  const totalStudents = students?.length;
  const totalTeachers = teachers?.length;

  if (errorMessage) {
    return (
      <div className="alert alert-error w-5/6 mt-8">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          className="w-6 h-6 stroke-current mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
        <span>{errorMessage}</span>
      </div>
    );
  }

  return (
    <div data-testid="dashboardContainer">
      <h2 className="font-bold text-lg">Dashboard</h2>
      <div className="h-1 border-2 border-black mr-4"></div>
      <section className="flex flex-col gap-2 mt-4">
        <h2 className="text-xl font-bold">At a glance...</h2>
        <div className="flex gap-4">
          {totalOutstandingAmount ? (
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total outstanding invoices</div>
                <div className="stat-value">{`£${convertToCurrency(
                  totalOutstandingAmount
                )}`}</div>
              </div>
            </div>
          ) : null}
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
