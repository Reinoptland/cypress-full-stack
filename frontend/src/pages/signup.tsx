import NavigationBar from "@/components/NavigationBar";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

const Signup = () => {
  const router = useRouter();
  const [getError, setError] = useState<string | null>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailFromForm = event.currentTarget.mail.value;
    const nameFromForm = event.currentTarget.username.value;
    const passwordFromForm = event.currentTarget.password.value;

    if (
      emailFromForm === undefined ||
      passwordFromForm === undefined ||
      nameFromForm === undefined
    ) {
      // This means something went wrong
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/signup", {
        email: emailFromForm,
        password: passwordFromForm,
        name: nameFromForm,
      });
      setError(null);
      // Store token
      localStorage.setItem("token", response.data.token);
      // Navigate home!
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error?.response?.data.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <>
      <NavigationBar />
      <main>
        <h1>This is the signup page</h1>
        <div>
          <form className="signup-form" onSubmit={handleSubmit}>
            <label htmlFor="username">🏷 username</label>
            <input type="username" id="username" name="username" />

            <label htmlFor="mail">✉️ Email</label>
            <input type="email" id="mail" name="mail" />

            <label htmlFor="password">🔑 Password</label>
            <input type="password" id="password" name="password" />

            <button type="submit">Signup in</button>
          </form>
          {getError && <p className="error-text">{getError}</p>}
        </div>
      </main>
    </>
  );
};

export default Signup;
