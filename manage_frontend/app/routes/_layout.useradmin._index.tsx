import { useLoaderData, Link } from "@remix-run/react";
import { getUsers } from "~/data/data";

export const loader = async () => {
  return await getUsers();
};

const UserAdmin = () => {
  const users = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">User settings</h1>
      <Link to={"/useradmin/add"}>
        <button className="btn btn-outline btn-primary btn-sm mb-4">
          Add User
        </button>
      </Link>
      <div className="h-1 border-2 border-black mr-4"></div>
      <h2>Current users</h2>
      <table className="table table-xs">
        <thead>
          <tr>
            <td>Email</td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {users ? (
            users.map((user: { user_id: number; email: string }) => {
              return (
                <tr key={user.user_id}>
                  <td>{user.email}</td>
                  <td>
                    <button className="btn btn-soft btn-info btn-sm mr-4">
                      Change Password
                    </button>
                    <button className="btn btn-soft btn-error btn-sm">
                      Delete user
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>No users</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserAdmin;
