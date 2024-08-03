import React from 'react';
import Card from 'react-bootstrap/Card';
import { CiClock2 } from "react-icons/ci";
import './ticket.css';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function Ticket({ ticket }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
        id: ticket.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: 999,
    }
    function formatDate(date) {
        const options = { day: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-GB', options);
    }
    return (
        <Card ref={setNodeRef} {...attributes} {...listeners} style={style} className='single-card'>
            <Card.Body style={{ textAlign: 'left' }}>
                <Card.Title>{ticket.ticketLabel}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted"><CiClock2 style={{ color: 'red' }} /> {formatDate(ticket.lastUpdated)}</Card.Subtitle>
                <Card.Text className="mb-2">{ticket.ticketOwner} - {ticket.effortPoint}</Card.Text>
            </Card.Body>
        </Card>
    )

}