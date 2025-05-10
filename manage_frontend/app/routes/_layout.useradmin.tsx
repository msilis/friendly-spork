import { useLoaderData } from "@remix-run/react";
import { getUsers } from "~/data/data";

export const loader = async () => {
  return await getUsers();
};

const UserAdmin = () => {
  const users = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">User settings</h1>
      <div className="h-1 border-2 border-black mr-4"></div>
      <h2>Current users</h2>
      <table className="table table-xs">
        <thead>
          <tr>
            <td>Email</td>
          </tr>
        </thead>
        <tbody>
          {users ? (
            users.map((user: { email: string }, index: number) => {
              return (
                <tr key={index}>
                  <td>{user?.email}</td>
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
