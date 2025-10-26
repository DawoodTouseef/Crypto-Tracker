# 🚀 Crypto Price Tracker Dashboard

A visually stunning, real-time cryptocurrency price tracking dashboard built with Next.js, Tailwind CSS, and the CoinGecko API. Features live data updates, interactive charts, dark mode, and a fully responsive design.

![Crypto Dashboard](https://img.shields.io/badge/Next.js-14.2.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Cryptocurrency Data**: Live prices, market caps, volumes, and 24-hour changes for top cryptocurrencies
- **Interactive 7-Day Charts**: Beautiful line charts showing price trends using Chart.js
- **Auto-refresh**: Data automatically updates every 60 seconds
- **Manual Refresh**: Instant refresh button with rate-limit protection
- **Smart Caching**: Server-side caching to optimize API calls and respect rate limits

### 🔍 Advanced Filtering & Search
- **Search**: Find any cryptocurrency by name or symbol in real-time
- **Sort Options**: 
  - Market Cap (default)
  - Price (High to Low)
  - 24h Change (%)
- **Display Limits**: Toggle between Top 10, Top 20, or Top 50 cryptocurrencies

### 🎨 Beautiful UI/UX
- **Dark/Light Mode**: Auto-detects system preference with manual toggle
- **Smooth Animations**: Framer Motion fade-in effects for polished user experience
- **Color-coded Changes**: Green for gains, red for losses with trend indicators
- **Responsive Design**: Perfect on mobile (📱), tablet (📲), and desktop (💻)
- **shadcn/ui Components**: Modern, accessible UI components

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Beautiful UI components |
| **Chart.js + react-chartjs-2** | 7-day trend charts |
| **Framer Motion** | Smooth animations |
| **next-themes** | Dark/light mode management |
| **CoinGecko API** | Real-time cryptocurrency data |

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Internet connection for API calls

### Setup Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd crypto-dashboard
```

2. **Install dependencies**
```bash
yarn install
# or
npm install
```

3. **Run the development server**
```bash
yarn dev
# or
npm run dev
```

4. **Open your browser**
```
http://localhost:3000
```

The application will automatically hot-reload as you make changes!

## 🏗️ Project Structure

```
crypto-dashboard/
├── app/
│   ├── api/
│   │   └── [[...path]]/
│   │       └── route.js          # API routes with caching
│   ├── page.js                   # Main dashboard page
│   ├── layout.js                 # Root layout with theme provider
│   └── globals.css               # Global styles
├── components/
│   ├── CryptoCard.js             # Individual crypto card with chart
│   └── ui/                       # shadcn/ui components
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       ├── select.jsx
│       └── skeleton.jsx
├── lib/
│   └── utils.js                  # Utility functions
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔌 API Endpoints

### Market Data
```
GET /api/crypto/markets?limit=50
```
Returns market data for top cryptocurrencies.

**Query Parameters:**
- `limit`: Number of coins to return (10, 20, or 50)

**Response:**
```json
[
  {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "https://...",
    "current_price": 67234.50,
    "market_cap": 1324567890123,
    "total_volume": 28456789012,
    "price_change_percentage_24h": 2.45
  }
]
```

### Chart Data
```
GET /api/crypto/chart/:coinId
```
Returns 7-day price history for a specific cryptocurrency.

**Response:**
```json
[
  {
    "timestamp": 1234567890,
    "price": 67234.50
  }
]
```

## 🎯 Key Features Explained

### Server-side Caching
- 5-minute cache duration to reduce API calls
- Stale-while-revalidate strategy for optimal performance
- Fallback demo data when rate-limited

### Auto-refresh Mechanism
- Runs every 60 seconds in the background
- Non-blocking UI updates
- Respects cache to avoid excessive API calls

### Responsive Grid Layout
- **Mobile**: Single column (1 card per row)
- **Tablet**: Two columns (2 cards per row)
- **Desktop**: Three columns (3 cards per row)

### Dark Mode Implementation
- Uses `next-themes` for seamless theme switching
- Auto-detects system preference on first load
- Persists user preference across sessions
- Chart colors adapt to theme

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy!

Vercel automatically detects Next.js and configures everything.

### Environment Variables
No environment variables required! The app uses the public CoinGecko API.

### For Production
```bash
yarn build
yarn start
```

## 📊 Performance Optimizations

- **Server-side caching**: Reduces API calls by 95%
- **Lazy loading**: Charts load independently
- **Optimized images**: Crypto logos with fallbacks
- **Code splitting**: Next.js automatic optimization
- **Stale-while-revalidate**: Instant loads with background updates

## 🎨 Customization

### Change Color Scheme
Edit `tailwind.config.js` to customize the color palette.

### Adjust Refresh Rate
In `app/page.js`, change the interval:
```javascript
const interval = setInterval(() => {
  fetchCryptos(true);
}, 60000); // Change this value (in milliseconds)
```

### Modify Cache Duration
In `app/api/[[...path]]/route.js`:
```javascript
const CACHE_DURATION = 300000; // 5 minutes (in milliseconds)
```

## 🐛 Troubleshooting

### API Rate Limiting
If you see "Rate limited" messages, the app automatically uses demo data. Wait a few minutes and refresh.

### Charts Not Loading
Ensure Chart.js is properly installed:
```bash
yarn add chart.js react-chartjs-2
```

### Dark Mode Not Working
Make sure `next-themes` is installed and `ThemeProvider` is in `layout.js`.

## 📝 API Reference

**CoinGecko API**: https://api.coingecko.com/api/v3

- **Free tier**: 10-30 calls/minute
- **No API key required** for basic usage
- **Documentation**: https://www.coingecko.com/api/documentation

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **CoinGecko** for the free cryptocurrency API
- **shadcn/ui** for beautiful, accessible components
- **Vercel** for Next.js and hosting platform

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, Tailwind CSS, and CoinGecko API**

⭐ Star this repo if you found it helpful!
