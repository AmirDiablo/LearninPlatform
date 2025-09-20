const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default: "profile.jpg"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    },
    roles: {
        type: String,
        default: "student"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPassword: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }

}, {timestamps: true})

accountSchema.index({email: 1})
accountSchema.index({roles: 1})

accountSchema.statics.signup = async function (username, email, password, role, profile) {
    const check = await this.findOne({email: email})

    if(!username || !email || !password) {
        throw Error("all fields must be filled")
    }

    if(check) {
        throw Error("this email is already in use")
    }

    if(!validator.isLength(username, {min: 3, max:20})) {
        throw Error("firstname must be at least 3 chars and maximum of 20")
    }

    /* if(!validator.isEmail(email)) {
        throw Error("enter a valid email address")
    } */

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const account = await this.create({ username, email, password: hash, roles: role, profile })

    return account
}

accountSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email})

    if(!email || !password) {
        throw Error("all fields must be filled")
    }

    if(!user) {
        throw Error("incorrect email")
    }

    if(!validator.isEmail(email)) {
        throw Error("enter a valid email address")
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        throw Error("incorrect password")
    }

    return user
}

const Account = mongoose.model("Account", accountSchema)

module.exports = Account