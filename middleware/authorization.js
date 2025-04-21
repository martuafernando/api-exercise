function authorization(req, res, next) {
	const role = req.user.role;

  
	if (role !== "admin") {
		res.status(403).json({
      message: "Forbidden",
    });
	}

  next();
}

module.exports = authorization;
