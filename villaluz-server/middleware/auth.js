const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
	if (!process.env.JWT_SECRET) {
		return res.status(500).json({ message: 'JWT_SECRET is not configured on the server' });
	}
	const header = req.headers.authorization;
	if (!header?.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	try {
		req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
		next();
	} catch {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

const requireAdmin = (req, res, next) => {
	if (req.user?.type !== 'admin') {
		return res.status(403).json({ message: 'Admin access required' });
	}
	next();
};

module.exports = { requireAuth, requireAdmin };
