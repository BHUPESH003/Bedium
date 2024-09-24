import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "@10kdevs/medium-common";
export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  console.log(body)
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ error: "invalid input" });
  }
  try {
    const user = await prisma.user.create({
      data: { email: body.email, password: body.password, name: body.name },
    });

    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );
    c.status(200);
    return c.json({token:jwt});
  } catch (e) {
    console.log(e);
    c.status(411);
    c.text("Invalid");
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.username,
        password: body.password,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({
        message: "Incorrect Creds",
      });
    }

    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );
    c.status(200);
    return c.json({
      token: jwt,
      id: user.id,
    });
  } catch (e) {
    console.log(e);
    c.status(411);
    c.text("Invalid");
  }
});
