// client/src/pages/RoomDetailsPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Carousel, Card, ListGroup, Form, Button, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext.jsx';

const RoomDetailsPage = () => {
  const { id: roomId } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // --- THIS IS THE MISSING FUNCTION ---
  const fetchRoom = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/rooms/${roomId}`);
      setRoom(res.data);
    } catch (err) {
      setError('Could not fetch room details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false); // This line is crucial to stop the loading spinner
    }
  };
  // ------------------------------------

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  // --- THIS IS THE MISSING FUNCTION ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    const config = {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` }
    };

    try {
      await axios.post(`http://localhost:5000/api/rooms/${roomId}/comments`, { text: commentText }, config);
      setCommentText('');
      fetchRoom(); // Refetch room data to show the new comment
    } catch (err) {
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  // ------------------------------------

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
        await axios.delete(`http://localhost:5000/api/rooms/${roomId}`, config);
        alert('Room deleted successfully.');
        navigate('/rooms');
      } catch (err) {
        alert('Failed to delete the room.');
      }
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;
  if (!room) return <p className="text-center mt-5">Room not found.</p>;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          <Carousel>
            {room.images.map((image, index) => (
              <Carousel.Item key={index}>
                <img className="d-block w-100" src={image} alt={`Room slide ${index + 1}`} style={{ height: '400px', objectFit: 'cover', borderRadius: '8px' }}/>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item><h3>{room.location}</h3></ListGroup.Item>
              <ListGroup.Item><strong>Facilities:</strong> {room.facility}</ListGroup.Item>
              <ListGroup.Item><strong>Capacity:</strong> {room.capacity} person(s)</ListGroup.Item>
              <ListGroup.Item><strong>Contact:</strong> {room.contactNumber}</ListGroup.Item>
              {auth.user && auth.user.id === room.createdBy && (
                <ListGroup.Item>
                  <Button as={Link} to={`/edit-room/${room._id}`} variant="light" className="w-100 mb-2">Edit Room</Button>
                  <Button variant="danger" className="w-100" onClick={handleDelete}>Delete Room</Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={8}>
          <h2>Comments</h2>
          {room.comments.length === 0 && <p>No comments yet. Be the first to comment!</p>}
          <ListGroup>
            {room.comments.map((comment) => (
              <ListGroup.Item key={comment._id} className="mb-2">
                <strong>{comment.author.name}</strong>
                <p className="mb-1">{comment.text}</p>
                <small className="text-muted">Posted on {new Date(comment.createdAt).toLocaleDateString()}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {auth.isAuthenticated && (
            <div className="mt-4">
              <h4>Leave a Comment</h4>
              <Form onSubmit={handleCommentSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control as="textarea" rows={3} value={commentText} onChange={(e) => setCommentText(e.target.value)} required />
                </Form.Group>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Spinner as="span" size="sm" /> : 'Submit'}
                </Button>
              </Form>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RoomDetailsPage;