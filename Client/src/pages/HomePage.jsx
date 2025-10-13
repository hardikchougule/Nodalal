import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';

const HomePage = () => {
  return (
    <Container fluid className="p-0">
      <div 
        className="text-center text-white d-flex align-items-center justify-content-center"
        style={{
          height: '80vh',
          backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '2rem', borderRadius: '15px' }}>
          <h1 className="display-3">Welcome to NoDalaal</h1>
          <p className="lead">
            Find your next home without any brokers. Direct, simple, and transparent.
          </p>
          <hr className="my-4" />
          <p>Ready to find your perfect room? Click the button below to start your search.</p>
          <Button as={Link} to="/rooms" variant="primary" size="lg">
            View Available Rooms
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default HomePage;