export default {
	mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/rancho-api",
	jwtSecret: process.env.JWT_SECRET || "jgutnrDE234",
	port: process.env.port || 8080,
};
