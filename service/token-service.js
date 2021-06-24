const jwt = require ('jsonwebtoken');
const tokenModel = require ('../models/token-model')
class TokenService {
    generateToken(payload){
        const accessToken = jwt.sign(payload, "jwt-secret-key", {expiresIn: '15s'})
        const refreshToken = jwt.sign(payload, "jwt-refresh-secret-key", {expiresIn: '30s'})
        return {
        accessToken,
            refreshToken
        }
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await  tokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({user: userId, refreshToken})
        return token;
    }
}

module.exports = new TokenService()