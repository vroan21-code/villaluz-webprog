import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
	Alert,
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

import {
	fetchArticles,
	createArticle,
	updateArticle,
	deleteArticle,
	uploadArticleImage,
} from '../../services/articleService';
import { slugify, parseContentParagraphs } from '../../utils/slugify';
import { resolveImageUrl } from '../../utils/imageUrl';

const emptyForm = () => ({
	title: '',
	name: '',
	image: '',
	content: '',
});

function validateForm(form, imageFile) {
	const errors = {};
	if (!form.title.trim()) errors.title = 'Title is required.';
	if (!form.name.trim()) errors.name = 'URL slug is required.';
	else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.name)) {
		errors.name = 'Use lowercase letters, numbers, and hyphens only.';
	}
	if (!imageFile && !form.image.trim()) errors.image = 'Please attach an image.';
	if (!parseContentParagraphs(form.content).length) {
		errors.content = 'Add at least one paragraph (separate paragraphs with a blank line).';
	}
	return errors;
}

function toRow(article) {
	return {
		id: article._id,
		title: article.title,
		name: article.name,
		image: article.image,
		contentParts: article.content ?? [],
		preview: (article.content?.[0] ?? '').slice(0, 100),
		createdAt: article.createdAt
			? new Date(article.createdAt).toLocaleDateString(undefined, {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
				})
			: '—',
	};
}

