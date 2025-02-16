import React, { useEffect, useState } from 'react';
import { BarChart, PieChart } from '@mui/x-charts';
import axios from 'axios';

export default function AdminDashboard() {
  interface Stats {
    players: {
      totalPlayers: number;
      totalGoals: number;
    };
  }

  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Admin Dashboard</h2>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl mb-2">Players Statistics</h3>
            <BarChart
              series={[{ data: [stats.players.totalPlayers] }]}
              xAxis={[{ data: ['Total Players'], scaleType: 'band' }]}
              height={300}
            />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl mb-2">Goals Distribution</h3>
            <PieChart
              series={[{ data: [{ value: stats.players.totalGoals, label: 'Total Goals' }] }]}
              width={400}
              height={300}
            />
          </div>
        </div>
      )}
    </div>
  );
}