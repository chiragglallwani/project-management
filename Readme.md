# Project & Task Management System

[![GitHub last commit](https://img.shields.io/github/last-commit/chiragglallwani/project-management)](https://github.com/chiragglallwani/project-management)
[![GitHub issues](https://img.shields.io/github/issues/chiragglallwani/project-management)](https://github.com/chiragglallwani/project-management/issues)
[![License](https://img.shields.io/github/license/chiragglallwani/project-management)](https://github.com/chiragglallwani/project-management/blob/main/LICENSE)

A full-stack solution for organizing projects, assigning tasks, and tracking progress, powered by **React.js** (frontend), **Node.js/Express** (backend), and **MongoDB**. This system also integrates the **Gemini API** for enhanced productivity features.

---

## Demo Videos:
- Desktop: https://www.loom.com/share/dc4b3da30df74a028b7da46fa94ac052?sid=fab29eab-59e5-4bf9-b01a-9342a7e9cfcc
- Mobile: 

## ✨ Key Features

- **Project Organization:** Create, categorize, and manage multiple projects.
- **Task Assignment:** Assign tasks to team members with due dates and priority levels.
- **Progress Tracking:** Status updates for tasks (To Do, In Progress, Blocked, Done).
- **Gemini Integration:** Utilize the Gemini API for features like automated task summarization or suggested action items.
- **Containerized Development:** Full support for local setup using Docker Compose.

---

## 🔗 Live Deployment

The application is deployed as a frontend/backend split architecture.

| Component    | Status | URL                                                    | Notes             |
| :----------- | :----- | :----------------------------------------------------- | :---------------- |
| **Frontend** | Active | **`https://project-management-one-tawny.vercel.app/`** | Hosted on Vercel. |

> ⚠️ **Recommendation:** To ensure a seamless experience, please wait 5 minutes after opening the Live URL before navigating to pages that require data (e.g., the Projects Dashboard).

---

## 🛠️ Local Setup Methods

Choose your preferred method for running the system locally.

### Method 1: Docker Compose (Recommended - Quickest Setup)

This method uses Docker to containerize the frontend, backend, and MongoDB, ensuring a consistent environment.

#### Prerequisites

- **Docker Desktop** (or Docker Engine) must be installed and running.

#### Setup Steps

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/chiragglallwani/project-management.git
    cd project-management
    ```

2.  **Create `.env` Files:**
    Create a file named `.env` inside both the `backend/` and `frontend/` directories.

    | Directory   | File Contents (`.env`)                                                                                        | Notes                                               |
    | :---------- | :------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------- |
    | `backend/`  | `PORT=3001`<br>`MONGO_URI=mongodb://mongo:27017/project-management`<br>`GEMINI_API_KEY="YOUR_GEMINI_API_KEY"` | `mongo:27017` is the Docker service name and port.  |
    | `frontend/` | `NEXT_PUBLIC_API_URL=http://backend:3001/api/v1`                                                              | `backend:3001` is the Docker service name and port. |

3.  **Run Containers:**
    Execute the following command in the root `project-management` directory:

    ```bash
    docker compose up --build
    ```

    Allow 1-2 minutes for the images to build and containers to start.

4.  **Access the Application:**
    Open your browser to: **`http://localhost:3000`**

---

### Method 2: Local Development (Traditional Setup)

This method requires Node.js, npm, and a local MongoDB instance.

#### Prerequisites

- **Node.js (v18+)** and **npm** installed.
- **MongoDB Community Server** installed and running on default port (`27017`).

#### Setup Steps

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/chiragglallwani/project-management.git
    cd project-management
    ```

2.  **Backend Setup (`backend/`)**

    ```bash
    cd backend
    npm install
    ```

    **Create `.env` file:**

    ```env
    PORT=3001
    MONGO_URI=mongodb://localhost:27017/project-management
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```

    **Run:**

    ```bash
    npm run dev
    ```

3.  **Frontend Setup (`frontend/`)**

    ```bash
    cd ../frontend
    npm install
    ```

    **Create `.env` file:**

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
    ```

    **Run:**

    ```bash
    npm run dev
    ```

4.  **Access the Application:**
    Ensure both the backend and frontend are running, then open your browser to: **`http://localhost:3000`**

## Features:

- To avoid UI issues on mobile, I have replaced columns with accordion and added extra field to update status (Note: We can still drag and drop on mobile devices)
