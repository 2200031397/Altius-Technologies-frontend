// Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function Home() {
  const [tickets, setTickets] = useState([]);
  const [ticket, setTicket] = useState({ title: '', description: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/tickets', { withCredentials: true })
      .then((response) => setTickets(response.data))
      .catch((error) => console.error('Error fetching tickets:', error));
  }, []);

  const createTicket = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/tickets', ticket, { withCredentials: true });
      setTickets([...tickets, response.data]);
      setTicket({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  return (
    <div className="home-container">
      <h1>Tickets</h1>
      <ul>
        {tickets.map((ticket, index) => (
          <li key={index}>
            {ticket.title}: {ticket.description}
          </li>
        ))}
      </ul>

      <h3>Create Ticket</h3>
      <input
        type="text"
        placeholder="Title"
        value={ticket.title}
        onChange={(e) => setTicket({ ...ticket, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={ticket.description}
        onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
      />
      <button onClick={createTicket}>Create Ticket</button>
    </div>
  );
}

export default Home;
