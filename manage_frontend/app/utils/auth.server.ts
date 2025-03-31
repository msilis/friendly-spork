import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { User } from "./models/user.server";
// import { redirect } from "@remix-run/node";

export const authenticator = new Authenticator<User | Error | null>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    let user = null;

    if (email === "testemail@email.com" && password === "password") {
      user = {
        name: email,
        token: `${password}-${new Date().getTime()}`,
      };

      return user;
    } else {
      throw new Error("Invalid credentials");
    }
  }),
  "email-pass"
);
