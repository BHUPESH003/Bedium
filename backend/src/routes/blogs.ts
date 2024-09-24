import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {  verify } from "hono/jwt";
import { createBlogInput, CreateBlogInput,updateBlogInput } from "@10kdevs/medium-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();
// blogRouter.use("/*", (c, next) => {
//   const authHeader = c.req.header("authorization");
//   const jwtMiddleware = jwt({
//     secret: c.env.JWT_SECRET,
//     cookie: authHeader,
//   });
//   return jwtMiddleware(c, next);
// });
blogRouter.get("/all/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogs = await prisma.posts.findMany({});
  console.log(blogs);
  return c.json(blogs);
});
blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user) {
      c.set("jwtPayload", user);
      await next();
    } else {
      return c.json({ error: "Unauthorized" }, 401);
    }
  } catch (e) {
    console.log(e);
    return c.json({ message: "Unauthorized" }, 401);
  }
});



blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");
  const blog = await prisma.posts.findUnique({
    where: {
      id,
    },
  });
  c.status(200);
  return c.json(blog);
});

blogRouter.post("/publish", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
  const payLoad = c.get("jwtPayload");
  console.log(payLoad);
  const res = await prisma.posts.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: payLoad.id,
    },
  });
  c.status(200);
  return c.json({
    id: res.id,
  });
});

blogRouter.put("/", async (c) => {
  const userId = c.get("jwtPayload");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
  const res = prisma.posts.update({
    where: {
      id: body.id,
      authorId: userId.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
    select: {
      id: true,
      title: true,
    },
  });
  c.status(200);
  return c.json({
    id:(await res).id,
    title:(await res).title
  });
});
