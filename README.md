# 🐾 Pet Buddy - Virtual Pet Game

A delightful virtual pet game where you care for your very own companion! Choose from 6 different pet types, customize them, and watch them grow happy and healthy.

## ✨ Features

### 🐾 **6 Pet Types to Choose From:**
- 🐰 **Bunny** - Cute rabbit with 3 detailed art styles (Enhanced, Chibi, Soft Realistic)
- 🦎 **Bearded Dragon** - Basking on rocks, eating crickets, soaking up heat lamps
- 🦫 **Capybara** - Relaxing with birds, splashing in water, ultimate chill vibes
- 🐕 **Dog** - Playing with tennis balls, getting treats, zoomies and tail wags
- 🐱 **Cat** - Sitting in boxes, playing with yarn, purring with hearts
- 🐿️ **Squirrel** - Collecting acorns, jumping between trees, surrounded by falling leaves

### 🎨 **Full Customization:**
Each pet type has unique options:
- **Colors**: Different palettes per pet (e.g., Dog: golden, brown, black, white, spotted, tricolor)
- **Sizes**: Small, Medium, Large (or Extra-Large for Capybaras!)
- **Special Features**: 
  - Bunny: Ear types (floppy, upright, lop)
  - Dragon: Patterns (normal, hypo, translucent, leatherback)
  - Dog: Breed types (retriever, terrier, bulldog, husky, corgi)
  - Cat: Fur length (short, medium, long, fluffy)
  - Squirrel: Tail bushiness (sleek, medium, bushy, extra-bushy)
  - Capybara: Ear sizes (small, medium, large)
- **Eye Colors**: Unique options for each pet type
- **Name Your Pet**: Give them a personality!

### 🏡 **7 Beautiful Environments:**
- 🌾 **Farm** - Barn, fence, rolling hills, sunny sky
- 🏜️ **Desert** - Sand dunes, cacti, tumbleweeds, blazing sun
- 🏖️ **Beach** - Ocean waves, palm trees, umbrella, seagulls
- 🌃 **City** - Night skyline with lit windows, moon and stars
- 🌴 **Jungle** - Dense canopy, vines, tropical flowers, butterflies
- 🎋 **Bamboo Forest** - Bamboo stalks, pandas, misty atmosphere
- 🌲 **Forest** - Trees, mushrooms, flowers, deer, morning fog

### 🎮 **Interactive Gameplay:**
- **Feed**: Drag food items to your pet (reduces hunger, increases happiness)
- **Give Water**: Keep your pet hydrated
- **Pet**: Click to show love and increase happiness
- **Chat Commands**: Type "jump", "dance", "pout", or "rub ears"
- **Playdates**: Arrange playdates with friends' pets

### ✨ **Idle Animations:**
Your pet comes alive with automatic gestures:
- Blinking, smiling, looking around
- Ear/tail wiggling (for pets with tails)
- Small hops and nose twitches
- Each pet has unique idle behaviors!

### 📊 **Real-Time Stat System:**
- **Happiness**: Decreases 5.2% per hour
- **Hunger**: Increases 16% per hour  
- **Thirst**: Increases 12.5% per hour
- Stats update every minute while playing
- Catch-up system when you return after being away

### 💰 **Coin Economy:**
- Earn coins for every interaction (5-15 coins)
- **Shop**: Buy food and water supplies
  - 🥕 5 Carrots: 20 coins
  - 🥬 5 Lettuce: 20 coins
  - 🍎 5 Apples: 30 coins
  - 💧 5 Water: 10 coins

### 💾 **Persistent Storage:**
- Auto-saves every 30 seconds
- Remembers your pet type, customizations, stats, and inventory
- Calculates time-based stat changes when you return

### ⚙️ **Settings:**
- Change pet type anytime!
- Rename your pet
- Adjust all customization options
- Switch home environment
- Change art style (for bunnies)

### 📱 **Mobile Optimized:**
- Touch-friendly controls
- Drag-and-drop gestures
- Responsive layout for all screen sizes
- No accidental zooming
- Can be installed as a mobile app (Add to Home Screen)

## 🎮 How to Play

## 🎮 How to Play

1. **Choose Your Pet**: Select from 6 different animals (Bunny, Bearded Dragon, Capybara, Dog, Cat, Squirrel)
2. **Customize**: Pick colors, sizes, special features, eye colors, and give them a name
3. **Care for Your Pet**: 
   - Drag food items to feed your pet
   - Give water to keep it hydrated
   - Click to pet and increase happiness
   - Watch idle animations as your pet blinks, looks around, and more
