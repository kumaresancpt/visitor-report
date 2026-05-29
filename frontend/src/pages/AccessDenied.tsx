import { useNavigate } from 'react-router-dom'
import './AccessDenied.css'

function AccessDenied() {
  const navigate = useNavigate()

  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <div className="access-denied-icon">⛔</div>
        <h1>Access Denied</h1>
        <p className="access-denied-message">
          You do not have permission to view reports. Please contact your administrator.
        </p>
        <button className="btn-home" onClick={() => navigate('/')}>
          Go Home
        </button>
      </div>
    </div>
  )
}

export default AccessDenied
