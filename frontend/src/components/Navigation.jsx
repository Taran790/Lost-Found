import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    if (userStr && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    console.error("Failed to parse user", e);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar variant="dark" expand="lg" className="glass-nav py-3 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to={token ? "/dashboard" : "/login"} className="text-primary d-flex align-items-center gap-2">
          <Search size={24} />
          Lost & Found Portal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {token ? (
              <>
                <Navbar.Text className="me-3 fw-medium">
                  Welcome, {user?.name || 'User'}
                </Navbar.Text>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                {location.pathname !== '/login' && (
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                )}
                {location.pathname !== '/register' && (
                  <Nav.Link as={Link} to="/register">
                    <Button variant="primary" size="sm">Register</Button>
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
