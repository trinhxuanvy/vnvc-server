const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VCSignup = new Schema(
  {
    injectorId: { type: Schema.Types.ObjectId, ref: 'Injector', required: true },
    vcCenterId: { type: Schema.Types.ObjectId, ref: 'VCCenter', required: true },
    listVaccine:[
      {
        vaccineId: { type: Schema.Types.ObjectId, required: true, }, 
        vaccineName: { type: String, required: true, }, 
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
        injectedDate: {
          type: Date,
          default: Date.now(),
        }
      }
    ],
    status: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "VCSignup",
  }
);

module.exports = mongoose.model("VCSignup", VCSignup);
