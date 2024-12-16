import { Link } from "@remix-run/react";

const Classes = () => {
  return (
    <div>
      <Link to={"/classes/add"}>
        <button className="btn-link">Add Class</button>
      </Link>
      <div className="overflow-x-auto">
        <h1 className="text-xl">Classes</h1>
        <table className="table table-xs">
          <thead>
            <tr>
              <th>ID</th>
              <th>Class Name</th>
              <th>Class Location</th>
              <th>Class Start Time</th>
              <th>Class End Time</th>
              <th>Class Teacher</th>
              <th>Class Accompanist</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default Classes;
