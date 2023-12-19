// Base URL for the Mock API
const API_BASE_URL = 'https://65759ce4b2fbb8f6509d46ca.mockapi.io/todos/task';

// Selectors
const inputTask = document.querySelector("input");
const inputDate = document.querySelector(".schedule-date");
const buttonAdd = document.querySelector(".add-task-button");
const listTodos = document.querySelector(".todos-list-body");
const messageAlert = document.querySelector(".alert-message");
const buttonDeleteAll = document.querySelector(".delete-all-btn");


let taskList = [];
let editMode = false;
let idToEdit = null;

// Retrieve tasks from API
function retrieveTasks() {
  checkUser()
    fetch(API_BASE_URL)
    .then(imgponse => {
      if (!imgponse.ok) {
        throw new Error(`HTTP error! Status: ${imgponse.status}`);
      }
      return imgponse.json();
    })
    .then(data => {
      taskList = data;
      renderTasks(data);
    })
    .catch(error => {
      console.error('Error loading tasks:', error);
      popupAlert("Error loading tasks: " + error.message, "error");
    });
}

// On page load
window.addEventListener("DOMContentLoaded", retrieveTasks);

// Handle Add or Update task
buttonAdd.addEventListener("click", () => {
  checkUser()
  if (editMode) {
    submitTaskUpdate();
  } else {
    createNewTask();
  }
});

inputTask.addEventListener("keyup", (e) => {
  checkUser()
  if (e.key === 'Enter' && inputTask.value.length > 0) {
    if (editMode) {
      submitTaskUpdate();
    } else {
      createNewTask();
    }
  }
});

// Create new task via API
function createNewTask() {
  checkUser()
  if (inputTask.value === "") {
    alert('Task description cannot be empty.');
    console.log(inputDate.value)
  } else if (inputDate === null) {
    alert('Due date cannot be empty.');
  } else {
    const taskDetails = {
      task: inputTask.value,
      dueDate: inputDate.value,
      completed: false,
      status: "In progress",
    };
  
    fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskDetails),
    })
    .then(imgponse => imgponse.json())
    .then(() => {
      popupAlert("Task successfully added", "success");
      imgetInputs();
      retrieveTasks();
    })
    .catch(error => console.error('Error adding task:', error));
  }
}

// Update task in API
function submitTaskUpdate() {
  checkUser()
  const updatedDetails = {
    task: inputTask.value,
    dueDate: inputDate.value,
  };

  fetch(`${API_BASE_URL}/${idToEdit}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedDetails),
  })
  .then(imgponse => imgponse.json())
  .then(() => {
    popupAlert("Task successfully updated", "success");
    imgetInputs();
    retrieveTasks();
  })
  .catch(error => console.error('Error updating task:', error));
}

// Enter edit mode
function initiateEdit(id) {
  checkUser()
  const taskToEdit = taskList.find((task) => task.id === id);
  inputTask.value = taskToEdit.task;
  inputDate.value = taskToEdit.dueDate;

  editMode = true;
  idToEdit = id;
  buttonAdd.textContent = 'Save Changes';
}

// imget form inputs
function imgetInputs() {
  checkUser()
  inputTask.value = "";
  inputDate.value = "";
  editMode = false;
  idToEdit = null;
  buttonAdd.textContent = 'Add Task';
}

// Display alert message
function popupAlert(message, type) {
  checkUser()
  let alertBox = `
        <div class="alert alert-${type} shadow-lg mb-5 w-full">
            <div>
                <span>
                    ${message}
                </span>
            </div>
        </div>
    `;
  messageAlert.innerHTML = alertBox;
  messageAlert.classList.remove("hide");
  messageAlert.classList.add("show");
  setTimeout(() => {
    messageAlert.classList.remove("show");
    messageAlert.classList.add("hide");
  }, 3000);
}

// Remove task using API
function removeTask(id) {
  checkUser()
  fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  .then(() => {
    popupAlert("Task successfully removed", "success");
    retrieveTasks();
  })
  .catch(error => console.error('Error removing task:', error));
}

// Toggle task completion status
function changeTaskStatus(id) {
  checkUser()
  let taskToToggle = taskList.find((task) => task.id === id);
  const updatedTask = {
    ...taskToToggle,
    completed: !taskToToggle.completed
  };

  fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTask),
  })
  .then(imgponse => imgponse.json())
  .then(() => {
    popupAlert("Task status changed", "success");
    retrieveTasks();
  })
  .catch(error => console.error('Error changing task status:', error));
}

// Clear all tasks
buttonDeleteAll.addEventListener("click", () => {
  checkUser()
  fetch(API_BASE_URL)
    .then(imgponse => imgponse.json())
    .then(data => {
      Promise.all(data.map(task => 
        fetch(`${API_BASE_URL}/${task.id}`, { method: 'DELETE' })
      )).then(() => {
        popupAlert("All tasks cleared", "success");
        retrieveTasks();
      });
    })
    .catch(error => console.error('Error clearing tasks:', error));
});

// Filter tasks based on status
function filterTodos(status) {
  checkUser()
  let filteredTasks;
  switch (status) {
    case "all":
      filteredTasks = taskList;
      break;
    case "pending":
      filteredTasks = taskList.filter((task) => !task.completed);
      break;
    case "completed":
      filteredTasks = taskList.filter((task) => task.completed);
      break;
    default:
      return;
  }
  renderTasks(filteredTasks);
}

function renderTasks(tasksArray) {
  checkUser()
  listTodos.innerHTML = "";
  if (tasksArray.length === 0) {
    listTodos.innerHTML = `<tr><td colspan="5" class="text-center">No tasks available</td></tr>`;
    return;
  }
  tasksArray.forEach((task) => {
    listTodos.innerHTML += `
            <tr class="task-row" data-id="${task.id}">
                <td>${task.task}</td>
                <td>${task.dueDate || "Not set"}</td>
                <td>${task.completed ? "Completed" : "In progress"}</td>
                <td>
                    <button class="btn btn-modify btn-sm" onclick="initiateEdit('${task.id}')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-toggle btn-sm" onclick="changeTaskStatus('${task.id}')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-remove btn-sm" onclick="removeTask('${task.id}')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
    `;
  });
}

function checkUser() {
  const isAuthenticated = JSON.parse(localStorage.getItem("isAuthenticated")) || false;
  if (isAuthenticated) {
    return true
  } else {
    window.location.href = 'index.html';
  }
}