function errorHandler(err, req, res, next) {
	res.status(err.statusCode ?? 500).json({
		message: err.errors?.map((it) => it.message) ?? err.message,
	});
}

module.exports = errorHandler;
