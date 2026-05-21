import { Navigate, useLocation } from 'react-router-dom';
import { canAccessUsersPage, isAuthenticated } from '../utils/auth';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.adminOnly] - When true, only admin role may access (Users page).
 */
export default function RequireAuth({ children, adminOnly = false }) {
	const location = useLocation();
	const authed = isAuthenticated();
	const allowed = !adminOnly || canAccessUsersPage();

	if (!authed) {
		return <Navigate to="/auth/signin" replace state={{ from: location }} />;
	}

	if (!allowed) {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
}
