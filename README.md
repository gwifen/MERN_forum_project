##Setup Instructions

###Clone the repository:
```bash
git clone https://github.com/yourusername/forum-application.git
cd forum-application
```

###Install server dependencies:
```bash
cd server
npm install
```

###Install client dependencies:
```bash
cd ../client
npm install
```

###Set up environment variables:
Change a .env file in the server directory:
```bash
DB=<your-database-url>
JWTPRIVATEKEY=<your-jwt-private-key>
SALT=<your-salt-value>
```

###Start the backend server:
```bash
cd server
npm start
```

###Start the frontend server:
```bash
cd ../client
npm start
```

###Access the application:
Open your browser and navigate to http://localhost:3000.
