# 🚀 Crypto Price Tracker Dashboard v2.0 - Enhanced Edition

A feature-rich, real-time cryptocurrency price tracking dashboard built with Next.js, Tailwind CSS, Chart.js, and the CoinGecko API. This enhanced version includes advanced features like watchlist management, currency switching, news feed, collapsible sidebar navigation, and robust mock data fallback.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)

## ✨ New Features in v2.0

### 🎯 Enhanced Core Functionality
- **Collapsible Sidebar Navigation**: Sleek sidebar with Home, Top Gainers, Watchlist, News, and Settings
- **Mock Data Fallback**: Automatically loads local mock data when API is rate-limited
- **Toast Notifications**: Real-time notifications for data updates and errors using Sonner
- **Currency Switcher**: Support for USD, EUR, and INR with localStorage persistence
- **Favorites/Watchlist**: Add/remove coins to personal watchlist with localStorage
- **News Section**: Latest crypto news with mock data support
- **Top Gainers View**: Filter and display only positive-performing cryptocurrencies
- **Settings Page**: Customize dashboard preferences including currency selection

### 🎨 UI/UX Enhancements
- **Real-time Price Glow**: Visual feedback with green/red glow on price changes
- **Watchlist Stars**: Interactive star icons on each card to quickly add/remove favorites
- **Collapsible Sidebar Animations**: Smooth Framer Motion animations
- **Enhanced Loading States**: Improved skeleton loaders and transition animations
- **Live Data Indicators**: Clear visual warnings when using mock data

### 📊 Previous Features (v1.0)
- Real-time cryptocurrency data with auto-refresh (60s)
- Interactive 7-day mini charts using Chart.js
- Advanced search and filtering capabilities
- Dark/Light mode with system auto-detect
- Fully responsive design (mobile, tablet, desktop)
- Server-side caching with rate limit handling

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Beautiful, accessible UI components |
| **Chart.js + react-chartjs-2** | Interactive 7-day trend charts |
| **Framer Motion** | Smooth page and component animations |
| **next-themes** | Dark/light mode management with persistence |
| **Sonner** | Toast notifications |
| **CoinGecko API** | Real-time cryptocurrency data |

## 📦 Installation

### Prerequisites
- Node.js 18+ and yarn
- Internet connection for API calls (optional - works with mock data)

### Setup Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd crypto-dashboard
```

2. **Install dependencies**
```bash
yarn install
```

3. **Run the development server**
```bash
yarn dev
```

4. **Open your browser**
```
http://localhost:3000
```

## 🏗️ Project Structure

```
crypto-dashboard/
├── app/
│   ├── api/
│   │   └── [[...path]]/
│   │       └── route.js          # API routes with caching & mock fallback
│   ├── page.js                   # Main dashboard with all views
│   ├── layout.js                 # Root layout with theme provider
│   └── globals.css               # Global styles
├── components/
│   ├── CryptoCard.js             # Enhanced crypto card with watchlist
│   ├── Sidebar.js                # Collapsible navigation sidebar
│   ├── NewsSection.js            # Crypto news feed
│   ├── SettingsView.js           # Settings page with currency switcher
│   └── ui/                       # shadcn/ui components
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       ├── select.jsx
│       ├── alert.jsx
│       ├── label.jsx
│       └── skeleton.jsx
├── lib/
│   ├── hooks/
│   │   ├── useCurrency.js        # Currency management hook
│   │   └── useWatchlist.js       # Watchlist management hook
│   └── utils.js                  # Utility functions
├── data/
│   └── mockCrypto.json           # Mock data for rate limit fallback
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔌 API Endpoints

### Market Data
```
GET /api/crypto/markets?limit=50
```
Returns market data for top cryptocurrencies with mock fallback.

**Query Parameters:**
- `limit`: Number of coins to return (10, 20, or 50)

**Response:**
```json
{
  \"data\": [...],
  \"isLiveData\": true,
  \"isMockData\": false,
  \"timestamp\": \"2025-01-26T10:00:00.000Z\"
}
```

### Chart Data
```
GET /api/crypto/chart/:coinId
```
Returns 7-day price history for a specific cryptocurrency.

### News
```
GET /api/crypto/news
```
Returns latest crypto news (mock data).

## 🎯 Key Features Explained

### Mock Data Fallback System
When the CoinGecko API is rate-limited or unavailable:
1. System automatically loads data from `/data/mockCrypto.json`
2. Toast notification alerts user: "⚠️ Live data temporarily unavailable"
3. Yellow alert banner displays on dashboard
4. System continues attempting to fetch live data every 60 seconds
5. Seamless transition back to live data when API is available

### Currency Switcher
- **Supported Currencies**: USD ($), EUR (€), INR (₹)
- **Automatic Conversion**: Real-time price conversion with exchange rates
- **Persistence**: Selection saved in localStorage
- **Location**: Settings page with dropdown selector

### Watchlist Management
- **Add/Remove**: Click star icon on any crypto card
- **Persistence**: Watchlist saved in localStorage
- **Dedicated View**: Access via sidebar navigation
- **Counter**: Shows number of favorited coins