export default function ArticlesPage() {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	const [listError, setListError] = useState('');

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [form, setForm] = useState(emptyForm);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState('');
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState('');

	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleting, setDeleting] = useState(false);

	const loadArticles = useCallback(async () => {
		try {
			setLoading(true);
			setListError('');
			const { data } = await fetchArticles();
			const articles = data.articles ?? [];
			setRows(articles.map(toRow));
		} catch {
			setListError('Failed to load articles. Make sure the server is running on port 5001.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadArticles();
	}, [loadArticles]);

	const resetImagePicker = () => {
		if (imagePreview.startsWith('blob:')) {
			URL.revokeObjectURL(imagePreview);
		}
		setImageFile(null);
		setImagePreview('');
	};

	const openAddDialog = () => {
		setEditingId(null);
		setForm(emptyForm());
		resetImagePicker();
		setErrors({});
		setSubmitError('');
		setDialogOpen(true);
	};

	const openEditDialog = useCallback((row) => {
		setImagePreview((prev) => {
			if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
			return row.image ? resolveImageUrl(row.image) : '';
		});
		setEditingId(row.id);
		setImageFile(null);
		setForm({
			title: row.title,
			name: row.name,
			image: row.image,
			content: (row.contentParts ?? []).join('\n\n'),
		});
		setErrors({});
		setSubmitError('');
		setDialogOpen(true);
	}, []);

	const closeDialog = () => {
		setDialogOpen(false);
		setEditingId(null);
		resetImagePicker();
		setErrors({});
		setSubmitError('');
	};

	const handleChange = (field) => (e) => {
		const value = e.target.value;
		setForm((prev) => {
			const next = { ...prev, [field]: value };
			if (
				field === 'title' &&
				!editingId &&
				(!prev.name || prev.name === slugify(prev.title))
			) {
				next.name = slugify(value);
			}
			return next;
		});
		if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
	};

	const handleImageSelect = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			setErrors((prev) => ({ ...prev, image: 'Please choose an image file.' }));
			return;
		}

		if (imagePreview.startsWith('blob:')) {
			URL.revokeObjectURL(imagePreview);
		}

		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));
		setErrors((prev) => ({ ...prev, image: '' }));
		e.target.value = '';
	};

	const handleRemoveImage = () => {
		resetImagePicker();
		setForm((prev) => ({ ...prev, image: '' }));
	};

	const handleSave = async (e) => {
		e.preventDefault();
		setSubmitError('');

		const validation = validateForm(form, imageFile);
		if (Object.keys(validation).length) {
			setErrors(validation);
			return;
		}

		setSubmitting(true);
		try {
			let imageUrl = form.image.trim();

			if (imageFile) {
				const { data: uploadData } = await uploadArticleImage(imageFile);
				imageUrl = uploadData.url;
			}

			const payload = {
				name: form.name.trim(),
				title: form.title.trim(),
				image: imageUrl,
				content: parseContentParagraphs(form.content),
			};

			if (editingId) {
				await updateArticle(editingId, payload);
			} else {
				await createArticle(payload);
			}

			closeDialog();
			await loadArticles();
		} catch (err) {
			setSubmitError(
				err.response?.data?.message ||
					(editingId ? 'Failed to update article.' : 'Failed to publish article.')
			);
		} finally {
			setSubmitting(false);
		}
	};

	const confirmDelete = async () => {
		if (!deleteTarget) return;
		setDeleting(true);
		try {
			await deleteArticle(deleteTarget.id);
			setDeleteTarget(null);
			await loadArticles();
		} catch (err) {
			setListError(err.response?.data?.message || 'Failed to delete article.');
			setDeleteTarget(null);
		} finally {
			setDeleting(false);
		}
	};

	const columns = useMemo(
		() => [
			{
				field: 'title',
				headerName: 'Title',
				flex: 1.2,
				minWidth: 160,
			},
			{
				field: 'name',
				headerName: 'Slug',
				flex: 0.8,
				minWidth: 120,
				renderCell: (params) => (
					<Chip
						label={params.value}
						size="small"
						variant="outlined"
						sx={{ fontFamily: 'monospace', fontSize: 11 }}
					/>
				),
			},
			{
				field: 'preview',
				headerName: 'Preview',
				flex: 1.2,
				minWidth: 160,
				sortable: false,
			},
			{
				field: 'image',
				headerName: 'Image',
				flex: 0.4,
				minWidth: 72,
				sortable: false,
				renderCell: (params) =>
					params.value ? (
						<Box
							component="img"
							src={resolveImageUrl(params.value)}
							alt=""
							sx={{
								width: 48,
								height: 36,
								objectFit: 'cover',
								borderRadius: 1,
								border: '1px solid',
								borderColor: 'divider',
							}}
						/>
					) : null,
			},
			{
				field: 'createdAt',
				headerName: 'Published',
				flex: 0.45,
				minWidth: 100,
			},
			{
				field: 'actions',
				headerName: 'Actions',
				sortable: false,
				filterable: false,
				flex: 1,
				minWidth: 280,
				renderCell: (params) => (
					<Stack direction="row" spacing={1} alignItems="center" sx={{ py: 0.5 }}>
						<Button
							size="small"
							variant="outlined"
							component={RouterLink}
							to={`/articles/${params.row.name}`}
							target="_blank"
							endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
						>
							View
						</Button>
						<Button
							size="small"
							variant="outlined"
							color="primary"
							onClick={() => openEditDialog(params.row)}
						>
							Edit
						</Button>
						<Button
							size="small"
							variant="outlined"
							color="error"
							startIcon={<DeleteOutlinedIcon />}
							onClick={() => setDeleteTarget(params.row)}
						>
							Delete
						</Button>
					</Stack>
				),
			},
		],
		[openEditDialog]
	);

	const isEditing = editingId != null;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
			<Paper
				elevation={0}
				sx={{
					borderRadius: 3,
					border: '1px solid',
					borderColor: 'divider',
					p: { xs: 2, md: 3 },
					background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
					color: 'common.white',
				}}
			>
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					alignItems={{ xs: 'stretch', sm: 'center' }}
					justifyContent="space-between"
					spacing={2}
				>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 700 }}>
							Articles
						</Typography>
						<Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
							View, edit, and publish articles on the public site.
						</Typography>
					</Box>
					<Button
						variant="contained"
						color="inherit"
						startIcon={<AddIcon />}
						onClick={openAddDialog}
						sx={{
							bgcolor: 'common.white',
							color: 'grey.900',
							fontWeight: 600,
							'&:hover': { bgcolor: 'grey.100' },
							alignSelf: { xs: 'stretch', sm: 'center' },
						}}
					>
						Add new article
					</Button>
				</Stack>
			</Paper>

			{listError && <Alert severity="error">{listError}</Alert>}

			<Paper
				elevation={0}
				sx={{
					borderRadius: 3,
					border: '1px solid',
					borderColor: 'divider',
					overflow: 'hidden',
				}}
			>
				<Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
						Published articles ({rows.length})
					</Typography>
				</Box>
				<Box sx={{ width: '100%', minHeight: 400 }}>
					<DataGrid
						rows={rows}
						columns={columns}
						loading={loading}
						pageSizeOptions={[5, 10, 25]}
						initialState={{
							pagination: { paginationModel: { pageSize: 10 } },
						}}
						disableRowSelectionOnClick
						sx={{
							border: 0,
							'& .MuiDataGrid-cell:focus': { outline: 'none' },
						}}
						slots={{
							noRowsOverlay: () => (
								<Stack alignItems="center" justifyContent="center" sx={{ height: '100%', py: 6 }}>
									<Typography color="text.secondary" sx={{ mb: 2 }}>
										No articles published yet.
									</Typography>
									<Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog}>
										Add new article
									</Button>
								</Stack>
							),
						}}
					/>
				</Box>
			</Paper>

			<Dialog
				open={dialogOpen}
				onClose={closeDialog}
				fullWidth
				maxWidth="sm"
				PaperProps={{
					sx: {
						borderRadius: 3,
						boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
					},
				}}
			>
				<DialogTitle
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						fontWeight: 700,
						pb: 1,
					}}
				>
					{isEditing ? 'Edit article' : 'Publish new article'}
					<IconButton aria-label="close" onClick={closeDialog} size="small">
						<CloseIcon />
					</IconButton>
				</DialogTitle>

				<Box component="form" onSubmit={handleSave}>
					<DialogContent dividers sx={{ pt: 2 }}>
						{submitError && (
							<Alert severity="error" sx={{ mb: 2 }}>
								{submitError}
							</Alert>
						)}

						<Stack spacing={2.5}>
							<TextField
								label="Title"
								value={form.title}
								onChange={handleChange('title')}
								error={Boolean(errors.title)}
								helperText={errors.title}
								fullWidth
								required
								autoFocus
							/>

							<TextField
								label="URL slug"
								value={form.name}
								onChange={handleChange('name')}
								error={Boolean(errors.name)}
								helperText={
									errors.name ||
									`Public link: /articles/${form.name || 'your-slug'}${
										isEditing ? ' (changing the slug updates the article URL)' : ''
									}`
								}
								fullWidth
								required
							/>

							<Box>
								<Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
									Cover image
								</Typography>
								<Stack direction="row" spacing={2} alignItems="flex-start">
									<Button
										variant="outlined"
										component="label"
										startIcon={<ImageOutlinedIcon />}
									>
										{imageFile || form.image ? 'Replace image' : 'Attach image'}
										<input
											type="file"
											hidden
											accept="image/jpeg,image/png,image/gif,image/webp"
											onChange={handleImageSelect}
										/>
									</Button>
									{(imageFile || form.image) && (
										<Button size="small" color="inherit" onClick={handleRemoveImage}>
											Remove
										</Button>
									)}
								</Stack>
								{errors.image && (
									<Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
										{errors.image}
									</Typography>
								)}
								{imagePreview && (
									<Box
										component="img"
										src={imagePreview}
										alt="Preview"
										sx={{
											mt: 2,
											width: '100%',
											maxHeight: 200,
											objectFit: 'cover',
											borderRadius: 2,
											border: '1px solid',
											borderColor: 'divider',
										}}
									/>
								)}
								{imageFile && (
									<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
										{imageFile.name}
									</Typography>
								)}
							</Box>

							<TextField
								label="Content"
								value={form.content}
								onChange={handleChange('content')}
								error={Boolean(errors.content)}
								helperText={
									errors.content || 'Separate paragraphs with a blank line.'
								}
								fullWidth
								required
								multiline
								minRows={8}
							/>
						</Stack>
					</DialogContent>

					<DialogActions sx={{ px: 3, py: 2 }}>
						<Button onClick={closeDialog} disabled={submitting}>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="contained"
							disabled={submitting}
							startIcon={
								submitting ? <CircularProgress size={18} color="inherit" /> : null
							}
						>
							{submitting
								? isEditing
									? 'Saving…'
									: 'Publishing…'
								: isEditing
									? 'Save changes'
									: 'Publish'}
						</Button>
					</DialogActions>
				</Box>
			</Dialog>

			<Dialog open={Boolean(deleteTarget)} onClose={() => !deleting && setDeleteTarget(null)}>
				<DialogTitle>Delete article?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This will permanently remove &ldquo;{deleteTarget?.title}&rdquo; from the site and
						database.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
						Cancel
					</Button>
					<Button
						color="error"
						variant="contained"
						onClick={confirmDelete}
						disabled={deleting}
					>
						{deleting ? 'Deleting…' : 'Delete'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
