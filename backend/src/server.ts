import express from "express";
import userRouter from "./routes/user.route";
import eventRouter from "./routes/event.route";
import { connectDb } from "./config/connectDb";
const app = express();
app.use(express.json());
connectDb();
app.use("/api/v1", userRouter);
app.use("/api/v1", eventRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
