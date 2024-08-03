import React from 'react';
import { useState } from 'react';
import './form.css';
import Button from 'react-bootstrap/Button';
export default function ShowForm({ ticket, handleSubmitForm }) {
    const [inputs, setInputs] = useState(ticket);
    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(obj => ({ ...obj, [name]: value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSubmitForm(inputs);
    }

    return (
        <div className='d-flex justify-content-center'>
            <div className='formDiv'>
                <form onSubmit={handleSubmit} className='d-flex flex-column gap-2 my-2'>
                    <label>Ticket Label:
                        &nbsp;<input
                            type="text"
                            name="ticketLabel"
                            value={inputs?.ticketLabel}
                            onChange={handleChange}
                        />
                    </label>
                    <label>Effort Point:
                        &nbsp;<input
                            type="number"
                            name="effortPoint"
                            value={inputs?.effortPoint}
                            onChange={handleChange}
                        />
                    </label>
                    <div style={{ marginLeft: '300px' }} className='m-2'>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )

}
