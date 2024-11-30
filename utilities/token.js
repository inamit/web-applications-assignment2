const jwt = require("jsonwebtoken");

const generateTokens = async (user) => {
    const accessToken = jwt.sign({ "_id": user._id }, process.env.TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
    const random = Math.floor(Math.random() * 1000000).toString();
    const refreshToken = jwt.sign({ "_id": user._id, "random": random }, process.env.TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRATION});
    return {accessToken, refreshToken};
}

const updateCookies = (accessToken, refreshToken, res) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 3600 * 1000
      });
    
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict', 
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
}

const clearCookies = (res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });
    
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });
}

module.exports = {generateTokens, updateCookies, clearCookies}