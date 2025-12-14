# Open Graph Image Guide for WatchPulse

## Required Specifications

### Dimensions & Format
- **Size**: 1200 x 630 pixels (required for Facebook, Twitter, LinkedIn)
- **Format**: JPG or PNG (JPG recommended for smaller file size)
- **File name**: `og-image.jpg` or `og-image.png`
- **Max file size**: Under 8MB (ideally under 1MB for fast loading)
- **Aspect ratio**: 1.91:1

### Design Recommendations

#### Background
- Use the brand gradient: `linear-gradient(135deg, #7C8DB0 0%, #B8977E 100%)`
- Or use a dark background (#121417) with gradient accents

#### Content to Include
1. **WatchPulse Logo** (top or center)
2. **Main Tagline**: "AI-Powered Movie Recommendations"
3. **Subheading**: "Based on Your Mood"
4. **Visual Elements**:
   - Movie/TV screen mockup showing the app
   - AI/mood icons (brain, heart, smile emoji)
   - Trending up arrow or graph
5. **Colors**: Use brand colors
   - Primary: #7C8DB0
   - Accent: #B8977E
   - Gold: #E0C097
   - Text: #F1F1F1

#### Typography
- **Heading**: Bold, 72-96px font size
- **Subheading**: Medium, 36-48px font size
- Use clear, readable fonts (Inter, Montserrat, or similar)

#### Layout Example
```
┌─────────────────────────────────────┐
│  [WatchPulse Logo]                  │
│                                     │
│      AI-Powered Movie               │
│      Recommendations                │
│                                     │
│      Based on Your Mood 🎬          │
│                                     │
│  [App Screenshot/Mockup]            │
│                                     │
│  watchpulseapp.com                  │
└─────────────────────────────────────┘
```

### Testing Your OG Image
After creating the image:
1. Save as `/public/og-image.jpg`
2. Test on: https://www.opengraph.xyz/
3. Validate with Facebook: https://developers.facebook.com/tools/debug/
4. Validate with Twitter: https://cards-dev.twitter.com/validator

### Quick Creation Tools
- **Canva**: Use their "Facebook Post" template (1200x630)
- **Figma**: Create custom design with exact specifications
- **Adobe Express**: Use social media templates
- **Photoshop/GIMP**: Manual design

### Current Metadata Configuration
The site is configured to use `/og-image.jpg` as the Open Graph image.
Once you create this file, it will automatically be used for social media shares.
