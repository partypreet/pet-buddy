import React, { useState, useEffect, useRef } from 'react';
import { Heart, Droplets, Carrot, Home, Users, MessageCircle, Coins, Settings } from 'lucide-react';

export default function PetBuddy() {
  const [gameState, setGameState] = useState('intro');
  const [petType, setPetType] = useState('bunny');
  const [bunnyName, setBunnyName] = useState('');
  const [bunnyConfig, setBunnyConfig] = useState({
    color: 'white',
    size: 'medium',
    earType: 'floppy',
    eyeColor: 'brown',
    style: 'enhanced'
  });
  const [environment, setEnvironment] = useState('farm');
  
  const [stats, setStats] = useState({
    happiness: 50,
    hunger: 50,
    thirst: 50,
    daysSinceCreation: 0,
    lastVisit: Date.now(),
    totalInteractions: 0,
    coins: 100
  });
  
  const [bunnyAnimation, setBunnyAnimation] = useState('idle');
  const [idleGesture, setIdleGesture] = useState('neutral');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inventory, setInventory] = useState({
    carrots: 5,
    lettuce: 5,
    apples: 3,
    water: 10
  });
  
  const audioContextRef = useRef(null);

  // Get customization options based on pet type
  const getPetCustomizationOptions = () => {
    const options = {
      bunny: {
        colors: ['white', 'brown', 'gray', 'black', 'spotted'],
        sizes: ['small', 'medium', 'large'],
        feature1: { label: 'Ear Type', options: ['floppy', 'upright', 'lop'] },
        feature2: { label: 'Eye Color', options: ['brown', 'blue', 'green', 'ruby'] }
      },
      'bearded-dragon': {
        colors: ['tan', 'orange', 'red', 'yellow', 'sandfire'],
        sizes: ['small', 'medium', 'large'],
        feature1: { label: 'Pattern', options: ['normal', 'hypo', 'translucent', 'leatherback'] },
        feature2: { label: 'Eye Color', options: ['dark', 'orange', 'red', 'blue'] }
      },
      capybara: {
        colors: ['brown', 'reddish-brown', 'gray-brown', 'dark-brown', 'golden'],
        sizes: ['medium', 'large', 'extra-large'],
        feature1: { label: 'Ear Size', options: ['small', 'medium', 'large'] },
        feature2: { label: 'Eye Color', options: ['dark-brown', 'black', 'amber'] }
      },
      dog: {
        colors: ['golden', 'brown', 'black', 'white', 'spotted', 'tricolor'],
        sizes: ['small', 'medium', 'large'],
        feature1: { label: 'Breed Type', options: ['retriever', 'terrier', 'bulldog', 'husky', 'corgi'] },
        feature2: { label: 'Eye Color', options: ['brown', 'blue', 'amber', 'heterochromia'] }
      },
      cat: {
        colors: ['orange', 'gray', 'black', 'white', 'calico', 'siamese'],
        sizes: ['small', 'medium', 'large'],
        feature1: { label: 'Fur Length', options: ['short', 'medium', 'long', 'fluffy'] },
        feature2: { label: 'Eye Color', options: ['green', 'blue', 'yellow', 'amber'] }
      },
      squirrel: {
        colors: ['red', 'gray', 'brown', 'black', 'albino'],
        sizes: ['small', 'medium', 'large'],
        feature1: { label: 'Tail Bushiness', options: ['sleek', 'medium', 'bushy', 'extra-bushy'] },
        feature2: { label: 'Eye Color', options: ['black', 'brown', 'dark'] }
      }
    };
    
    return options[petType] || options.bunny;
  };

  const getPetEmoji = () => {
    const emojis = {
      bunny: '🐰',
      'bearded-dragon': '🦎',
      capybara: '🦫',
      dog: '🐕',
      cat: '🐱',
      squirrel: '🐿️'
    };
    return emojis[petType] || '🐰';
  };

  const getPetName = () => {
    const names = {
      bunny: 'Bunny',
      'bearded-dragon': 'Bearded Dragon',
      capybara: 'Capybara',
      dog: 'Dog',
      cat: 'Cat',
      squirrel: 'Squirrel'
    };
    return names[petType] || 'Pet';
  };

  useEffect(() => {
    const loadGame = async () => {
      try {
        const saved = await window.storage.get('bunny-game-state');
        if (saved && saved.value) {
          const data = JSON.parse(saved.value);
          setGameState('game');
          setPetType(data.petType || 'bunny');
          setBunnyName(data.bunnyName);
          setBunnyConfig(data.bunnyConfig);
          setEnvironment(data.environment);
          
          const daysPassed = Math.floor((Date.now() - data.stats.lastVisit) / (1000 * 60 * 60 * 24));
          const hoursPassed = (Date.now() - data.stats.lastVisit) / (1000 * 60 * 60);
          
          // Happiness decreases by 5.2 points per hour (30% faster than 4)
          const happinessDecrease = hoursPassed * 5.2;
          // Hunger increases by 16 points per hour (60% faster than 10)
          const hungerIncrease = hoursPassed * 16;
          // Thirst increases by 12.5 points per hour (25% faster than base 10)
          const thirstIncrease = hoursPassed * 12.5;
          
          setStats({
            ...data.stats,
            daysSinceCreation: data.stats.daysSinceCreation + daysPassed,
            happiness: Math.max(0, data.stats.happiness - happinessDecrease),
            hunger: Math.min(100, data.stats.hunger + hungerIncrease),
            thirst: Math.min(100, data.stats.thirst + thirstIncrease),
            lastVisit: Date.now()
          });
          
          setInventory(data.inventory || inventory);
        }
      } catch (err) {
        console.log('Starting new game');
      }
    };
    loadGame();
  }, []);

  // Real-time happiness, hunger, and thirst degradation
  useEffect(() => {
    if (gameState === 'game') {
      const interval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          happiness: Math.max(0, prev.happiness - (5.2 / 60)), // Decrease 5.2 points per hour (30% faster)
          hunger: Math.min(100, prev.hunger + (16 / 60)), // Increase 16 points per hour (60% faster)
          thirst: Math.min(100, prev.thirst + (12.5 / 60)), // Increase 12.5 points per hour (25% faster)
          lastVisit: Date.now()
        }));
      }, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Idle animation cycle - bunny performs random gestures when idle
  useEffect(() => {
    if (gameState === 'game' && bunnyAnimation === 'idle') {
      const gestures = ['neutral', 'blink', 'smile', 'look-left', 'look-right', 'wiggle-ears', 'tail-wag', 'hop-small', 'nose-twitch'];
      
      const cycleGesture = () => {
        const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
        setIdleGesture(randomGesture);
        
        // Return to neutral after gesture completes
        if (randomGesture !== 'neutral') {
          setTimeout(() => {
            setIdleGesture('neutral');
          }, 1500);
        }
      };
      
      // Change gesture every 3-6 seconds randomly
      const interval = setInterval(cycleGesture, Math.random() * 3000 + 3000);
      
      return () => clearInterval(interval);
    } else if (bunnyAnimation !== 'idle') {
      setIdleGesture('neutral');
    }
  }, [gameState, bunnyAnimation]);

  const saveGame = async () => {
    try {
      await window.storage.set('bunny-game-state', JSON.stringify({
        petType,
        bunnyName,
        bunnyConfig,
        environment,
        stats,
        inventory
      }));
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  useEffect(() => {
    if (gameState === 'game') {
      const interval = setInterval(saveGame, 30000);
      return () => clearInterval(interval);
    }
  }, [gameState, bunnyName, bunnyConfig, environment, stats, inventory]);

  const playSound = (type) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      const sounds = {
        eat: [400, 450, 500],
        drink: [300, 280, 260],
        happy: [523, 659, 784, 1047],
        coin: [523, 659, 784],
        pet: [440, 550],
        jump: [392, 523, 659]
      };
      
      const frequencies = sounds[type] || [440];
      let time = ctx.currentTime;
      
      frequencies.forEach((freq, i) => {
        oscillator.frequency.setValueAtTime(freq, time + i * 0.1);
      });
      
      gainNode.gain.setValueAtTime(0.3, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + frequencies.length * 0.1);
      
      oscillator.start(time);
      oscillator.stop(time + frequencies.length * 0.1 + 0.1);
    } catch (err) {
      console.log('Sound not available');
    }
  };

  const updateStats = (changes, coinReward = 5) => {
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, Math.max(0, prev.happiness + (changes.happiness || 0))),
      hunger: Math.min(100, Math.max(0, prev.hunger + (changes.hunger || 0))),
      thirst: Math.min(100, Math.max(0, prev.thirst + (changes.thirst || 0))),
      totalInteractions: prev.totalInteractions + 1,
      coins: prev.coins + coinReward
    }));
  };

  const feedBunny = (food) => {
    if (inventory[food] <= 0) return;
    
    setInventory(prev => ({ ...prev, [food]: prev[food] - 1 }));
    updateStats({ hunger: -20, happiness: 10 }, 10);
    setBunnyAnimation('eating');
    playSound('eat');
    
    const responses = [
      `Yummy! ${bunnyName} loves ${food}! 🥕`,
      `Nom nom nom! That was delicious!`,
      `${bunnyName} is so happy! More please!`
    ];
    addChatMessage(responses[Math.floor(Math.random() * responses.length)]);
    
    setTimeout(() => setBunnyAnimation('idle'), 2000);
  };

  const giveWater = () => {
    if (inventory.water <= 0) return;
    
    setInventory(prev => ({ ...prev, water: prev.water - 1 }));
    updateStats({ thirst: -25, happiness: 5 }, 5);
    setBunnyAnimation('drinking');
    playSound('drink');
    addChatMessage(`Refreshing! ${bunnyName} feels much better!`);
    setTimeout(() => setBunnyAnimation('idle'), 2000);
  };

  const petBunny = () => {
    updateStats({ happiness: 15 }, 8);
    setBunnyAnimation('happy');
    playSound('pet');
    const responses = [
      `${bunnyName} loves being petted! ❤️`,
      `*purrs* ... wait, bunnies don't purr! *happy bunny sounds*`,
      `This feels amazing!`
    ];
    addChatMessage(responses[Math.floor(Math.random() * responses.length)]);
    setTimeout(() => setBunnyAnimation('idle'), 2000);
  };

  const addChatMessage = (text, isUser = false) => {
    setChatMessages(prev => [...prev, { text, isUser, timestamp: Date.now() }]);
  };

  const handleChatCommand = (command) => {
    const cmd = command.toLowerCase().trim();
    addChatMessage(command, true);
    
    if (cmd === 'jump') {
      setBunnyAnimation('jumping');
      playSound('jump');
      addChatMessage('Wheee! Look how high I can jump! 🐰');
      setTimeout(() => setBunnyAnimation('idle'), 2000);
    } else if (cmd === 'dance') {
      setBunnyAnimation('dancing');
      playSound('happy');
      addChatMessage('🎵 Time to dance! Watch my moves! 💃');
      setTimeout(() => setBunnyAnimation('idle'), 3000);
    } else if (cmd === 'pout') {
      setBunnyAnimation('pouting');
      addChatMessage('😢 But... but...');
      setTimeout(() => setBunnyAnimation('idle'), 2000);
    } else if (cmd === 'rub ears') {
      setBunnyAnimation('ear-rub');
      playSound('pet');
      addChatMessage('Ooh, my ears! That tickles! 😊');
      setTimeout(() => setBunnyAnimation('idle'), 2000);
    } else {
      addChatMessage(`I don't know that trick yet! Try: jump, dance, pout, or rub ears!`);
    }
  };

  const buyItem = (item, cost) => {
    if (stats.coins >= cost) {
      setStats(prev => ({ ...prev, coins: prev.coins - cost }));
      setInventory(prev => ({ ...prev, [item]: (prev[item] || 0) + 5 }));
      playSound('coin');
      addChatMessage(`Thanks for getting me more ${item}! 🎉`);
    }
  };

  const getEnvironmentStyle = () => {
    const styles = {
      farm: {
        background: 'linear-gradient(to bottom, #87CEEB 0%, #E8F4F8 50%, #90EE90 100%)',
        elements: (
          <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
            {/* Sun */}
            <div style={{ position: 'absolute', top: '40px', right: '60px', width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)', boxShadow: '0 0 50px rgba(255, 215, 0, 0.5)' }} />
            {/* Clouds */}
            <div style={{ position: 'absolute', top: '80px', left: '10%', width: '120px', height: '40px', background: 'white', borderRadius: '50px', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '70px', left: '12%', width: '80px', height: '50px', background: 'white', borderRadius: '50px', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '120px', right: '15%', width: '100px', height: '35px', background: 'white', borderRadius: '50px', opacity: 0.8 }} />
            {/* Barn */}
            <div style={{ position: 'absolute', bottom: '100px', left: '50px', width: '120px', height: '100px', background: '#8B4513', borderRadius: '5px' }} />
            <div style={{ position: 'absolute', bottom: '200px', left: '50px', width: '120px', height: '0', borderLeft: '60px solid transparent', borderRight: '60px solid transparent', borderBottom: '60px solid #DC143C' }} />
            {/* Fence */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} style={{ position: 'absolute', bottom: '80px', left: `${30 + i * 60}px`, width: '8px', height: '60px', background: '#8B4513' }} />
            ))}
            {/* Hills */}
            <div style={{ position: 'absolute', bottom: '60px', left: '60%', width: '300px', height: '150px', background: '#7CFC00', borderRadius: '50% 50% 0 0', opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: '60px', right: '10%', width: '200px', height: '100px', background: '#90EE90', borderRadius: '50% 50% 0 0', opacity: 0.7 }} />
          </div>
        )
      },
      desert: {
        background: 'linear-gradient(to bottom, #FFE4B5 0%, #F4A460 50%, #DEB887 100%)',
        elements: (
          <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
            {/* Hot sun */}
            <div style={{ position: 'absolute', top: '30px', right: '80px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, #FF8C00 0%, #FF4500 100%)', boxShadow: '0 0 80px rgba(255, 140, 0, 0.8)' }} />
            {/* Sand dunes */}
            <div style={{ position: 'absolute', bottom: '50px', left: '10%', width: '400px', height: '200px', background: '#F5DEB3', borderRadius: '50% 50% 0 0', opacity: 0.7 }} />
            <div style={{ position: 'absolute', bottom: '30px', right: '15%', width: '350px', height: '180px', background: '#DEB887', borderRadius: '50% 50% 0 0', opacity: 0.8 }} />
            <div style={{ position: 'absolute', bottom: '70px', left: '40%', width: '300px', height: '150px', background: '#EDC9AF', borderRadius: '50% 50% 0 0', opacity: 0.6 }} />
            {/* Cacti */}
            <div style={{ position: 'absolute', bottom: '150px', left: '20%' }}>
              <div style={{ width: '20px', height: '80px', background: '#228B22', borderRadius: '10px' }} />
              <div style={{ position: 'absolute', top: '20px', left: '-20px', width: '20px', height: '30px', background: '#228B22', borderRadius: '10px 10px 0 0', transform: 'rotate(-45deg)' }} />
              <div style={{ position: 'absolute', top: '15px', right: '-20px', width: '20px', height: '35px', background: '#228B22', borderRadius: '10px 10px 0 0', transform: 'rotate(45deg)' }} />
            </div>
            <div style={{ position: 'absolute', bottom: '120px', right: '25%' }}>
              <div style={{ width: '25px', height: '100px', background: '#2E8B57', borderRadius: '12px' }} />
              <div style={{ position: 'absolute', top: '30px', left: '-22px', width: '22px', height: '40px', background: '#2E8B57', borderRadius: '11px 11px 0 0', transform: 'rotate(-30deg)' }} />
            </div>
            {/* Tumbleweeds */}
            <div style={{ position: 'absolute', bottom: '90px', left: '50%', width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #8B7355', opacity: 0.6 }} />
          </div>
        )
      },
      beach: {
        background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 40%, #F0E68C 70%, #DEB887 100%)',
        elements: (
          <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
            {/* Sun */}
            <div style={{ position: 'absolute', top: '50px', right: '100px', width: '90px', height: '90px', borderRadius: '50%', background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)', boxShadow: '0 0 60px rgba(255, 215, 0, 0.6)' }} />
            {/* Seagulls */}
            <div style={{ position: 'absolute', top: '100px', left: '20%', fontSize: '24px' }}>🕊️</div>
            <div style={{ position: 'absolute', top: '80px', right: '30%', fontSize: '20px' }}>🕊️</div>
            {/* Clouds */}
            <div style={{ position: 'absolute', top: '70px', left: '15%', width: '110px', height: '38px', background: 'white', borderRadius: '50px', opacity: 0.9 }} />
            <div style={{ position: 'absolute', top: '110px', right: '20%', width: '90px', height: '32px', background: 'white', borderRadius: '50px', opacity: 0.9 }} />
            {/* Ocean waves */}
            <div style={{ position: 'absolute', bottom: '200px', width: '100%', height: '4px', background: '#1E90FF', opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: '190px', width: '100%', height: '100px', background: 'linear-gradient(to bottom, #4169E1 0%, #1E90FF 100%)', opacity: 0.7 }} />
            {/* Wave details */}
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{ position: 'absolute', bottom: `${200 + i * 15}px`, left: `${i * 20}%`, width: '60px', height: '8px', background: 'white', borderRadius: '50%', opacity: 0.5 }} />
            ))}
            {/* Palm trees */}
            <div style={{ position: 'absolute', bottom: '100px', left: '10%' }}>
              <div style={{ width: '15px', height: '120px', background: '#8B4513', borderRadius: '7px' }} />
              <div style={{ position: 'absolute', top: '-20px', left: '-25px', fontSize: '50px' }}>🌴</div>
            </div>
            <div style={{ position: 'absolute', bottom: '90px', right: '15%' }}>
              <div style={{ width: '18px', height: '140px', background: '#A0522D', borderRadius: '9px' }} />
              <div style={{ position: 'absolute', top: '-25px', left: '-28px', fontSize: '55px' }}>🌴</div>
            </div>
            {/* Beach umbrella */}
            <div style={{ position: 'absolute', bottom: '100px', left: '70%' }}>
              <div style={{ width: '5px', height: '80px', background: '#8B4513', margin: '0 auto' }} />
              <div style={{ position: 'absolute', top: '-5px', left: '-35px', width: '75px', height: '40px', background: 'repeating-linear-gradient(90deg, #FF6347 0px, #FF6347 15px, #FFD700 15px, #FFD700 30px)', borderRadius: '50% 50% 0 0' }} />
            </div>
            {/* Starfish */}
            <div style={{ position: 'absolute', bottom: '80px', right: '40%', fontSize: '25px' }}>⭐</div>
            <div style={{ position: 'absolute', bottom: '70px', left: '50%', fontSize: '20px' }}>🐚</div>
          </div>
        )
      },
      city: {
        background: 'linear-gradient(to bottom, #4A5568 0%, #718096 50%, #A0AEC0 100%)',
        elements: (
          <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
            {/* Moon */}
            <div style={{ position: 'absolute', top: '40px', right: '80px', width: '70px', height: '70px', borderRadius: '50%', background: 'radial-gradient(circle, #F0E68C 0%, #DAA520 100%)', boxShadow: '0 0 40px rgba(240, 230, 140, 0.5)' }} />
            {/* Stars */}
            {[...Array(15)].map((_, i) => (
              <div key={i} style={{ position: 'absolute', top: `${Math.random() * 200 + 40}px`, left: `${Math.random() * 90}%`, fontSize: '12px', color: 'white' }}>✨</div>
            ))}
            {/* Buildings - skyscrapers */}
            <div style={{ position: 'absolute', bottom: '0', left: '5%', width: '80px', height: '250px', background: 'linear-gradient(to bottom, #2D3748 0%, #1A202C 100%)', borderRadius: '5px 5px 0 0' }}>
              {[...Array(10)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', top: `${20 + i * 22}px`, left: '10px', width: '15px', height: '12px', background: '#FFD700', margin: '0 5px' }} />
              ))}
              {[...Array(10)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', top: `${20 + i * 22}px`, right: '10px', width: '15px', height: '12px', background: '#FFD700', margin: '0 5px' }} />
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: '0', left: '20%', width: '100px', height: '300px', background: 'linear-gradient(to bottom, #374151 0%, #1F2937 100%)', borderRadius: '8px 8px 0 0' }}>
              {[...Array(12)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', top: `${25 + i * 22}px`, left: '15px', width: '15px', height: '12px', background: '#FFA500' }} />
              ))}
              {[...Array(12)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', top: `${25 + i * 22}px`, right: '15px', width: '15px', height: '12px', background: '#FFA500' }} />
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: '0', right: '15%', width: '90px', height: '280px', background: 'linear-gradient(to bottom, #4B5563 0%, #374151 100%)', borderRadius: '6px 6px 0 0' }}>
              {[...Array(11)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', top: `${25 + i * 23}px`, left: '12px', width: '14px', height: '13px', background: '#FFD700' }} />
              ))}
              {[...Array(11)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', top: `${25 + i * 23}px`, right: '12px', width: '14px', height: '13px', background: '#FFD700' }} />
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: '0', right: '5%', width: '70px', height: '200px', background: 'linear-gradient(to bottom, #374151 0%, #1F2937 100%)', borderRadius: '4px 4px 0 0' }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', top: `${25 + i * 22}px`, left: '10px', width: '12px', height: '12px', background: '#FFA500' }} />
              ))}
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', top: `${25 + i * 22}px`, right: '10px', width: '12px', height: '12px', background: '#FFA500' }} />
              ))}
            </div>
          </div>
        )
      },
      jungle: {
        background: 'linear-gradient(to bottom, #2F4F4F 0%, #228B22 50%, #006400 100%)',
        elements: (
          <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
            {/* Canopy */}
            <div style={{ position: 'absolute', top: '0', width: '100%', height: '150px', background: 'radial-gradient(ellipse at top, #2F4F4F 0%, transparent 70%)', opacity: 0.6 }} />
            {/* Large leaves */}
            <div style={{ position: 'absolute', top: '50px', left: '5%', fontSize: '80px', opacity: 0.7, transform: 'rotate(-20deg)' }}>🌿</div>
            <div style={{ position: 'absolute', top: '30px', right: '8%', fontSize: '90px', opacity: 0.6, transform: 'rotate(15deg)' }}>🌿</div>
            <div style={{ position: 'absolute', top: '100px', left: '15%', fontSize: '70px', opacity: 0.8, transform: 'rotate(25deg)' }}>🍃</div>
            <div style={{ position: 'absolute', top: '120px', right: '20%', fontSize: '75px', opacity: 0.7, transform: 'rotate(-30deg)' }}>🍃</div>
            {/* Vines */}
            <div style={{ position: 'absolute', top: '0', left: '25%', width: '3px', height: '200px', background: '#2F4F4F', borderRadius: '2px' }} />
            <div style={{ position: 'absolute', top: '0', right: '30%', width: '4px', height: '180px', background: '#228B22', borderRadius: '2px' }} />
            {/* Tropical plants */}
            <div style={{ position: 'absolute', bottom: '80px', left: '10%' }}>
              <div style={{ fontSize: '60px' }}>🌴</div>
            </div>
            <div style={{ position: 'absolute', bottom: '100px', right: '12%' }}>
              <div style={{ fontSize: '55px' }}>🌺</div>
            </div>
            {/* Butterflies */}
            <div style={{ position: 'absolute', top: '150px', left: '40%', fontSize: '25px', animation: 'float 3s ease-in-out infinite' }}>🦋</div>
            <div style={{ position: 'absolute', top: '180px', right: '35%', fontSize: '22px', animation: 'float 4s ease-in-out infinite' }}>🦋</div>
            {/* Ground plants */}
            <div style={{ position: 'absolute', bottom: '50px', left: '20%', fontSize: '40px' }}>🌿</div>
            <div style={{ position: 'absolute', bottom: '60px', right: '25%', fontSize: '45px' }}>🌱</div>
            <div style={{ position: 'absolute', bottom: '40px', left: '50%', fontSize: '35px' }}>🍀</div>
            {/* Flowers */}
            <div style={{ position: 'absolute', bottom: '90px', left: '60%', fontSize: '30px' }}>🌸</div>
            <div style={{ position: 'absolute', bottom: '70px', right: '40%', fontSize: '28px' }}>🌺</div>
          </div>
        )
      },
      bamboo: {
        background: 'linear-gradient(to bottom, #90EE90 0%, #7CFC00 50%, #32CD32 100%)',
        elements: (
          <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
            {/* Bamboo stalks */}
            {[10, 18, 28, 38, 50, 62, 72, 82, 90].map((pos, i) => (
              <div key={i} style={{ position: 'absolute', bottom: '0', left: `${pos}%`, width: '25px', height: `${250 + Math.random() * 100}px`, background: 'linear-gradient(to right, #228B22 0%, #90EE90 50%, #228B22 100%)', borderRadius: '12px' }}>
                <div style={{ position: 'absolute', top: '20%', width: '100%', height: '8px', background: '#2F4F4F', borderRadius: '4px' }} />
                <div style={{ position: 'absolute', top: '45%', width: '100%', height: '8px', background: '#2F4F4F', borderRadius: '4px' }} />
                <div style={{ position: 'absolute', top: '70%', width: '100%', height: '8px', background: '#2F4F4F', borderRadius: '4px' }} />
              </div>
            ))}
            {/* Bamboo leaves at top of stalks */}
            <div style={{ position: 'absolute', top: '40px', left: '12%', fontSize: '45px', color: '#228B22', transform: 'rotate(-20deg)' }}>🎋</div>
            <div style={{ position: 'absolute', top: '30px', left: '30%', fontSize: '50px', color: '#2E8B57', transform: 'rotate(15deg)' }}>🎋</div>
            <div style={{ position: 'absolute', top: '50px', left: '52%', fontSize: '48px', color: '#228B22', transform: 'rotate(-10deg)' }}>🎋</div>
            <div style={{ position: 'absolute', top: '35px', left: '74%', fontSize: '52px', color: '#2E8B57', transform: 'rotate(25deg)' }}>🎋</div>
            <div style={{ position: 'absolute', top: '45px', right: '8%', fontSize: '47px', color: '#228B22', transform: 'rotate(-15deg)' }}>🎋</div>
            {/* Ground foliage */}
            <div style={{ position: 'absolute', bottom: '50px', left: '15%', fontSize: '35px' }}>🌿</div>
            <div style={{ position: 'absolute', bottom: '60px', left: '45%', fontSize: '38px' }}>🌿</div>
            <div style={{ position: 'absolute', bottom: '55px', right: '20%', fontSize: '36px' }}>🌿</div>
            {/* Pandas */}
            <div style={{ position: 'absolute', bottom: '120px', left: '25%', fontSize: '45px' }}>🐼</div>
            <div style={{ position: 'absolute', bottom: '100px', right: '30%', fontSize: '40px' }}>🐼</div>
            {/* Mist effect */}
            <div style={{ position: 'absolute', bottom: '100px', width: '100%', height: '150px', background: 'linear-gradient(to top, rgba(255, 255, 255, 0.3) 0%, transparent 100%)' }} />
          </div>
        )
      },
      forest: {
        background: 'linear-gradient(to bottom, #228B22 0%, #006400 50%, #013220 100%)',
        elements: (
          <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
            {/* Tree trunks */}
            {[8, 22, 35, 48, 62, 75, 88].map((pos, i) => (
              <div key={i} style={{ position: 'absolute', bottom: '0', left: `${pos}%`, width: '35px', height: `${180 + Math.random() * 80}px`, background: 'linear-gradient(to right, #4A2511 0%, #8B4513 50%, #4A2511 100%)', borderRadius: '17px 17px 0 0' }} />
            ))}
            {/* Tree canopies */}
            <div style={{ position: 'absolute', top: '50px', left: '5%', width: '100px', height: '100px', background: 'radial-gradient(circle, #228B22 0%, #006400 100%)', borderRadius: '50%', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '40px', left: '18%', width: '120px', height: '110px', background: 'radial-gradient(circle, #2E8B57 0%, #006400 100%)', borderRadius: '50%', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '30px', left: '32%', width: '110px', height: '105px', background: 'radial-gradient(circle, #228B22 0%, #004d00 100%)', borderRadius: '50%', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '45px', left: '45%', width: '125px', height: '115px', background: 'radial-gradient(circle, #2E8B57 0%, #006400 100%)', borderRadius: '50%', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '35px', left: '59%', width: '115px', height: '108px', background: 'radial-gradient(circle, #228B22 0%, #006400 100%)', borderRadius: '50%', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '50px', left: '72%', width: '108px', height: '100px', background: 'radial-gradient(circle, #2E8B57 0%, #004d00 100%)', borderRadius: '50%', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '40px', right: '5%', width: '120px', height: '112px', background: 'radial-gradient(circle, #228B22 0%, #006400 100%)', borderRadius: '50%', opacity: 0.8 }} />
            {/* Mushrooms */}
            <div style={{ position: 'absolute', bottom: '80px', left: '15%' }}>
              <div style={{ width: '20px', height: '25px', background: '#F5F5DC', borderRadius: '10px 10px 0 0', margin: '0 auto' }} />
              <div style={{ width: '35px', height: '20px', background: '#DC143C', borderRadius: '50% 50% 0 0', marginTop: '-5px', position: 'relative', left: '-7.5px' }}>
                <div style={{ position: 'absolute', top: '5px', left: '8px', width: '6px', height: '6px', background: 'white', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: '5px', right: '8px', width: '6px', height: '6px', background: 'white', borderRadius: '50%' }} />
              </div>
            </div>
            {/* Flowers */}
            <div style={{ position: 'absolute', bottom: '70px', left: '40%', fontSize: '25px' }}>🌼</div>
            <div style={{ position: 'absolute', bottom: '65px', right: '35%', fontSize: '28px' }}>🌸</div>
            <div style={{ position: 'absolute', bottom: '75px', left: '60%', fontSize: '23px' }}>🌻</div>
            {/* Ferns */}
            <div style={{ position: 'absolute', bottom: '50px', left: '25%', fontSize: '40px' }}>🌿</div>
            <div style={{ position: 'absolute', bottom: '55px', right: '25%', fontSize: '42px' }}>🌿</div>
            {/* Birds */}
            <div style={{ position: 'absolute', top: '100px', left: '30%', fontSize: '22px' }}>🐦</div>
            <div style={{ position: 'absolute', top: '80px', right: '28%', fontSize: '20px' }}>🐦</div>
            {/* Deer */}
            <div style={{ position: 'absolute', bottom: '110px', right: '15%', fontSize: '40px' }}>🦌</div>
            {/* Fog effect */}
            <div style={{ position: 'absolute', bottom: '0', width: '100%', height: '200px', background: 'linear-gradient(to top, rgba(255, 255, 255, 0.2) 0%, transparent 100%)' }} />
          </div>
        )
      }
    };
    return styles[environment] || styles.farm;
  };

  const renderPet = () => {
    // If bunny, use the detailed SVG rendering
    if (petType === 'bunny') {
      return renderBunnyStyle();
    }
    
    // For other pets, use enhanced emoji-based rendering with animations
    const sizeMultiplier = bunnyConfig.size === 'small' ? 0.7 : 
                          bunnyConfig.size === 'medium' ? 1 : 
                          bunnyConfig.size === 'large' ? 1.3 : 
                          bunnyConfig.size === 'extra-large' ? 1.5 : 1;
    
    // Different rendering for each pet type
    if (petType === 'bearded-dragon') {
      return (
        <div style={{
          fontSize: `${180 * sizeMultiplier}px`,
          textAlign: 'center',
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.25))',
          transition: 'all 0.3s ease',
          position: 'relative',
          display: 'inline-block'
        }}>
          {/* Main bearded dragon */}
          <div style={{ 
            transform: bunnyAnimation === 'jumping' ? 'translateY(-20px)' : 
                       idleGesture === 'hop-small' ? 'translateY(-10px)' : 'none',
            transition: 'transform 0.3s ease'
          }}>
            🦎
          </div>
          
          {/* Basking rock */}
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.4em',
            opacity: 0.6
          }}>🪨</div>
          
          {/* Heat lamp effect when happy */}
          {bunnyAnimation === 'happy' && (
            <div style={{
              position: 'absolute',
              top: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.5em',
              animation: 'pulse 1s ease-in-out infinite'
            }}>☀️</div>
          )}
          
          {/* Cricket when eating */}
          {bunnyAnimation === 'eating' && (
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '-50px',
              fontSize: '0.3em',
              animation: 'wiggle 0.5s ease-in-out infinite'
            }}>🦗</div>
          )}
          
          {/* Water droplet when drinking */}
          {bunnyAnimation === 'drinking' && (
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '-50px',
              fontSize: '0.4em'
            }}>💧</div>
          )}
          
          {/* Head bob when idle */}
          {idleGesture === 'smile' && (
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.3em'
            }}>👑</div>
          )}
        </div>
      );
    }
    
    if (petType === 'capybara') {
      return (
        <div style={{
          fontSize: `${200 * sizeMultiplier}px`,
          textAlign: 'center',
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.25))',
          transition: 'all 0.3s ease',
          position: 'relative',
          display: 'inline-block'
        }}>
          {/* Main capybara */}
          <div style={{ 
            transform: idleGesture === 'hop-small' ? 'translateY(-10px)' : 'none',
            transition: 'transform 0.3s ease'
          }}>
            🦫
          </div>
          
          {/* Water splash when drinking */}
          {bunnyAnimation === 'drinking' && (
            <>
              <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '-20%',
                fontSize: '0.3em',
                opacity: 0.7
              }}>💦</div>
              <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '-20%',
                fontSize: '0.3em',
                opacity: 0.7
              }}>💦</div>
            </>
          )}
          
          {/* Orange when eating */}
          {bunnyAnimation === 'eating' && (
            <div style={{
              position: 'absolute',
              top: '40%',
              right: '-50px',
              fontSize: '0.4em'
            }}>🍊</div>
          )}
          
          {/* Relaxed with birds when happy */}
          {bunnyAnimation === 'happy' && (
            <>
              <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-30%',
                fontSize: '0.25em',
                animation: 'float 2s ease-in-out infinite'
              }}>🐦</div>
              <div style={{
                position: 'absolute',
                top: '0%',
                right: '-30%',
                fontSize: '0.25em',
                animation: 'float 2s ease-in-out infinite 0.5s'
              }}>🐦</div>
            </>
          )}
          
          {/* Spa day vibes when smiling */}
          {idleGesture === 'smile' && (
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              fontSize: '0.3em'
            }}>🧘</div>
          )}
          
          {/* Grass patch */}
          <div style={{
            position: 'absolute',
            bottom: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.35em',
            opacity: 0.6
          }}>🌿</div>
        </div>
      );
    }
    
    if (petType === 'dog') {
      return (
        <div style={{
          fontSize: `${190 * sizeMultiplier}px`,
          textAlign: 'center',
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.25))',
          transition: 'all 0.3s ease',
          position: 'relative',
          display: 'inline-block'
        }}>
          {/* Main dog */}
          <div style={{ 
            transform: bunnyAnimation === 'jumping' ? 'translateY(-40px) rotate(-10deg)' : 
                       bunnyAnimation === 'dancing' ? 'rotate(15deg)' :
                       idleGesture === 'hop-small' ? 'translateY(-15px)' :
                       idleGesture === 'tail-wag' ? 'rotate(5deg)' : 'none',
            transition: 'transform 0.2s ease'
          }}>
            🐕
          </div>
          
          {/* Ball when playing/happy */}
          {(bunnyAnimation === 'happy' || bunnyAnimation === 'jumping') && (
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              fontSize: '0.4em',
              animation: 'bounce 0.8s ease-in-out infinite'
            }}>🎾</div>
          )}
          
          {/* Treat when eating */}
          {bunnyAnimation === 'eating' && (
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '-50px',
              fontSize: '0.4em'
            }}>🦴</div>
          )}
          
          {/* Water bowl when drinking */}
          {bunnyAnimation === 'drinking' && (
            <div style={{
              position: 'absolute',
              bottom: '0%',
              left: '60%',
              fontSize: '0.35em'
            }}>🥣</div>
          )}
          
          {/* Hearts when petted */}
          {bunnyAnimation === 'happy' && (
            <>
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '-30px',
                fontSize: '0.35em',
                animation: 'float 1.5s ease-in-out infinite'
              }}>❤️</div>
              <div style={{
                position: 'absolute',
                top: '-25px',
                right: '-30px',
                fontSize: '0.35em',
                animation: 'float 1.5s ease-in-out infinite 0.3s'
              }}>❤️</div>
            </>
          )}
          
          {/* Zoomies effect when dancing */}
          {bunnyAnimation === 'dancing' && (
            <>
              <div style={{
                position: 'absolute',
                top: '30%',
                left: '-40px',
                fontSize: '0.3em',
                opacity: 0.5
              }}>💨</div>
              <div style={{
                position: 'absolute',
                bottom: '30%',
                left: '-50px',
                fontSize: '0.25em',
                opacity: 0.4
              }}>💨</div>
            </>
          )}
          
          {/* Paw prints */}
          {idleGesture === 'smile' && (
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '20%',
              fontSize: '0.25em',
              opacity: 0.5
            }}>🐾</div>
          )}
        </div>
      );
    }
    
    if (petType === 'cat') {
      return (
        <div style={{
          fontSize: `${180 * sizeMultiplier}px`,
          textAlign: 'center',
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.25))',
          transition: 'all 0.3s ease',
          position: 'relative',
          display: 'inline-block'
        }}>
          {/* Main cat */}
          <div style={{ 
            transform: bunnyAnimation === 'jumping' ? 'translateY(-30px)' : 
                       bunnyAnimation === 'pouting' ? 'scaleX(-1)' :
                       idleGesture === 'hop-small' ? 'translateY(-12px)' : 'none',
            transition: 'transform 0.3s ease'
          }}>
            🐱
          </div>
          
          {/* Fish when eating */}
          {bunnyAnimation === 'eating' && (
            <div style={{
              position: 'absolute',
              top: '45%',
              right: '-50px',
              fontSize: '0.4em'
            }}>🐟</div>
          )}
          
          {/* Milk when drinking */}
          {bunnyAnimation === 'drinking' && (
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '-50px',
              fontSize: '0.4em'
            }}>🥛</div>
          )}
          
          {/* Purring hearts when happy */}
          {bunnyAnimation === 'happy' && (
            <>
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '-35px',
                fontSize: '0.3em',
                animation: 'float 2s ease-in-out infinite'
              }}>💗</div>
              <div style={{
                position: 'absolute',
                top: '25%',
                right: '-35px',
                fontSize: '0.3em',
                animation: 'float 2s ease-in-out infinite 0.4s'
              }}>💗</div>
              <div style={{
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.25em',
                opacity: 0.7
              }}>💤</div>
            </>
          )}
          
          {/* Yarn ball when playing */}
          {bunnyAnimation === 'dancing' && (
            <div style={{
              position: 'absolute',
              bottom: '10%',
              right: '-45px',
              fontSize: '0.4em',
              animation: 'spin 2s linear infinite'
            }}>🧶</div>
          )}
          
          {/* Blinking eyes */}
          {idleGesture === 'blink' && (
            <div style={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.4em'
            }}>😴</div>
          )}
          
          {/* Sitting on box */}
          <div style={{
            position: 'absolute',
            bottom: '-28px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.45em',
            opacity: 0.5
          }}>📦</div>
        </div>
      );
    }
    
    if (petType === 'squirrel') {
      return (
        <div style={{
          fontSize: `${170 * sizeMultiplier}px`,
          textAlign: 'center',
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.25))',
          transition: 'all 0.3s ease',
          position: 'relative',
          display: 'inline-block'
        }}>
          {/* Main squirrel */}
          <div style={{ 
            transform: bunnyAnimation === 'jumping' ? 'translateY(-35px)' : 
                       bunnyAnimation === 'dancing' ? 'rotate(-15deg)' :
                       idleGesture === 'hop-small' ? 'translateY(-18px)' :
                       idleGesture === 'tail-wag' ? 'scaleX(-1)' : 'none',
            transition: 'transform 0.25s ease'
          }}>
            🐿️
          </div>
          
          {/* Acorn when eating */}
          {bunnyAnimation === 'eating' && (
            <>
              <div style={{
                position: 'absolute',
                top: '40%',
                right: '-45px',
                fontSize: '0.35em'
              }}>🌰</div>
              <div style={{
                position: 'absolute',
                top: '55%',
                right: '-40px',
                fontSize: '0.25em',
                opacity: 0.6
              }}>🌰</div>
            </>
          )}
          
          {/* Water droplet when drinking */}
          {bunnyAnimation === 'drinking' && (
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '-45px',
              fontSize: '0.35em'
            }}>💧</div>
          )}
          
          {/* Jumping between trees */}
          {bunnyAnimation === 'jumping' && (
            <>
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: '-50px',
                fontSize: '0.4em',
                opacity: 0.6
              }}>🌳</div>
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-50px',
                fontSize: '0.4em',
                opacity: 0.6
              }}>🌳</div>
            </>
          )}
          
          {/* Happy with stored nuts */}
          {bunnyAnimation === 'happy' && (
            <>
              <div style={{
                position: 'absolute',
                top: '10%',
                left: '-40px',
                fontSize: '0.25em'
              }}>🌰</div>
              <div style={{
                position: 'absolute',
                top: '20%',
                right: '-40px',
                fontSize: '0.25em'
              }}>🌰</div>
              <div style={{
                position: 'absolute',
                top: '5%',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.3em',
                animation: 'float 1.5s ease-in-out infinite'
              }}>✨</div>
            </>
          )}
          
          {/* Leaves falling when dancing */}
          {bunnyAnimation === 'dancing' && (
            <>
              <div style={{
                position: 'absolute',
                top: '0%',
                left: '-30px',
                fontSize: '0.3em',
                animation: 'fall 2s ease-in infinite',
                opacity: 0.7
              }}>🍂</div>
              <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-30px',
                fontSize: '0.3em',
                animation: 'fall 2s ease-in infinite 0.5s',
                opacity: 0.7
              }}>🍁</div>
            </>
          )}
          
          {/* Tree branch perch */}
          <div style={{
            position: 'absolute',
            bottom: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.5em',
            opacity: 0.5
          }}>🪵</div>
        </div>
      );
    }
    
    // Fallback
    return <div style={{ fontSize: '200px' }}>🐾</div>;
  };

  const getBunnyColor = () => {
    const colors = {
      white: '#FFFFFF',
      brown: '#8B4513',
      gray: '#A9A9A9',
      black: '#2C2C2C',
      spotted: '#FFFFFF'
    };
    return colors[bunnyConfig.color] || colors.white;
  };

  const renderBunnyStyle = () => {
    const color = getBunnyColor();
    const eyeColor = bunnyConfig.eyeColor === 'blue' ? '#4A90E2' : 
                     bunnyConfig.eyeColor === 'green' ? '#50C878' : 
                     bunnyConfig.eyeColor === 'ruby' ? '#E0115F' : '#654321';

    if (bunnyConfig.style === 'chibi') {
      return (
        <svg width="250" height="280" viewBox="0 0 250 280" style={{ 
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.25))',
          transform: bunnyAnimation === 'eating' ? 'rotateZ(-5deg)' : 
                     bunnyAnimation === 'drinking' ? 'rotateZ(5deg)' : 'none',
          transition: 'transform 0.2s ease'
        }}>
          <ellipse cx="125" cy="265" rx="70" ry="12" fill="rgba(0,0,0,0.15)" />
          
          {/* Chibi Ears */}
          {bunnyConfig.earType === 'upright' && (
            <>
              <circle cx="90" cy="60" r="25" fill={color} stroke="#2C2C2C" strokeWidth="3" />
              <circle cx="90" cy="65" r="15" fill="#FFC0CB" />
              <circle cx="160" cy="60" r="25" fill={color} stroke="#2C2C2C" strokeWidth="3" />
              <circle cx="160" cy="65" r="15" fill="#FFC0CB" />
            </>
          )}
          {bunnyConfig.earType === 'floppy' && (
            <>
              <ellipse cx="85" cy="80" rx="22" ry="30" fill={color} stroke="#2C2C2C" strokeWidth="3" transform="rotate(-30 85 80)" />
              <ellipse cx="165" cy="80" rx="22" ry="30" fill={color} stroke="#2C2C2C" strokeWidth="3" transform="rotate(30 165 80)" />
            </>
          )}
          {bunnyConfig.earType === 'lop' && (
            <>
              <circle cx="80" cy="85" r="20" fill={color} stroke="#2C2C2C" strokeWidth="3" />
              <circle cx="170" cy="85" r="20" fill={color} stroke="#2C2C2C" strokeWidth="3" />
            </>
          )}
          
          <circle cx="125" cy="160" r="80" fill={color} stroke="#2C2C2C" strokeWidth="3" />
          <circle cx="125" cy="175" rx="60" ry="60" fill="#FFE4E1" opacity="0.5" />
          
          <circle cx="125" cy="80" r="60" fill={color} stroke="#2C2C2C" strokeWidth="3" />
          
          <ellipse cx="75" cy="90" rx="20" ry="15" fill="#FF69B4" opacity="0.5" />
          <ellipse cx="175" cy="90" rx="20" ry="15" fill="#FF69B4" opacity="0.5" />
          
          <circle cx="105" cy="75" r="15" fill="#2C2C2C" />
          <circle cx="145" cy="75" r="15" fill="#2C2C2C" />
          <circle cx="108" cy="72" r="8" fill="white" />
          <circle cx="148" cy="72" r="8" fill="white" />
          <circle cx="102" cy="78" r="4" fill="white" />
          <circle cx="142" cy="78" r="4" fill="white" />
          
          <circle cx="125" cy="95" r="4" fill="#FFB6C1" />
          
          {bunnyAnimation === 'pouting' ? (
            <path d="M 125 97 Q 120 95 115 97 M 125 97 Q 130 95 135 97" stroke="#2C2C2C" strokeWidth="2.5" fill="none" />
          ) : bunnyAnimation === 'happy' ? (
            <path d="M 115 97 Q 125 102 135 97" stroke="#2C2C2C" strokeWidth="2.5" fill="none" />
          ) : (
            <path d="M 125 97 Q 115 100 110 97 M 125 97 Q 135 100 140 97" stroke="#2C2C2C" strokeWidth="2.5" fill="none" />
          )}
          
          {bunnyAnimation === 'eating' && (
            <g>
              <path d="M 140 110 L 145 105 L 150 110 L 155 105" fill="#FF8C00" stroke="#FF6347" strokeWidth="1.5" />
              <path d="M 150 105 L 148 100 L 152 100" fill="#228B22" />
            </g>
          )}
          
          {bunnyAnimation === 'drinking' && (
            <ellipse cx="130" cy="113" rx="4" ry="6" fill="#87CEEB" opacity="0.7" />
          )}
          
          <line x1="50" y1="88" x2="75" y2="88" stroke="#2C2C2C" strokeWidth="1.5" />
          <line x1="50" y1="94" x2="75" y2="92" stroke="#2C2C2C" strokeWidth="1.5" />
          <line x1="200" y1="88" x2="175" y2="88" stroke="#2C2C2C" strokeWidth="1.5" />
          <line x1="200" y1="94" x2="175" y2="92" stroke="#2C2C2C" strokeWidth="1.5" />
          
          <circle cx="70" cy="140" r="18" fill={color} stroke="#2C2C2C" strokeWidth="3" />
          <circle cx="180" cy="140" r="18" fill={color} stroke="#2C2C2C" strokeWidth="3" />
          
          <ellipse cx="105" cy="235" rx="25" ry="18" fill={color} stroke="#2C2C2C" strokeWidth="3" />
          <ellipse cx="145" cy="235" rx="25" ry="18" fill={color} stroke="#2C2C2C" strokeWidth="3" />
          <circle cx="105" cy="235" r="8" fill="#FFB6C1" />
          <circle cx="145" cy="235" r="8" fill="#FFB6C1" />
          
          <circle cx="125" cy="225" r="28" fill={color} stroke="#2C2C2C" strokeWidth="3" />
          <circle cx="120" cy="220" r="18" fill="white" opacity="0.6" />
          
          {bunnyAnimation === 'happy' && (
            <>
              <path d="M 70 70 Q 70 65 75 65 Q 80 65 80 70 Q 80 75 75 80 L 70 75 Q 65 70 65 65 Q 65 60 70 60 Q 75 60 75 65" fill="#FF69B4" opacity="0.7" />
              <path d="M 175 70 Q 175 65 180 65 Q 185 65 185 70 Q 185 75 180 80 L 175 75 Q 170 70 170 65 Q 170 60 175 60 Q 180 60 180 65" fill="#FF69B4" opacity="0.7" />
            </>
          )}
          
          {bunnyAnimation === 'dancing' && (
            <>
              <text x="60" y="60" fontSize="24" fill="#9370DB">♪</text>
              <text x="180" y="65" fontSize="20" fill="#9370DB">♫</text>
              <text x="70" y="40" fontSize="18" fill="#9370DB">♬</text>
            </>
          )}
          
          <text x="40" y="50" fontSize="20" fill="#FFD700">✨</text>
          <text x="195" y="55" fontSize="18" fill="#FFD700">✨</text>
        </svg>
      );
    }

    if (bunnyConfig.style === 'realistic') {
      return (
        <svg width="250" height="280" viewBox="0 0 250 280" style={{ 
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.25))',
          transform: bunnyAnimation === 'eating' ? 'rotateZ(-5deg)' : 
                     bunnyAnimation === 'drinking' ? 'rotateZ(5deg)' : 'none',
          transition: 'transform 0.2s ease'
        }}>
          <ellipse cx="125" cy="270" rx="65" ry="8" fill="rgba(0,0,0,0.2)" />
          
          {/* Realistic Ears */}
          {bunnyConfig.earType === 'upright' && (
            <>
              <ellipse cx="95" cy="50" rx="18" ry="55" fill={color} stroke="#8B7355" strokeWidth="2" />
              <ellipse cx="95" cy="55" rx="10" ry="40" fill="#FADADD" opacity="0.7" />
              <path d="M 95 30 Q 92 45 95 60" stroke="#DDD" strokeWidth="1" opacity="0.5" />
              <path d="M 100 32 Q 97 47 100 62" stroke="#DDD" strokeWidth="1" opacity="0.5" />
              <ellipse cx="155" cy="50" rx="18" ry="55" fill={color} stroke="#8B7355" strokeWidth="2" />
              <ellipse cx="155" cy="55" rx="10" ry="40" fill="#FADADD" opacity="0.7" />
              <path d="M 155 30 Q 152 45 155 60" stroke="#DDD" strokeWidth="1" opacity="0.5" />
              <path d="M 150 32 Q 147 47 150 62" stroke="#DDD" strokeWidth="1" opacity="0.5" />
            </>
          )}
          {bunnyConfig.earType === 'floppy' && (
            <>
              <path d="M 95 80 Q 70 70 65 100 Q 70 110 85 105" fill={color} stroke="#8B7355" strokeWidth="2.5" />
              <path d="M 95 85 Q 75 80 72 100" fill="#FADADD" opacity="0.5" stroke="none" />
              <path d="M 155 80 Q 180 70 185 100 Q 180 110 165 105" fill={color} stroke="#8B7355" strokeWidth="2.5" />
              <path d="M 155 85 Q 175 80 178 100" fill="#FADADD" opacity="0.5" stroke="none" />
            </>
          )}
          {bunnyConfig.earType === 'lop' && (
            <>
              <ellipse cx="90" cy="95" rx="20" ry="32" fill={color} stroke="#8B7355" strokeWidth="2.5" transform="rotate(-35 90 95)" />
              <ellipse cx="160" cy="95" rx="20" ry="32" fill={color} stroke="#8B7355" strokeWidth="2.5" transform="rotate(35 160 95)" />
            </>
          )}
          
          <ellipse cx="125" cy="175" rx="70" ry="80" fill={color} stroke="#8B7355" strokeWidth="2" />
          <path d="M 85 150 Q 100 160 85 170" stroke="#E0E0E0" strokeWidth="1.5" opacity="0.6" />
          <path d="M 165 150 Q 150 160 165 170" stroke="#E0E0E0" strokeWidth="1.5" opacity="0.6" />
          <ellipse cx="125" cy="185" rx="50" ry="60" fill="#FAFAFA" opacity="0.8" />
          
          <circle cx="125" cy="90" r="48" fill={color} stroke="#8B7355" strokeWidth="2" />
          <circle cx="80" cy="100" r="20" fill="#FAFAFA" opacity="0.6" />
          <circle cx="170" cy="100" r="20" fill="#FAFAFA" opacity="0.6" />
          
          <ellipse cx="105" cy="82" rx="8" ry="11" fill={eyeColor} />
          <ellipse cx="145" cy="82" rx="8" ry="11" fill={eyeColor} />
          <circle cx="107" cy="80" r="3" fill="white" />
          <circle cx="147" cy="80" r="3" fill="white" />
          
          {bunnyAnimation === 'pouting' && (
            <>
              <path d="M 95 75 Q 105 72 115 75" stroke="#8B7355" strokeWidth="2" fill="none" />
              <path d="M 135 75 Q 145 72 155 75" stroke="#8B7355" strokeWidth="2" fill="none" />
            </>
          )}
          {bunnyAnimation === 'happy' && (
            <>
              <path d="M 95 73 Q 105 70 115 73" stroke="#8B7355" strokeWidth="2" fill="none" />
              <path d="M 135 73 Q 145 70 155 73" stroke="#8B7355" strokeWidth="2" fill="none" />
            </>
          )}
          
          <ellipse cx="125" cy="100" rx="6" ry="5" fill="#E5989B" />
          <path d="M 125 100 L 125 105" stroke="#8B7355" strokeWidth="1.5" />
          
          {bunnyAnimation === 'pouting' ? (
            <path d="M 125 105 Q 120 103 115 105 M 125 105 Q 130 103 135 105" stroke="#8B7355" strokeWidth="1.5" fill="none" />
          ) : bunnyAnimation === 'happy' ? (
            <path d="M 115 105 Q 125 110 135 105" stroke="#8B7355" strokeWidth="1.5" fill="none" />
          ) : (
            <path d="M 125 105 Q 118 108 115 107 M 125 105 Q 132 108 135 107" stroke="#8B7355" strokeWidth="1.5" fill="none" />
          )}
          
          {bunnyAnimation === 'eating' && (
            <g>
              <path d="M 140 115 L 145 110 L 150 115 L 155 110" fill="#FF8C00" stroke="#FF6347" strokeWidth="1.5" />
              <path d="M 150 110 L 148 105 L 152 105" fill="#228B22" />
            </g>
          )}
          
          {bunnyAnimation === 'drinking' && (
            <ellipse cx="130" cy="118" rx="4" ry="6" fill="#87CEEB" opacity="0.7" />
          )}
          
          <line x1="55" y1="95" x2="80" y2="94" stroke="#8B7355" strokeWidth="1" />
          <line x1="55" y1="100" x2="80" y2="99" stroke="#8B7355" strokeWidth="1" />
          <line x1="57" y1="105" x2="80" y2="104" stroke="#8B7355" strokeWidth="1" />
          <line x1="195" y1="95" x2="170" y2="94" stroke="#8B7355" strokeWidth="1" />
          <line x1="195" y1="100" x2="170" y2="99" stroke="#8B7355" strokeWidth="1" />
          <line x1="193" y1="105" x2="170" y2="104" stroke="#8B7355" strokeWidth="1" />
          
          <ellipse cx="85" cy="165" rx="22" ry="30" fill={color} stroke="#8B7355" strokeWidth="2" />
          <ellipse cx="165" cy="165" rx="22" ry="30" fill={color} stroke="#8B7355" strokeWidth="2" />
          <ellipse cx="85" cy="175" rx="14" ry="18" fill="#FADADD" opacity="0.5" />
          <ellipse cx="165" cy="175" rx="14" ry="18" fill="#FADADD" opacity="0.5" />
          
          <ellipse cx="105" cy="250" rx="24" ry="16" fill={color} stroke="#8B7355" strokeWidth="2" />
          <ellipse cx="145" cy="250" rx="24" ry="16" fill={color} stroke="#8B7355" strokeWidth="2" />
          <ellipse cx="105" cy="250" rx="16" ry="11" fill="#C9A9A6" opacity="0.6" />
          <ellipse cx="145" cy="250" rx="16" ry="11" fill="#C9A9A6" opacity="0.6" />
          
          <circle cx="125" cy="240" r="22" fill={color} stroke="#8B7355" strokeWidth="2" />
          <circle cx="118" cy="235" r="16" fill="#FAFAFA" opacity="0.7" />
          <path d="M 115 230 Q 120 238 115 246" stroke="#E0E0E0" strokeWidth="1" opacity="0.5" />
          
          {bunnyAnimation === 'happy' && (
            <>
              <path d="M 70 70 Q 70 65 75 65 Q 80 65 80 70 Q 80 75 75 80 L 70 75 Q 65 70 65 65 Q 65 60 70 60 Q 75 60 75 65" fill="#FF69B4" opacity="0.7" />
              <path d="M 175 70 Q 175 65 180 65 Q 185 65 185 70 Q 185 75 180 80 L 175 75 Q 170 70 170 65 Q 170 60 175 60 Q 180 60 180 65" fill="#FF69B4" opacity="0.7" />
            </>
          )}
          
          {bunnyAnimation === 'dancing' && (
            <>
              <text x="60" y="60" fontSize="24" fill="#9370DB">♪</text>
              <text x="180" y="65" fontSize="20" fill="#9370DB">♫</text>
              <text x="70" y="40" fontSize="18" fill="#9370DB">♬</text>
            </>
          )}
        </svg>
      );
    }

    // Enhanced style (default)
    return (
      <svg width="250" height="280" viewBox="0 0 250 280" style={{ 
        filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.25))',
        transform: bunnyAnimation === 'eating' ? 'rotateZ(-5deg)' : 
                   bunnyAnimation === 'drinking' ? 'rotateZ(5deg)' : 'none',
        transition: 'transform 0.2s ease'
      }}>
        <ellipse cx="125" cy="265" rx="60" ry="10" fill="rgba(0,0,0,0.15)" />
        
        {bunnyConfig.earType === 'upright' && (
          <>
            <ellipse cx="95" cy="45" rx="15" ry="50" fill={color} stroke="#2C2C2C" strokeWidth="2.5" 
              style={{ 
                transformOrigin: '95px 80px',
                transform: bunnyAnimation === 'ear-rub' ? 'rotate(-15deg)' : 
                          idleGesture === 'wiggle-ears' ? 'rotate(-8deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}/>
            <ellipse cx="95" cy="50" rx="8" ry="30" fill="#FFB6C1" opacity="0.6" />
            <ellipse cx="155" cy="45" rx="15" ry="50" fill={color} stroke="#2C2C2C" strokeWidth="2.5"
              style={{ 
                transformOrigin: '155px 80px',
                transform: bunnyAnimation === 'ear-rub' ? 'rotate(15deg)' : 
                          idleGesture === 'wiggle-ears' ? 'rotate(8deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}/>
            <ellipse cx="155" cy="50" rx="8" ry="30" fill="#FFB6C1" opacity="0.6" />
          </>
        )}
        {bunnyConfig.earType === 'floppy' && (
          <>
            <path d="M 95 80 Q 70 70 65 100 Q 70 110 85 105" fill={color} stroke="#2C2C2C" strokeWidth="2.5" />
            <path d="M 95 85 Q 75 80 72 100" fill="#FFB6C1" opacity="0.5" stroke="none" />
            <path d="M 155 80 Q 180 70 185 100 Q 180 110 165 105" fill={color} stroke="#2C2C2C" strokeWidth="2.5" />
            <path d="M 155 85 Q 175 80 178 100" fill="#FFB6C1" opacity="0.5" stroke="none" />
          </>
        )}
        {bunnyConfig.earType === 'lop' && (
          <>
            <ellipse cx="90" cy="105" rx="18" ry="28" fill={color} stroke="#2C2C2C" strokeWidth="2.5" transform="rotate(-40 90 105)" />
            <ellipse cx="90" cy="105" rx="10" ry="18" fill="#FFB6C1" opacity="0.5" transform="rotate(-40 90 105)" />
            <ellipse cx="160" cy="105" rx="18" ry="28" fill={color} stroke="#2C2C2C" strokeWidth="2.5" transform="rotate(40 160 105)" />
            <ellipse cx="160" cy="105" rx="10" ry="18" fill="#FFB6C1" opacity="0.5" transform="rotate(40 160 105)" />
          </>
        )}
        
        <ellipse cx="125" cy="180" rx="65" ry="75" fill={color} stroke="#2C2C2C" strokeWidth="2.5" />
        <ellipse cx="125" cy="190" rx="45" ry="55" fill="white" opacity="0.4" />
        
        <circle cx="125" cy="95" r="50" fill={color} stroke="#2C2C2C" strokeWidth="2.5" />
        
        <circle cx="85" cy="105" r="18" fill="#FFB6C1" opacity="0.4" />
        <circle cx="165" cy="105" r="18" fill="#FFB6C1" opacity="0.4" />
        
        {/* Eyes - with idle gesture variations */}
        {idleGesture === 'blink' ? (
          <>
            {/* Closed eyes */}
            <line x1="95" y1="85" x2="115" y2="85" stroke="#2C2C2C" strokeWidth="3" />
            <line x1="135" y1="85" x2="155" y2="85" stroke="#2C2C2C" strokeWidth="3" />
          </>
        ) : idleGesture === 'look-left' ? (
          <>
            <ellipse cx="105" cy="85" rx="10" ry="12" fill="white" />
            <ellipse cx="145" cy="85" rx="10" ry="12" fill="white" />
            <circle cx="102" cy="85" r="8" fill={eyeColor} />
            <circle cx="142" cy="85" r="8" fill={eyeColor} />
            <circle cx="104" cy="82" r="4" fill="white" />
            <circle cx="144" cy="82" r="4" fill="white" />
          </>
        ) : idleGesture === 'look-right' ? (
          <>
            <ellipse cx="105" cy="85" rx="10" ry="12" fill="white" />
            <ellipse cx="145" cy="85" rx="10" ry="12" fill="white" />
            <circle cx="110" cy="85" r="8" fill={eyeColor} />
            <circle cx="150" cy="85" r="8" fill={eyeColor} />
            <circle cx="112" cy="82" r="4" fill="white" />
            <circle cx="152" cy="82" r="4" fill="white" />
          </>
        ) : (
          <>
            {/* Normal eyes */}
            <ellipse cx="105" cy="85" rx="10" ry="12" fill="white" />
            <ellipse cx="145" cy="85" rx="10" ry="12" fill="white" />
            <circle cx="107" cy="85" r="8" fill={eyeColor} />
            <circle cx="147" cy="85" r="8" fill={eyeColor} />
            <circle cx="109" cy="82" r="4" fill="white" />
            <circle cx="149" cy="82" r="4" fill="white" />
            <circle cx="111" cy="88" r="2" fill="white" opacity="0.7" />
            <circle cx="151" cy="88" r="2" fill="white" opacity="0.7" />
          </>
        )}
        
        {/* Eyebrows - vary with idle gestures */}
        {idleGesture === 'smile' && (
          <>
            <path d="M 95 73 Q 105 70 115 73" stroke="#2C2C2C" strokeWidth="2" fill="none" />
            <path d="M 135 73 Q 145 70 155 73" stroke="#2C2C2C" strokeWidth="2" fill="none" />
          </>
        )}
        
        {bunnyAnimation === 'pouting' && (
          <>
            <path d="M 95 75 Q 105 72 115 75" stroke="#2C2C2C" strokeWidth="2" fill="none" />
            <path d="M 135 75 Q 145 72 155 75" stroke="#2C2C2C" strokeWidth="2" fill="none" />
          </>
        )}
        {bunnyAnimation === 'happy' && (
          <>
            <path d="M 95 73 Q 105 70 115 73" stroke="#2C2C2C" strokeWidth="2" fill="none" />
            <path d="M 135 73 Q 145 70 155 73" stroke="#2C2C2C" strokeWidth="2" fill="none" />
          </>
        )}
        
        <path d="M 125 103 L 120 108 L 130 108 Z" fill="#FFB6C1" />
        <circle cx="125" cy="105" r="3" fill="#FFB6C1" />
        
        {/* Nose twitch animation */}
        {idleGesture === 'nose-twitch' && (
          <circle cx="125" cy="105" r="4" fill="#FFB6C1" />
        )}
        
        {/* Mouth - varies with animation and idle gestures */}
        {bunnyAnimation === 'pouting' ? (
          <path d="M 125 108 Q 120 110 115 108 M 125 108 Q 130 110 135 108" stroke="#2C2C2C" strokeWidth="2" fill="none" />
        ) : bunnyAnimation === 'happy' || idleGesture === 'smile' ? (
          <path d="M 115 108 Q 125 115 135 108" stroke="#2C2C2C" strokeWidth="2" fill="none" />
        ) : (
          <path d="M 125 108 L 118 113 M 125 108 L 132 113" stroke="#2C2C2C" strokeWidth="2" fill="none" />
        )}
        
        {bunnyAnimation === 'eating' && (
          <g>
            <path d="M 140 115 L 145 110 L 150 115 L 155 110" fill="#FF8C00" stroke="#FF6347" strokeWidth="1.5" />
            <path d="M 150 110 L 148 105 L 152 105" fill="#228B22" />
          </g>
        )}
        
        {bunnyAnimation === 'drinking' && (
          <ellipse cx="130" cy="118" rx="4" ry="6" fill="#87CEEB" opacity="0.7" />
        )}
        
        <line x1="60" y1="100" x2="85" y2="98" stroke="#2C2C2C" strokeWidth="1.5" />
        <line x1="60" y1="106" x2="85" y2="104" stroke="#2C2C2C" strokeWidth="1.5" />
        <line x1="62" y1="112" x2="85" y2="110" stroke="#2C2C2C" strokeWidth="1.5" />
        <line x1="190" y1="100" x2="165" y2="98" stroke="#2C2C2C" strokeWidth="1.5" />
        <line x1="190" y1="106" x2="165" y2="104" stroke="#2C2C2C" strokeWidth="1.5" />
        <line x1="188" y1="112" x2="165" y2="110" stroke="#2C2C2C" strokeWidth="1.5" />
        
        <ellipse cx="85" cy="170" rx="20" ry="25" fill={color} stroke="#2C2C2C" strokeWidth="2" />
        <ellipse cx="165" cy="170" rx="20" ry="25" fill={color} stroke="#2C2C2C" strokeWidth="2" />
        <ellipse cx="85" cy="180" rx="12" ry="15" fill="white" opacity="0.3" />
        <ellipse cx="165" cy="180" rx="12" ry="15" fill="white" opacity="0.3" />
        
        <ellipse cx="100" cy="245" rx="22" ry="15" fill={color} stroke="#2C2C2C" strokeWidth="2.5" />
        <ellipse cx="150" cy="245" rx="22" ry="15" fill={color} stroke="#2C2C2C" strokeWidth="2.5" />
        
        <ellipse cx="100" cy="245" rx="15" ry="10" fill="#FFB6C1" opacity="0.4" />
        <ellipse cx="150" cy="245" rx="15" ry="10" fill="#FFB6C1" opacity="0.4" />
        <circle cx="95" cy="243" r="3" fill="#FFB6C1" opacity="0.5" />
        <circle cx="100" cy="243" r="3" fill="#FFB6C1" opacity="0.5" />
        <circle cx="105" cy="243" r="3" fill="#FFB6C1" opacity="0.5" />
        <circle cx="145" cy="243" r="3" fill="#FFB6C1" opacity="0.5" />
        <circle cx="150" cy="243" r="3" fill="#FFB6C1" opacity="0.5" />
        <circle cx="155" cy="243" r="3" fill="#FFB6C1" opacity="0.5" />
        
        {/* Tail with wagging animation */}
        <g style={{
          transformOrigin: '125px 235px',
          transform: idleGesture === 'tail-wag' ? 'rotate(10deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s ease'
        }}>
          <circle cx="125" cy="235" r="20" fill={color} stroke="#2C2C2C" strokeWidth="2" />
          <circle cx="120" cy="232" r="14" fill="white" opacity="0.4" />
        </g>
        
        {bunnyAnimation === 'happy' && (
          <>
            <path d="M 70 70 Q 70 65 75 65 Q 80 65 80 70 Q 80 75 75 80 L 70 75 Q 65 70 65 65 Q 65 60 70 60 Q 75 60 75 65" fill="#FF69B4" opacity="0.7" />
            <path d="M 175 70 Q 175 65 180 65 Q 185 65 185 70 Q 185 75 180 80 L 175 75 Q 170 70 170 65 Q 170 60 175 60 Q 180 60 180 65" fill="#FF69B4" opacity="0.7" />
          </>
        )}
        
        {bunnyAnimation === 'dancing' && (
          <>
            <text x="60" y="60" fontSize="24" fill="#9370DB">♪</text>
            <text x="180" y="65" fontSize="20" fill="#9370DB">♫</text>
            <text x="70" y="40" fontSize="18" fill="#9370DB">♬</text>
          </>
        )}
      </svg>
    );
  };

  if (gameState === 'intro') {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive",
        padding: '20px'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '30px',
          backdropFilter: 'blur(10px)',
          maxWidth: '800px',
          width: '100%'
        }}>
          <h1 style={{
            fontSize: '4rem',
            marginBottom: '20px',
            textShadow: '3px 3px 6px rgba(0,0,0,0.3)'
          }}>🐾 Pet Buddy 🐾</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Welcome to your virtual pet adventure!</p>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>Choose your companion and watch them grow!</p>
          
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Choose Your Pet:</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '15px',
            marginBottom: '30px'
          }}>
            {[
              { type: 'bunny', emoji: '🐰', name: 'Bunny' },
              { type: 'bearded-dragon', emoji: '🦎', name: 'Bearded Dragon' },
              { type: 'capybara', emoji: '🦫', name: 'Capybara' },
              { type: 'dog', emoji: '🐕', name: 'Dog' },
              { type: 'cat', emoji: '🐱', name: 'Cat' },
              { type: 'squirrel', emoji: '🐿️', name: 'Squirrel' }
            ].map(pet => (
              <button
                key={pet.type}
                onClick={() => setPetType(pet.type)}
                style={{
                  padding: '20px',
                  fontSize: '3rem',
                  background: petType === pet.type ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'rgba(255, 255, 255, 0.2)',
                  border: petType === pet.type ? '3px solid white' : '3px solid transparent',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div>{pet.emoji}</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{pet.name}</div>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setGameState('customize')}
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              border: 'none',
              padding: '20px 50px',
              fontSize: '1.5rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 'bold',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
            }}
          >
            Start Your Journey
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'customize') {
    const petOptions = getPetCustomizationOptions();
    
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a8e6cf 0%, #ffd3b6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive"
      }}>
        <div style={{
          background: 'white',
          borderRadius: '30px',
          padding: '40px',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <h2 style={{ fontSize: '2.5rem', color: '#667eea', textAlign: 'center', marginBottom: '10px' }}>
            {getPetEmoji()} Create Your {getPetName()}
          </h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
            Customize your perfect companion!
          </p>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '1.3rem', color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>
              {getPetName()} Name
            </label>
            <input
              type="text"
              value={bunnyName}
              onChange={(e) => setBunnyName(e.target.value)}
              placeholder="Enter a cute name..."
              style={{ width: '100%', padding: '15px', fontSize: '1.2rem', border: '3px solid #667eea', borderRadius: '15px', fontFamily: 'inherit' }}
            />
          </div>

          {petType === 'bunny' && (
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '1.3rem', color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>Art Style</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { value: 'enhanced', label: 'Enhanced', emoji: '✨' },
                  { value: 'chibi', label: 'Chibi', emoji: '🌸' },
                  { value: 'realistic', label: 'Soft Realistic', emoji: '🌿' }
                ].map(style => (
                  <button
                    key={style.value}
                    onClick={() => setBunnyConfig(prev => ({ ...prev, style: style.value }))}
                    style={{
                      padding: '15px',
                      border: `3px solid ${bunnyConfig.style === style.value ? '#667eea' : '#ddd'}`,
                      background: bunnyConfig.style === style.value ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                      color: bunnyConfig.style === style.value ? 'white' : '#333',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                      textTransform: 'capitalize'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{style.emoji}</div>
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '1.3rem', color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>Color</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
              {petOptions.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setBunnyConfig(prev => ({ ...prev, color }))}
                  style={{
                    padding: '15px',
                    border: `3px solid ${bunnyConfig.color === color ? '#667eea' : '#ddd'}`,
                    background: bunnyConfig.color === color ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                    color: bunnyConfig.color === color ? 'white' : '#333',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '1.3rem', color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>Size</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
              {petOptions.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setBunnyConfig(prev => ({ ...prev, size }))}
                  style={{
                    padding: '15px',
                    border: `3px solid ${bunnyConfig.size === size ? '#667eea' : '#ddd'}`,
                    background: bunnyConfig.size === size ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                    color: bunnyConfig.size === size ? 'white' : '#333',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '1.3rem', color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>
              {petOptions.feature1.label}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
              {petOptions.feature1.options.map(option => (
                <button
                  key={option}
                  onClick={() => setBunnyConfig(prev => ({ ...prev, earType: option }))}
                  style={{
                    padding: '15px',
                    border: `3px solid ${bunnyConfig.earType === option ? '#667eea' : '#ddd'}`,
                    background: bunnyConfig.earType === option ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                    color: bunnyConfig.earType === option ? 'white' : '#333',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '1.3rem', color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>
              {petOptions.feature2.label}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
              {petOptions.feature2.options.map(option => (
                <button
                  key={option}
                  onClick={() => setBunnyConfig(prev => ({ ...prev, eyeColor: option }))}
                  style={{
                    padding: '15px',
                    border: `3px solid ${bunnyConfig.eyeColor === option ? '#667eea' : '#ddd'}`,
                    background: bunnyConfig.eyeColor === option ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                    color: bunnyConfig.eyeColor === option ? 'white' : '#333',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '1.3rem', color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>Home Environment</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
              {['farm', 'desert', 'beach', 'city', 'jungle', 'bamboo', 'forest'].map(env => (
                <button
                  key={env}
                  onClick={() => setEnvironment(env)}
                  style={{
                    padding: '15px',
                    border: `3px solid ${environment === env ? '#667eea' : '#ddd'}`,
                    background: environment === env ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                    color: environment === env ? 'white' : '#333',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (bunnyName.trim()) {
                setGameState('game');
                saveGame();
              } else {
                alert(`Please give your ${getPetName().toLowerCase()} a name!`);
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              border: 'none',
              padding: '20px 50px',
              fontSize: '1.5rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 'bold',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              width: '100%'
            }}
          >
            Meet {bunnyName || `Your ${getPetName()}`}!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: getEnvironmentStyle().background,
      padding: '20px',
      fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Environment Elements */}
      {getEnvironmentStyle().elements}
      
      {/* Stats Bar */}
      <div style={{
        display: 'flex',
        gap: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '20px',
        borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {[
          { icon: <Heart size={20} />, label: 'Happy', value: stats.happiness, gradient: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)' },
          { icon: <Carrot size={20} />, label: 'Hunger', value: stats.hunger, gradient: 'linear-gradient(90deg, #ffa500 0%, #ff4500 100%)' },
          { icon: <Droplets size={20} />, label: 'Thirst', value: stats.thirst, gradient: 'linear-gradient(90deg, #00bfff 0%, #0080ff 100%)' }
        ].map(stat => (
          <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '200px' }}>
            {stat.icon}
            <div style={{ fontWeight: 'bold', color: '#333' }}>{stat.label}</div>
            <div style={{ flex: 1, height: '20px', background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${stat.value}%`, background: stat.gradient, borderRadius: '10px', transition: 'width 0.5s ease' }} />
            </div>
            <span style={{ fontWeight: 'bold', color: '#333', minWidth: '40px' }}>{Math.round(stat.value)}%</span>
          </div>
        ))}
        <div style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          padding: '10px 20px',
          borderRadius: '15px',
          color: 'white',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Coins size={20} />
          <span>{stats.coins}</span>
        </div>
      </div>

      {/* Info Panel */}
      <div style={{
        position: 'absolute',
        top: '140px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '20px',
        borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#667eea', fontSize: '1.5rem', marginBottom: '10px' }}>{bunnyName}</h3>
        <p style={{ color: '#333', margin: '5px 0' }}>Days together: {stats.daysSinceCreation}</p>
        <p style={{ color: '#333', margin: '5px 0' }}>Interactions: {stats.totalInteractions}</p>
      </div>

      {/* Bunny */}
      <div
        onClick={petBunny}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedItem) {
            if (draggedItem === 'water') giveWater();
            else feedBunny(draggedItem);
            setDraggedItem(null);
          }
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) ${
            bunnyAnimation === 'jumping' ? 'translateY(-80px)' :
            bunnyAnimation === 'dancing' ? 'rotate(10deg)' :
            bunnyAnimation === 'pouting' ? 'scale(0.95)' :
            bunnyAnimation === 'happy' ? 'scale(1.1)' :
            idleGesture === 'hop-small' ? 'translateY(-15px)' :
            ''
          }`,
          cursor: 'pointer',
          transition: idleGesture === 'tail-wag' ? 'none' : 'all 0.3s ease'
        }}
      >
        {renderPet()}
        
        {bunnyAnimation !== 'idle' && (
          <div style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '20px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            animation: 'bounce 0.5s ease infinite',
            textTransform: 'capitalize'
          }}>
            {bunnyAnimation}!
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-5px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes tailWag {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100px) rotate(180deg); opacity: 0; }
        }
      `}</style>

      {/* Action Bar */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '15px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '25px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        flexWrap: 'wrap',
        maxWidth: '90%'
      }}>
        {[
          { icon: <Carrot size={32} />, label: 'Carrots', count: inventory.carrots, key: 'carrots' },
          { icon: <span style={{ fontSize: '32px' }}>🥬</span>, label: 'Lettuce', count: inventory.lettuce, key: 'lettuce' },
          { icon: <span style={{ fontSize: '32px' }}>🍎</span>, label: 'Apples', count: inventory.apples, key: 'apples' },
          { icon: <Droplets size={32} />, label: 'Water', count: inventory.water, key: 'water' }
        ].map(item => (
          <div
            key={item.key}
            draggable
            onDragStart={() => setDraggedItem(item.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
              padding: '15px',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: '15px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            {item.icon}
            <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: 'bold' }}>{item.label}</span>
            <span style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: '#ff4757',
              color: 'white',
              borderRadius: '50%',
              width: '25px',
              height: '25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem'
            }}>{item.count}</span>
          </div>
        ))}
        
        <div
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            padding: '15px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '15px',
            cursor: 'pointer'
          }}
        >
          <MessageCircle size={32} />
          <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: 'bold' }}>Chat</span>
        </div>
        
        <div
          onClick={() => {
            const friend = prompt('Enter your friend\'s bunny name for a playdate!');
            if (friend) {
              updateStats({ happiness: 20 }, 15);
              playSound('happy');
              addChatMessage(`Yay! ${bunnyName} had a wonderful playdate with ${friend}! 🎉`);
            }
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            padding: '15px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '15px',
            cursor: 'pointer'
          }}
        >
          <Users size={32} />
          <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: 'bold' }}>Playdate</span>
        </div>
        
        <div
          onClick={() => {
            const envs = ['farm', 'desert', 'beach', 'city', 'jungle', 'bamboo', 'forest'];
            const newEnv = prompt(`Change environment to: ${envs.join(', ')}`);
            if (newEnv && envs.includes(newEnv)) {
              setEnvironment(newEnv);
              addChatMessage(`Wow! I love my new ${newEnv} home! 🏡`);
            }
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            padding: '15px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '15px',
            cursor: 'pointer'
          }}
        >
          <Home size={32} />
          <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: 'bold' }}>Home</span>
        </div>
        
        <div
          onClick={() => setSettingsOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            padding: '15px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '15px',
            cursor: 'pointer'
          }}
        >
          <Settings size={32} />
          <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: 'bold' }}>Settings</span>
        </div>
      </div>

      {/* Shop */}
      <div style={{
        position: 'absolute',
        top: '140px',
        left: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '20px',
        borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <h4 style={{ color: '#667eea', fontSize: '1.3rem', marginBottom: '10px' }}>🛒 Shop</h4>
        {[
          { item: 'carrots', label: '🥕 5 Carrots', cost: 20 },
          { item: 'lettuce', label: '🥬 5 Lettuce', cost: 20 },
          { item: 'apples', label: '🍎 5 Apples', cost: 30 },
          { item: 'water', label: '💧 5 Water', cost: 10 }
        ].map(shop => (
          <button
            key={shop.item}
            onClick={() => buyItem(shop.item, shop.cost)}
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 'bold',
              marginBottom: '10px',
              display: 'block',
              width: '100%'
            }}
          >
            {shop.label} - {shop.cost} coins
          </button>
        ))}
      </div>

      {/* Chat */}
      {chatOpen && (
        <div style={{
          position: 'fixed',
          right: '20px',
          bottom: '160px',
          width: '350px',
          height: '400px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h4 style={{ fontSize: '1.2rem' }}>Chat with {bunnyName}</h4>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >×</button>
          </div>
          
          <div style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 15px',
                  borderRadius: '15px',
                  maxWidth: '80%',
                  wordWrap: 'break-word',
                  background: msg.isUser ? '#667eea' : '#f0f0f0',
                  color: msg.isUser ? 'white' : '#333',
                  alignSelf: msg.isUser ? 'flex-end' : 'flex-start'
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          
          <div style={{ padding: '15px', borderTop: '2px solid #e0e0e0' }}>
            <input
              type="text"
              placeholder="Try: jump, dance, pout, rub ears..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleChatCommand(e.target.value);
                  e.target.value = '';
                }
              }}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #667eea',
                borderRadius: '12px',
                fontFamily: 'inherit',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div style={{
            padding: '10px 15px',
            background: '#f8f8f8',
            fontSize: '0.85rem',
            color: '#666',
            textAlign: 'center'
          }}>
            Commands: jump, dance, pout, rub ears
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '30px',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setSettingsOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: '#666'
              }}
            >×</button>

            <h2 style={{ fontSize: '2.5rem', color: '#667eea', textAlign: 'center', marginBottom: '30px' }}>⚙️ Settings</h2>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '1.3rem', color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>Pet Type</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px'
              }}>
                {[
                  { type: 'bunny', emoji: '🐰', name: 'Bunny' },
                  { type: 'bearded-dragon', emoji: '🦎', name: 'Dragon' },
                  { type: 'capybara', emoji: '🦫', name: 'Capybara' },
                  { type: 'dog', emoji: '🐕', name: 'Dog' },
                  { type: 'cat', emoji: '🐱', name: 'Cat' },
                  { type: 'squirrel', emoji: '🐿️', name: 'Squirrel' }
                ].map(pet => (
                  <button
                    key={pet.type}
                    onClick={() => setPetType(pet.type)}
                    style={{
                      padding: '12px',
                      border: `3px solid ${petType === pet.type ? '#667eea' : '#ddd'}`,
                      background: petType === pet.type ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                      color: petType === pet.type ? 'white' : '#333',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '0.9rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <div style={{ fontSize: '2rem' }}>{pet.emoji}</div>
                    <div>{pet.name}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '1.3rem', color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>
                {getPetName()} Name
              </label>
              <input
                type="text"
                value={bunnyName}
                onChange={(e) => setBunnyName(e.target.value)}
                placeholder="Enter a cute name..."
                style={{ width: '100%', padding: '15px', fontSize: '1.2rem', border: '3px solid #667eea', borderRadius: '15px', fontFamily: 'inherit' }}
              />
            </div>

            {petType === 'bunny' && (
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '1.3rem', color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>Art Style</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { value: 'enhanced', label: 'Enhanced', emoji: '✨' },
                    { value: 'chibi', label: 'Chibi', emoji: '🌸' },
                    { value: 'realistic', label: 'Soft Realistic', emoji: '🌿' }
                  ].map(style => (
                    <button
                      key={style.value}
                      onClick={() => setBunnyConfig(prev => ({ ...prev, style: style.value }))}
                      style={{
                        padding: '15px',
                        border: `3px solid ${bunnyConfig.style === style.value ? '#667eea' : '#ddd'}`,
                        background: bunnyConfig.style === style.value ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                        color: bunnyConfig.style === style.value ? 'white' : '#333',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        textTransform: 'capitalize'
                      }}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{style.emoji}</div>
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
                      fontSize: '1rem',
                      textTransform: 'capitalize'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{style.emoji}</div>
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {['Fur Color', 'Size', 'Ear Type', 'Eye Color', 'Home Environment'].map((label, idx) => {
              const options = [
                ['white', 'brown', 'gray', 'black', 'spotted'],
                ['small', 'medium', 'large'],
                ['floppy', 'upright', 'lop'],
                ['brown', 'blue', 'green', 'ruby'],
                ['farm', 'desert', 'beach', 'city', 'jungle', 'bamboo', 'forest']
              ][idx];
              const key = ['color', 'size', 'earType', 'eyeColor', 'environment'][idx];
              const isEnv = label === 'Home Environment';
              
              return (
                <div key={label} style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontSize: '1.3rem', color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>{label}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                    {options.map(option => (
                      <button
                        key={option}
                        onClick={() => isEnv ? setEnvironment(option) : setBunnyConfig(prev => ({ ...prev, [key]: option }))}
                        style={{
                          padding: '15px',
                          border: `3px solid ${(isEnv ? environment : bunnyConfig[key]) === option ? '#667eea' : '#ddd'}`,
                          background: (isEnv ? environment : bunnyConfig[key]) === option ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                          color: (isEnv ? environment : bunnyConfig[key]) === option ? 'white' : '#333',
                          borderRadius: '15px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: '1rem',
                          textTransform: 'capitalize'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => {
                setSettingsOpen(false);
                saveGame();
                addChatMessage(`Yay! I love my new look! 🎨✨`);
              }}
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                padding: '20px 50px',
                fontSize: '1.5rem',
                borderRadius: '50px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 'bold',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                width: '100%'
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

