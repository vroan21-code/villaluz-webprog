export const ROLES = {
	ADMIN: 'admin',
	EDITOR: 'editor',
	VIEWER: 'viewer',
};

export function getUserRole() {
	const type = localStorage.getItem('type');
	return type ? type.toLowerCase() : null;
}

export function isAuthenticated() {
	return (
		localStorage.getItem('isLoggedIn') === 'true' && Boolean(localStorage.getItem('token'))
	);
}

export function getAuthUser() {
	return {
		firstName: localStorage.getItem('firstName') || '',
		type: getUserRole(),
		token: localStorage.getItem('token') || '',
	};
}

export function setAuthSession({ token, type, firstName }) {
	localStorage.setItem('token', token);
	localStorage.setItem('type', type);
	localStorage.setItem('firstName', firstName || '');
	localStorage.setItem('isLoggedIn', 'true');
}

export function clearAuthSession() {
	localStorage.removeItem('token');
	localStorage.removeItem('type');
	localStorage.removeItem('firstName');
	localStorage.removeItem('isLoggedIn');
}

/** Only admins can open the Users management page. */
export function canAccessUsersPage() {
	return getUserRole() === ROLES.ADMIN;
}

/** Viewers are not allowed to sign in to the dashboard. */
export function canSignIn(role) {
	return role?.toLowerCase() !== ROLES.VIEWER;
}
