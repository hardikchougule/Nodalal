// client/src/pages/EditRoomPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Spinner, Image } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const EditRoomPage = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [formData, setFormData] = useState({ location: '', facility: '', contactNumber: '', capacity: '' });
  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState({ image1: null, image2: null, image3: null });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        // Use environment variable for the API URL
        const url = `${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`;
        const { data } = await axios.get(url);
        setFormData({ location: data.location, facility: data.facility, contactNumber: data.contactNumber, capacity: data.capacity });
        setCurrentImages(data.images);
      } catch (error) {
        alert('Could not load room data.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoomData();
  }, [roomId]);

  const handleTextChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (key, e) => { if (e.target.files[0]) setNewImages({ ...newImages, [key]: e.target.files[0] }); };

  const onSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const updatedData = { ...formData };
    const newSelectedImages = Object.values(newImages).filter(img => img !== null);

    if (newSelectedImages.length > 0) {
      const newImageUrls = [];
      try {
        // NOTE: Cloudinary URL does NOT use the VITE_API_URL variable
        const uploadPreset = 'YOUR_UPLOAD_PRESET_NAME'; // <-- Keep Cloudinary creds
        const cloudName = 'YOUR_CLOUD_NAME';       // <-- Keep Cloudinary creds
        for (const imageFile of newSelectedImages) {
          const data = new FormData(); data.append('file', imageFile); data.append('upload_preset', uploadPreset);
          const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, data);
          newImageUrls.push(res.data.secure_url);
        }
        updatedData.images = newImageUrls; // Overwrite images if new ones were uploaded
      } catch (err) {
        alert('Image upload failed.'); setUpdating(false); return;
      }
    } // If no new images selected, updatedData will not have an 'images' key, so the backend won't touch them

    const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
    try {
      // Use environment variable for the API URL
      const url = `${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`;
      await axios.put(url, updatedData, config);
      alert('Room updated!'); navigate(`/room/${roomId}`);
    } catch (error) {
      alert('Failed to update room.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <h2>Edit Room</h2>
          <div className="mb-4"><h5>Current Images</h5>{currentImages.map((img, index) => (<Image key={index} src={img} thumbnail width={150} className="me-2" />))}</div>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3"><Form.Label>Location</Form.Label><Form.Control type="text" name="location" value={formData.location} onChange={handleTextChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Facility</Form.Label><Form.Control as="textarea" rows={3} name="facility" value={formData.facility} onChange={handleTextChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Contact</Form.Label><Form.Control type="text" name="contactNumber" value={formData.contactNumber} onChange={handleTextChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Capacity</Form.Label><Form.Control type="number" name="capacity" value={formData.capacity} onChange={handleTextChange} required min="1" /></Form.Group>
            <hr /><h5 className="mt-4">Upload New Images (Replaces Old)</h5><p className="text-muted">Leave blank to keep current images.</p>
            <Form.Group className="mb-3"><Form.Label>Image 1</Form.Label><Form.Control type="file" onChange={e => handleImageChange('image1', e)} accept="image/*" /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Image 2</Form.Label><Form.Control type="file" onChange={e => handleImageChange('image2', e)} accept="image/*" /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Image 3</Form.Label><Form.Control type="file" onChange={e => handleImageChange('image3', e)} accept="image/*" /></Form.Group>
            <Button variant="primary" type="submit" disabled={updating}>{updating ? <Spinner as="span" size="sm" /> : 'Update Room'}</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
export default EditRoomPage;