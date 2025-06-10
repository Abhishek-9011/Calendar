import User from "../models/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const signup = async (req: any, res: any) => {
  const { username, password } = req.body;
  try {
    await User.create({
      username,
      password,
    });
    res.json({ message: "user signed up succesfully" });
  } catch (error: any) {
    res.json({ message: "some error occured" + error.message });
  }
};

export const signin = async (req: any, res: any) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username, password });
    if (existingUser) {
      const token = jwt.sign(
        {
          id: existingUser._id,
        },
        // @ts-ignore
        process.env.JWT_PASSWORD
      );
      res.json({ message: "user signed in successfully", token: token });
    }
  } catch (error: any) {
    res.json({ message: "some error occured" + error.message });
  }
};