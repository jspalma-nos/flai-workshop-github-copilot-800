import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME;
        const leaderboardUrl = codespace
          ? `https://${codespace}-8000.app.github.dev/api/leaderboard/`
          : 'http://localhost:8000/api/leaderboard/';
        const usersUrl = codespace
          ? `https://${codespace}-8000.app.github.dev/api/users/`
          : 'http://localhost:8000/api/users/';
        
        console.log('Fetching leaderboard from:', leaderboardUrl);
        console.log('Fetching users from:', usersUrl);
        
        // Fetch both leaderboard and users data
        const [leaderboardResponse, usersResponse] = await Promise.all([
          fetch(leaderboardUrl),
          fetch(usersUrl)
        ]);

        if (!leaderboardResponse.ok || !usersResponse.ok) {
          throw new Error(`HTTP error! status: ${leaderboardResponse.status}`);
        }
        
        const leaderboardData = await leaderboardResponse.json();
        const usersData = await usersResponse.json();
        
        console.log('Leaderboard API Response:', leaderboardData);
        console.log('Users API Response:', usersData);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardArray = Array.isArray(leaderboardData.results || leaderboardData) 
          ? (leaderboardData.results || leaderboardData) 
          : [];
        const usersArray = Array.isArray(usersData.results || usersData)
          ? (usersData.results || usersData)
          : [];
        
        // Create a map of user_id to user name
        const userMap = {};
        usersArray.forEach(user => {
          userMap[String(user._id)] = user.name;
        });
        
        console.log('User Map:', userMap);
        
        setLeaderboard(leaderboardArray);
        setUsers(userMap);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Error loading leaderboard: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="content-container">
        <h2 className="mb-4">🏆 Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <div className="alert alert-info" role="alert">
            <strong>Info:</strong> No leaderboard entries found.
          </div>
        ) : (
          <>
            <p className="text-muted mb-3">
              Showing Top <span className="badge bg-primary">{leaderboard.length}</span> Performers
            </p>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Team</th>
                    <th>Total Calories</th>
                    <th>Total Activities</th>
                    <th>Avg Duration (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => {
                    const avgDuration = entry.total_activities > 0 
                      ? (entry.total_duration / entry.total_activities).toFixed(1)
                      : 0;
                    const username = users[entry.user_id] || entry.user_id || 'Unknown';
                    
                    return (
                      <tr key={entry._id || entry.id || index}>
                        <td>
                          <span className={`badge ${
                            index === 0 ? 'bg-warning' :
                            index === 1 ? 'bg-secondary' :
                            index === 2 ? 'bg-danger' :
                            'bg-light text-dark'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                          </span>
                        </td>
                        <td><strong>{username}</strong></td>
                        <td>{entry.team_id || <span className="text-muted">N/A</span>}</td>
                        <td>
                          <span className="badge bg-success">
                            {entry.total_calories || 0} cal
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info">{entry.total_activities || 0}</span>
                        </td>
                        <td><strong>{avgDuration}</strong></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
