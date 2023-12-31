const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        name: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        pic: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        }
    },
    {
        timestamps: true
    }
);

// checking if the password matching with already exists user or not while user is loggin in...
userSchema.methods.matchPassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword, this.password);
};

// logic for decrypting the normal password and then save it in the password...
userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next();
    }
    const salt = await bcrypt.genSalt(15);
    this.password = await bcrypt.hash(this.password, salt);
});




const User = mongoose.model("User", userSchema);
module.exports = User;