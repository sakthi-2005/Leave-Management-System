import React, { useState } from 'react';
import Login from './pages/login';
import Main from './pages/mainPage'
import { Admin } from './admin/adminPage'
import { BrowserRouter , Router , Routes } from 'react-router-dom';
import './App.css'

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  if (!user) return <Login setUser={setUser}/>;
  console.log(user)

  return (
    <div className="App">

      {user.isAdmin ? <Admin user={user} setUser={setUser}/> : <Main setlogin={setUser}/> }
      {/* <Admin user={user}/> */}
    </div>
  );
}

export default App;
