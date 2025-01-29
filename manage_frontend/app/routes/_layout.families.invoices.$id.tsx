import {
  useParams,
  Link,
  useSearchParams,
  useLoaderData,
} from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useEffect } from "react";
import { getFamily, getFamilyTransactions } from "~/data/data";
import { FamilyRecord } from "~/types/types";
import { BasePdf } from "node_modules/@pdfme/common/dist/types/src/schema";
import { position } from "html2canvas-pro/dist/types/css/property-descriptors/position";

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

  const { family, transactions } = useLoaderData<typeof loader>();
  const familyAccount: FamilyRecord = family[0];

  const getPdfMe = async () => {
    if (typeof window !== "undefined") {
      const { generate } = await import("@pdfme/generator");
      return generate;
    }
    return null;
  };
  const getBlankPdf = async () => {
    if (typeof window !== "undefined") {
      const { BLANK_PDF } = await import("@pdfme/common");
      return BLANK_PDF;
    }
    return null;
  };

  const generatePdf = async () => {
    const generate = await getPdfMe();
    const BLANK_PDF = await getBlankPdf();
    if (generate && BLANK_PDF) {
      const template = {
        basePdf: BLANK_PDF,
        schemas: [
          [
            {
              position: { x: 10, y: 10 },
              width: 200,
              height: 30,
              type: "text",
              name: "title",
            },
          ],
        ],
      };
      const inputs = [{ title: "My PDF" }];
      generate({ template, inputs }).then((pdf) => {
        const blob = new Blob([pdf.buffer], { type: "application/pdf" });
        window.open(URL.createObjectURL(blob));
      });
    }
  };

  const handleGenerateClick = () => {
    generatePdf();
  };

  // const TestPdf = () => {
  //   useEffect(() => {
  //     console.log("useEffect ran");
  //     const generatePdf = async () => {
  //       const generate = await usePdfMe();
  //       const BLANK_PDF = await useBlankPdf();
  //       if (generate) {
  //         const template = {
  //           basePdf: BLANK_PDF,
  //           schemas: [
  //             [
  //               {
  //                 position: { x: 10, y: 10 },
  //                 width: 200,
  //                 height: 30,
  //                 type: "text",
  //                 name: "title",
  //               },
  //             ],
  //           ],
  //         };
  //         const inputs = [{ title: "My PDF" }];
  //         generate({ template, inputs }).then((pdf) => {
  //           const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  //           window.open(URL.createObjectURL(blob));
  //         });
  //       }
  //     };
  //     generatePdf();
  //   }, []);
  //   return <div>This should show something</div>;
  // };

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
        />
        <label htmlFor="invoice_end_date">End Date</label>
        <input
          type="date"
          name="invoice_end_date"
          className="input input-bordered"
        />
        <button className="btn btn-accent w-fit" onClick={handleGenerateClick}>
          Generate invoice
        </button>
      </section>
    </>
  );
};

export default Invoices;
