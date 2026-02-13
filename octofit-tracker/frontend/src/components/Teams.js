import React, { useEffect, useState } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespace
          ? `https://${codespace}-8000.app.github.dev/api/teams/`
          : 'http://localhost:8000/api/teams/';
        
        console.log('Fetching teams from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Teams API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Teams Data:', teamsData);
        
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const codespace = process.env.REACT_APP_CODESPACE_NAME;
      const apiUrl = codespace
        ? `https://${codespace}-8000.app.github.dev/api/teams/`
        : 'http://localhost:8000/api/teams/';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTeam = await response.json();
      setTeams(prev => [...prev, newTeam]);
      setSubmitSuccess(true);
      setFormData({ name: '', description: '' });
      
      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Error adding team:', err);
      setSubmitError(err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: '', description: '' });
    setSubmitError(null);
    setSubmitSuccess(false);
  };

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
          Error loading teams: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="content-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">🤝 Teams</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            ➕ Add New Team
          </button>
        </div>
        {teams.length === 0 ? (
          <div className="alert alert-info" role="alert">
            <strong>Info:</strong> No teams found.
          </div>
        ) : (
          <>
            <p className="text-muted mb-3">
              Total Teams: <span className="badge bg-primary">{teams.length}</span>
            </p>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Team Name</th>
                    <th>Description</th>
                    <th>Members Count</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => (
                    <tr key={team._id || team.id || index}>
                      <td><strong>{team.name}</strong></td>
                      <td>{team.description}</td>
                      <td>
                        <span className="badge bg-info">{team.members_count || 0}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add Team Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Team</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {submitError && (
                    <div className="alert alert-danger" role="alert">
                      Error: {submitError}
                    </div>
                  )}
                  {submitSuccess && (
                    <div className="alert alert-success" role="alert">
                      Team added successfully!
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Team Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Enter team description (optional)"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
