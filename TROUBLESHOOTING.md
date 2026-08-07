# Common Issues and Solutions

## Installation Issues

### npm install fails
**Problem**: Dependencies fail to install  
**Solution**: 
1. Delete `node_modules` folder and `package-lock.json`
2. Run `npm cache clean --force`
3. Run `npm install` again

### Node version error
**Problem**: "The engine 'node' is incompatible with this module"  
**Solution**: 
- Upgrade to Node.js 18 or higher
- Download from [nodejs.org](https://nodejs.org/)

## Connection Issues

### Can't connect from phone
**Problem**: Phone can't access the app  
**Solution**:
1. Both devices must be on the same Wi-Fi network
2. Use your computer's local IP address (192.168.x.x), not localhost
3. Check firewall settings - allow port 3000
4. Try turning off VPN if enabled

### Votes not syncing
**Problem**: Changes don't appear on other devices  
**Solution**:
1. Check browser console for errors (F12)
2. Refresh all connected devices
3. Restart the development server
4. Check if WebSocket connection is established

## Development Issues

### Hot reload not working
**Problem**: Changes don't appear after saving files  
**Solution**:
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check terminal for compilation errors
3. Restart the dev server

### TypeScript errors
**Problem**: Red squiggly lines in VS Code  
**Solution**:
1. Install recommended extensions
2. Restart VS Code
3. Run `npm install` to ensure types are installed

### Port 3000 already in use
**Problem**: "Port 3000 is already in use"  
**Solution**:
1. Kill the process using port 3000
2. Or use a different port: `npm run dev -- -p 3001`

## Runtime Issues

### Users not appearing in list
**Problem**: New users join but don't show up  
**Solution**:
- Refresh the page
- Check that users are entering their names
- Look for connection errors in console

### Votes stuck on screen
**Problem**: Old votes remain after reset  
**Solution**:
- Click Reset button
- Refresh all connected browsers
- Clear browser cache

## Browser Compatibility

### Recommended Browsers
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ⚠️ Internet Explorer NOT supported

### Mobile Browsers
- ✅ Safari (iOS)
- ✅ Chrome (Android)
- ✅ Samsung Internet

## Performance Issues

### App is slow
**Solution**:
1. Close unnecessary browser tabs
2. Clear browser cache
3. Check internet connection
4. Use production build for better performance

### Memory leaks
**Problem**: App gets slower over time  
**Solution**:
- Refresh the page periodically
- Ensure Socket.IO connections are properly cleaned up
- Check browser dev tools for memory usage

## Deployment Issues

### Build fails
**Problem**: `npm run build` fails  
**Solution**:
1. Check for TypeScript errors: `npm run lint`
2. Fix all errors shown
3. Try `npm run build` again

### Environment variables
**Problem**: Config not working in production  
**Solution**:
- Create `.env.local` for local development
- Set environment variables in your hosting platform
- Don't commit `.env.local` to git

## Getting Help

If none of these solutions work:
1. Check the terminal output for specific error messages
2. Look at browser console (F12) for JavaScript errors
3. Verify all files are present and correctly named
4. Try deleting `node_modules` and `.next` folders, then reinstall
5. Make sure you're using the correct versions of dependencies

## Useful Commands

```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install

# Check for outdated packages
npm outdated

# Update all packages
npm update

# Run type checking
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

Remember: Most issues can be solved by:
1. Refreshing the browser
2. Restarting the dev server
3. Reinstalling dependencies
4. Checking the console for errors
