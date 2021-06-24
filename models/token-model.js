const {Schema,model} = require("mongoose");


const TokenSchema = new Schema ({
    user: {type:Schema.Types.ObjectId, ref:'User'},
    refreshToken: {types:String, required: true}
})

module.exports = model('Token', TokenSchema);