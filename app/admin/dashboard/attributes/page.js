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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { useState } from 'react';

export default function AttributesPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAttribute, setNewAttribute] = useState({
    name: '',
    isRequired: false,
  });
  const [newValue, setNewValue] = useState('');
  const [expandedAttribute, setExpandedAttribute] = useState(null);
  const [attributes, setAttributes] = useState([
    {
      id: 1,
      name: 'Color',
      isRequired: true,
      status: 'active',
      values: ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'],
    },
    {
      id: 2,
      name: 'Size',
      isRequired: true,
      status: 'active',
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      id: 3,
      name: 'Material',
      isRequired: false,
      status: 'active',
      values: ['Cotton', 'Polyester', 'Wool', 'Silk', 'Leather'],
    },
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewAttribute({
      name: '',
      isRequired: false,
    });
  };

  const handleAddAttribute = () => {
    if (newAttribute.name.trim()) {
      const newId = Math.max(...attributes.map(a => a.id)) + 1;
      setAttributes([
        ...attributes,
        {
          id: newId,
          ...newAttribute,
          status: 'active',
          values: [],
        }
      ]);
      handleClose();
    }
  };

  const handleDeleteAttribute = (id) => {
    setAttributes(attributes.filter(attribute => attribute.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAttribute(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddValue = (attributeId) => {
    if (newValue.trim()) {
      setAttributes(attributes.map(attr => {
        if (attr.id === attributeId) {
          return {
            ...attr,
            values: [...attr.values, newValue.trim()]
          };
        }
        return attr;
      }));
      setNewValue('');
    }
  };

  const handleDeleteValue = (attributeId, value) => {
    setAttributes(attributes.map(attr => {
      if (attr.id === attributeId) {
        return {
          ...attr,
          values: attr.values.filter(v => v !== value)
        };
      }
      return attr;
    }));
  };

  const filteredAttributes = attributes.filter(attribute =>
    attribute.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <TableCell sx={{ fontWeight: 600 }}>Required</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Values</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAttributes.map((attribute) => (
                  <>
                    <TableRow key={attribute.id}>
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
                          label={attribute.status}
                          color={attribute.status === 'active' ? 'success' : 'default'}
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {attribute.values.slice(0, 3).map((value, index) => (
                            <Chip
                              key={index}
                              label={value}
                              size="small"
                              onDelete={() => handleDeleteValue(attribute.id, value)}
                              sx={{ borderRadius: 1 }}
                            />
                          ))}
                          {attribute.values.length > 3 && (
                            <Chip
                              label={`+${attribute.values.length - 3} more`}
                              size="small"
                              onClick={() => setExpandedAttribute(expandedAttribute === attribute.id ? null : attribute.id)}
                              sx={{ borderRadius: 1 }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => setExpandedAttribute(expandedAttribute === attribute.id ? null : attribute.id)}
                        >
                          {expandedAttribute === attribute.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
                          onClick={() => handleDeleteAttribute(attribute.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                        <Collapse in={expandedAttribute === attribute.id}>
                          <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  All Values
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  {attribute.values.map((value, index) => (
                                    <Chip
                                      key={index}
                                      label={value}
                                      size="small"
                                      onDelete={() => handleDeleteValue(attribute.id, value)}
                                      sx={{ borderRadius: 1 }}
                                    />
                                  ))}
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <TextField
                                    size="small"
                                    placeholder="Add new value"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    sx={{ flexGrow: 1 }}
                                  />
                                  <Button
                                    variant="contained"
                                    onClick={() => handleAddValue(attribute.id)}
                                    disabled={!newValue.trim()}
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Attribute Dialog */}
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
            <FormControl fullWidth>
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