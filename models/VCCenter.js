const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VCCenter = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    province: {
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
    collection: "VCCenter",
  }
);

module.exports = mongoose.model("VCCenter", VCCenter);
