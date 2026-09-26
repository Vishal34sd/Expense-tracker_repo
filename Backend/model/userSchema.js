import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
        default: null,
        trim: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: true,
    },
    avatar: {
        type: String,
        default: "avatar1",
    },

    // ----- New fields for rate limiting -----
    searchCount: {
        type: Number,
        default: 0,
    },
    lastSearchDate: {
        type: Date,
    },
    financialBehavior: {
        type: String,
        default: "",
    },
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);
export default userModel;
