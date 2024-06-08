import { Request, Response, NextFunction } from "express";
import User from "../v1/models/userModel";
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.headers.authorization) {
    const token: string = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({
      token: token,
    }).select("-password");
    if (!user) {
      res.json({
        code: 400,
        message: "Token không hợp lệ",
      });
    }
    req["user"] = user;
    next();
  } else {
    res.json({
      code: 400,
      message: "Vui lòng gửi kèm token",
    });
  }
};

// Link hướng dẫn gửi token từ FetchAPI cho Frontend: https://reqbin.com/code/javascript/ricgaie0/javascript-fetch-bearer-token
// Hướng dẫn gửi từ POSTMAN video Bài49 phút thứ 15
