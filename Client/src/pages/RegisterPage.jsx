// client/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: '',
  });

  const { name, email, password, adminCode } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const newUser = {
      name,
      email,
      password,
      adminCode,
    };

    try {
      const url = 'http://localhost:5000/api/auth/register';
      const res = await axios.post(url, newUser);
      
      console.log(res.data);
      alert('Registration successful!');

    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.message || 'Registration failed');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2>Register</h2>
          <Form onSubmit={onSubmit}>
            {/* --- THESE ARE THE CORRECTED FORM FIELDS --- */}
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={name}
                onChange={onChange}
                required
              />
            </Form.Group>

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
            {/* ------------------------------------------- */}
            
            <Form.Group className="mb-3" controlId="formBasicAdminCode">
              <Form.Label>Admin Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Optional: Enter code for admin registration"
                name="adminCode"
                value={adminCode}
                onChange={onChange}
              />
            </Form.Group>
            
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;