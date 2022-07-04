const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema(
  {
    categoryName: {
      type: String,
      default: '',
    },
    parentId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'Category',
  },
);

module.exports = mongoose.model('Category', Category);
