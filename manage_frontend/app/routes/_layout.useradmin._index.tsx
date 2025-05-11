import { useLoaderData, Link, useRevalidator } from "@remix-run/react";
import { useRef } from "react";
import { deleteUser, getUsers, updatePassword } from "~/data/data";
import { useToast } from "~/hooks/hooks";

export const loader = async () => {
  return await getUsers();
};

const UserAdmin = () => {
  const users = useLoaderData<typeof loader>();
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const passwordRef = useRef<HTMLDialogElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const revalidate = useRevalidator();
  let userToDelete: number | string | undefined;
  let userToUpdate: number | string | undefined;
  const toast = useToast();
  const handleUpdatePassword = (id: string | number | undefined) => {
    passwordRef.current?.show();
    userToUpdate = id;
  };
  const confirmUpdatePassword = () => {
    if (
      passwordInputRef.current?.value !== confirmPasswordInputRef.current?.value
    ) {
      toast.error("Passwords do not match");
    } else {
      const dataToUpdate = {
        id: userToUpdate,
        password: passwordInputRef.current?.value,
      };
      updatePassword(dataToUpdate);
      passwordInputRef?.current?.value && (passwordInputRef.current.value = "");
      confirmPasswordInputRef?.current?.value &&
        (confirmPasswordInputRef.current.value = "");
      passwordRef.current?.close();
      toast.success("Password has been updated");
    }
  };
  const handleDeleteUser = (id: number | string | undefined) => {
    confirmationRef.current?.showModal();
    userToDelete = id;
  };

  const handleDeleteConfirmation = () => {
    deleteUser({ userId: userToDelete });
    revalidate.revalidate();
    userToDelete = undefined;
    confirmationRef.current?.close();
    toast.success("User deleted successfully");
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
                      onClick={() => handleUpdatePassword(user.user_id)}
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
      <dialog ref={passwordRef} className="modal">
        <div className="modal-box flex flex-col gap-2">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => passwordRef.current?.close()}
          >
            ✕
          </button>
          <label htmlFor="newPassword" className="font-bold">
            New Password
          </label>
          <input
            ref={passwordInputRef}
            type="password"
            name="newPassword"
            defaultValue={passwordInputRef.current?.value}
            placeholder="Password"
            className="input input-bordered w-full max-w-xs"
          />
          <label htmlFor="newPasswordConfirm">Conirm Password</label>
          <input
            ref={confirmPasswordInputRef}
            type="password"
            name="newPasswordConfirm"
            defaultValue={confirmPasswordInputRef.current?.value}
            placeholder="Confirm Password"
            className="input input-bordered w-full max-w-xs"
          />
          <div className="flex gap-2 mt-3">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => passwordRef.current?.close()}
            >
              Cancel
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={confirmUpdatePassword}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default UserAdmin;
