import { Request, Response } from "express";
import Task from "../models/taskModel";
import paginationHeper from "../../../helpers/paginationHelper";
import searchHelper from "../../../helpers/searchHelper";

// [GET] /v1/api/tasks
export const index = async (req: Request, res: Response) => {
  try {
    // FIND
    interface Find {
      deleted: boolean;
      status?: string;
      title?: RegExp;
    }
    const find: Find = {
      deleted: false,
    };
    if (req.query.status) {
      find.status = req.query.status.toString();
    }
    // END FIND

    // SORT
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      const sortKey = req.query.sortKey.toLocaleString();
      sort[sortKey] = req.query.sortValue;
    }
    // END SORT

    // SEARCH
    let objectSearch = searchHelper(req.query);
    if (req.query.keyword) {
      find.title = objectSearch.regex;
    }
    //END SEARCH

    // PAGINATION
    let initPagination = {
      currentPage: 1,
      limitItems: 2,
    };
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHeper(
      initPagination,
      req.query,
      countTasks
    );
    // END PAGINATION

    const tasks = await Task.find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);
    res.json({
      code: 200,
      message: "Tìm kiếm thành công",
      tasks,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Tìm kiếm không thành công",
    });
  }
};

// [GET] /v1/api/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const task = await Task.findOne({
    deleted: false,
    _id: id,
  });
  res.json({
    code: 200,
    task,
  });
};

// [PATCH] /v1/api/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const status: string = req.body.status;
    await Task.updateOne({ _id: id }, { status: status });
    res.json({
      code: 200,
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật không thành công hoặc không tìm thấy",
    });
  }
};

// [GET] /v1/api/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    enum Key {
      status = "status",
      deleted = "deleted",
      timeStart = "timeStart",
      timeFinish = "timeFinish",
      listUser = "listUser",
    }
    const ids: string[] = req.body.ids;
    const key: Key = req.body.key;
    const value: string = req.body.value;
    switch (key) {
      case Key.status:
        await Task.updateMany({ _id: { $in: ids } }, { status: value });
        res.json({
          code: 200,
          message: "Cập nhật trạng thái cho các công việc đã chọn thành công",
        });
        break;

      default:
        res.json({
          code: 400,
          message: "Không tồn tại",
        });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Error 404",
    });
  }
};
