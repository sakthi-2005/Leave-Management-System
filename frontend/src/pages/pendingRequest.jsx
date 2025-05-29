import React, { useState, useEffect } from 'react';
import { fetchPendingRequest } from '../static/pendingRequests'
import { ReviewScreen } from '../components/reviewScreen';


function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("de-DE");
}

export function RequestPending({user}){
    let [view,setView] = useState('closed');
    let [data,setData] = useState({})
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    async function fetchpendingrequest(){
        setPendingRequests(await fetchPendingRequest(user));
    }
    fetchpendingrequest()
    
  }, []);

  const handleReview = (request) => {
    setData(request);
    setView('review');
  };

  return (
    <div className="request-page">
      <div className="request-container">
        < ReviewScreen view={view} setView={setView} data={data} userId={user.id}/>
        {pendingRequests.length === 0 ? (
          <div className="request-empty-message">🎉 No pending leave requests!</div>
        ) : (
          <div className="request-grid">
            {pendingRequests.map((req,index) => (
              <div className="request-card" key={req.id}>
                <div className="request-details-header">
                  <div className="request-user">{req.user_name}</div>
                  <div className="request-type-badge">{req.type}</div>
                </div>
                <div className="request-dates">🗓 {formatDate(req.from_date)} → {formatDate(req.to_date)}</div>
                <div className="request-description">📋 {req.description}</div>
                <button className="request-review-btn" onClick={() => handleReview(req)}>Review</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

