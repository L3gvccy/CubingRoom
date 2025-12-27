import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";
import { type } from "os";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  displayName: {
    type: String,
  },
  wcaId: {
    type: String,
    unique: true,
  },
  wcaName: {
    type: String,
  },
  image: {
    type: String,
    default: undefined,
  },
  countryCode: {
    type: String,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function () {
  if (this.password) {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
  }
  if (!this.displayName) {
    if (this.email) {
      this.displayName = this.email.split("@")[0];
    } else {
      this.displayName = this.wcaName.split(" ")[0];
    }
  }
});

const User = mongoose.model("Users", userSchema);

export default User;
