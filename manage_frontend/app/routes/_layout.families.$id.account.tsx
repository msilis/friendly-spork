import { Link, useSearchParams, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getFamily, getFamilyTransactions } from "~/data/data";
import { FamilyRecord } from "~/types/types";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  console.log(searchParams, "searchParams");
  const name = searchParams.get("name");
  console.log(name, "query");
  const [family, transactions] = await Promise.all([
    getFamily(name),
    getFamilyTransactions(params.id),
  ]);
  console.log(family[0], "family and transactions");
  return Response.json({ family, transactions });
};

const FamilyAccount = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get("name");

  const { family, transactions } = useLoaderData<typeof loader>();
  const familyAccount: FamilyRecord = family[0];

  return (
    <>
      <Link to={`/families/${param}`} viewTransition>
        <button className="btn-link">Back</button>
      </Link>
      <section>
        <header className="mt-4 font-bold">
          <h2>{`Account for ${familyAccount.family_last_name} Family`}</h2>
        </header>
      </section>
    </>
  );
};

export default FamilyAccount;
