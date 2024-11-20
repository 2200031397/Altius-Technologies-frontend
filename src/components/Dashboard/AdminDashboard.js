import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Admin.css'; // Import the CSS file

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState({});

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
        console.error('Error fetching tickets:', error);
        setError('Failed to fetch tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCustomers = async () => {
      const token = Cookies.get('authToken');
      try {
        const response = await axios.get('http://localhost:3000/api/customers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to fetch customer data. Please try again later.');
      }
    };

    fetchTickets();
    fetchCustomers();
  }, []);

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

  const handleAddNote = async (ticketId) => {
    if (!noteContent[ticketId]?.trim()) return;

    const token = Cookies.get('authToken');
    try {
      const response = await axios.post(`http://localhost:3000/api/tickets/${ticketId}/add-note`, 
        { content: noteContent[ticketId] }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTickets(tickets.map(ticket =>
        ticket._id === ticketId ? { ...ticket, notes: response.data.notes } : ticket
      ));
      setNoteContent(prevNotes => ({ ...prevNotes, [ticketId]: "" }));
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Failed to add note. Please try again later.');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    const token = Cookies.get('authToken');
    try {
      await axios.delete(`http://localhost:3000/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(tickets.filter(ticket => ticket._id !== ticketId));
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setError('Failed to delete ticket. Please try again later.');
    }
  };

  return (
    <div className="admin-dashboard">
     <h2>Admin Dashboard</h2>
      {error && <p className="error-message">{error}</p>}
      <h3>All Tickets</h3>

      <div className="tickets-section">
        
        {loading ? <p>Loading tickets...</p> : (
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Last Updated</th>
                <th>Actions</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket._id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.customerName}</td>
                  <td>{new Date(ticket.lastUpdatedOn).toLocaleString()}</td>
                  <td>
                    <button onClick={() => updateTicketStatus(ticket._id, 'Pending')}>Pending</button>
                    <button onClick={() => updateTicketStatus(ticket._id, 'Closed')}>Resolved</button>
                    <button onClick={() => handleDeleteTicket(ticket._id)}>Delete</button>
                  </td>
                  <td>
                    <div className="notes-section">
                      {ticket.notes && ticket.notes.length > 0 ? (
                        <ul>
                          {ticket.notes.map((note, index) => (
                            <li key={index}>
                              <p><strong>{note.addedBy}({note.customerRole}):</strong> {note.content}</p>
                              <p><em>Added on: {new Date(note.timestamp).toLocaleString()}</em></p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No notes for this ticket.</p>
                      )}
                    </div>
                    <textarea
                      value={noteContent[ticket._id] || ""}
                      onChange={(e) => setNoteContent(prevNotes => ({
                        ...prevNotes,
                        [ticket._id]: e.target.value
                      }))}
                      placeholder="Add a note to this ticket"
                    />
                    <button onClick={() => handleAddNote(ticket._id)}>Add Note</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="customers-section">
        <h3>Customer List</h3>
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map(customer => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
