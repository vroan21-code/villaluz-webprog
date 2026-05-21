const HOST = `${import.meta.env.VITE_API_URL}`;
const SERVER = HOST.replace(/\/api\/?$/, '');

export default {
	HOST,
	SERVER,
};

