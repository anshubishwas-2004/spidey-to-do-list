const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// =========================================
// MIDDLEWARE
// =========================================
app.use(cors());
app.use(express.json());

// Serve the awesome Spidey frontend files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Our in-memory "Web" storage for tasks
let tasks = [];

// =========================================
// API ROUTES
// =========================================

// GET all tasks (Fetch the mission log)
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// ADD task (Thwip a new mission)
app.post('/tasks', (req, res) => {
  // Spidey sense tingling: Validate the input so we don't get blank tasks!
  if (!req.body.text || req.body.text.trim() === '') {
    return res.status(400).json({ error: "Task text cannot be empty!" });
  }

  const task = {
    _id: Date.now().toString(), // Using string ID just like MongoDB does
    text: req.body.text.trim(),
    completed: false
  };

  tasks.push(task);
  res.status(201).json(task); // 201 means "Created successfully"
});

// DELETE task (Defeat the villain)
app.delete('/tasks/:id', (req, res) => {
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t._id !== req.params.id);
  
  // Check if anything was actually deleted
  if (tasks.length === initialLength) {
    return res.status(404).json({ error: "Task not found in the web!" });
  }
  
  res.sendStatus(200);
});

// TOGGLE task (Mission accomplished / Re-opened)
app.put('/tasks/:id', (req, res) => {
  let taskFound = false;
  
  tasks = tasks.map(t => {
    if (t._id === req.params.id) {
      taskFound = true;
      return { ...t, completed: !t.completed };
    }
    return t;
  });

  if (!taskFound) {
     return res.status(404).json({ error: "Task not found!" });
  }

  res.sendStatus(200);
});

// =========================================
// START SERVER
// =========================================
app.listen(PORT, () => {
  console.log(`🕷️ Spidey Server swinging high on http://localhost:${PORT}`);
});