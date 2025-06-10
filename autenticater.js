function autenticate(req, res, next) {
    console.log("autenticando....");
    next();
}

module.exports = autenticate;