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

  const fetchRoom = async () => {
    try {
      setLoading(true);
      // Use environment variable for the API URL
      const url = `${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`;
      const res = await axios.get(url);
      setRoom(res.data);
    } catch (err) {
      setError('Could not fetch room details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
    try {
      // Use environment variable for the API URL
      const url = `${import.meta.env.VITE_API_URL}/api/rooms/${roomId}/comments`;
      await axios.post(url, { text: commentText }, config);
      setCommentText(''); fetchRoom();
    } catch (err) {
      alert('Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
        // Use environment variable for the API URL
        const url = `${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`;
        await axios.delete(url, config);
        alert('Room deleted.'); navigate('/rooms');
      } catch (err) {
        alert('Failed to delete.');
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
          <Carousel>{room.images.map((img, idx) => (<Carousel.Item key={idx}><img className="d-block w-100" src={img} alt={`Slide ${idx}`} style={{ height: '400px', objectFit: 'cover', borderRadius: '8px' }}/></Carousel.Item>))}</Carousel>
        </Col>
        <Col md={4}>
          <Card><ListGroup variant="flush"><ListGroup.Item><h3>{room.location}</h3></ListGroup.Item><ListGroup.Item><strong>Facilities:</strong> {room.facility}</ListGroup.Item><ListGroup.Item><strong>Capacity:</strong> {room.capacity} person(s)</ListGroup.Item><ListGroup.Item><strong>Contact:</strong> {room.contactNumber}</ListGroup.Item>{auth.user && auth.user.id === room.createdBy && (<ListGroup.Item><Button as={Link} to={`/edit-room/${room._id}`} variant="light" className="w-100 mb-2">Edit</Button><Button variant="danger" className="w-100" onClick={handleDelete}>Delete</Button></ListGroup.Item>)}</ListGroup></Card>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={8}>
          <h2>Comments</h2>
          {room.comments.length === 0 && <p>No comments yet.</p>}
          <ListGroup>{room.comments.map(c => (<ListGroup.Item key={c._id} className="mb-2"><strong>{c.author.name}</strong><p className="mb-1">{c.text}</p><small className="text-muted">Posted on {new Date(c.createdAt).toLocaleDateString()}</small></ListGroup.Item>))}</ListGroup>
          {auth.isAuthenticated && (<div className="mt-4"><h4>Leave a Comment</h4><Form onSubmit={handleCommentSubmit}><Form.Group className="mb-3"><Form.Control as="textarea" rows={3} value={commentText} onChange={e => setCommentText(e.target.value)} required /></Form.Group><Button type="submit" disabled={submitting}>{submitting ? <Spinner as="span" size="sm" /> : 'Submit'}</Button></Form></div>)}
        </Col>
      </Row>
    </Container>
  );
};

export default RoomDetailsPage;