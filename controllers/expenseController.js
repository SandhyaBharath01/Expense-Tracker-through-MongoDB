const path = require("path");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../util/database");
const Uploads = require("../models/fileUploadsModel");
const AWS = require("aws-sdk");
const { S3Client } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config()
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const uploads = require("../models/fileUploadsModel");
const fileUploads = require("../models/fileUploadsModel");

const mongoose = require("mongoose");


const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
  },
});

exports.getHomePage = async (req, res, next) => {
  try {
    res.sendFile(
      path.join(__dirname, "../", "public", "views", "homePage.html")
    );
  } catch {
    (err) => console.log(err);
  }
};

exports.addExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const date = req.body.date;
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;

    const user = await User.findById(req.user.id);
    user.totalExpenses += Number(amount);
    await user.save({ session });

    const expense = new Expense({
      date: date,
      category: category,
      description: description,
      amount: amount,
      userId: req.user.id,
    });

    await expense.save({ session });
    await session.commitTransaction();
    res.status(200).redirect("/homePage");
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
  } finally {
    session.endSession();
  }
};

exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({userId: req.user.id });
    res.json(expenses);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred" });
  }
};


exports.getAllExpensesforPagination = async (req, res, next) => {
  try {
    const pageNo = parseInt(req.params.page);
    const expensesPerPage = parseInt(req.query.expensesPerPage);
    const limit = expensesPerPage || 10;
    const offset = (pageNo - 1) * limit;
    const totalExpenses = await Expense.countDocuments({
       userId: req.user.id
    });
    const totalPages = Math.ceil(totalExpenses / limit);
    const expenses = await Expense.find({ userId: req.user.id })
    .skip(offset)
    .limit(limit);

    res.json({ expenses: expenses, totalPages: totalPages });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred" });
  }
};



exports.deleteExpense = async (req, res, next) => {
  const id = req.params.id;
  try {
    const expense = await Expense.findOne({_id: id, userId: req.user.id });
    const user = await User.findById(req.user.id);
    user.totalExpenses -= expense.amount;
    await user.save();
    await Expense.deleteOne({ _id: id, userId: req.user.id });
    res.redirect("/homePage");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.editExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;

    const expense = await Expense.findOne({_id: id, userId:req.user.id});
    const user = await User.findById(req.user.id);

    user.totalExpenses = user.totalExpenses - expense.amount + Number(amount);
    await user.save();

    await Expense.updateOne(
      { _id: id, userId: req.user.id },
      {
        category: category,
        description: description,
        amount: amount,
      }
    );

    res.redirect("/homePage");
  } catch (err) {
    console.log(err);
  }
};

exports.downloadExpense = async (req, res) => {
  console.log("hi");
  try {
    const user = req.user;
    const expenses = await Expense.find({ userId: req.user.id });

    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `${user.id}Expense/${new Date()}.txt`;

    const file = await uploadToS3(stringifiedExpenses, filename);

    const newFileUpload = new fileUploads({
      fileUrl: file,
      fileName: filename,
    });

    await newFileUpload.save();

    res.status(201).json({ url: file });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
};

async function uploadToS3(data, filename) {
  const BUCKET_NAME = "fullstackexpensetracker";
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_SECRET_KEY;
  let s3Bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3Bucket.upload(params, async (err, s3response) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(s3response);

        const newFileUpload = new fileUploads({
          fileUrl: s3response.Location,
          fileName: filename,
        });

        await newFileUpload.save();

        resolve(s3response.Location);
      }
    });
  });
}



