import React, { useEffect, useState } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    activity_type: '',
    duration: '',
    difficulty: 'easy',
    target_calories: ''
  });
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespace
          ? `https://${codespace}-8000.app.github.dev/api/workouts/`
          : 'http://localhost:8000/api/workouts/';
        
        console.log('Fetching workouts from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Workouts Data:', workoutsData);
        
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkouts();
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
        ? `https://${codespace}-8000.app.github.dev/api/workouts/`
        : 'http://localhost:8000/api/workouts/';

      const workoutData = {
        ...formData,
        duration: parseInt(formData.duration),
        target_calories: parseInt(formData.target_calories)
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newWorkout = await response.json();
      setWorkouts(prev => [...prev, newWorkout]);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        description: '',
        activity_type: '',
        duration: '',
        difficulty: 'easy',
        target_calories: ''
      });
      
      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Error adding workout:', err);
      setSubmitError(err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      description: '',
      activity_type: '',
      duration: '',
      difficulty: 'easy',
      target_calories: ''
    });
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
          Error loading workouts: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="content-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">💪 Workout Suggestions</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            ➕ Add New Workout
          </button>
        </div>
        {workouts.length === 0 ? (
          <div className="alert alert-info" role="alert">
            <strong>Info:</strong> No workouts found.
          </div>
        ) : (
          <>
            <p className="text-muted mb-4">
              Available Workouts: <span className="badge bg-primary">{workouts.length}</span>
            </p>
            <div className="row">
              {workouts.map((workout, index) => (
                <div key={workout._id || workout.id || index} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-header">
                      <h5 className="card-title mb-0">{workout.name}</h5>
                    </div>
                    <div className="card-body">
                      <p className="card-text text-muted">{workout.description}</p>
                      <hr />
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <strong>Activity Type:</strong>{' '}
                          <span className="badge bg-secondary">{workout.activity_type}</span>
                        </li>
                        <li className="mb-2">
                          <strong>Difficulty:</strong>{' '}
                          <span className={`badge ${
                            workout.difficulty === 'easy' ? 'bg-success' :
                            workout.difficulty === 'medium' ? 'bg-warning text-dark' :
                            'bg-danger'
                          }`}>
                            {workout.difficulty.toUpperCase()}
                          </span>
                        </li>
                        <li className="mb-2">
                          <strong>⏱️ Duration:</strong> {workout.duration} min
                        </li>
                        <li className="mb-2">
                          <strong>🔥 Est. Calories:</strong>{' '}
                          <span className="badge bg-success">{workout.target_calories}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Workout Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Workout</h5>
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
                      Workout added successfully!
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Workout Name *</label>
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
                    <label htmlFor="description" className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="activity_type" className="form-label">Activity Type *</label>
                    <select
                      className="form-select"
                      id="activity_type"
                      name="activity_type"
                      value={formData.activity_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select activity type</option>
                      <option value="Running">Running</option>
                      <option value="Cycling">Cycling</option>
                      <option value="Swimming">Swimming</option>
                      <option value="Weight Training">Weight Training</option>
                      <option value="Yoga">Yoga</option>
                      <option value="HIIT">HIIT</option>
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="duration" className="form-label">Duration (minutes) *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="target_calories" className="form-label">Target Calories *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="target_calories"
                        name="target_calories"
                        value={formData.target_calories}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="difficulty" className="form-label">Difficulty *</label>
                    <select
                      className="form-select"
                      id="difficulty"
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Workout
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

export default Workouts;
