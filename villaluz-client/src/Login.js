import React, { useState } from 'react';
import Button from './components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from './services/userService';

function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const { data } = await loginUser({ email, password });
			console.log('Login successful', data);
			localStorage.setItem('token', data.token);
			localStorage.setItem('firstName', data.firstName);
			localStorage.setItem('type', data.type);

			navigate('/dashboard', { state: { firstName: data.firstName, type: data.type } });
		} catch (err) {
			console.error('Login failed:', err);
			setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
		}
	};

	return (
		<div>
			<h2>Login</h2>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<form onSubmit={handleLogin}>
				<div>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<Button type="submit">Login</Button>
			</form>
			<Link to="/register">If you do not have an account, register here..</Link>
		</div>
	);
}

export default LoginPage;

