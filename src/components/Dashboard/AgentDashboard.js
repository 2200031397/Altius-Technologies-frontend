import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);  // For handling errors
  const [loading, setLoading] = useState(true);  // For showing loading indicator

  // Fetch tickets on component mount
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);  // Show loading indicator while fetching data
      const token = Cookies.get('authToken');
      try {
        const response = await axios.get('http://localhost:3000/api/tickets', {
          headers: { Authorization: `Bearer ${token}` },  // Add Bearer token for authentication
        });
        setTickets(response.data);  // Set tickets in state
      } catch (error) {
        console.log('Error fetching tickets:', error);
        alert(error);
        setError('Failed to fetch tickets. Please try again later.');  // Set error message
      } finally {
        setLoading(false);  // Hide loading indicator after fetching
      }
    };

    fetchTickets();
  }, []);  // Empty array to run once when component mounts

  // Update ticket status
  const updateTicketStatus = async (ticketId, status) => {
    const token = Cookies.get('authToken');
    try {
      const response = await axios.put(`http://localhost:3000/api/tickets/${ticketId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },  // Include token in header
      });

      // Update the local state with the new ticket status
      setTickets(tickets.map(ticket =>
        ticket._id === ticketId ? { ...ticket, status: response.data.status } : ticket
      ));
    } catch (error) {
      console.error('Error updating ticket:', error);
      setError('Failed to update ticket. Please try again later.');
    }
  };

  // Render tickets or loading/error states
  return (
    <div>
      <h2>Agent Dashboard</h2>
      <h3>All Tickets</h3>

      {loading && <p>Loading tickets...</p>}  {/* Show loading indicator */}
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Show error message if any */}
      
      {!loading && !error && (
        <ul>
          {tickets.map(ticket => (
            <li key={ticket._id}>
              <p><strong>Title:</strong> {ticket.title}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
              <button onClick={() => updateTicketStatus(ticket._id, 'Pending')}>Mark as Pending</button>
              <button onClick={() => updateTicketStatus(ticket._id, 'Closed')}>Mark as Resolved</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AgentDashboard;
