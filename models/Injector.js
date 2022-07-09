const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Injector = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: Date.now(),
    },
    phone: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    province: {
      type: String,
      default: "",
    },
    district: {
      type: String,
      default: "",
    },
    commute: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    relationship: {
      type: String,
      default: "",
    },
    code: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Injector",
  }
);

module.exports = mongoose.model("Injector", Injector);
