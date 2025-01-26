import { useParams } from "@remix-run/react";

const Invoices = () => {
  const params = useParams();
  return (
    <div>{`You're on the invocie page for family with id: ${params.id}`}</div>
  );
};

export default Invoices;
