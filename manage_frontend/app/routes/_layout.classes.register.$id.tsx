import { useParams, useNavigate } from "@remix-run/react";

const Register = () => {
  const params = useParams();
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(`/classes/${params.id}`);
  };

  return (
    <div>
      <h2>Register</h2>
      <button className="btn btn-link" onClick={handleBackClick}>
        Back
      </button>
    </div>
  );
};

export default Register;
