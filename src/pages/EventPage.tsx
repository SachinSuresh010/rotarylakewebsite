import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventGallery from './EventGallery';
import { getEvent } from '../data/eventData';

const EventPage: React.FC = () => {
  const { year, eventId } = useParams<{ year: string; eventId: string }>();
  const navigate = useNavigate();

  if (!year || !eventId) {
    return (
      <div style={{ paddingTop: '80px', textAlign: 'center' }}>
        <h2>Event not found</h2>
        <button onClick={() => navigate('/gallery')}>Back to Gallery</button>
      </div>
    );
  }

  const event = getEvent(year, eventId);

  if (!event) {
    return (
      <div style={{ paddingTop: '80px', textAlign: 'center' }}>
        <h2>Event not found</h2>
        <button onClick={() => navigate('/gallery')}>Back to Gallery</button>
      </div>
    );
  }

  return (
    <EventGallery
      eventName={event.name}
      eventDescription={event.description}
      images={event.images}
      backLink={`/gallery/${year}`}
    />
  );
};

export default EventPage; 