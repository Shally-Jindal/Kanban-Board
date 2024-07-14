import React from 'react';
import Ticket from './ticket';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
export default function Lane({ type, tickets }) {
    // console.log(type,'--type')
    // console.log(tickets,'----tickets in lane')
    const { setNodeRef } = useDroppable({
        id: type,
    });
    return (<>
    <div className='d-flex flex-column gap-2' ref={setNodeRef}>
    <SortableContext items={tickets.map(item => item.id)} strategy={verticalListSortingStrategy}>
            {tickets.map((item) => {
                return <Ticket key={item.id} ticket={item} id={item.id}/>
            })}
        </SortableContext>
    </div>
        
    </>)
}
