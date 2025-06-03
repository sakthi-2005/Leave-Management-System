import { useState,useEffect } from 'react';
import axios from 'axios';


const leaveColors = {
  'Sick Leave': '#fd79a8',          // Vibrant Coral Red
  'Casual Leave': '#ffb347',        // Warm Soft Orange
  'Work From Home': '#6c5ce7',  // Vivid Indigo
  Holiday: '#45aaf2',       // Bright Sky Blue
  Weekend: '#ffeaa7',       // Light Pastel Yellow
  Today: '#00b894',         // Fresh Mint Green
  Multiple: '#ff6b6b',      // Neon Pink
  'Loss of Pay': '#636e72',        // Neutral Slate Gray
  'On Duty': '#00cec9'         // Aqua Blue
};


export function CalendarPage({ user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  let [userLeaves,setUserLeaves] = useState([]);
  let [holidays,setHolidays] = useState([]);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  useEffect(()=>{

    async function fetchuserLeaves(){
      await axios
      .get('/leave/calendarLeaves', {params: { userId: user.id }})
      .then((response) => {
        setUserLeaves(response.data.leaves)
      })
      .catch((err) => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.log(err);
      });
    }
    fetchuserLeaves();

    async function fetchHolidays(){
      await axios
      .get('/leave/holiday', {params: { userId: user.id }})
      .then((response) => {
        setHolidays(response.data.holidays)
      })
      .catch((err) => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.log(err);
      });
    }
    fetchHolidays();

  },[])

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDay = date.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      const fullDate = new Date(year, month, d+1);
      const dateStr = fullDate.toISOString().split('T')[0];
      const isWeekend = fullDate.getDay() === 1 || fullDate.getDay() === 0;
      let isHoliday = false;
      let holidayName = '';

      for(let day of holidays){
        if(new Date(day.date).toISOString().split('T')[0] == dateStr){
          isHoliday = true;
          holidayName = day.name;
          break;
        }
      }

      let leaves = []

      if(userLeaves != null && userLeaves.length != 0 ){
        leaves = userLeaves.filter(
          (leave) => new Date(leave.from_date).toISOString().split('T')[0] <= dateStr && new Date(leave.to_date).toISOString().split('T')[0] >= dateStr && !isHoliday && !isWeekend
      );
    }

      let color = leaveColors.Default;
      if (leaves.length == 1) color = leaveColors[leaves[0].Type];
      else if(leaves.length > 1) color = leaveColors.Multiple;
      else if (isHoliday) {color = leaveColors.Holiday;}
      else if (isWeekend) color = leaveColors.Weekend;
      if(dateStr == new Date().toISOString().split('T')[0]) color = leaveColors.Today;

      days.push({
        date: dateStr,
        label: d,
        isHoliday,
        isWeekend,
        leaves,
        color,
        holidayName
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days = getDaysInMonth(year, month);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&larr;</button>
        <h2>{monthName} {year}</h2>
        <button onClick={handleNextMonth}>&rarr;</button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
          <div key={i} className="calendar-day-name">{d}</div>
        ))}

        {days.map((day, idx) => (
          <div
            key={idx}
            className="calendar-cell"
            style={{ backgroundColor: day?.color || 'transparent' }}
            onClick={() => day && setSelectedDay(day)}
          >
            {day ? day.label : ''}
          </div>
        ))}
      </div>

      <div className="calendar-legend">
        {Object.entries(leaveColors).map(([type, color]) => (
          <span key={type}>
            <span className="legend-color" style={{ background: color }}></span> {type}
          </span>
        ))}
      </div>
      {selectedDay && (selectedDay.isHoliday || selectedDay.isWeekend ||  selectedDay.leaves.length > 0 || selectedDay.date == new Date().toISOString().split('T')[0] ) && (
        <div className="day-details">
          <h3>{new Date(selectedDay.date).toLocaleDateString("en-GB")}</h3>
          {selectedDay.leaves.length > 0 ? (
            <ul>
              {selectedDay.leaves.map((leave, i) => (
                <li key={i}><strong>{leave.name}</strong> - {leave.Type}</li>
              ))}
            </ul>
          ) : selectedDay.isHoliday ? (
            <p>{selectedDay.holidayName}</p>
          ) : selectedDay.isWeekend ? (
            <p>This day is a weekend.</p>
          ) : (
            <p>No leaves Today</p>
          )}
          <button onClick={() => setSelectedDay(null)}>Close</button>
        </div>
      )}
    </div>
  );
}