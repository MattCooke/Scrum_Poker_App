# Scrum Poker App

A real-time, multi-user Scrum Poker voting application for agile teams with a clean, professional design.

## Features

- 🎨 **Professional Visual Theme**: Clean yellow, black, and neutral gray color scheme
- 🏠 **Multi-Room Support**: Create up to 10 separate voting rooms for different teams or sessions
- 🎯 **Fibonacci Voting**: Vote using Fibonacci numbers (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?)
- 👥 **Multi-User Support**: Multiple team members can join and vote simultaneously
- 🔄 **Real-Time Updates**: Instant synchronization across all connected devices
- 🧹 **Auto-Cleanup**: Rooms automatically close after 7 days of inactivity to free up space
- 📱 **Responsive Design**: Works seamlessly on phones, tablets, and computers
- 🌙 **Dark Mode**: Professional appearance in both light and dark themes

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Server Configuration

You can configure the server IP address and port using different methods:

**Option 1: Using npm scripts (recommended)**
```bash
# Default - localhost only
npm run scrum-poker

# Allow access from other devices on your network
npm run scrum-poker:all

# Explicitly use localhost
npm run scrum-poker:local
```

**Option 2: Using environment variables**
Create a `.env.local` file in the root directory:
```env
HOSTNAME=0.0.0.0
PORT=3000
```
Then run:
```bash
npm run dev
```

**Option 3: Direct Next.js CLI**
```bash
# Windows PowerShell
npx next dev -H 0.0.0.0 -p 3000

# Custom IP address
npx next dev -H 192.168.1.100 -p 3000
```

**Common configurations:**
- `localhost` or `127.0.0.1` - Local machine only
- `0.0.0.0` - Accessible from any device on your network
- Specific IP (e.g., `192.168.1.100`) - Bind to a specific network interface

**Production and Azure Web App**
For a production deployment, use the custom Node.js entrypoint:
```bash
npm run build
npm start
```
The server binds to `0.0.0.0` and reads `process.env.Port`, then `process.env.PORT`, defaulting to port `3000`. For an Azure App Service source deployment, set the startup command to `npm start` and configure the `Port` app setting if Azure provides a different port.

### Usage

#### Room Management
1. **View Rooms**: When you open the app, you'll see a list of active rooms
2. **Create a Room**: Click "Create New Room", enter a room name and your name
3. **Join a Room**: Select a room from the list, enter your name, and click "Join"
4. **Room Limits**: Maximum of 10 active rooms at a time
5. **Auto-Cleanup**: Rooms inactive for 7 days are automatically deleted

#### Voting in a Room
1. **Enter Story**: Type the user story or task you're estimating
2. **Cast Your Vote**: Click on a Fibonacci number to vote
3. **View Progress**: See how many team members have voted
4. **Reveal Votes**: Click "Reveal" to show all votes
5. **Reset**: Click "Reset" to clear all votes and start a new estimation
6. **Leave Room**: Click "Leave Room" to return to the room selection

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Real-Time**: Socket.IO
- **Build Tool**: Next.js built-in bundler

## Docker Deployment

This application is Docker-ready with an optimized, lightweight container image.

### Quick Start with Docker

**Build and run with Docker Compose (easiest):**
```bash
docker-compose up -d
```

The app will be available at [http://localhost:3000](http://localhost:3000)

**Or build and run manually:**
```bash
# Build the image
docker build -t scrum-poker-app .

# Run the container
docker run -d -p 3000:3000 --name scrum-poker scrum-poker-app
```

### Docker Image Details

- **Base Image**: `node:lts-alpine3.24` (Alpine Linux 3.24 with Node.js LTS)
- **Image Size**: ~120-150 MB (highly optimized with standalone build)
- **Multi-stage Build**: Separates build dependencies from runtime
- **Non-root User**: Runs as unprivileged user for security
- **Health Check**: Built-in container health monitoring
- **Optimizations**: 
  - Uses Next.js standalone output (only essential files)
  - Production-only dependencies in final image
  - Aggressive layer caching
  - Telemetry disabled

### Docker Commands

```bash
# Build with size optimization
docker build -t scrum-poker-app .

# Check image size
docker images scrum-poker-app

# View logs
docker logs scrum-poker-app

# Stop the container
docker-compose down

# Rebuild after changes
docker-compose up -d --build

# Check container health
docker ps

# Access container shell (for debugging)
docker exec -it scrum-poker-app sh
```

### Further Size Optimization

If you need an even smaller image (<100 MB), consider:

```dockerfile
# Use distroless base (add to Dockerfile final stage)
FROM gcr.io/distroless/nodejs18-debian11
# ~50-80 MB final image, but no shell access
```

Or compress the image:
```bash
# Export and compress
docker save scrum-poker-app | gzip > scrum-poker-app.tar.gz

# Prune unused images
docker image prune -a
```

### Deployment to Production

**Port Configuration:**
Change the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # External:Internal
```

**Environment Variables:**
Add to `docker-compose.yml`:
```yaml
environment:
  - NODE_ENV=production
  - HOSTNAME=0.0.0.0
  - PORT=3000
```

**Azure App Service (Node.js runtime):**
1. Use a Linux Web App with the Node 24 LTS runtime.
2. Set the startup command to `npm start`.
3. Enable **Web sockets**. Enable **Always On** if the App Service plan supports it.
4. Add these application settings:
   ```text
   NODE_ENV=production
   Port=3000
   HOSTNAME=0.0.0.0
   SCM_DO_BUILD_DURING_DEPLOYMENT=true
   ```
5. Connect the repository through **Deployment Center → GitHub**.
6. Ensure deployment runs `npm ci` followed by `npm run build`.
7. Keep the app at one instance because room state is held in memory.
8. Do not set `WEBSITES_PORT`; that setting is only needed for custom-container Web Apps.

**Popular Hosting Platforms:**

- **AWS ECS/Fargate**: Deploy container directly
- **Google Cloud Run**: Automatic scaling and HTTPS
- **Azure Container Instances**: Simple container deployment
- **DigitalOcean App Platform**: Easy container hosting
- **Fly.io**: Edge deployment with global regions
- **Railway.app**: Simple Dockerfile deployment

**Example Fly.io deployment:**
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login and launch
fly launch

# Deploy
fly deploy
```

**Example deployment to any VPS (Ubuntu/Debian):**
```bash
# On your server, clone the repo
git clone <your-repo-url>
cd Scrum-Poker-App

# Install Docker and Docker Compose
sudo apt update
sudo apt install -y docker.io docker-compose

# Start the application
sudo docker-compose up -d

# Optional: Set up nginx reverse proxy with SSL
sudo apt install -y nginx certbot python3-certbot-nginx
# Configure nginx to proxy to localhost:3000
```

### Security Considerations

- Container runs as non-root user (`nextjs`)
- No sensitive data in environment variables
- Health checks ensure service availability
- Resource limits prevent DoS attacks
- Use HTTPS in production (reverse proxy or platform SSL)

## Project Structure

```
scrum-poker-app/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── page.tsx      # Main voting page
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── VotingCard.tsx
│   │   ├── UserList.tsx
│   │   └── StoryInput.tsx
│   ├── lib/              # Utility functions
│   │   └── socket.ts     # Socket.IO client setup
│   └── types/            # TypeScript types
│       └── index.ts
├── pages/
│   └── api/
│       └── socket.ts     # Socket.IO server endpoint
└── public/               # Static assets

```

## Deployment

The app can be deployed to any platform that supports Next.js:

- Vercel (recommended)
- Netlify
- AWS
- Azure
- Docker

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
