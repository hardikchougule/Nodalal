// client/src/pages/AddRoomPage.jsx

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const AddRoomPage = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ location: '', facility: '', contactNumber: '', capacity: 1 });
  const [images, setImages] = useState({ image1: null, image2: null, image3: null });
  const [uploading, setUploading] = useState(false);

  const { location, facility, contactNumber, capacity } = formData;

  const handleTextChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleImageChange = (key, e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB.'); e.target.value = null; return;
      }
      setImages({ ...images, [key]: e.target.files[0] });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const selectedImages = Object.values(images).filter(img => img !== null);
    if (selectedImages.length === 0) { alert('Please upload at least one image.'); return; }
    
    setUploading(true);
    const imageUrls = [];

    try {
      // NOTE: Cloudinary URL does NOT use the VITE_API_URL variable
      const uploadPreset = 'YOUR_UPLOAD_PRESET_NAME'; // <-- Keep Cloudinary creds
      const cloudName = 'YOUR_CLOUD_NAME';       // <-- Keep Cloudinary creds

      for (const imageFile of selectedImages) {
        const data = new FormData();
        data.append('file', imageFile); data.append('upload_preset', uploadPreset);
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, data);
        imageUrls.push(res.data.secure_url);
      }
    } catch (err) {
      console.error('Image upload failed:', err); alert('Image upload failed.'); setUploading(false); return;
    }

    const roomData = { ...formData, images: imageUrls };
    const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };

    try {
      // Use environment variable for the API URL
      const url = `${import.meta.env.VITE_API_URL}/api/rooms`;
      await axios.post(url, roomData, config);
      alert('Room added successfully!'); navigate('/');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert(err.response ? err.response.data.message : 'Failed to add room');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <h2>Add a New Room</h2>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3"><Form.Label>Location</Form.Label><Form.Control type="text" name="location" value={location} onChange={handleTextChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Facility Description</Form.Label><Form.Control as="textarea" rows={3} name="facility" value={facility} onChange={handleTextChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Contact Number</Form.Label><Form.Control type="text" name="contactNumber" value={contactNumber} onChange={handleTextChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Capacity (members)</Form.Label><Form.Control type="number" name="capacity" value={capacity} onChange={handleTextChange} required min="1" /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Image 1 (Required)</Form.Label><Form.Control type="file" onChange={(e) => handleImageChange('image1', e)} accept="image/*" /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Image 2 (Optional)</Form.Label><Form.Control type="file" onChange={(e) => handleImageChange('image2', e)} accept="image/*" /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Image 3 (Optional)</Form.Label><Form.Control type="file" onChange={(e) => handleImageChange('image3', e)} accept="image/*" /></Form.Group>
            <Button variant="primary" type="submit" disabled={uploading}>{uploading ? <Spinner as="span" size="sm" /> : 'Add Room'}</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
export default AddRoomPage;