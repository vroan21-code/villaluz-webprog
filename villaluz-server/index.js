require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const articleRoutes = require('./routes/articleRoutes');

const app = express();

app.use(express.json());

// Middleware
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// CORS options
const corsOptions = {
	origin: '*', // Allow all origins
	credentials: true, // Allow credentials
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
	preflightContinue: false,
	optionsSuccessStatus: 204, // For legacy browser support
};

app.use(cors(corsOptions));

// Curb CORS Error by adding headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

// Uploaded article images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
	res.json({ ok: true, message: 'API is running' });
});

// Connect to MongoDB before API routes (required for Vercel serverless)
app.use('/api', async (req, res, next) => {
	try {
		await connectDB();
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Database connection failed',
			hint: 'Check MONGO_URI in Vercel Environment Variables and Atlas Network Access (0.0.0.0/0).',
		});
	}
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

// Error Handling
app.use((err, req, res, next) => {
	if (err.name === 'MulterError' || err.message?.includes('image')) {
		return res.status(400).json({ message: err.message });
	}
	console.error(err.stack);
	res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

// Local dev: start the server. Vercel imports this file as a serverless function.
if (!process.env.VERCEL) {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

