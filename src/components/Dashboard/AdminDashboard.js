import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function AdminDashboard() {
  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchCustomersAndTickets = async () => {
      const token = Cookies.get('authToken');

      try {
        // Fetch customers
        const customersResponse = await axios.get('http://localhost:3000/api/customers', {
          headers: { Authorization: `Bearer ${token}` }, // Added Bearer prefix
        });
        setCustomers(customersResponse.data);

        // Fetch tickets
        const ticketsResponse = await axios.get('http://localhost:3000/api/tickets', {
          headers: { Authorization: `Bearer ${token}` }, // Added Bearer prefix
        });
        setTickets(ticketsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCustomersAndTickets();
  }, []);

  const deleteTicket = async (ticketId) => {
    const token = Cookies.get('authToken');
    try {
      await axios.delete(`http://localhost:3000/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Added Bearer prefix
      });
      setTickets(tickets.filter(ticket => ticket._id !== ticketId));
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Customers</h3>
      <ul>
        {customers.map(customer => (
          <li key={customer._id}>
            <p>Name: {customer.name}</p>
            <p>Email: {customer.email}</p>
          </li>
        ))}
      </ul>

      <h3>Tickets Raised by Customers</h3>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket._id}>
            <p>Title: {ticket.title}</p>
            <p>Status: {ticket.status}</p>
            <p>Raised By: {ticket.customerName}</p>
            <button onClick={() => deleteTicket(ticket._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
