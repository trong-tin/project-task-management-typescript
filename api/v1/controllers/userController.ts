import { Request, Response } from "express";
import User from "../models/userModel";
import md5 from "md5";
import { generateRandomString } from "../../../helpers/generate";

// [POST] /v1/api/users/register
export const register = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    const password: string = md5(req.body.password);
    const fullName: string = req.body.fullName;
    const token: string = generateRandomString(20);
    const existEmail = await User.findOne({ email: email });
    if (existEmail) {
      res.json({
        code: 400,
        message: "Email đã tồn tại",
      });
    } else {
      const user = new User({
        fullName: fullName,
        email: email,
        password: password,
        token: token,
      });
      user.save();
      res.cookie("token", token);
      res.json({
        code: 200,
        message: "Tạo tài khoản thành công",
        token: token,
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "ERROR 404",
    });
  }
};

// [POST] /v1/api/users/login
export const login = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    const password: string = md5(req.body.password);

    const existUser = await User.findOne({
      email: email,
      password: password,
    });
    if (existUser) {
      const token: string = existUser.token;
      res.cookie("token", token);
      res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: token,
      });
    } else {
      res.json({
        code: 400,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "ERROR 404",
    });
  }
};

// [GET] /v1/api/users/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const user = await User.findOne({
      _id: id,
      deleted: false,
    }).select("-password -token");
    res.json({
      code: 200,
      message: "Tìm kiếm trang cá nhân thành công",
      info: user,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "ERROR 404",
    });
  }
};
