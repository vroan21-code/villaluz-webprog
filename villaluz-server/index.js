require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.status(404).send('Cannot GET /');
});

app.get('/api', (req, res) => {
	res.json({
		message: 'Villaluz API',
		endpoints: ['/api/health', '/api/users', '/api/articles', '/api/users/login'],
	});
});

// Uploaded images (local disk; on Vercel uses /tmp — files may not persist)
const uploadsDir = process.env.VERCEL
	? path.join('/tmp', 'uploads')
	: path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', async (req, res) => {
	try {
		await connectDB();
		res.json({ ok: true, message: 'API is running', database: 'connected' });
	} catch (error) {
		res.status(500).json({ ok: false, message: error.message });
	}
});

app.use('/api', async (req, res, next) => {
	if (req.path === '/health') {
		return next();
	}
	try {
		await connectDB();
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Database connection failed',
			hint: 'Set MONGO_URI in Vercel. In Atlas: Network Access → 0.0.0.0/0.',
		});
	}
});

app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

app.use((err, req, res, next) => {
	if (err.name === 'MulterError' || err.message?.includes('image')) {
		return res.status(400).json({ message: err.message });
	}
	console.error(err.stack);
	res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5001;

if (!process.env.VERCEL) {
	const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	server.on('error', (err) => {
		if (err.code === 'EADDRINUSE') {
			console.error(
				`Port ${PORT} is already in use. Stop the other server or change PORT in .env`
			);
		} else {
			console.error(err);
		}
		process.exit(1);
	});
}

module.exports = app;
