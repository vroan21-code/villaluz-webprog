import axios from 'axios';
import constants from '../constants';

const API = axios.create({
	baseURL: `${constants.HOST}/articles`,
});

export const fetchArticles = () => API.get('/');

export const fetchArticleByName = (name) => API.get(`/${name}`);

export const createArticle = (article) => API.post('/', article);

export const updateArticle = (id, article) => API.put(`/${id}`, article);

export const deleteArticle = (id) => API.delete(`/${id}`);

export const uploadArticleImage = (file) => {
	const formData = new FormData();
	formData.append('image', file);
	return API.post('/upload', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
};
