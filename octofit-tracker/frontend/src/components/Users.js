import React, { useEffect, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    team_id: ''
  });
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespace
          ? `https://${codespace}-8000.app.github.dev/api/users/`
          : 'http://localhost:8000/api/users/';
        
        console.log('Fetching users from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Users API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const usersData = data.results || data;
        console.log('Users Data:', usersData);
        
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
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
        ? `https://${codespace}-8000.app.github.dev/api/users/`
        : 'http://localhost:8000/api/users/';

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

      const newUser = await response.json();
      setUsers(prev => [...prev, newUser]);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', password: '', team_id: '' });
      
      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Error adding user:', err);
      setSubmitError(err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', password: '', team_id: '' });
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
          Error loading users: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="content-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">👥 Users</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            ➕ Add New User
          </button>
        </div>
        {users.length === 0 ? (
          <div className="alert alert-info" role="alert">
            <strong>Info:</strong> No users found.
          </div>
        ) : (
          <>
            <p className="text-muted mb-3">
              Total Users: <span className="badge bg-primary">{users.length}</span>
            </p>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Full Name</th>
                    <th>Team</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id || user.id || index}>
                      <td><strong>{user.name ? user.name.split(' ')[0].toLowerCase() : 'N/A'}</strong></td>
                      <td>{user.email}</td>
                      <td>{user.name || 'N/A'}</td>
                      <td>
                        {user.team_id ? (
                          <span className="badge bg-info">{user.team_id}</span>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New User</h5>
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
                      User added successfully!
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name *</label>
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
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="team_id" className="form-label">Team ID (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="team_id"
                      name="team_id"
                      value={formData.team_id}
                      onChange={handleInputChange}
                      placeholder="Leave empty if no team"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add User
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

export default Users;