4. **Chat Commands**: Type "jump", "dance", "pout", or "rub ears" in chat
5. **Earn Coins**: Get coins for every interaction (feeding, petting, etc.)
6. **Shop**: Buy more food and water with your coins
7. **Settings**: Change your pet type, appearance, or environment anytime
8. **Check In Regularly**: Stats decrease over time, so visit often to keep your pet happy!

## 🐾 Pet-Specific Features

Each pet has unique animations and interactions:

- **🐰 Bunny**: Detailed SVG art, 3 art styles, ear wiggling, tail wagging
- **🦎 Bearded Dragon**: Basks on rock, eats crickets, enjoys heat lamp when happy
- **🦫 Capybara**: Birds land on it, splashes in water, ultimate relaxation
- **🐕 Dog**: Plays with tennis ball, gets treats, shows zoomies when dancing
- **🐱 Cat**: Sits in box, plays with yarn, purrs with hearts
- **🐿️ Squirrel**: Stores acorns, jumps between trees, leaves fall when dancing

## 📱 Deployment to GitHub Pages

### Step 1: Prepare Your Repository

1. Create a new repository on GitHub named `bunny-buddy`
2. Don't initialize it with any files

### Step 2: Update package.json

Edit `package.json` and replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:

```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/bunny-buddy"
```

### Step 3: Deploy

Run these commands in your terminal:

```bash
# Navigate to the project directory
cd bunny-buddy

# Install dependencies
npm install

# Initialize git repository
git init
git add .
git commit -m "Initial commit - Bunny Buddy game"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/bunny-buddy.git

# Push to GitHub
git branch -M main
git push -u origin main

# Deploy to GitHub Pages
npm run deploy
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select the `gh-pages` branch
4. Click **Save**

Your game will be live at: `https://YOUR_GITHUB_USERNAME.github.io/bunny-buddy`

## 🔄 Updating Your Deployed Game

Whenever you make changes:

```bash
git add .
git commit -m "Your update message"
git push
npm run deploy
```

## 📱 Mobile Optimization

The game is fully optimized for mobile devices with:
- Touch-friendly controls
- Responsive layout
- Drag-and-drop gestures
- No zoom on input fields
- Full-screen capable on iOS/Android

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📊 Stat Mechanics

- **Happiness**: Decreases by 5.2% per hour
- **Hunger**: Increases by 16% per hour
- **Thirst**: Increases by 12.5% per hour

Keep your bunny happy, fed, and hydrated by checking in regularly!

## 🎨 Customization Options Per Pet

### 🐰 Bunny
- **Colors**: White, Brown, Gray, Black, Spotted
- **Ear Types**: Floppy, Upright, Lop
- **Eye Colors**: Brown, Blue, Green, Ruby
- **Art Styles**: Enhanced, Chibi, Soft Realistic

### 🦎 Bearded Dragon
- **Colors**: Tan, Orange, Red, Yellow, Sandfire
- **Patterns**: Normal, Hypo, Translucent, Leatherback
- **Eye Colors**: Dark, Orange, Red, Blue

### 🦫 Capybara
- **Colors**: Brown, Reddish-Brown, Gray-Brown, Dark-Brown, Golden
- **Sizes**: Medium, Large, Extra-Large
- **Ear Sizes**: Small, Medium, Large
- **Eye Colors**: Dark-Brown, Black, Amber

### 🐕 Dog
- **Colors**: Golden, Brown, Black, White, Spotted, Tricolor
- **Breed Types**: Retriever, Terrier, Bulldog, Husky, Corgi
- **Eye Colors**: Brown, Blue, Amber, Heterochromia

### 🐱 Cat
- **Colors**: Orange, Gray, Black, White, Calico, Siamese
- **Fur Lengths**: Short, Medium, Long, Fluffy
- **Eye Colors**: Green, Blue, Yellow, Amber

### 🐿️ Squirrel
- **Colors**: Red, Gray, Brown, Black, Albino
- **Tail Bushiness**: Sleek, Medium, Bushy, Extra-Bushy
- **Eye Colors**: Black, Brown, Dark

## 💾 Data Storage

The game uses browser localStorage to save your bunny's progress. Your data persists across sessions but is stored locally on your device.

## 🎯 Future Ideas

- Multiplayer playdates
- More mini-games
- Achievement system
- Different bunny breeds
- Seasonal events

## 📄 License

This project is open source and available for personal use.

## 🐰 Enjoy!

Have fun caring for your virtual bunny buddy! 💕
