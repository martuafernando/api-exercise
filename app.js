const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const routes = require("./routes");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const swaggerDocument = require("./docs/swagger.json");

const app = express();
const PORT = 3000;

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api", routes);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`connected to port ${PORT}`);
});
