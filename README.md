# Seneca's Letters to Lucilius

A beautiful, fast, and thoughtfully designed website showcasing Seneca's complete collection of 124 letters to his friend Lucilius. Built with modern web technologies and optimized for reading.

## 🌟 Features

### Reading Experience
- **124 complete letters** from Seneca's *Epistulae Morales ad Lucilium*
- **Auto-hiding header** for distraction-free reading
- **Customizable typography** with system font options
- **Adjustable font sizes** with keyboard shortcuts
- **Dark/light theme** toggle
- **Related letters** suggestions

### Performance
- **System fonts only** - zero font loading time
- **Static site generation** with Astro
- **Optimized for speed** - built for fast loading
- **Responsive design** - works on all devices

### Design
- **Minimal aesthetic** meets ancient wisdom
- **Terracotta color scheme** inspired by Roman pottery
- **Clean typography** focused on readability
- **Thoughtful spacing** and layout
- **Daisy logo** symbolizing natural wisdom

## 🚀 Technology Stack

- **[Astro](https://astro.build/)** - Static site generator
- **TypeScript** - Type-safe JavaScript
- **System Fonts** - No external font loading
- **CSS Custom Properties** - Modern styling
- **Cloudflare Pages** - Deployment platform

## 📁 Project Structure

```
/
├── public/
│   └── favicon.svg          # Daisy logo favicon
├── src/
│   ├── components/
│   │   ├── Header.astro     # Navigation header
│   │   └── Footer.astro     # Site footer
│   ├── data/
│   │   └── all_letters.json # Complete letters data
│   ├── layouts/
│   │   └── Layout.astro     # Base layout template
│   └── pages/
│       ├── index.astro      # Homepage
│       ├── about.astro      # About page
│       ├── library.astro    # Complete library
│       └── letters/
│           └── [id].astro   # Individual letter pages
├── astro.config.mjs         # Astro configuration
└── package.json
```

## 🛠 Installation & Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd seneca-letters

# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:4321
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run deploy       # Deploy to Cloudflare Pages
```

## 📖 Content Structure

### Letter Data Format
Each letter in `all_letters.json` contains:
```json
{
  "number": 1,
  "roman_number": "I",
  "title": "ON THE PROPER USE OF TIME",
  "content": "Letter content in plain text..."
}
```

### Content Processing
- **Paragraph numbers removed** automatically
- **Footnotes cleaned** from display text
- **Title case conversion** applied consistently
- **Content formatting** preserves readability

## 🎨 Design System

### Colors
```css
--terracotta: #d2691e           /* Primary accent */
--terracotta-light: rgba(210, 105, 30, .05)  /* Light background */
--text-primary: #1a1a1a         /* Main text */
--text-secondary: #4a5568       /* Secondary text */
--text-muted: #718096           /* Muted text */
--background: #ffffff           /* Page background */
--surface: #fefefe              /* Card backgrounds */
```

### Typography
```css
/* Primary reading font */
font-family: ui-serif, Georgia, 'Times New Roman', serif;

/* Interface font */  
font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, sans-serif;
```

### Font Options for Readers
- **System Serif** (default) - New York on Apple, Times on others
- **Georgia** - Classic web serif
- **Times New Roman** - Traditional serif
- **System Sans** - SF Pro Text on Apple, Segoe UI on Windows
- **Charter** - Alternative serif option

## ⚡ Performance Features

### Font Loading
- **Zero external fonts** - uses system fonts only
- **Instant rendering** - no FOUT/FOIT
- **Optimal fallbacks** - graceful degradation

### Auto-Hide Header
- **Scroll-based** - hides when reading, shows when needed
- **Smooth animations** - 300ms transitions
- **Performance optimized** - uses `requestAnimationFrame`

### Static Generation
- **124 static pages** generated at build time
- **Dynamic routing** with `[id].astro`
- **Optimized bundle** for fast loading

## 🔧 Customization

### Adding New Letters
1. Add letter data to `src/data/all_letters.json`
2. Include required fields: `number`, `title`, `content`
3. Optional: `roman_number` field
4. Rebuild site to generate new pages

### Styling Changes
- Edit CSS custom properties in `src/layouts/Layout.astro`
- Component styles are scoped to individual `.astro` files
- Global styles affect the entire site

### Color Scheme
```css
/* Light theme (default) */
:root {
  --terracotta: #d2691e;
  --text-primary: #1a1a1a;
  --background: #ffffff;
}

/* Dark theme */
[data-theme="dark"] {
  --text-primary: #f7fafc;
  --background: #0f0f0f;
}
```

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px  
- **Mobile**: < 768px

### Mobile Optimizations
- **Stacked header** navigation
- **Larger touch targets** for controls
- **Simplified layouts** on small screens
- **Optimized font sizes** for readability

## 🚦 Deployment

### Cloudflare Pages
```bash
# Build and deploy
npm run deploy

# Deploy to staging
npm run deploy:staging

# Deploy to production  
npm run deploy:production
```

### Manual Build
```bash
# Generate static files
npm run build

# Files output to ./dist/
# Upload dist/ contents to any static host
```

## 🎯 Features in Detail

### Reading Controls
- **Font selection** with 5 system font options
- **Size adjustment** from 14px to 24px (2px increments)
- **Theme toggle** between light and dark modes
- **Keyboard shortcuts** (Cmd/Ctrl + Plus/Minus for sizing)
- **Persistent preferences** saved to localStorage

### Navigation
- **Previous/Next letters** with smart linking
- **Related letters** based on proximity in sequence
- **Back to library** quick return
- **Auto-hide header** for focused reading

### Search & Discovery
- **Complete library** with all 124 letters
- **Search functionality** (in library page)
- **Curated featured** letters on homepage
- **Related letters** on each letter page

## 🏛 About the Content

### Source
All letters are sourced from Richard Mott Gummere's translation for the Loeb Classical Library (1917-1925), digitized by Wikisource contributors.

### Translation
- **Scholar**: Richard Mott Gummere (1883-1953)
- **Original**: Harvard University Press, 3 volumes
- **Period**: Letters written 63-65 CE
- **Public domain** status ensures free access

### Historical Context
- **Author**: Lucius Annaeus Seneca (4 BCE - 65 CE)
- **Recipient**: Lucilius Junior, procurator of Sicily
- **Period**: Final years before Seneca's forced suicide
- **Genre**: Philosophical correspondence, Stoic ethics

## 🤝 Contributing

### Content Improvements
- Report formatting issues
- Suggest letter curation
- Propose feature enhancements

### Technical Contributions
- Performance optimizations
- Accessibility improvements
- Mobile experience enhancements
- Additional reading features

## 📄 License

- **Code**: MIT License
- **Content**: Public Domain (Gummere translation)
- **Design**: Original work

## 🙏 Acknowledgments

- **Richard Mott Gummere** - Original translation
- **Wikisource contributors** - Digital preservation
- **Seneca** - Timeless wisdom
- **Modern web community** - Tools and techniques

---

*"Every new beginning comes from some other beginning's end."* - Seneca

Built with ❤️ for philosophy enthusiasts and anyone seeking ancient wisdom for modern life.