import axios from "axios";

export const fetchPendingRequest = async (user) => {
    let a;
    await axios
      .get('http://localhost:5000/api/leave/pendingrequest', {
        params: { userId: user.id }
      })
      .then((response) => {
        a = response.data.leaveRequestes;
      })
      .catch((err) => {
        console.log(err);
      });

      return a;
}