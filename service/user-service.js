const UserModel = require('../models/user-model')
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const mailService = require('../service/mail-service')
const tokensService = require('../service/token-service')
const UserDto = require('../dtos/user-dtos')
const ApiError = require('../exception/api-error')
class UserService {
    async registration(email,password){
        const candidate = await UserModel.findOne({email})
        if(candidate) {
            throw ApiError.BadRequest(`Use exist with this email ${email}`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}` )
        const userDto = new UserDto(user);
        const tokens = tokensService.generateToken({...userDto});
        await tokensService.saveToken(user.id,tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }
}

module.exports = new UserService()