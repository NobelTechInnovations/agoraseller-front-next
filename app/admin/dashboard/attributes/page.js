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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Grid,
  Pagination,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../utils/axios';
import { debounce } from 'lodash';

export default function AttributesPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAttribute, setNewAttribute] = useState({
    name: '',
    isRequired: false,
    type: 'variant'
  });
  const [newValue, setNewValue] = useState({
    name: '',
    value: '',
    attributeId: ''
  });
  const [expandedAttribute, setExpandedAttribute] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [matchingAttributes, setMatchingAttributes] = useState([]);
  const [searchingMatches, setSearchingMatches] = useState(false);

  const fetchAttributes = async (page = 1, search = '') => {
    setLoading(true);
    setError(null);
    try {
      let url = `/v1/admin/attribute/list?page=${page}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      console.log('Fetching URL:', url); // Debug log

      const response = await axiosInstance.get(url);
      console.log('API Response:', response.data); // Debug log

      if (response.data.success) {
        setAttributes(response.data.data.attributes || []);
        setPagination(response.data.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0
        });
      } else {
        setError(response.data.message || 'Failed to fetch attributes');
      }
    } catch (error) {
      console.error('Error fetching attributes:', error);
      setError(error.response?.data?.message || 'Failed to fetch attributes');
      setAttributes([]);
      setPagination({
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to prevent too many API calls
  const debouncedSearch = useCallback(
    debounce((search) => {
      fetchAttributes(1, search);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    if (searchQuery === '') {
      fetchAttributes(currentPage);
    }
  }, [currentPage]);

  // New function to search all attributes without pagination
  const searchAllAttributes = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setMatchingAttributes([]);
      return;
    }
    
    setSearchingMatches(true);
    try {
      const response = await axiosInstance.get(`/v1/admin/attribute/list?search=${encodeURIComponent(searchTerm)}&limit=1000`);
      if (response.data.success) {
        // Filter to only include attributes with names similar to the search term
        const searchTermLower = searchTerm.toLowerCase();
        const similarAttributes = response.data.data.attributes.filter(attr => 
          attr.name.toLowerCase().includes(searchTermLower) ||
          searchTermLower.includes(attr.name.toLowerCase())
        );
        setMatchingAttributes(similarAttributes);
      }
    } catch (error) {
      console.error('Error searching all attributes:', error);
      setMatchingAttributes([]);
    } finally {
      setSearchingMatches(false);
    }
  };

  // Debounce the all-attributes search to prevent too many API calls
  const debouncedAllSearch = useCallback(
    debounce((search) => {
      searchAllAttributes(search);
    }, 300),
    []
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewAttribute({
      name: '',
      isRequired: false,
      type: 'variant'
    });
  };

  const handleAddAttribute = async () => {
    if (newAttribute.name.trim()) {
      try {
        const response = await axiosInstance.post('/v1/admin/attribute/add', newAttribute);
        if (response.data.success) {
          fetchAttributes(); // Refresh the list
          handleClose();
        }
      } catch (error) {
        console.error('Error creating attribute:', error);
      }
    }
  };

  const handleDeleteAttribute = (id) => {
    setAttributes(attributes.filter(attribute => attribute._id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAttribute(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // When typing in the name field, check for existing attributes
    if (name === 'name') {
      if (value.trim()) {
        debouncedAllSearch(value);
      } else {
        setMatchingAttributes([]);
      }
    }
  };

  const handleAddValue = async (attributeId) => {
    if (newValue.name.trim()) {
      try {
        const payload = {
          name: newValue.name,
          value: newValue.value || newValue.name, // Use name as value if no specific value provided
          attributeId: attributeId
        };
        const response = await axiosInstance.post('/v1/admin/attribute-option/create', payload);
        if (response.data.success) {
          fetchAttributes(); // Refresh the list
          setNewValue({
            name: '',
            value: '',
            attributeId: ''
          });
        }
      } catch (error) {
        console.error('Error adding value:', error);
      }
    }
  };

  const handleDeleteValue = (attributeId, valueId) => {
    setAttributes(attributes.map(attr => {
      if (attr._id === attributeId) {
        return {
          ...attr,
          options: attr.options.filter(option => option._id !== valueId)
        };
      }
      return attr;
    }));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

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
          Add Attribute
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search attributes..."
              value={searchQuery}
              onChange={handleSearchChange}
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

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Required</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Values</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: '#f5f5f5' }}>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : attributes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No attributes found
                    </TableCell>
                  </TableRow>
                ) : (
                  attributes.map((attribute) => (
                    <>
                      <TableRow key={attribute._id}>
                        <TableCell>{attribute.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={attribute.isRequired ? 'Yes' : 'No'}
                            color={attribute.isRequired ? 'success' : 'default'}
                            size="small"
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={attribute.type}
                            color="primary"
                            size="small"
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {attribute.options?.slice(0, 3).map((option) => (
                              <Chip
                                key={option._id}
                                label={option.name}
                                size="small"
                                onDelete={() => handleDeleteValue(attribute._id, option._id)}
                                sx={{ borderRadius: 1 }}
                              />
                            ))}
                            {attribute.options?.length > 3 && (
                              <Chip
                                label={`+${attribute.options.length - 3} more`}
                                size="small"
                                onClick={() => setExpandedAttribute(expandedAttribute === attribute._id ? null : attribute._id)}
                                sx={{ borderRadius: 1 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => setExpandedAttribute(expandedAttribute === attribute._id ? null : attribute._id)}
                          >
                            {expandedAttribute === attribute._id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: theme.palette.error.main }}
                            onClick={() => handleDeleteAttribute(attribute._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                          <Collapse in={expandedAttribute === attribute._id}>
                            <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    All Values
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {attribute.options?.map((option) => (
                                      <Chip
                                        key={option._id}
                                        label={option.name}
                                        size="small"
                                        onDelete={() => handleDeleteValue(attribute._id, option._id)}
                                        sx={{ borderRadius: 1 }}
                                      />
                                    ))}
                                  </Box>
                                </Grid>
                                <Grid item xs={12}>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                      size="small"
                                      placeholder="Value name"
                                      value={newValue.name}
                                      onChange={(e) => setNewValue(prev => ({ ...prev, name: e.target.value }))}
                                      sx={{ flexGrow: 1 }}
                                    />
                                    {attribute.type === 'variant' && (
                                      <TextField
                                        size="small"
                                        placeholder="Value (e.g. #000 for color)"
                                        value={newValue.value}
                                        onChange={(e) => setNewValue(prev => ({ ...prev, value: e.target.value }))}
                                        sx={{ flexGrow: 1 }}
                                      />
                                    )}
                                    <Button
                                      variant="contained"
                                      onClick={() => handleAddValue(attribute._id)}
                                      disabled={!newValue.name.trim()}
                                      sx={{
                                        background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
                                        '&:hover': {
                                          background: 'linear-gradient(135deg, #4e4376 0%, #2b5876 100%)',
                                        },
                                      }}
                                    >
                                      Add Value
                                    </Button>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {pagination.total > 0 && (
            <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
              <Pagination 
                count={pagination.pages} 
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                showFirstButton 
                showLastButton
                disabled={loading}
              />
              <Typography variant="body2" color="text.secondary">
                Total {pagination.total} items
              </Typography>
            </Stack>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add New Attribute</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Attribute Name"
              name="name"
              value={newAttribute.name}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
              required
            />
            
            {searchingMatches && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgress size={20} />
              </Box>
            )}
            
            {matchingAttributes.length > 0 && newAttribute.name.trim() !== '' && !searchingMatches && (
              <Alert 
                severity="warning" 
                sx={{ mb: 2 }}
                icon={<WarningIcon />}
              >
                <Typography variant="body2">
                  Similar attributes found:
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {matchingAttributes.slice(0, 5).map(attr => (
                    <Chip 
                      key={attr._id} 
                      label={attr.name} 
                      size="small" 
                      color="warning"
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                  {matchingAttributes.length > 5 && (
                    <Chip 
                      label={`+${matchingAttributes.length - 5} more`} 
                      size="small"
                      sx={{ borderRadius: 1 }}
                    />
                  )}
                </Box>
              </Alert>
            )}
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Required</InputLabel>
              <Select
                name="isRequired"
                value={newAttribute.isRequired}
                onChange={handleInputChange}
                label="Required"
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={newAttribute.type}
                onChange={handleInputChange}
                label="Type"
              >
                <MenuItem value="variant">Variant</MenuItem>
                <MenuItem value="meta">Meta</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddAttribute}
            disabled={!newAttribute.name.trim()}
            sx={{
              background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4e4376 0%, #2b5876 100%)',
              },
            }}
          >
            Add Attribute
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 