const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VCCenter = new Schema(
  {
    name: {
      type: String,
      default: '',
    },
    province: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      default: '',
    },
    commute: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'VCCenter',
  },
);

module.exports = mongoose.model('VCCenter', VCCenter);
