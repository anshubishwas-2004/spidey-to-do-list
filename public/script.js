// public/script.js
const API = "/tasks"; // Exactly matches your server.js

// Fetch and display tasks
async function fetchTasks() {
    try {
        const res = await fetch(API);
        const tasks = await res.json();
        const list = document.getElementById("taskList");

        list.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");
            
            // Add completed class if true
            li.className = "list-group-item shadow-sm" + (task.completed ? " completed" : "");

            // Notice we use task._id here to match your server!
            li.innerHTML = `
                <span class="task-text" onclick="toggleTask('${task._id}')" style="cursor: pointer; flex-grow: 1;">
                    ${task.text}
                </span>
                <button class="delete-btn" onclick="deleteTask('${task._id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

            list.appendChild(li);
        });
    } catch (error) {
        console.error("Failed to fetch tasks. Is the server running?", error);
    }
}

// Add a new task
async function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (!text) return;

    await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });

    input.value = "";
    fetchTasks();
}

// Delete a task
async function deleteTask(id) {
    await fetch(`${API}/${id}`, {
        method: "DELETE"
    });
    fetchTasks();
}

// Toggle a task as completed/incomplete
async function toggleTask(id) {
    await fetch(`${API}/${id}`, {
        method: "PUT"
    });
    fetchTasks();
}

// Allow pressing "Enter" to add a task
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Load tasks when the page opens
fetchTasks();