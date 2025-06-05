const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); // req.body

//ROUTES//
//create an entry

app.post("/entries", async (req,res) => {
    try {
        const { entry_name, quantity, user_id } = req.body;
        const newEntry = await pool.query(
            "INSERT INTO shoppinglist (entry_name, quantity, checked, priority_flag, user_id) VALUES($1, $2, false, false, $3) RETURNING *", 
            [entry_name, quantity, user_id]);
        
            res.json(newEntry.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

//get all entries for a user

app.get("/entries/user/:user_id", async(req,res) => {
    try {
        const { user_id } = req.params;
        const allEntries = await pool.query('SELECT * FROM shoppinglist WHERE user_id = $1 ORDER BY priority_flag DESC, created_at ASC', [user_id]);
        res.json(allEntries.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//get an entry

app.get("/entries/:id", async (req,res) => {
    try {
        const { id } = req.params;
        const entry = await pool.query("SELECT * FROM shoppinglist WHERE entry_id = $1", [id]);

        res.json(entry.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update an entry

app.put("/entries/:id", async (req,res) => {
    try {
        const { id } = req.params;
        const { entry_name, quantity, checked, priority_flag } = req.body;
        const updateEntry = await pool.query(
            "UPDATE shoppinglist SET entry_name = $1, quantity = $2, checked = $3, priority_flag = $4, updated_at = CURRENT_TIMESTAMP WHERE entry_id = $5",
            [entry_name, quantity, checked, priority_flag, id]
        );
        res.json({ message: `Entry with ID ${id} was updated` });   
            
    } catch (err) {
        console.error(err.message);
    }
});

// Update checked or priority_flag
app.patch("/entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { checked, priority_flag } = req.body;
  
      const updateFields = [];
      const values = [];
  
      if (checked !== undefined) {
        updateFields.push("checked = $" + (values.length + 1));
        values.push(checked);
      }
  
      if (priority_flag !== undefined) {
        updateFields.push("priority_flag = $" + (values.length + 1));
        values.push(priority_flag);
      }
  
      if (updateFields.length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
      }
  
      values.push(id); // Add ID as last parameter
      const query = `UPDATE shoppinglist SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE entry_id = $${values.length}`;
  
      await pool.query(query, values);
  
      res.json({ message: `Entry ${id} updated.` });
    } catch (err) {
      console.error(err.message);
    }
  });

//delete an entry

app.delete("/entries/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteEntry = await pool.query(
            "DELETE FROM shoppinglist WHERE entry_id = $1", [id]
        );
        res.json({ message: `Entry with ID ${id} was deleted`}); 

    } catch (err) {
        console.log(err.message);
    }
});

app.listen(5000, () => {
    console.log("Server has started on port 5000");
});

