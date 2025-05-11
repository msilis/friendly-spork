import { useLoaderData, Link, useRevalidator } from "@remix-run/react";
import { useRef } from "react";
import { deleteUser, getUsers } from "~/data/data";

export const loader = async () => {
  return await getUsers();
};

const UserAdmin = () => {
  const users = useLoaderData<typeof loader>();
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const revalidate = useRevalidator();
  let userToDelete: number | string | undefined;
  const handleUpdatePassword = () => {};
  const handleDeleteUser = (id: number | string | undefined) => {
    confirmationRef.current?.showModal();
    userToDelete = id;
  };

  const handleDeleteConfirmation = () => {
    deleteUser({ userId: userToDelete });
    revalidate.revalidate();
    userToDelete = undefined;
    confirmationRef.current?.close();
  };
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
                    <button
                      className="btn btn-soft btn-info btn-sm mr-4"
                      onClick={handleUpdatePassword}
                    >
                      Change Password
                    </button>
                    <button
                      className="btn btn-soft btn-error btn-sm"
                      onClick={() => handleDeleteUser(user.user_id)}
                    >
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
      <dialog ref={confirmationRef} className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => confirmationRef.current?.close()}
          >
            ✕
          </button>
          <p>
            Are you sure you want to delete this user? <br />
            This cannot be undone.
          </p>
          <div className="flex gap-4 mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => confirmationRef.current?.close()}
            >
              Cancel
            </button>
            <button
              className="btn btn-accent"
              onClick={handleDeleteConfirmation}
            >
              Yes
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default UserAdmin;
