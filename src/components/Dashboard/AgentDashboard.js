import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const token = Cookies.get('authToken');
      try {
        const response = await axios.get('http://localhost:3000/api/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data);
      } catch (error) {
        console.log('Error fetching tickets:', error);
        alert(error);
        setError('Failed to fetch tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Update ticket status
  const updateTicketStatus = async (ticketId, status) => {
    const token = Cookies.get('authToken');
    try {
      const response = await axios.put(`http://localhost:3000/api/tickets/${ticketId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTickets(tickets.map(ticket =>
        ticket._id === ticketId ? { ...ticket, status: response.data.status } : ticket
      ));
    } catch (error) {
      console.error('Error updating ticket:', error);
      setError('Failed to update ticket. Please try again later.');
    }
  };

  // Handle adding note to a ticket
  const handleAddNote = async (ticketId) => {
    const noteContent = notes[ticketId];  
    if (!noteContent.trim()) return;  

    const token = Cookies.get('authToken');
    try {
      const response = await axios.post(`http://localhost:3000/api/tickets/${ticketId}/add-note`, 
        { content: noteContent }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTickets(tickets.map(ticket =>
        ticket._id === ticketId ? { ...ticket, notes: response.data.notes } : ticket
      ));
      
      setNotes({ ...notes, [ticketId]: "" });  
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Failed to add note. Please try again later.');
    }
  };

  const handleNoteChange = (ticketId, event) => {
    setNotes({ ...notes, [ticketId]: event.target.value });
  };

  return (
    <div className="agent-dashboard">
      <h2>Agent Dashboard</h2>
      <h3>All Tickets</h3>

      {loading && <p className="loading">Loading tickets...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Customer</th>
              <th>Last Updated</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket._id} className="ticket-item">
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <td>{ticket.customerName}</td>
                <td>{new Date(ticket.lastUpdatedOn).toLocaleString()}</td>
                <td>
                  <div className="notes-section">
                    {ticket.notes.length > 0 ? (
                      <ul>
                        {ticket.notes.map((note, index) => (
                          <li key={index}>
                            <p><strong>{note.addedBy}:</strong> {note.content}</p>
                            <p><em>Added on: {new Date(note.timestamp).toLocaleString()}</em></p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No notes for this ticket.</p>
                    )}
                  </div>
                  <textarea 
                    value={notes[ticket._id] || ""} 
                    onChange={(e) => handleNoteChange(ticket._id, e)} 
                    placeholder="Add a note" 
                    className="ticket-textarea"
                  />
                  <button className="add-note-button" onClick={() => handleAddNote(ticket._id)}>Add Note</button>
                </td>
                <td className="ticket-actions">
                  <button onClick={() => updateTicketStatus(ticket._id, 'Pending')}>Mark as Pending</button>
                  <button onClick={() => updateTicketStatus(ticket._id, 'Closed')}>Mark as Resolved</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AgentDashboard;
