import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const NavigationBar = () => {
  const [token, setToken] = useState<null | string>(null);
  const [user, setUser] = useState<{ email: string; admin: boolean } | null>(
    null
  );

  useEffect(() => {
    const getMe = async (token: string) => {
      const response = await axios.get("http://localhost:3001/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Here you have acces to the data
      console.log(response.data);
      setUser(response.data.user);
    };

    const tokenFromLS = localStorage.getItem("token");
    if (tokenFromLS === null) {
      return;
    }
    if (tokenFromLS) {
      setToken(tokenFromLS);
    }
    getMe(tokenFromLS);
  }, []);

  const handleClick = () => {
    localStorage.removeItem("token");
    setToken(null);
  };
  return (
    <div className="nav-bar">
      <Link href={"/"}>Home</Link>
      {token ? (
        <>
          <Link href={"/users"}>User management</Link>
          {user && (
            <>
              <span>
                {user.email} {user.admin ? "admin" : "user"}
              </span>
              <button onClick={handleClick}>Logout</button>
            </>
          )}
        </>
      ) : (
        <>
          <Link href={"/login"}>Login</Link>
          <Link href={"/signup"}>Signup</Link>
        </>
      )}
    </div>
  );
};

export default NavigationBar;
