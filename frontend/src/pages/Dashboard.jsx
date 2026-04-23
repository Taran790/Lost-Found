import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal, InputGroup } from 'react-bootstrap';
import { Search as SearchIcon, Plus } from 'lucide-react';
import api from '../api';
import ItemCard from '../components/ItemCard';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    type: 'Lost',
    location: '',
    date: '',
    contactInfo: ''
  });

  const currentUserStr = localStorage.getItem('user');
  let currentUser = null;
  try {
    if (currentUserStr && currentUserStr !== 'undefined') {
      currentUser = JSON.parse(currentUserStr);
    }
  } catch (e) {
    console.error("Failed to parse user", e);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/items');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return fetchItems();
    }
    try {
      const res = await api.get(`/items/search?name=${searchQuery}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({
      itemName: '',
      description: '',
      type: 'Lost',
      location: '',
      date: '',
      contactInfo: ''
    });
  };

  const handleShowModal = () => setShowModal(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/items/${currentItemId}`, formData);
      } else {
        await api.post('/items', formData);
      }
      handleCloseModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      itemName: item.itemName,
      description: item.description || '',
      type: item.type,
      location: item.location || '',
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      contactInfo: item.contactInfo || ''
    });
    setCurrentItemId(item._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${id}`);
        fetchItems();
      } catch (err) {
        console.error(err);
        alert('Failed to delete item.');
      }
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4 align-items-center">
        <Col md={6} className="mb-3 mb-md-0">
          <h2 className="fw-bold mb-0 text-primary-gradient">Dashboard</h2>
          <p className="text-muted mb-0">Manage lost and found items on campus.</p>
        </Col>
        <Col md={6} className="d-flex justify-content-md-end gap-2">
          <Form onSubmit={handleSearch} className="d-flex flex-grow-1" style={{ maxWidth: '300px' }}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="primary" type="submit">
                <SearchIcon size={18} />
              </Button>
            </InputGroup>
          </Form>
          <Button variant="primary" onClick={handleShowModal} className="d-flex align-items-center gap-2">
            <Plus size={18} /> Report Item
          </Button>
        </Col>
      </Row>

      {items.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <h4>No items found.</h4>
          <p>Be the first to report a lost or found item.</p>
        </div>
      ) : (
        <Row className="g-4">
          {items.map((item) => (
            <Col key={item._id} xs={12} md={6} lg={4}>
              <ItemCard 
                item={item} 
                currentUser={currentUser} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for Add/Edit Item */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{isEditing ? 'Edit Item' : 'Report an Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} id="itemForm">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Item Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Type *</Form.Label>
                  <Form.Select name="type" value={formData.type} onChange={handleChange} required>
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Where was it lost/found?"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Contact Info</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    placeholder="Phone or Email"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="itemForm">
            {isEditing ? 'Save Changes' : 'Submit'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
