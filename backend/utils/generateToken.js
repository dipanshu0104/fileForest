const jwt = require('jsonwebtoken');
// const userModel = require('../models/userModel');

const generateTokenAndSetCookie =  (res, userId, sessionId) => {
    const token = jwt.sign({userId, sessionId}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

    res.cookie("token", token, {
        httpOnly: true, // xss attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //csrf attack
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return token;
}

module.exports = generateTokenAndSetCookie;