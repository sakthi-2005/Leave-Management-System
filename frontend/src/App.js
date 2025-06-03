import { useState } from 'react';
import Login from './pages/login';
import Main from './pages/mainPage';
import { Admin } from './admin/adminPage';
import './App.css';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api';
if(localStorage.getItem('token')) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
}

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  if (!user) return <Login setUser={setUser}/>;


  return (
    <div className="App">
      {user.isAdmin ? <Admin user={user} setUser={setUser}/> : <Main setlogin={setUser}/> }
    </div>
  );
}

export default App;
