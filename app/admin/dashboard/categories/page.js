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
  Autocomplete,
  CircularProgress,
  Collapse,
  FormGroup,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LocalOffer as AttributeIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axios';

export default function CategoriesPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    parentCategory: null,
    thumb: null 
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // New state for attributes mapping
  const [attributeMapOpen, setAttributeMapOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [attributesLoading, setAttributesLoading] = useState(false);
  const [mappingLoading, setMappingLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/v1/admin/category/list');
      if (response.data.success) {
        setCategories(response.data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttributes = async (categoryId) => {
    setAttributesLoading(true);
    try {
      // Fetch mapped attributes for the category
      const mappedResponse = await axiosInstance.get(`/v1/admin/category/${categoryId}/attributes`);
      const mappedAttributes = mappedResponse.data.success ? mappedResponse.data.data : [];
      
      // Fetch all available attributes
      const allAttributesResponse = await axiosInstance.get('/v1/admin/attribute/list?limit=100');
      if (allAttributesResponse.data.success) {
        const allAttributes = allAttributesResponse.data.data.attributes || [];
        setAttributes(allAttributes);
        
        // Set the mapped attributes as selected
        setSelectedAttributes(mappedAttributes.map(attr => attr._id));
      }
    } catch (error) {
      console.error('Error fetching attributes:', error);
    } finally {
      setAttributesLoading(false);
    }
  };

  const findCategoryById = (id, categoriesList) => {
    for (const category of categoriesList) {
      if (category._id === id) return category;
      if (category.children) {
        const found = findCategoryById(id, category.children);
        if (found) return found;
      }
    }
    return null;
  };

  const handleAttributeMapOpen = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setAttributeMapOpen(true);
    fetchAttributes(categoryId);
  };

  const handleAttributeMapClose = () => {
    setAttributeMapOpen(false);
    setSelectedCategoryId(null);
    setSelectedAttributes([]);
  };

  const handleAttributeToggle = (attributeId) => {
    setSelectedAttributes(prev => {
      if (prev.includes(attributeId)) {
        return prev.filter(id => id !== attributeId);
      }
      return [...prev, attributeId];
    });
  };

  const handleSaveAttributeMapping = async () => {
    if (!selectedCategoryId) return;
    
    setMappingLoading(true);
    try {
      const response = await axiosInstance.post(`/v1/admin/category/${selectedCategoryId}/map-attributes`, {
        attribute_ids: selectedAttributes
      });
      
      if (response.data.success) {
        fetchCategories(); // Refresh categories to get updated mapping
        handleAttributeMapClose();
      }
    } catch (error) {
      console.error('Error mapping attributes:', error);
    } finally {
      setMappingLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewCategory({ name: '', parentCategory: null, thumb: null });
  };

  const handleAddCategory = async () => {
    if (newCategory.name.trim()) {
      setActionLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', newCategory.name);
        if (newCategory.parentCategory) {
          formData.append('parent', newCategory.parentCategory._id);
        }
        if (newCategory.thumb) {
          formData.append('thumb', newCategory.thumb);
        }

        const response = await axiosInstance.post('/v1/admin/category/add', formData);

        if (response.data.success) {
          fetchCategories();
          handleClose();
        }
      } catch (error) {
        console.error('Error adding category:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    setDeleteLoadingId(id);
    try {
      const response = await axiosInstance.delete(`/v1/admin/category/${id}/delete`);
      if (response.data.success) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setDeleteLoadingId(null);
    }
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

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderCategoryRow = (category, level = 0) => {
    const isExpanded = expandedCategories[category._id];
    const hasChildren = category.children && category.children.length > 0;

    return [
      <TableRow 
        key={`row-${category._id}`}
        sx={{
          backgroundColor: level === 0 ? 'inherit' : 'rgba(0, 0, 0, 0.02)',
        }}
      >
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: level * 3 }}>
            {hasChildren && (
              <IconButton size="small" onClick={() => toggleCategoryExpansion(category._id)}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {category.name}
              <Chip
                size="small"
                label={category.attributeAvailable == "yes" ? "Attributes Added" : "No Attributes"}
                color={category.attributeAvailable == "yes" ? "success" : "warning"}
                sx={{ 
                  height: '20px',
                  '& .MuiChip-label': {
                    px: 1,
                    fontSize: '0.7rem'
                  }
                }}
              />
            </Box>
          </Box>
        </TableCell>
        <TableCell>{category.slug}</TableCell>
        <TableCell>{category.parent ? getParentCategoryName(category.parent) : 'None'}</TableCell>
        <TableCell>
          <Chip
            label={category.status}
            color={category.status === 'active' ? 'success' : 'default'}
            size="small"
            sx={{ borderRadius: 1 }}
          />
        </TableCell>
        <TableCell>
          {new Date(category.createdAt).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => handleAttributeMapOpen(category._id)}
            sx={{ 
              color: theme.palette.info.main,
              bgcolor: category.attributeAvailable === "yes" ? 'rgba(46, 125, 50, 0.1)' : 'rgba(237, 108, 2, 0.1)',
              '&:hover': {
                bgcolor: category.attributeAvailable === "yes" ? 'rgba(46, 125, 50, 0.2)' : 'rgba(237, 108, 2, 0.2)',
              }
            }}
          >
            <AttributeIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: theme.palette.primary.main }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: theme.palette.error.main }}
            onClick={() => handleDeleteCategory(category._id)}
            disabled={deleteLoadingId === category._id}
          >
            {deleteLoadingId === category._id ? (
              <CircularProgress size={20} color="error" />
            ) : (
              <DeleteIcon />
            )}
          </IconButton>
        </TableCell>
      </TableRow>,
      hasChildren && isExpanded && (
        <TableRow key={`children-${category._id}`}>
          <TableCell colSpan={6} sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableBody>
                  {category.children.map(child => renderCategoryRow(child, level + 1))}
                </TableBody>
              </Table>
            </TableContainer>
          </TableCell>
        </TableRow>
      )
    ].filter(Boolean);
  };

  const getParentCategoryName = (parentId) => {
    if (!parentId) return 'None';
    const findCategory = (categories) => {
      for (const category of categories) {
        if (category._id === parentId) return category.name;
        if (category.children) {
          const found = findCategory(category.children);
          if (found) return found;
        }
      }
      return 'Unknown';
    };
    return findCategory(categories);
  };

  const flattenCategories = (categories, level = 0) => {
    return categories.reduce((acc, category) => {
      const option = {
        _id: category._id,
        name: category.name,
        level,
        label: '  '.repeat(level) + category.name
      };
      acc.push(option);
      if (category.children && category.children.length > 0) {
        acc.push(...flattenCategories(category.children, level + 1));
      }
      return acc;
    }, []);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading categories...</Typography>
      </Box>
    );
  }

  const parentCategoryOptions = flattenCategories(categories);

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
                  <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Parent Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories.flatMap((category) => renderCategoryRow(category))}
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
            <Autocomplete
              fullWidth
              options={parentCategoryOptions}
              getOptionLabel={(option) => option.label || ''}
              value={newCategory.parentCategory}
              onChange={(event, newValue) => {
                setNewCategory(prev => ({
                  ...prev,
                  parentCategory: newValue
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Parent Category"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Typography sx={{ pl: option.level * 2 }}>
                    {option.name}
                  </Typography>
                </li>
              )}
            />
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
            disabled={!newCategory.name.trim() || actionLoading}
            sx={{
              background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4e4376 0%, #2b5876 100%)',
              },
            }}
          >
            {actionLoading ? 'Adding...' : 'Add Category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attribute Mapping Dialog */}
      <Dialog 
        open={attributeMapOpen} 
        onClose={handleAttributeMapClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Map Attributes to Category
        </DialogTitle>
        <DialogContent>
          {attributesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Attributes: {attributes.length}
                </Typography>
              </Box>
              <List sx={{ width: '100%' }}>
                {/* Show Variant attributes first */}
                {attributes.filter(attr => attr.type === 'variant').length > 0 && (
                  <ListItem>
                    <Typography variant="subtitle1" color="primary">
                      Variant Attributes
                    </Typography>
                  </ListItem>
                )}
                {attributes
                  .filter(attr => attr.type === 'variant')
                  .map((attribute) => (
                    <ListItem key={attribute._id} disablePadding>
                      <ListItemButton onClick={() => handleAttributeToggle(attribute._id)}>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={selectedAttributes.includes(attribute._id)}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText 
                          primary={attribute.name}
                          secondary={
                            <>
                              Type: {attribute.type}
                              {attribute.options?.length > 0 && 
                                ` • ${attribute.options.length} options`}
                            </>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                
                {/* Then show Meta attributes */}
                {attributes.filter(attr => attr.type === 'meta').length > 0 && (
                  <ListItem sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" color="primary">
                      Meta Attributes
                    </Typography>
                  </ListItem>
                )}
                {attributes
                  .filter(attr => attr.type === 'meta')
                  .map((attribute) => (
                    <ListItem key={attribute._id} disablePadding>
                      <ListItemButton onClick={() => handleAttributeToggle(attribute._id)}>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={selectedAttributes.includes(attribute._id)}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText 
                          primary={attribute.name}
                          secondary={
                            <>
                              Type: {attribute.type}
                              {attribute.options?.length > 0 && 
                                ` • ${attribute.options.length} options`}
                            </>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleAttributeMapClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveAttributeMapping}
            disabled={mappingLoading}
            sx={{
              background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4e4376 0%, #2b5876 100%)',
              },
            }}
          >
            {mappingLoading ? 'Saving...' : 'Save Mapping'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 