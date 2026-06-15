import connectToDB from "@/configs/db";
import { verifyToken } from "@/utils/auth";
import UserModel from "@/models/User";
import todoModel from "@/models/Todo";

const handler = async (req, res) => {
  connectToDB();

  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "You are not login !!" });
  }

  const tokenPayload = verifyToken(token);

  if (!tokenPayload) {
    return res.status(401).json({ message: "You are not login !!" });
  }

  const user = await UserModel.findOne({
    email: tokenPayload.email,
  });

  if (req.method === "GET") {
    const todos = await todoModel.find({ user: user._id });
    return res.json(todos);
  } else if (req.method === "POST") {
    // Codes -> Create new todo

    const { title, isCompleted } = req.body;
    const newTodo = {
      title,
      isCompleted,
      user: user._id,
    };

    await todoModel.create(newTodo);

    return res.status(201).json({ message: "Todo Created Successfully :))" });
  } else {
    return false;
  }
};

export default handler;
