import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function CustomerDashboard() {
  const [tickets, setTickets] = useState([]);
  const [newTicketTitle, setNewTicketTitle] = useState('');

  useEffect(() => {
    
  }, []);

  const handleCreateTicket = async () => {
    const token = Cookies.get('authToken'); // Retrieve token
    try {
      // POST request to create a new ticket
      const response = await axios.post('http://localhost:3000/api/tickets', 
        { title: newTicketTitle }, // Data to be sent to the backend
        {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
        }
      );
      
      // Update tickets state with the new ticket
      setTickets([response.data.ticket, ...tickets]);
      setNewTicketTitle(''); // Clear input field
      alert('Ticket created successfully');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert(`Error creating ticket: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div>
      <h2>Customer Dashboard</h2>

      {/* Form to create new ticket */}
      <div>
        <h3>Create New Ticket</h3>
        <input
          type="text"
          placeholder="Ticket Title"
          value={newTicketTitle}
          onChange={(e) => setNewTicketTitle(e.target.value)}
        />
        <button onClick={handleCreateTicket}>Create Ticket</button>
      </div>

      
    </div>
  );
}

export default CustomerDashboard;
