"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.login = exports.register = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const md5_1 = __importDefault(require("md5"));
const generate_1 = require("../../../helpers/generate");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = (0, md5_1.default)(req.body.password);
        const fullName = req.body.fullName;
        const token = (0, generate_1.generateRandomString)(20);
        const existEmail = yield userModel_1.default.findOne({ email: email });
        if (existEmail) {
            res.json({
                code: 400,
                message: "Email đã tồn tại",
            });
        }
        else {
            const user = new userModel_1.default({
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
    }
    catch (error) {
        res.json({
            code: 400,
            message: "ERROR 404",
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = (0, md5_1.default)(req.body.password);
        const existUser = yield userModel_1.default.findOne({
            email: email,
            password: password,
        });
        if (existUser) {
            const token = existUser.token;
            res.cookie("token", token);
            res.json({
                code: 200,
                message: "Đăng nhập thành công",
                token: token,
            });
        }
        else {
            res.json({
                code: 400,
                message: "Tài khoản hoặc mật khẩu không chính xác",
            });
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "ERROR 404",
        });
    }
});
exports.login = login;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            code: 200,
            message: "Tìm kiếm trang cá nhân thành công",
            info: req["user"],
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "ERROR 404",
        });
    }
});
exports.detail = detail;
