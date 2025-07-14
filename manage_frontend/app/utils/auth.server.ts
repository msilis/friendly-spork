import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { User } from "./models/user.server";
import { login } from "~/data/data.server";
export const authenticator = new Authenticator<User | Error | null>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const userLogin = await login({ email, password });
    if (userLogin?.token) {
      return { ...userLogin, email: email };
    } else {
      throw new Error(
        `Invalid credentials: ${email} - email, ${password} - password`
      );
    }
  }),
  "email-pass"
);
