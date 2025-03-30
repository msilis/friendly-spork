const Login = () => {
  return (
    <main className="w-96 m-auto justify-center">
      <form className="flex flex-col">
        <label htmlFor="email" className="mt-6">
          Email
        </label>
        <input name="email" className="input input-primary" required />
        <label htmlFor="password" className="mt-5">
          Password
        </label>
        <input className="input input-primary" type="password" required />
        <button className="btn btn-primary mt-4">Login</button>
      </form>
    </main>
  );
};

export default Login;
