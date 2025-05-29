const express = require('express');
const db = require('../db');
const router = express.Router();

router.patch('/updateUser', async (req, res) => {

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  console.log(userId)

  try {
    let id;
    const [ID] = await db.query(`select id from positions where name = ?`,[userId.position])
    if(ID.length == 0){
      id = null;
    }
    else{
      id = ID[0].id
    }
    const [rows] = await db.query(` UPDATE users
                                          SET 
                                            name = COALESCE(? , name),
                                            email = COALESCE(? , email),
                                            password = COALESCE(? , password),
                                            reporting_manager_id = COALESCE(? , reporting_manager_id),
                                            role_id = COALESCE(? , role_id),
                                            isAdmin = COALESCE(? , isAdmin)
                                          WHERE 
                                              id = ?; `,[userId.name,userId.email,userId.password,userId.ManagerId,id,userId.isAdmin,userId.id]);
    
    res.json({ ststus: 'updated' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to update' });
  }
});

module.exports = router;
