import mongoose from "mongoose";
const taskSchema = new mongoose.Schema(
  {
    title: String,
    createBy: String,
    listUser: Array,
    taskParentId: String,
    status: String,
    content: String,
    timeStart: Date,
    timeFinish: Date,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema, "tasks");

export default Task;
