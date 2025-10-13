// client/src/pages/RoomsPage.jsx

import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import RoomCard from '../components/RoomCard';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/rooms');
        setRooms(res.data);
      } catch (err) {
        setError('Could not fetch rooms. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []); // The empty dependency array means this runs once on component mount

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <h1>Available Rooms</h1>
      <Row>
        {rooms.map((room) => (
          <Col key={room._id} sm={12} md={6} lg={4} xl={3}>
            <RoomCard room={room} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default RoomsPage;