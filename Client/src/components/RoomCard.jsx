// client/src/components/RoomCard.jsx

import React from 'react';
import { Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  return (
    // The Card itself is NO LONGER wrapped in a Link
    <Card className="my-3 p-3 rounded h-100">
      
      {/* The Carousel sits directly inside the Card, NOT inside a Link */}
      {room.images && room.images.length > 0 && (
        <Carousel interval={null}> {/* interval={null} stops auto-sliding */}
          {room.images.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={image}
                alt={`Room image ${index + 1}`}
                style={{ height: '200px', objectFit: 'cover' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}
      
      {/* --- THIS IS THE KEY CHANGE --- */}
      {/* We wrap ONLY the Card.Body in the Link */}
      <Link to={`/room/${room._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Card.Body>
          <Card.Title as="div">
            <strong>{room.location}</strong>
          </Card.Title>
          <Card.Text as="div">
            Capacity: {room.capacity} person(s)
          </Card.Text>
          <Card.Text as="h5" className="mt-2">
            Contact: {room.contactNumber}
          </Card.Text>
        </Card.Body>
      </Link>

    </Card>
  );
};

export default RoomCard;