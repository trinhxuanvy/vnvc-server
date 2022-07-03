const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    District: {
        type: String,
        default: "",
    },
    Commute: {
        type: String,
        default: "",
    },
    Address: {
        type: String,
        default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Category",
  }
);

module.exports = mongoose.model("Category", Category);
