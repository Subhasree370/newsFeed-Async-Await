const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  post: [
    {
      type: schema.Types.ObjectID,
      ref: "Post",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
