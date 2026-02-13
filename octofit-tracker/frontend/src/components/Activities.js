import React, { useEffect, useState } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespace
          ? `https://${codespace}-8000.app.github.dev/api/activities/`
          : 'http://localhost:8000/api/activities/';
        
        console.log('Fetching activities from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Activities Data:', activitiesData);
        
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActivities();
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
          Error loading activities: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="content-container">
        <h2 className="mb-4">🏃 Activities</h2>
        {activities.length === 0 ? (
          <div className="alert alert-info" role="alert">
            <strong>Info:</strong> No activities found.
          </div>
        ) : (
          <>
            <p className="text-muted mb-3">
              Total Activities: <span className="badge bg-primary">{activities.length}</span>
            </p>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Activity Type</th>
                    <th>Duration (min)</th>
                    <th>Calories</th>
                    <th>Date</th>
                    <th>User</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={activity._id || activity.id || index}>
                      <td>
                        <span className="badge bg-secondary">{activity.activity_type}</span>
                      </td>
                      <td><strong>{activity.duration}</strong></td>
                      <td>
                        <span className="badge bg-success">{activity.calories}</span>
                      </td>
                      <td>{new Date(activity.date).toLocaleDateString()}</td>
                      <td>{activity.user_id || <span className="text-muted">N/A</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Activities;
