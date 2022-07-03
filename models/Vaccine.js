const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Vaccin = new Schema(
  {
    vaccineName: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    prevention: {
      type: String,
      default: "",
    },
    description: { // page thong tin cua vaccine
      type: String,
      default: "",
    },
    sellType: {
      type: String, // retail or package
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    price: { type: Number, min: 0, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Vaccine",
  }
);

module.exports = mongoose.model("Vaccine", Vaccine);
