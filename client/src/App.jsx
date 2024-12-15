import { useEffect, useState } from 'react';
import './App.css'

import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
  const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchEvents();
    }, [searchTerm, startDate, endDate]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/events?limit=1000', {
                params: { source_ip: searchTerm, start_date: startDate, end_date: endDate },
            });
            setEvents(response.data);
        } catch (err) {
            console.error(err);
        }
    };


    const getWeekStart = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        date.setDate(date.getDate() + diff);
        return date.toISOString().split('T')[0];
    };
    
    const groupEventsByWeek = (events) => {
        const grouped = {};

        events.forEach(event => {
            const weekStart = getWeekStart(event.timestamp);
            grouped[weekStart] = (grouped[weekStart] || 0) + 1;
        });
    
        const labels = Object.keys(grouped).sort();
        const dataPoints = labels.map(label => grouped[label]);
    
        return { labels, dataPoints };
    };
    
    const { labels, dataPoints } = groupEventsByWeek(events);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Events Per Week',
                data: dataPoints,
                fill: false,
                borderColor: 'blue',
            },
        ],
    };
    

    return (
      <div>
          <h1>Event Dashboard</h1>
          <div>
              <input
                  type="text"
                  placeholder="Search by source IP"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
              />
          </div>
          <Line data={chartData} />
          <ul>
              {events.map((event) => (
                  <li key={event.id}>
                      {event.timestamp} - {event.source_ip} to {event.destination_ip}:{event.destination_port}
                  </li>
              ))}
          </ul>
      </div>
  );
}

export default App
