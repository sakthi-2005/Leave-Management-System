import { useState,useEffect } from "react";
import axios from "axios";

export function RequestPage( { leaveBalances, setIsRequestLeaveVisible , user ,setToastColor , setToastMessage, setToastVisible } ){
    

    const [leaveType, setLeaveType] = useState("0");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reason, setReason] = useState("");
    const [workingDays, setWorkingDays] = useState(0);
    let [holidays,setHolidays] = useState([]);

    useEffect(()=>{
        const fetchHolidays = async () => {
            await axios
              .get('http://localhost:5000/api/leave/holiday')
              .then((response) => {
                // holidays = [...response];
                setHolidays(response.data.holidays);
              })
              .catch((err) => {
                console.log(err);
              });
        }
        fetchHolidays();
    },[])

    useEffect(() => {
        if (!fromDate || !toDate) {
          setWorkingDays(0);
          return;
        }
      
        const from = new Date(fromDate);
        const to = new Date(toDate);
        let count = 0;
      
        for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
          const day = d.getDay();
          const isoDate = d.toISOString().split("T")[0];
          if (day !== 0 && day !== 6 && !holidays.includes(isoDate)) {
            count++;
          }
        }
          setWorkingDays(count);
    }, [fromDate, toDate]);


    async function handleSubmit(e){
        e.preventDefault();

        if(leaveBalances[Number(leaveType)].remainingLeaves < workingDays){
          alert('insufficient Leave Balance');
          return;
        }

        try {
        const response = await axios.post('http://localhost:5000/api/leave/request', {type: (Number(leaveType)+1) , from: fromDate , to: toDate , reason: reason , userId:user.id , noOfDays: workingDays});
        if(response.data.status == 'updated'){
          setToastVisible(true);
          setToastColor('green');
          setToastMessage('Request Sent Successfully');
          setIsRequestLeaveVisible(false);
        }
        } catch (error) {
          setToastVisible(true);
          setToastColor('red');
          setToastMessage('request failed!');
        }

    }


    return (
        <div className="requestLeave-backdrop" onClick={() => setIsRequestLeaveVisible(false)}>
                  <div className="requestLeave-box animated-slide" onClick={(e) => e.stopPropagation()}>
                    <h2>Request Leave</h2>
                    <form className="requestLeave-form" onSubmit={handleSubmit}>
                      <label>
                        Leave Type:
                        <select name='leaveType' value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                          <option value="0">Sick Leave</option>
                          <option value="1">Casual Leave</option>
                          <option value="2">Work From Home</option>
                          <option value="3">On Duty</option>
                          <option value="4">Loss-of-pay</option>
                        </select> <br /> Reamining: <>{leaveBalances[Number(leaveType)].remainingLeaves > 30 ? Infinity : leaveBalances[Number(leaveType)].remainingLeaves || 0}</>
                      </label>
                      <label>
                        From Date:
                        <input name='fromDate' type="date" min={new Date().toISOString().split('T')[0]} value={fromDate} onChange={(e) => setFromDate(e.target.value)} required disabled={leaveBalances[Number(leaveType)].remainingLeaves == 0}/>
                      </label>
                      {workingDays != 0 ? <>Required: {workingDays} <br /> <br /></>: null}
                      <label>
                        To Date:
                        <input name='toDate' type="date" min={fromDate} value={toDate} onChange={(e) => setToDate(e.target.value)} required disabled={leaveBalances[Number(leaveType)].remainingLeaves == 0}/>
                      </label>

                      <label>
                        Reason:
                        <textarea name='reason' rows="4" value={reason} onChange={(e) => setReason(e.target.value)} required disabled={leaveBalances[Number(leaveType)].remainingLeaves == 0}/>
                      </label>
                      <div className="requestLeave-actions">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={() => setIsRequestLeaveVisible(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
    )
}