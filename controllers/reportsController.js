const path = require("path");
const Expense = require("../models/expenseModel");

exports.getReportsPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "reports.html"));
};

exports.dailyReports = async (req, res, next) => {
  try {
    const date = req.body.date;
    const expenses = await Expense.find({ date: date, userId: req.user._id });
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};

exports.monthlyReports = async (req, res, next) => {
  try {
    const month = req.body.month;
    const userId = req.user._id;

    const expenses = await Expense.find({
      date: { $regex: `.*-${month}-.*` },
      userId: userId,
    }).lean();

    // // group expenses by category and calculate total amount
    // const categoryWiseTotal = {};
    // expenses.forEach((expense) => {
    //   if (categoryWiseTotal[expense.category]) {
    //     categoryWiseTotal[expense.category] += expense.amount;
    //   } else {
    //     categoryWiseTotal[expense.category] = expense.amount;
    //   }
    // });
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};

/* const path = require("path");
const Expense = require("../models/expenseModel");
const { Op } = require("sequelize");

exports.getReportsPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "reports.html"));
};

exports.dailyReports = async (req, res, next) => {
  try {
    const date = req.body.date;
    const expenses = await Expense.findAll({
      where: { date: date, userId: req.user.id },
    });
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};

exports.monthlyReports = async (req, res, next) => {
  try {
    const month = req.body.month;

    const expenses = await Expense.findAll({
      where: {
        date: {
          [Op.like]: `%-${month}-%`,
        },
        userId: req.user.id,
      },
      raw: true,
    });

    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};
 */
