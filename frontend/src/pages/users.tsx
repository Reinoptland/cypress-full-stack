import NavigationBar from "@/components/NavigationBar";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type TUser = {
  id: string;
  name: string;
  email: string;
  admin: boolean;
};

export default function Users() {
  const [getError, setError] = useState<string | null>(null);
  const [getUsers, setUsers] = useState<TUser[] | null>(null);
  const router = useRouter();
  useEffect(() => {
    const getUsers = async (token: string) => {
      try {
        const response = await axios.get("http://localhost:3001/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data.users);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error?.response?.data.message || "Something went wrong");
        } else {
          setError("Something went wrong");
        }
      }
    };

    const token = localStorage.getItem("token");

    if (token === null) {
      router.push("/");
    } else {
      getUsers(token);
    }
  }, [router]);

  async function promote(id: string) {
    const token = localStorage.getItem("token");
    if (!getUsers || !token) return;

    setUsers(
      getUsers.map((user) => {
        if (user.id === id) {
          return { ...user, admin: true };
        } else {
          return user;
        }
      })
    );

    await axios.patch(
      `http://localhost:3001/users/${id}`,
      { admin: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async function deleteUser(id: string) {
    const token = localStorage.getItem("token");
    if (!getUsers || !token) return;

    setUsers(
      getUsers.filter((user) => {
        return user.id !== id;
      })
    );

    await axios.delete(`http://localhost:3001/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return (
    <>
      <NavigationBar />
      <main>
        <h1>User Management</h1>
        {getError && <p className="error-text">{getError}</p>}
        {getUsers && (
          <ul>
            {getUsers.map((user) => {
              return (
                <li key={user.id}>
                  {user.name} - {user.email} -{" "}
                  {user.admin ? (
                    "Admin"
                  ) : (
                    <>
                      User{" "}
                      <button onClick={() => promote(user.id)}>
                        promote to admin 🎖
                      </button>
                    </>
                  )}
                  <button onClick={() => deleteUser(user.id)}>
                    delete user ❌
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
