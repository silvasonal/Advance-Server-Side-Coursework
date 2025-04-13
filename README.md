# Advance Server Side Coursework

To get started, first clone the repository:

git clone https://github.com/silvasonal/Advance-Server-Side-Coursework.git

To run the project locally:

# Frontend Setup:
cd frontend
npm install
npm start


# Backend Setup:
cd backend
npm install
npm start


# To run the project using Docker:

1. Make sure Docker is installed and running on your machine.
2. Remove node_modules and package-lock.json from the backend directory to avoid conflicts:
    Remove-Item -Recurse -Force .\backend\node_modules
    Remove-Item -Force .\backend\package-lock.json

3. Stop any running containers (if any):
    docker-compose down

4. Build and start the containers:
    docker-compose up --build


