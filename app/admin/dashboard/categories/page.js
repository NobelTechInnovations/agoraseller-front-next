'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useState } from 'react';

export default function CategoriesPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    parentCategory: '',
    thumb: null 
  });
  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', parentCategory: '', status: 'active' },
    { id: 2, name: 'Clothing', parentCategory: '', status: 'active' },
    { id: 3, name: 'Books', parentCategory: '', status: 'inactive' },
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewCategory({ name: '', parentCategory: '', thumb: null });
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const formData = new FormData();
      formData.append('name', newCategory.name);
      formData.append('parentCategory', newCategory.parentCategory);
      if (newCategory.thumb) {
        formData.append('thumb', newCategory.thumb);
      }

      // Here you would typically send the formData to your API
      // For now, we'll just update the local state
      const newId = Math.max(...categories.map(c => c.id)) + 1;
      setCategories([
        ...categories,
        {
          id: newId,
          name: newCategory.name,
          parentCategory: newCategory.parentCategory,
          status: 'active'
        }
      ]);
      handleClose();
    }
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewCategory(prev => ({
        ...prev,
        thumb: e.target.files[0]
      }));
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ px: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4e4376 0%, #2b5876 100%)',
            },
          }}
        >
          Add Category
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Parent Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.parentCategory || 'None'}</TableCell>
                    <TableCell>
                      <Chip
                        label={category.status}
                        color={category.status === 'active' ? 'success' : 'default'}
                        size="small"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: theme.palette.error.main }}
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add New Category</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Category Name"
              name="name"
              value={newCategory.name}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
              required
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Parent Category</InputLabel>
              <Select
                name="parentCategory"
                value={newCategory.parentCategory}
                onChange={handleInputChange}
                label="Parent Category"
              >
                <MenuItem value="">None</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload Thumbnail
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {newCategory.thumb && (
              <Typography variant="body2" color="text.secondary">
                Selected file: {newCategory.thumb.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddCategory}
            disabled={!newCategory.name.trim()}
            sx={{
              background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4e4376 0%, #2b5876 100%)',
              },
            }}
          >
            Add Category
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 