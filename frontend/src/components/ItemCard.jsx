import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { MapPin, Calendar, User, Phone, Edit2, Trash2 } from 'lucide-react';

const ItemCard = ({ item, currentUser, onEdit, onDelete }) => {
  const isOwner = currentUser && item.user && (item.user._id === currentUser.id || item.user === currentUser.id);

  return (
    <Card className="h-100 glass-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="fw-bold mb-0">{item.itemName}</Card.Title>
          <Badge bg={item.type === 'Lost' ? 'danger' : 'success'} className="px-3 py-2 rounded-pill">
            {item.type}
          </Badge>
        </div>
        
        <Card.Text className="text-muted small mb-3">
          {item.description || 'No description provided.'}
        </Card.Text>

        <div className="d-flex flex-column gap-2 small text-muted mb-4">
          {item.location && (
            <div className="d-flex align-items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <span>{item.location}</span>
            </div>
          )}
          {item.date && (
            <div className="d-flex align-items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
          )}
          {item.user && item.user.name && (
            <div className="d-flex align-items-center gap-2">
              <User size={16} className="text-primary" />
              <span>Reported by: {item.user.name}</span>
            </div>
          )}
          {item.contactInfo && (
            <div className="d-flex align-items-center gap-2">
              <Phone size={16} className="text-primary" />
              <span>{item.contactInfo}</span>
            </div>
          )}
        </div>
      </Card.Body>
      
      {isOwner && (
        <Card.Footer className="bg-transparent border-top-0 d-flex gap-2 justify-content-end pb-3 pe-3">
          <Button variant="outline-primary" size="sm" onClick={() => onEdit(item)} className="d-flex align-items-center gap-1">
            <Edit2 size={14} /> Edit
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => onDelete(item._id)} className="d-flex align-items-center gap-1">
            <Trash2 size={14} /> Delete
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
};

export default ItemCard;
