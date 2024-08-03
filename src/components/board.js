import React, { useEffect, useState } from 'react';
import { ticketListItems } from '../data';
import Lane from './lane';
import './board.css';
import Card from 'react-bootstrap/Card';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Modal } from 'react-bootstrap';
import ShowForm from './form';
 

export default function Board() {
    const [tickets, setTickets] = useState([]);
    const [show, setShow] = useState(false);
    const [clickedTicket, setClickedTicket] = useState(null);
    const [clickTimer, setClickTimer] = useState(null);
    const [open, setOpen] = React.useState(false);
 
    const handleClickToOpen = () => {
        setOpen(true);
    };
 
    const handleToClose = () => {
        setOpen(false);
    };

    const handleClose = () => setShow(false);

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
        'TODO': { t: getTicketsByStatus('TODO'), effortCount: findEffortCount(getTicketsByStatus('TODO')), color: '#d3d3d3' },
        'IN_PROGRESS': { t: getTicketsByStatus('IN_PROGRESS'), effortCount: findEffortCount(getTicketsByStatus('IN_PROGRESS')), color: '#add8e6' },
        'CODE_REVIEW': { t: getTicketsByStatus('CODE_REVIEW'), effortCount: findEffortCount(getTicketsByStatus('CODE_REVIEW')), color: '#f08080' },
        'DONE': { t: getTicketsByStatus('DONE'), effortCount: findEffortCount(getTicketsByStatus('DONE')), color: '#90ee90' }
    };


    const handleDragEnd = (event) => {
        const { active, over } = event;
        const draggedTicket = tickets.find(ticket => ticket.id === active.id);

        // Check if it's a double click
        if (clickTimer) {
            clearTimeout(clickTimer);
            setClickTimer(null);

            // Double click logic
            if (!over) {
                setShow(true);
                setClickedTicket(draggedTicket);
                return;
            }
        } else {
            // Set timer for single click detection
            // setTimeout function returns a unique ID for the timer it creates
            setClickTimer(setTimeout(() => {
                if (over) {
                    // Get the ID of the lane where the ticket was dropped
                    const overLaneId = over.id;
                    if(draggedTicket.status === 'TODO' && overLaneId === 'DONE'){
                        console.log('not allowed');
                    }
                    else if (draggedTicket && overLaneId !== draggedTicket.status) {
                        setTickets(prevTickets => {
                            const updatedTickets = prevTickets.map(ticket => {
                                if (ticket.id === active.id) {
                                    return { ...ticket, status: overLaneId, lastUpdated: new Date() };
                                }
                                return ticket;
                            });
                            return updatedTickets;
                        });
                    }
                }
                setClickTimer(null);
            }, 250)); // Set delay for detecting double click
        }
    };

    function handleSubmitForm(e) {
        setTickets(prevTickets => {
            const updatedTickets = prevTickets.map(ticket => {
                if (ticket.id === e.id) {
                    return { ...e, lastUpdated: new Date() };
                }
                return ticket;
            });
            return updatedTickets;
        });
        setShow(false);
    }


    return (
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className='d-flex flex-row gap-2 my-2 justify-content-center'>
                {Object.keys(boardTypeObj).map((k) => (
                    <Card key={k}>
                        <Card.Header style={{ textAlign: 'left' }}>{k} - {boardTypeObj[k].effortCount}</Card.Header>
                        <Card.Body style={{ backgroundColor: boardTypeObj[k].color }}>
                            <SortableContext items={boardTypeObj[k].t.map(ticket => ticket.id)} strategy={verticalListSortingStrategy}>
                                <Lane type={k} tickets={boardTypeObj[k].t} />
                            </SortableContext>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{clickedTicket?.status}</Modal.Title>
                </Modal.Header>
                <Modal.Body><ShowForm ticket={clickedTicket} handleSubmitForm={(e) => handleSubmitForm(e)} /></Modal.Body>
            </Modal>
        </DndContext>
    );
}
