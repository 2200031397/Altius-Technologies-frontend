import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Customer.css';
function CustomerDashboard() {
  const [tickets, setTickets] = useState([]);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [noteContents, setNoteContents] = useState({});

  
  const fetchCustomerTickets = async () => {
    const token = Cookies.get('authToken'); 
    try {
      const response = await axios.get('https://altius-technologies-backend-1.onrender.com/api/tickets/my-tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching customer tickets:', error);
      alert(`Error fetching tickets: ${error.response?.data?.message || error.message}`);
    }
  };

  
  const handleCreateTicket = async () => {
    const token = Cookies.get('authToken'); // Retrieve token from cookies
    try {
      const response = await axios.post(
        'https://altius-technologies-backend-1.onrender.com/api/tickets',
        { title: newTicketTitle },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTickets([response.data.ticket, ...tickets]);
      setNewTicketTitle('');
      alert('Ticket created successfully');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert(`Error creating ticket: ${error.response?.data?.message || error.message}`);
    }
  };

  
  const handleAddNote = async (ticketId) => {
    const token = Cookies.get('authToken');
    try {
      const response = await axios.post(
        `https://altius-technologies-backend-1.onrender.com/api/tickets/${ticketId}/add-note`,
        { content: noteContents[ticketId] || '' },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      
      const updatedTickets = tickets.map(ticket =>
        ticket._id === ticketId ? { ...ticket, notes: response.data.notes } : ticket
      );
      setTickets(updatedTickets);
      setNoteContents({ ...noteContents, [ticketId]: '' }); // Clear the note input for this ticket
      alert('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      alert(`Error adding note: ${error.response?.data?.message || error.message}`);
    }
  };


  const handleNoteChange = (ticketId, value) => {
    setNoteContents({ ...noteContents, [ticketId]: value });
  };

  useEffect(() => {
    fetchCustomerTickets();
  }, []);

  return (
    <div className="customer-dashboard-container">
      <h2>Customer Dashboard</h2>

      <div className="create-ticket-section">
        <h3>Create New Ticket</h3>
        <input
          type="text"
          placeholder="Ticket Title"
          value={newTicketTitle}
          onChange={(e) => setNewTicketTitle(e.target.value)}
        />
        <button onClick={handleCreateTicket}>Create Ticket</button>
      </div>

      <div>
        <h3>Your Tickets</h3>
        {tickets.length > 0 ? (
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Last Updated</th>
                <th>Notes</th>
                <th>Add Note</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.customerName}</td>
                  <td>{new Date(ticket.lastUpdatedOn).toLocaleString()}</td>
                  <td>
                    <table className="notes-table">
                      <thead>
                        <tr>
                          <th>Content</th>
                          <th>Added By</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ticket.notes.map((note, index) => (
                          <tr key={index}>
                            <td>{note.content}</td>
                            <td>{note.addedBy}</td>
                            <td>{new Date(note.timestamp).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                  <td>
                    <textarea
                      className="add-note-textarea"
                      placeholder="Add a note"
                      value={noteContents[ticket._id] || ''}
                      onChange={(e) => handleNoteChange(ticket._id, e.target.value)}
                    />
                    <button className="add-note-btn" onClick={() => handleAddNote(ticket._id)}>
                      Add Note
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tickets found.</p>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
