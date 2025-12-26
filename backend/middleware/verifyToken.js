const jwt = require('jsonwebtoken');
const sessionModal = require('../models/sessionModel')

module.exports.verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });


		const { userId, sessionId } = decoded;


		 // Verify if the session is still active
		 const session = await sessionModal.findOne({ sessionId, user: userId });
		 if (!session) {
            return res.status(401).json({  message: 'Session invalid or expired'  });
        }

		req.userId = decoded.userId;
		req.sessionId = decoded.sessionId

		next();
	} catch (error) {
		console.log("Error in verifyToken ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
}