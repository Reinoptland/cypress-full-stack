import express, { json } from "express";
import { AuthMiddleware, AuthRequest } from "./auth/middleware";
import { toToken } from "./auth/jwt";
import { Prisma, PrismaClient } from "@prisma/client";
import cors from "cors";
const app = express();
const port = 3001;

const prisma = new PrismaClient();
app.use(cors());
app.use(json());

app.get("/me", AuthMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(500).send({ message: "Something went wrong!" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  res.send({
    message: `Hello user with id ${userId}`,
    user: { email: user?.email, admin: user?.admin },
  });
});

app.get("/users", AuthMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(500).send({ message: "Something went wrong!" });
    return;
  }

  const admin = await prisma.user.findUnique({
    where: { id: userId, admin: true },
  });

  const allUsers = await prisma.user.findMany();

  if (admin === null) {
    return res
      .status(404)
      .send({ message: "You are not an admin, sorry!", users: allUsers });
  }

  return res.status(200).send({ message: "ok", users: allUsers });
});

app.patch("/users/:id", AuthMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(500).send({ message: "Something went wrong!" });
    return;
  }

  const admin = await prisma.user.findUnique({
    where: { id: userId, admin: true },
  });

  if (admin === null) {
    return res.status(401).send({ message: "You are not an admin, sorry!" });
  }

  const promotedAdmin = await prisma.user.update({
    where: { id: req.params.id },
    data: { admin: true },
  });

  return res
    .status(200)
    .send({ message: "Admin promoted", user: promotedAdmin });
});

app.delete("/users/:id", AuthMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(500).send({ message: "Something went wrong!" });
    return;
  }

  const deletedUser = await prisma.user.delete({
    where: { id: req.params.id },
  });

  return res.status(200).send({ message: "User Deleted" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: "Body needs 'email' and 'password'" });
    return;
  }
  const userToLogin = await prisma.user.findFirst({
    where: { email: email },
  });
  if (!userToLogin || userToLogin.password !== password) {
    res.status(400).send({ message: "Login Failed" });
    return;
  }
  const token = toToken({ userId: userToLogin.id });
  res.send({ message: "Login success", token: token });
});

app.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: "Body needs 'email' and 'password'" });
    return;
  }
  try {
    const userSignedUp = await prisma.user.create({
      data: { email: email, name: name, password: password },
    });

    const token = toToken({ userId: userSignedUp.id });
    res.send({ message: "Signup success", token: token });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(400).send({
          message: "A user with this email already exists ...",
        });
      }
    } else {
      console.log(error);
      res.status(400).send({ message: "Something went wrong" });
    }
  }
});

app.listen(port, () => {
  console.log(`⚡ Server listening on port: ${port}`);
});
