import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { sessionStorage } from "~/utils/models/user.server";
import {
  useLoaderData,
  Link,
  useRevalidator,
  useFetcher,
} from "@remix-run/react";
import { useRef } from "react";
import { deleteUser, getUsers, updatePassword } from "~/data/data.server";
import { useToast } from "~/hooks/hooks";

interface ActionResponse {
  success: boolean;
  message: string;
}

type UserType = {
  user_id: number;
  email: string;
  hashedPassword: string;
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "update") {
    const userIdToUpdate = formData.get("id");
    const passwordToUpdate = formData.get("password");
    if (
      typeof userIdToUpdate === "string" &&
      typeof passwordToUpdate === "string" &&
      userIdToUpdate &&
      passwordToUpdate
    ) {
      try {
        const updatedData = {
          id: userIdToUpdate.toString(),
          password: passwordToUpdate.toString(),
        };
        const result = await updatePassword(updatedData);
        if (result?.success) {
          return Response.json({ success: true, message: "Password updated" });
        } else
          return Response.json({
            success: false,
            message: "There was an error updating the password",
          });
      } catch (error) {
        console.log("Error updating password: ", error);
        return Response.json({
          success: false,
          message: "Error updating password",
        });
      }
    } else
      return Response.json({ success: false, message: "Invalid form data" });
  } else if (intent === "delete") {
    const userToDelete = formData.get("user_id");
    if (typeof userToDelete === "string" && userToDelete) {
      try {
        const result = await deleteUser({
          userId: userToDelete,
        });
        if (result?.success) {
          return Response.json({ success: true, message: "User deleted" });
        } else
          return Response.json({
            success: false,
            message: "Error deleting user",
          });
      } catch (error) {
        console.error("Network error ", error);
        return Response.json({
          success: false,
          message: "There was a network error",
        });
      }
    }
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");
  const userEmail = user.email;
  try {
    const users = await getUsers();
    const mappedUsers = users.map((user: UserType) => {
      return { user_id: user.user_id, email: user.email };
    });
    return Response.json({ mappedUsers, userEmail });
  } catch (error) {
    console.error("Error fetching users: ", error);
    return Response.json(
      {
        message:
          "Sorry, there was an error getting users, please try again later",
      },
      { status: 500 }
    );
  }
};

const UserAdmin = () => {
  const loaderData = useLoaderData<{
    message?: string;
    mappedUsers?: { email: string; user_id: number }[];
    userEmail: string;
  }>();
  const users: { email: string; user_id: number }[] | undefined =
    loaderData.mappedUsers;
  const currentUser = loaderData.userEmail;
  const errorMessage = loaderData.message;
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const passwordRef = useRef<HTMLDialogElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const revalidate = useRevalidator();
  let userToDelete: number | string | undefined;
  let userToUpdate: number | string | undefined;
  const fetcher = useFetcher<ActionResponse | undefined>();
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
      if (
        userToUpdate !== undefined &&
        passwordInputRef.current?.value !== undefined
      ) {
        fetcher.submit(
          {
            id: userToUpdate,
            password: passwordInputRef.current?.value,
          },
          { method: "POST" }
        );
        passwordInputRef?.current?.value &&
          (passwordInputRef.current.value = "");
        confirmPasswordInputRef?.current?.value &&
          (confirmPasswordInputRef.current.value = "");
        passwordRef.current?.close();
        toast.success("Password has been updated");
      } else toast.error("There was an error updating the password");
    }
  };
  const handleDeleteUser = (
    id: number | undefined,
    email: string | undefined
  ) => {
    if (email === currentUser) {
      toast.error("Cannot delete currently logged-in user");
      return;
    }
    if (users && users?.length <= 1) {
      toast.error("Cannot delete last user");
      return;
    }
    confirmationRef.current?.showModal();
    userToDelete = id;
  };

  const handleDeleteConfirmation = () => {
    if (userToDelete !== undefined) {
      fetcher.submit(
        {
          intent: "delete",
          user_id: userToDelete.toString(),
        },
        { method: "POST" }
      );
      userToDelete = undefined;
      confirmationRef.current?.close();
      revalidate.revalidate();
      toast.success("User deleted successfully");
    } else return toast.error("There was an error deleting the user");
  };

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
          {users?.length ? (
            users?.map((user: { user_id: number; email: string }) => {
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
                      onClick={() => handleDeleteUser(user.user_id, user.email)}
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
