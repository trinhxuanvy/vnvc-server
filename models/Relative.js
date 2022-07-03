const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Relative = new Schema(
  {
    injectorId: { type: Schema.Types.ObjectId, ref: 'Injector', required: true },
    relationship: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    phone: {
        type: String,
        default: "",
      }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Relative",
  }
);

module.exports = mongoose.model("Relative", Relative);
