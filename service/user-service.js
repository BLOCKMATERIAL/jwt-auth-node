const UserModel = require('../models/user-model')
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const mailService = require('../service/mail-service')
const tokensService = require('../service/token-service')
const UserDto = require('../dtos/user-dtos')
class UserService {
    async registration(email,password){
        const candidate = await UserModel.findOne({email})
        if(candidate) {
            throw new Error(`Use exist with this email ${email}`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink =uuid.v4();
        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email,activationLink)
        const userDto = new UserDto(user);
        const tokens = tokensService.generateToken({...userDto});
        await tokensService.saveToken(user.id,tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }
}

module.exports = new UserService()