### Sidebar Navigation
- **Views**:
  - 🏠 Home: All cryptocurrencies with search/filter
  - 📈 Top Gainers: Only positive 24h performers
  - ⭐ Watchlist: Your favorited coins
  - 📰 News: Latest crypto news
  - ⚙️ Settings: Dashboard preferences
- **Collapsible**: Click arrow to collapse/expand
- **Smooth Animations**: Framer Motion transitions

### Price Glow Effect
- Green glow for price increases
- Red glow for price decreases
- 1-second fade animation
- Triggers on price updates

## 🎨 Theme Support

### Dark Mode
- **Auto-detect**: Respects system theme preference
- **Manual Toggle**: Sun/moon icon in header
- **Persistence**: Theme choice saved automatically
- **Full Coverage**: All components adapt to theme

### Currency Display
- Prices automatically formatted for selected currency
- Currency symbol displayed in header
- All market cap and volume values converted

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import repository
4. Deploy!

No environment variables required - works out of the box!

### Build for Production
```bash
yarn build
yarn start
```

## 📊 Performance Optimizations

- **Server-side caching**: 5-minute cache reduces API calls by 95%
- **Stale-while-revalidate**: Instant loads with background updates
- **Lazy loading**: Charts load independently
- **Code splitting**: Automatic Next.js optimization
- **Mock data fallback**: Zero downtime even with API limits
- **localStorage**: Instant preference loading

## 🎮 User Guide

### Adding Coins to Watchlist
1. Navigate to Home or Top Gainers view
2. Click the star icon on any cryptocurrency card
3. Star turns yellow when added
4. View your watchlist via sidebar

### Changing Currency
1. Click "Settings" in sidebar
2. Select preferred currency from dropdown
3. All prices update automatically
4. Selection persists across sessions

### Viewing Top Gainers
1. Click "Top Gainers" in sidebar
2. See only cryptocurrencies with positive 24h changes
3. Sorted by highest gain percentage

### Reading Crypto News
1. Click "News" in sidebar
2. Browse latest cryptocurrency news
3. Click "Read more" to open full articles

## 🐛 Troubleshooting

### API Rate Limiting
- **Issue**: "Live data temporarily unavailable" message
- **Solution**: System automatically uses mock data. Wait 1-2 minutes and data will refresh
- **Note**: Rate limits reset after a few minutes

### Watchlist Not Saving
- **Issue**: Favorites not persisting between sessions
- **Solution**: Ensure browser localStorage is enabled
- **Check**: Browser settings > Privacy > Allow local data

### Currency Not Changing
- **Issue**: Prices still showing in previous currency
- **Solution**: Navigate away from current view and back
- **Alternative**: Refresh the page

### Charts Not Loading
- **Issue**: Empty chart areas
- **Solution**: Check browser console for errors
- **Ensure**: Chart.js and react-chartjs-2 are installed

## 📝 API Reference

**CoinGecko API**: https://api.coingecko.com/api/v3

- **Free tier**: 10-30 calls/minute
- **No API key required**: Basic usage
- **Rate limit handling**: Automatic mock data fallback
- **Documentation**: https://www.coingecko.com/api/documentation

## 🔒 Privacy & Data Storage

### What's Stored in localStorage
- **Preferred Currency**: USD/EUR/INR selection
- **Watchlist**: Array of favorited coin IDs
- **Theme Preference**: Dark/light mode choice

### What's NOT Stored
- Personal information
- Financial data
- API keys or credentials
- Price history or analytics

## 🎯 Future Enhancements (Roadmap)

### Planned Features
- [ ] Historical data chart page (click coin for details)
- [ ] Price alerts and notifications
- [ ] Portfolio tracking
- [ ] PWA support (installable app)
- [ ] More currency options
- [ ] Advanced filtering (by market cap, volume, etc.)
- [ ] Coin comparison tool
- [ ] Export watchlist as CSV

### Optional Integrations
- [ ] Real crypto news API (CryptoPanic)
- [ ] Social sentiment analysis
- [ ] Exchange rate historical charts
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **CoinGecko** for the free cryptocurrency API
- **shadcn/ui** for beautiful, accessible components
- **Vercel** for Next.js and hosting platform
- **Chart.js** for powerful charting library
- **Framer Motion** for smooth animations

## 📧 Contact & Support

For questions, issues, or feedback:
- Open an issue on GitHub
- Check existing issues for solutions
- Review troubleshooting guide above

---

## 🎉 What's New in v2.0

### Major Additions
✅ Collapsible sidebar navigation  
✅ Multi-currency support (USD/EUR/INR)  
✅ Watchlist with localStorage persistence  
✅ Mock data fallback for rate limit resilience  
✅ Crypto news section  
✅ Top Gainers view  
✅ Settings page  
✅ Toast notifications  
✅ Price glow animations  
✅ Enhanced error handling  

### Improvements
⚡ Better loading states  
⚡ Improved mobile responsiveness  
⚡ Smoother animations  
⚡ Better theme support  
⚡ Enhanced caching strategy  

---

**Built with ❤️ using Next.js, Tailwind CSS, Chart.js, and CoinGecko API**

⭐ Star this repo if you found it helpful!

**v2.0.0 - Enhanced Edition** | [View Changelog](CHANGELOG.md) | [Report Bug](issues) | [Request Feature](issues)
