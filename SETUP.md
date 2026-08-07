# Scrum Poker App - Setup & Usage Guide

## 🚀 Quick Start

### Step 1: Install Node.js
If you don't have Node.js installed:
1. Download from [https://nodejs.org/](https://nodejs.org/)
2. Install the LTS (Long Term Support) version
3. Verify installation by opening a terminal and running:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Dependencies
Open a terminal in the project folder and run:
```bash
npm install
```

This will install all required packages including:
- Next.js (React framework)
- Socket.IO (real-time communication)
- Tailwind CSS (styling)
- TypeScript (type safety)

### Step 3: Start the Development Server
```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

### Step 4: Access from Other Devices

To allow other devices on your network to connect:

1. Find your computer's IP address:
   - **Windows**: Open Command Prompt and run `ipconfig`
   - **Mac/Linux**: Open Terminal and run `ifconfig`
   - Look for your local IP (usually starts with 192.168.x.x or 10.x.x.x)

2. Other devices can access the app at:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```
   For example: `http://192.168.1.100:3000`

3. Make sure all devices are on the same network!

## 📱 How to Use

### Starting a Session
1. Open the app in your browser
2. Enter your name
3. Click "Join Session"

### Voting
1. Read the current story (or add one by clicking on the story field)
2. Click on a Fibonacci number to cast your vote
3. Click again on the same number to remove your vote

### Revealing Votes
- Click "👀 Reveal" to show everyone's votes
- Click "🙈 Hide" to hide the votes again

### Resetting for Next Story
- Click "🔄 Reset" to clear all votes and start fresh

## 🎯 Fibonacci Numbers Explained

The voting cards use the Fibonacci sequence, which is standard in Scrum:
- **0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89**: Story point values
- **?**: Unsure about the estimate
- **☕**: Need a break or more discussion

## 🔧 Troubleshooting

### "Cannot connect to server"
- Make sure the development server is running (`npm run dev`)
- Check that you're using the correct IP address
- Verify all devices are on the same Wi-Fi network

### Page not loading
- Clear your browser cache
- Try a different browser
- Check the terminal for error messages

### Votes not updating in real-time
- Check your internet connection
- Refresh the page
- Look for errors in the browser console (F12)

## 🚢 Production Deployment

For a permanent deployment, you can use:

### Vercel (Recommended - Free)
1. Create account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Run: `vercel`
4. Follow the prompts

### Other Options
- **Netlify**: Similar to Vercel
- **AWS/Azure**: For enterprise deployments
- **Docker**: Containerized deployment

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts` to modify the color scheme

### Add More Voting Options
Edit `src/types/index.ts` and modify the `FIBONACCI_VALUES` array

### Change Story Field
Modify `src/components/StoryInput.tsx`

## 📝 Features

✅ Real-time voting synchronization  
✅ Responsive design (mobile & desktop)  
✅ Fibonacci sequence voting cards  
✅ User presence indicators  
✅ Vote reveal/hide functionality  
✅ Story description field  
✅ Dark mode support  
✅ Connection status tracking  

## 🤝 Support

If you encounter issues:
1. Check the terminal output for errors
2. Look at browser console (F12) for JavaScript errors
3. Verify all dependencies are installed correctly
4. Make sure you're using Node.js version 18 or higher

## 📄 License

MIT License - Feel free to modify and use as needed!

---

**Happy Estimating! 🎯**
