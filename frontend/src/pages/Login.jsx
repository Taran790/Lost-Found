import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'An error occurred during login');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center h-100 mt-5">
      <Card style={{ width: '400px' }} className="glass-card p-4">
        <h2 className="text-center mb-4 fw-bold text-primary-gradient">Welcome Back</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="text-muted fw-semibold">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="py-2"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label className="text-muted fw-semibold">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="py-2"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-3">
            Login
          </Button>
          <div className="text-center text-muted">
            Don't have an account? <Link to="/register" className="text-primary text-decoration-none fw-semibold">Register</Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
