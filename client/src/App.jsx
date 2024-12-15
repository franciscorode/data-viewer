import { useEffect, useState } from 'react';
import './App.css'

import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
  const [events, setEvents] = useState([]);
    const [searchSourceIpTerm, setSearchSourceIpTerm] = useState('');
    const [searchDestIpTerm, setSearchDestIpTerm] = useState('');
    const [searchDestPortTerm, setSearchDestPortTerm] = useState('');
    const [searchNameTerm, setSearchNameTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchEvents();
    }, [searchSourceIpTerm, searchDestIpTerm, searchDestPortTerm, searchNameTerm, startDate, endDate]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/events?limit=1000', {
                params: { 
                    source_ip: searchSourceIpTerm,
                    destination_ip: searchDestIpTerm,
                    destination_port: searchDestPortTerm,
                    computer_name: searchNameTerm,
                    start_date: startDate,
                    end_date: endDate
                },
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
        <style>
            {`.event-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }

            .event-table th,
            .event-table td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
            }`}
        </style>
          <h1>Event Dashboard</h1>
          <div>
              <input
                  type="text"
                  placeholder="Search by source IP"
                  value={searchSourceIpTerm}
                  onChange={(e) => setSearchSourceIpTerm(e.target.value)}
              />
              <input
                  type="text"
                  placeholder="Search by destination IP"
                  value={searchDestIpTerm}
                  onChange={(e) => setSearchDestIpTerm(e.target.value)}
              />
              <input
                  type="text"
                  placeholder="Search by destination port"
                  value={searchDestPortTerm}
                  onChange={(e) => setSearchDestPortTerm(e.target.value)}
              />
              <input
                  type="text"
                  placeholder="Search by computer name"
                  value={searchNameTerm}
                  onChange={(e) => setSearchNameTerm(e.target.value)}
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
          <table className="event-table">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Computer Name</th>
                    <th>Source IP</th>
                    <th>Destination IP</th>
                    <th>Destination Port</th>
                </tr>
            </thead>
            <tbody>
                {events.map((event) => (
                    <tr key={event.id}>
                        <td>{event.timestamp}</td>
                        <td>{event.computer_name}</td>
                        <td>{event.source_ip}</td>
                        <td>{event.destination_ip}</td>
                        <td>{event.destination_port}</td>
                    </tr>
                ))}
            </tbody>
        </table>

      </div>
  );
}

export default App

