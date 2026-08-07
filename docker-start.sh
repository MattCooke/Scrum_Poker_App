#!/bin/bash
# Docker Build and Run Helper Script
# Run this with: ./docker-start.sh

echo "🐳 Building Scrum Poker Docker Image..."

# Build the Docker image
docker build -t scrum-poker-app .

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting container..."
    
    # Remove existing container if it exists
    docker rm -f scrum-poker-app 2>/dev/null
    
    # Run the container
    docker run -d \
        -p 3000:3000 \
        --name scrum-poker-app \
        --restart unless-stopped \
        scrum-poker-app
    
    if [ $? -eq 0 ]; then
        echo "✅ Container started successfully!"
        echo ""
        echo "📱 Access the app at:"
        echo "   http://localhost:3000"
        echo ""
        echo "📊 Container status:"
        docker ps | grep scrum-poker-app
        echo ""
        echo "💡 Useful commands:"
        echo "   View logs:    docker logs scrum-poker-app"
        echo "   Follow logs:  docker logs -f scrum-poker-app"
        echo "   Stop:         docker stop scrum-poker-app"
        echo "   Remove:       docker rm -f scrum-poker-app"
    else
        echo "❌ Failed to start container"
        exit 1
    fi
else
    echo "❌ Build failed"
    exit 1
fi
