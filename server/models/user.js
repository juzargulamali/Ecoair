const { Schema, model } = require("mongoose");
const { hash, compare } = require("bcryptjs");

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    password: String,
    role: {
      type: String,
      enum: ["admin", "default"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    //using bcrypt hash
    this.password = await hash(this.password, 10);
  }
});

userSchema.methods.matchPassword = function (password) {
  //using bcrypt compare
  return compare(password, this.password);
};

const User = model("User", userSchema);
module.exports =  User;
