# Docker Build and Run Helper Script
# Run this with: ./docker-start.ps1

Write-Host "🐳 Building Scrum Poker Docker Image..." -ForegroundColor Cyan

# Build the Docker image
docker build -t scrum-poker-app .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Starting container..." -ForegroundColor Cyan
    
    # Remove existing container if it exists
    docker rm -f scrum-poker-app 2>$null
    
    # Run the container
    docker run -d `
        -p 3000:3000 `
        --name scrum-poker-app `
        --restart unless-stopped `
        scrum-poker-app
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Container started successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📱 Access the app at:" -ForegroundColor Yellow
        Write-Host "   http://localhost:3000" -ForegroundColor White
        Write-Host ""
        Write-Host "📊 Container status:" -ForegroundColor Yellow
        docker ps | Select-String "scrum-poker-app"
        Write-Host ""
        Write-Host "💡 Useful commands:" -ForegroundColor Yellow
        Write-Host "   View logs:    docker logs scrum-poker-app" -ForegroundColor White
        Write-Host "   Follow logs:  docker logs -f scrum-poker-app" -ForegroundColor White
        Write-Host "   Stop:         docker stop scrum-poker-app" -ForegroundColor White
        Write-Host "   Remove:       docker rm -f scrum-poker-app" -ForegroundColor White
    } else {
        Write-Host "❌ Failed to start container" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
