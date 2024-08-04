
# Usage Dashboard Task - Tamir Hen

## About The Project
Hello, this is my solution for the Orbital Witness technical task, hope you'll find it interesting.  
The project is divided into two parts:
* Backend - Python & FastAPI
* Frontend - TypeScript & React

A few things to note:
* I have added comments in the code to help review it.
* The timestamp returning from the `messages` API is in UTC (+00:00) time. I wasn't sure if the requirement is to show the usage in UTC as provided, or in BST (+01:00).
The example table in the task brief shows the first two messages in their UTC time, hence I decided to show the time in UTC. This is documented in comments above the code blocks where it's applied. 
* It is possible to test the backend directly by opening the FastAPI Swagger at (default URL):  
http://127.0.0.1:8000/docs

## Prerequisites
* Python3 (preferably Python v3.11)
* Node.js (preferably Node v21)

## Getting Started
Clone the repository
```bash
git clone https://github.com/TamirHen/usage-dashboard.git
```
`cd` into the repository
```bash
cd usage-dashboard
```

## Backend
From project root, `cd` into the backend folder
```bash
cd backend
```
Create the environment variable from the example file
```bash
cp .env.example .env
```
Open the `.env` file and add the Orbital Witness public API base URL (replace asterisks with the actual domain)
```
OC_BASE_URL="https://******/tech-task"
```
Create the virtual environment (preferably with python3.11)
```bash
python3 -m venv .venv
```
Activate the virtual environment 
```bash
source .venv/bin/activate
```
Install the packages 
```bash
python -m pip install -r requirements.txt
```
`cd` into the `server` folder  
```bash
cd server
```
Start the server 
```bash
fastapi run main.py
```

## Frontend
From project root, `cd` into the frontend folder
```bash
cd frontend
```
Create the environment variable from the example file
```bash
cp .env.example .env
```
Install the dependencies
```bash
npm install
```
Start the React App
```bash
npm start
```
Open the app in a browser, the default URL is:  
http://localhost:3005
