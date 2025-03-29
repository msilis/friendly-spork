import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { User, authenticateUser } from "./models/user.server";

export const authenticator = new Authenticator<User | null>();

authenticator.use(
  new FormStrategy(async ({ form, request }) => {
    let username = form.get("username");
    let password = form.get("password");

    //hash password here

    const user = await authenticateUser(username, password);
    return user;
  })
  "user-pass"
);
