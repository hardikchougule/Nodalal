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

  // State for text fields
  const [formData, setFormData] = useState({
    location: '',
    facility: '',
    contactNumber: '',
    capacity: '',
  });

  const [currentImages, setCurrentImages] = useState([]); // To display old images
  const [newImages, setNewImages] = useState({ // To handle new file uploads
    image1: null,
    image2: null,
    image3: null,
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch existing room data to pre-fill the form
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/rooms/${roomId}`);
        setFormData({
          location: data.location,
          facility: data.facility,
          contactNumber: data.contactNumber,
          capacity: data.capacity,
        });
        setCurrentImages(data.images); // Set current images for display
      } catch (error) {
        console.error("Failed to fetch room data", error);
        alert('Could not load room data.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoomData();
  }, [roomId]);

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (key, e) => {
    if (e.target.files[0]) {
      setNewImages({ ...newImages, [key]: e.target.files[0] });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const updatedData = { ...formData };
    const newSelectedImages = Object.values(newImages).filter(img => img !== null);

    // If new images were selected, upload them first
    if (newSelectedImages.length > 0) {
      const newImageUrls = [];
      try {
        const uploadPreset = 'YOUR_UPLOAD_PRESET_NAME'; // <-- REPLACE THIS
        const cloudName = 'YOUR_CLOUD_NAME';       // <-- REPLACE THIS

        for (const imageFile of newSelectedImages) {
          const data = new FormData();
          data.append('file', imageFile);
          data.append('upload_preset', uploadPreset);
          const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, data);
          newImageUrls.push(res.data.secure_url);
        }
        updatedData.images = newImageUrls; // Add new image URLs to the data being sent
      } catch (err) {
        alert('Image upload failed. Please try again.');
        setUpdating(false);
        return;
      }
    }

    // Now, update the room with either just text changes or text + new images
    const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
    try {
      await axios.put(`http://localhost:5000/api/rooms/${roomId}`, updatedData, config);
      alert('Room updated successfully!');
      navigate(`/room/${roomId}`);
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
          
          {/* Display Current Images */}
          <div className="mb-4">
            <h5>Current Images</h5>
            {currentImages.map((img, index) => (
              <Image key={index} src={img} thumbnail width={150} className="me-2" />
            ))}
          </div>

          <Form onSubmit={onSubmit}>
            {/* Text input fields */}
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" name="location" value={formData.location} onChange={handleTextChange} required />
            </Form.Group>
            {/* ... other text fields ... */}
            <Form.Group className="mb-3">
              <Form.Label>Facility Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="facility" value={formData.facility} onChange={handleTextChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control type="text" name="contactNumber" value={formData.contactNumber} onChange={handleTextChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacity (members)</Form.Label>
              <Form.Control type="number" name="capacity" value={formData.capacity} onChange={handleTextChange} required min="1" />
            </Form.Group>
            
            <hr />
            <h5 className="mt-4">Upload New Images</h5>
            <p className="text-muted">Select new images to replace all existing ones. Leave blank to keep current images.</p>

            {/* New Image Inputs */}
            <Form.Group className="mb-3">
              <Form.Label>Image 1</Form.Label>
              <Form.Control type="file" onChange={(e) => handleImageChange('image1', e)} accept="image/*" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image 2</Form.Label>
              <Form.Control type="file" onChange={(e) => handleImageChange('image2', e)} accept="image/*" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image 3</Form.Label>
              <Form.Control type="file" onChange={(e) => handleImageChange('image3', e)} accept="image/*" />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={updating}>
              {updating ? <Spinner as="span" size="sm" /> : 'Update Room'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditRoomPage;