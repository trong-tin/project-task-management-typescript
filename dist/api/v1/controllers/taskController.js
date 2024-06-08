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
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const taskModel_1 = __importDefault(require("../models/taskModel"));
const paginationHelper_1 = __importDefault(require("../../../helpers/paginationHelper"));
const searchHelper_1 = __importDefault(require("../../../helpers/searchHelper"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false,
        };
        if (req.query.status) {
            find.status = req.query.status.toString();
        }
        const sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            const sortKey = req.query.sortKey.toLocaleString();
            sort[sortKey] = req.query.sortValue;
        }
        let objectSearch = (0, searchHelper_1.default)(req.query);
        if (req.query.keyword) {
            find.title = objectSearch.regex;
        }
        let initPagination = {
            currentPage: 1,
            limitItems: 2,
        };
        const countTasks = yield taskModel_1.default.countDocuments(find);
        const objectPagination = (0, paginationHelper_1.default)(initPagination, req.query, countTasks);
        const tasks = yield taskModel_1.default.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip);
        res.json({
            code: 200,
            message: "Tìm kiếm thành công",
            tasks,
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Tìm kiếm không thành công",
        });
    }
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const task = yield taskModel_1.default.findOne({
        deleted: false,
        _id: id,
    });
    res.json({
        code: 200,
        task,
    });
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const status = req.body.status;
        yield taskModel_1.default.updateOne({ _id: id }, { status: status });
        res.json({
            code: 200,
            message: "Cập nhật thành công",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật không thành công hoặc không tìm thấy",
        });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Key;
        (function (Key) {
            Key["status"] = "status";
            Key["delete"] = "delete";
            Key["timeStart"] = "timeStart";
            Key["timeFinish"] = "timeFinish";
            Key["listUser"] = "listUser";
        })(Key || (Key = {}));
        const ids = req.body.ids;
        const key = req.body.key;
        const value = req.body.value;
        switch (key) {
            case Key.status:
                yield taskModel_1.default.updateMany({ _id: { $in: ids } }, { status: value });
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái cho các công việc đã chọn thành công",
                });
                break;
            case Key.delete:
                yield taskModel_1.default.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
                res.json({
                    code: 200,
                    message: "Xóa các công việc đã chọn thành công",
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại",
                });
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Error 404",
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new taskModel_1.default(req.body);
        const data = yield task.save();
        res.json({
            code: 200,
            message: "Tạo công việc mới thành công",
            data: data,
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Error 404",
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield taskModel_1.default.updateOne({
            _id: id,
        }, req.body);
        res.json({
            code: 200,
            message: "Chỉnh sửa công việc thành công",
            dataEdit: req.body,
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Error 404",
        });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield taskModel_1.default.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
        res.json({
            code: 200,
            message: "Xóa công việc thành công",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Error 404",
        });
    }
});
exports.deleteTask = deleteTask;
