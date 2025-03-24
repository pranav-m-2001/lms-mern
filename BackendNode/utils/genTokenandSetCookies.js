const jwt = require('jsonwebtoken')

function generteTokenAndSetCookies(res, userId){
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'})
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        samSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return token
}

module.exports = {
    generteTokenAndSetCookies
}

