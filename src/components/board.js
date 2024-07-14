import React, { useEffect, useState } from 'react';
import { ticketListItems } from '../data';
import Lane from './lane';
import './board.css';
import Card from 'react-bootstrap/Card';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function Board() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        setTickets([...ticketListItems]);
    }, []);

    const findEffortCount = (tickets) => {
        if (Array.isArray(tickets)) {
            return tickets.reduce((accum, next) => accum + Number(next.effortPoint), 0);
        }
        return 0;
    };

    const getTicketsByStatus = (status) => tickets.filter(ticket => ticket.status === status);

    const boardTypeObj = {
        'TODO': { t: getTicketsByStatus('TODO'), effortCount: findEffortCount(getTicketsByStatus('TODO')) },
        'IN_PROGRESS': { t: getTicketsByStatus('IN_PROGRESS'), effortCount: findEffortCount(getTicketsByStatus('IN_PROGRESS')) },
        'CODE_REVIEW': { t: getTicketsByStatus('CODE_REVIEW'), effortCount: findEffortCount(getTicketsByStatus('CODE_REVIEW')) },
        'DONE': { t: getTicketsByStatus('DONE'), effortCount: findEffortCount(getTicketsByStatus('DONE')) }
    };

    
    const handleDragEnd = (event) => {
        const { active, over } = event;
    
        // Get the ID of the lane where the ticket was dropped
        const overLaneId = over.id;
        const draggedTicket = tickets.find(ticket => ticket.id === active.id);

        if (draggedTicket) {
            setTickets(prevTickets => {
                const updatedTickets = prevTickets.map(ticket => {
                    if (ticket.id === active.id) {
                        return { ...ticket, status: overLaneId, lastUpdated: new Date(2024,6,8)};
                    }
                    return ticket;
                });
                return updatedTickets;
            });
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className='d-flex flex-row gap-2 my-2 justify-content-center'>
                {Object.keys(boardTypeObj).map((k) => (
                    <Card key={k}>
                        <Card.Header style={{ textAlign: 'left' }}>{k} - {boardTypeObj[k].effortCount}</Card.Header>
                        <Card.Body>
                            <SortableContext items={boardTypeObj[k].t.map(ticket => ticket.id)} strategy={verticalListSortingStrategy}>
                                <Lane type={k} tickets={boardTypeObj[k].t} />
                            </SortableContext>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </DndContext>
    );
}
