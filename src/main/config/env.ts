export default {
	mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/rancho-api",
	jwtSecret: process.env.JWT_SECRET || "Jklg¨",
	port: process.env.PORT || 8080,
};
