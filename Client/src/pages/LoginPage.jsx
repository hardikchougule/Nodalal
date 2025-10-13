// client/src/pages/LoginPage.jsx

import React, { useState, useContext } from 'react'; // Import useContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx'; // Import our AuthContext

const LoginPage = () => {
  // Get the login function from our context
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook for navigation

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const user = { email, password };

    try {
      const url = 'http://localhost:5000/api/auth/login';
      const res = await axios.post(url, user);

      // --- THIS IS THE KEY CHANGE ---
      // Instead of console.log, we call the login function from our context
      login(res.data.token);
      
      alert('Login successful!');
      
      // Redirect the user to the home page after successful login
      navigate('/');

    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.message || 'Login failed');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2>Login</h2>
          <Form onSubmit={onSubmit}>
            {/* Form fields remain the same */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;