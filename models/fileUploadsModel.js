const mongoose = require("mongoose");

const fileUploadsSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
});

const fileUploads = mongoose.model("fileUploads", fileUploadsSchema);

module.exports = fileUploads;


// const Sequelize = require("sequelize")
// const sequelize = require("../util/database")

// const uploads = sequelize.define("uploads", {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     fileUrl: {
//         type: Sequelize.STRING
//     },
//     fileName: {
//         type: Sequelize.STRING
//     }
// })

// module.exports = uploads;