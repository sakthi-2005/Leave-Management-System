import React, { useState,useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import UserModal from './userModal';
import LeaveModal from './leaveModal';
import { Profile } from '../pages/profile.jsx'

export function Admin({setUser}) {
  const [users, setUsers] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [search, setSearch] = useState('');
  let [profile,setProfile] = useState(false);
  const token = localStorage.getItem('token');

  const openUserModal = (user = null) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const openLeaveModal = (leave = null) => {
    setSelectedLeave(leave);
    setShowLeaveModal(true);
  };

  const saveUser = async(user,method) => {
    if(method == 'insert'){
      await axios
        .post('/admin/addUser', {params: { data: [user] }})
        .then((response) => {
          console.log(response.data.status);
        })
        .catch((err) => {
          console.log(err);
        });
      }
      else{
        await axios
        .patch('/admin/updateUser', {userId: user })
        .then((response) => {
          console.log(response.data.status);
        })
        .catch((err) => {
          console.log(err);
        });
      }
    setShowUserModal(false);
  };

  const deleteUser = async(id) => {
    await axios
    .delete('/admin/deleteUser', {params: { Id: id }})
    .then((response) => {
      console.log(response.data.status);
    })
    .catch((err) => {
      console.log(err);
    });
    setShowUserModal(false);
  };

  const saveLeave = async(leave,method) => {
    if(method == 'insert'){
      await axios
      .post('/admin/addLeave', {params: { data: leave }})
      .then((response) => {
        console.log(response.data.status);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    else{
      await axios
      .patch('/admin/updateLeave', { leaveId: leave })
      .then((response) => {
        console.log(response.data.status);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    setShowLeaveModal(false);
  };

  const deleteLeave = async(id) => {
    await axios
    .delete('/admin/deleteLeave', {params: { Id: id }})
    .then((response) => {
      console.log(response.data.status);
    })
    .catch((err) => {
      console.log(err);
    });
  };

  useEffect(()=>{

    async function fetchUsers(){
        await axios
                .get('http://localhost:5000/api/admin/allUsers')
                .then((response) => {
                    // console.log(response.data.leaves);
                    setUsers(response.data.users)
                })
                .catch((err) => {
                    console.log(err);
                });
    }
    fetchUsers();

    async function fetchLeaves(){
        await axios
        .get('http://localhost:5000/api/admin/allLeaves')
        .then((response) => {
            setLeaveTypes(response.data.leaves)
        })
        .catch((err) => {
            console.log(err);
        });
      }
      fetchLeaves();

  },[search,showUserModal,showLeaveModal])

  return (
    <div className="admin-container">
      {profile && <Profile setUser={setUser}/>}
      <header className="admin-header">
        <h1 className="admin-title">Admin Panel</h1>
        <div className='admin-header-card'>
          <button onClick={() => setProfile(e=>!e)} className='admin-header-profile'>👤</button>
          <br /> <br />
          <button className="admin-button" onClick={() => openUserModal()}>+ Add User</button>
        </div>
      </header>

      <div className="admin-search">
        <input className="admin-search-input" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}/>
      </div>

      <div className="admin-users">
        {users.filter(u =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.position.toLowerCase().includes(search.toLowerCase())
        ).map(user => (
          <div className="admin-user-card" key={user.id} onClick={() => openUserModal(user)}>
            <span className="admin-user-username">{user.id}</span>
            <span className="admin-user-name">{user.name}</span>
            <span className="admin-user-position">{user.position}</span>
          </div>
        ))}
      </div>

      <div className="admin-leaves">
        {leaveTypes.map(leave => (
          <div className="admin-leave-card" key={leave.id}>
            <h3>{leave.name}</h3>
            <h5>{leave.position}</h5>
            <p>{leave.monthly_allocation > 30 ? Infinity : leave.monthly_allocation} days</p>
            <div className="admin-leave-actions">
              <button onClick={() => openLeaveModal(leave)}>Edit</button>
              <button onClick={() => deleteLeave(leave.id)}>Delete</button>
            </div>
          </div>
        ))}
        <button className="admin-button" onClick={() => openLeaveModal()}>+ Add Leave Type</button>
      </div>

      {showUserModal &&
        <UserModal user={selectedUser} onClose={() => setShowUserModal(false)} onSave={saveUser} onDelete={deleteUser} users={users}/>
      }

      {showLeaveModal &&
        <LeaveModal leave={selectedLeave} onClose={() => setShowLeaveModal(false)} onSave={saveLeave} />
      }
    </div>
  );
}
