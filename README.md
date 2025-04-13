# Advance Server Side Coursework

To get started, first clone the repository:

git clone https://github.com/silvasonal/Advance-Server-Side-Coursework.git

To run the project locally:

# Frontend Setup:
1.cd frontend
2.npm install
3.npm start


# Backend Setup:
1.cd backend
2.npm start


# To run the project using Docker:

1. Make sure Docker is installed and running on your machine.
2. Remove node_modules and package-lock.json from the backend directory to avoid conflicts:
    2.1.Remove-Item -Recurse -Force .\backend\node_modules
    2.2.Remove-Item -Force .\backend\package-lock.json

3. Stop any running containers (if any):
    3.1.docker-compose down

4. Build and start the containers:
    4.1.docker-compose up --build


