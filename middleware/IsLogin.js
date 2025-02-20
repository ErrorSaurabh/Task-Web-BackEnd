let islogin = async (req, res, next) => {
    try {
        jwt.verify(req.headers.authorization, "abcd")
        next()

    } catch (err) {
        res.json({
            "msg": "plz login"
        })
    }
}


let isadmin = async (req, res, next) => {
    try {
        let obj = await um.findById({
            "_id": req.headers.uid
        })
        if (obj && obj.role == "Manager") {
            next()
        } else {
            res.json({
                "msg": "you are not Manager"
            })
        }
    } catch (err) {
        res.json({
            "msg": "error in authorization"
        })
    }
}
module.exports = {
    islogin,
    isadmin
};