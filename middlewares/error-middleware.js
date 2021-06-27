const ApiError = require('../exception/api-error'
)
module.exports = function (err,rq,res,next) {
    console.log(err)
    if (err instanceof  ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: 'Плохой запрос'})
}