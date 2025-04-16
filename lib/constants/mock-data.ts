export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  size: 'small' | 'medium' | 'large';
  category: string;
  author: string;
  likes: number;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Cosmic Exploration',
    description: 'A journey through the stars',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
    size: 'large',
    category: 'space',
    author: 'Sarah Johnson',
    likes: 1234
  },
  {
    id: 2,
    title: 'Urban Dreams',
    description: 'City lights in the night',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
    size: 'medium',
    category: 'city',
    author: 'Mike Chen',
    likes: 890
  },
  {
    id: 3,
    title: 'Natural Wonders',
    description: 'The beauty of mother nature',
    image: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e',
    size: 'small',
    category: 'nature',
    author: 'Emma Davis',
    likes: 2156
  },
  {
    id: 4,
    title: 'Abstract Thoughts',
    description: 'Where imagination meets reality',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
    size: 'medium',
    category: 'abstract',
    author: 'Alex Turner',
    likes: 1567
  },
  {
    id: 5,
    title: "Ocean's Depth",
    description: 'Mysteries of the deep blue',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
    size: 'large',
    category: 'nature',
    author: 'Lisa Wang',
    likes: 3421
  },
  {
    id: 6,
    title: 'Desert Dreams',
    description: 'Endless horizons of sand',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35',
    size: 'small',
    category: 'nature',
    author: 'Omar Hassan',
    likes: 945
  },
  {
    id: 7,
    title: 'Neon Nights',
    description: 'Electric dreams in the city',
    image: 'https://images.unsplash.com/photo-1545486332-9e0999c535b2',
    size: 'large',
    category: 'city',
    author: 'David Kim',
    likes: 1876
  },
  {
    id: 8,
    title: 'Mountain Peak',
    description: 'Above the clouds',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    size: 'medium',
    category: 'nature',
    author: 'Chris Alpine',
    likes: 2543
  },
  {
    id: 9,
    title: 'Arctic Aurora',
    description: 'Northern lights dancing in the sky',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7',
    size: 'large',
    category: 'nature',
    author: 'Erik Nordic',
    likes: 4521
  },
  {
    id: 10,
    title: 'Tech Future',
    description: "Tomorrow's technology today",
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    size: 'medium',
    category: 'technology',
    author: 'Ray Binary',
    likes: 1832
  },
  {
    id: 11,
    title: 'Vintage Charm',
    description: 'A glimpse into the past',
    image: 'https://images.unsplash.com/photo-1542729779-11d8fe8e25f6',
    size: 'small',
    category: 'retro',
    author: 'Clara Times',
    likes: 2187
  },
  {
    id: 12,
    title: 'Forest Mystique',
    description: 'Hidden secrets of the woods',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969',
    size: 'large',
    category: 'nature',
    author: 'Woodland Walker',
    likes: 3256
  },
  {
    id: 13,
    title: 'Urban Geometry',
    description: 'Patterns in architecture',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
    size: 'medium',
    category: 'architecture',
    author: 'Leo Builder',
    likes: 2456
  },
  {
    id: 14,
    title: 'Neon Portrait',
    description: 'Cyberpunk aesthetics',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b',
    size: 'small',
    category: 'portrait',
    author: 'Nina Cyber',
    likes: 1987
  },
  {
    id: 15,
    title: 'Desert Storm',
    description: "Nature's raw power",
    image: 'https://images.unsplash.com/photo-1508697014387-db70aad34f4d',
    size: 'large',
    category: 'nature',
    author: 'Sam Storm',
    likes: 2854
  },
  {
    id: 16,
    title: 'Minimal Zen',
    description: 'Finding peace in simplicity',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    size: 'medium',
    category: 'minimal',
    author: 'Zen Master',
    likes: 1543
  },
  {
    id: 17,
    title: 'Street Art',
    description: 'Urban expression',
    image: 'https://images.unsplash.com/photo-1532546430529-1be093fd5aaf',
    size: 'large',
    category: 'art',
    author: 'Urban Artist',
    likes: 3421
  },
  {
    id: 18,
    title: 'Ocean Wave',
    description: 'Power of the sea',
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0',
    size: 'medium',
    category: 'nature',
    author: 'Marina Blue',
    likes: 2765
  },
  {
    id: 19,
    title: 'Retro Gaming',
    description: 'Nostalgia in pixels',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
    size: 'small',
    category: 'technology',
    author: 'Pixel Master',
    likes: 1876
  },
  {
    id: 20,
    title: 'Botanical Dreams',
    description: "Nature's patterns",
    image: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236',
    size: 'large',
    category: 'nature',
    author: 'Flora Smith',
    likes: 2198
  },
  {
    id: 21,
    title: 'Tokyo Nights',
    description: 'City that never sleeps',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    size: 'large',
    category: 'city',
    author: 'Tokyo Runner',
    likes: 4532
  },
  {
    id: 22,
    title: 'Industrial Beauty',
    description: 'Finding art in machinery',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
    size: 'medium',
    category: 'industrial',
    author: 'Steel Worker',
    likes: 1654
  },
  {
    id: 23,
    title: 'Sunset Serenity',
    description: 'Golden hour magic',
    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869',
    size: 'large',
    category: 'nature',
    author: 'Sun Chaser',
    likes: 3421
  },
  {
    id: 24,
    title: 'Geometric Dreams',
    description: 'Abstract patterns in nature',
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2',
    size: 'small',
    category: 'abstract',
    author: 'Pattern Pro',
    likes: 1988
  },
  {
    id: 25,
    title: 'Rainy City',
    description: 'Urban poetry in raindrops',
    image: 'https://images.unsplash.com/photo-1493314894560-5c412a56c17c',
    size: 'large',
    category: 'city',
    author: 'Rain Walker',
    likes: 2876
  },
  {
    id: 26,
    title: 'Mountain Lake',
    description: 'Mirror of nature',
    image: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0',
    size: 'medium',
    category: 'nature',
    author: 'Lake Explorer',
    likes: 2345
  },
  {
    id: 27,
    title: 'Tech Minimal',
    description: 'Clean tech aesthetics',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    size: 'small',
    category: 'technology',
    author: 'Tech Minimalist',
    likes: 1765
  },
  {
    id: 28,
    title: 'Urban Wildlife',
    description: 'Nature in the city',
    image: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd',
    size: 'large',
    category: 'nature',
    author: 'City Naturalist',
    likes: 2987
  },
  {
    id: 29,
    title: 'Retro Vibes',
    description: 'Vintage color palette',
    image: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe',
    size: 'medium',
    category: 'retro',
    author: 'Time Traveler',
    likes: 1876
  },
  {
    id: 30,
    title: 'Abstract Flow',
    description: 'Fluid art in motion',
    image: 'https://images.unsplash.com/photo-1541187714594-731deadcd16a',
    size: 'large',
    category: 'abstract',
    author: 'Flow Artist',
    likes: 3421
  },
  {
    id: 31,
    title: 'Desert Night',
    description: 'Stars over sand dunes',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35',
    size: 'medium',
    category: 'nature',
    author: 'Desert Walker',
    likes: 2654
  },
  {
    id: 32,
    title: 'Cyber City',
    description: 'Future metropolitan',
    image: 'https://images.unsplash.com/photo-1515091943-9d5c0ad475af',
    size: 'large',
    category: 'city',
    author: 'Future Visionary',
    likes: 4321
  },
  {
    id: 33,
    title: 'Forest Light',
    description: 'Sunbeams through trees',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969',
    size: 'medium',
    category: 'nature',
    author: 'Light Seeker',
    likes: 2876
  },
  {
    id: 34,
    title: 'Minimal Tech',
    description: 'Clean technology',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    size: 'small',
    category: 'technology',
    author: 'Tech Designer',
    likes: 1987
  },
  {
    id: 35,
    title: 'Urban Jungle',
    description: 'City gardens flourish',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc',
    size: 'large',
    category: 'city',
    author: 'Urban Gardener',
    likes: 3298
  },
  {
    id: 36,
    title: 'Frozen Lake',
    description: 'Winter landscape reflections',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    size: 'medium',
    category: 'nature',
    author: 'Arctic Explorer',
    likes: 2890
  },
  {
    id: 37,
    title: 'Modern Office',
    description: 'Clean lines and productivity',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
    size: 'large',
    category: 'architecture',
    author: 'Corp Architect',
    likes: 1530
  },
  {
    id: 38,
    title: 'Hot Air Balloons',
    description: 'Floating over scenic landscapes',
    image: 'https://images.unsplash.com/photo-1580744704337-940460524171',
    size: 'medium',
    category: 'travel',
    author: 'Sky High',
    likes: 2455
  },
  {
    id: 39,
    title: 'Abstract Metal',
    description: 'Shiny surfaces and textures',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc',
    size: 'small',
    category: 'abstract',
    author: 'Metal Worker',
    likes: 1105
  },
  {
    id: 40,
    title: 'Coastal Road',
    description: 'Driving by the ocean cliffs',
    image: 'https://images.unsplash.com/photo-1517824806704-9040b037703b',
    size: 'large',
    category: 'travel',
    author: 'Road Tripper',
    likes: 3120
  },
  {
    id: 41,
    title: 'Retro Console',
    description: 'Classic gaming machine',
    image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb',
    size: 'small',
    category: 'retro',
    author: 'Gamer Oldschool',
    likes: 980
  },
  {
    id: 42,
    title: 'Jungle Canopy',
    description: 'Lush green leaves overhead',
    image: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1',
    size: 'medium',
    category: 'nature',
    author: 'Jane Jungle',
    likes: 2350
  },
  {
    id: 43,
    title: 'Skyscraper View',
    description: 'Looking down from the top',
    image: 'https://images.unsplash.com/photo-1523978591478-c753949ff840',
    size: 'large',
    category: 'city',
    author: 'High Flyer',
    likes: 2999
  },
  {
    id: 44,
    title: 'Food Market',
    description: 'Colorful spices and produce',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    size: 'medium',
    category: 'food',
    author: 'Chef Ramsey',
    likes: 1750
  },
  {
    id: 45,
    title: 'Wild Horses',
    description: 'Running free on the plains',
    image: 'https://images.unsplash.com/photo-1577824463206-940376b5c26f',
    size: 'large',
    category: 'animals',
    author: 'Wild Life',
    likes: 3510
  },
  {
    id: 46,
    title: 'Abstract Waves',
    description: 'Fluid motion in color',
    image: 'https://images.unsplash.com/photo-1552083375-1447ce886485',
    size: 'small',
    category: 'abstract',
    author: 'Fluid Artist',
    likes: 1240
  },
  {
    id: 47,
    title: 'Library Silence',
    description: 'Knowledge stacked high',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da',
    size: 'medium',
    category: 'interiors',
    author: 'Book Worm',
    likes: 1995
  },
  {
    id: 48,
    title: 'Mountain Road',
    description: 'Winding through the peaks',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    size: 'large',
    category: 'nature',
    author: 'Peak Climber',
    likes: 3015
  },
  {
    id: 49,
    title: 'Drone Shot',
    description: 'Birds eye view of the coast',
    image: 'https://images.unsplash.com/photo-1526779259212-939e64788e3c',
    size: 'medium',
    category: 'travel',
    author: 'Aerial Ace',
    likes: 2678
  },
  {
    id: 50,
    title: 'Coffee Beans',
    description: 'Aroma of the morning',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
    size: 'small',
    category: 'food',
    author: 'Barista Bob',
    likes: 1345
  },
  {
    id: 51,
    title: 'Neon Sign',
    description: 'Glowing city light',
    image: 'https://images.unsplash.com/photo-1572695435037-0d939a526abb',
    size: 'small',
    category: 'city',
    author: 'Night Owl',
    likes: 1688
  },
  {
    id: 52,
    title: 'Foggy Forest',
    description: 'Misty morning woods',
    image: 'https://images.unsplash.com/photo-1488866022504-f2584929ca5f',
    size: 'large',
    category: 'nature',
    author: 'Misty Hiker',
    likes: 2955
  },
  {
    id: 53,
    title: 'Guitar Close-up',
    description: 'Strings and wood grain',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1',
    size: 'medium',
    category: 'music',
    author: 'Rock Star',
    likes: 2110
  },
  {
    id: 54,
    title: 'Autumn Leaves',
    description: 'Colors of the fall season',
    image: 'https://images.unsplash.com/photo-1476842634003-7dcca8f832de',
    size: 'medium',
    category: 'nature',
    author: 'Fall Fanatic',
    likes: 2490
  },
  {
    id: 55,
    title: 'Surfer Wave',
    description: 'Riding the ocean current',
    image: 'https://images.unsplash.com/photo-1580901369227-308f6f40d547',
    size: 'large',
    category: 'sports',
    author: 'Wave Rider',
    likes: 2780
  },
  {
    id: 56,
    title: 'Minimalist Plant',
    description: 'Greenery in simple setting',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411',
    size: 'small',
    category: 'minimal',
    author: 'Plant Parent',
    likes: 1420
  },
  {
    id: 57,
    title: 'Train Tracks',
    description: 'Journey to the horizon',
    image: 'https://images.unsplash.com/photo-1506787436749-e6e7a48a3825',
    size: 'medium',
    category: 'travel',
    author: 'Traveler X',
    likes: 2055
  },
  {
    id: 58,
    title: 'Space Nebula',
    description: 'Colorful cosmic clouds',
    image: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47',
    size: 'large',
    category: 'space',
    author: 'Astro Annie',
    likes: 3890
  },
  {
    id: 59,
    title: 'City Rooftops',
    description: 'Overlooking the urban sprawl',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
    size: 'medium',
    category: 'city',
    author: 'Urban Explorer',
    likes: 2230
  },
  {
    id: 60,
    title: 'Abstract Paint',
    description: 'Mixing colors on canvas',
    image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5',
    size: 'small',
    category: 'art',
    author: 'Painter Pete',
    likes: 1770
  }
];

// Additional 30 images for virtualization testing
export const additionalGalleryItems: GalleryItem[] = [
  {
    id: 61,
    title: 'Mountain Summit',
    description: 'Breathtaking view from the peak',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    size: 'large',
    category: 'nature',
    author: 'Peak Climber',
    likes: 4231
  },
  {
    id: 62,
    title: 'Coastal Sunset',
    description: 'Golden hour by the beach',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    size: 'medium',
    category: 'nature',
    author: 'Beach Wanderer',
    likes: 3567
  },
  {
    id: 63,
    title: 'Tech Workspace',
    description: 'Modern productivity setup',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    size: 'small',
    category: 'technology',
    author: 'Tech Nomad',
    likes: 2134
  },
  {
    id: 64,
    title: 'City Skyline Night',
    description: 'Urban landscape after dark',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
    size: 'large',
    category: 'city',
    author: 'Night Owl',
    likes: 3978
  },
  {
    id: 65,
    title: 'Desert Oasis',
    description: 'Water in the midst of sand',
    image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0',
    size: 'medium',
    category: 'nature',
    author: 'Desert Wanderer',
    likes: 1876
  },
  {
    id: 66,
    title: 'Abstract Patterns',
    description: 'Mesmerizing geometric shapes',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
    size: 'small',
    category: 'abstract',
    author: 'Pattern Master',
    likes: 2354
  },
  {
    id: 67,
    title: 'Vintage Car',
    description: 'Classic automobile beauty',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2',
    size: 'large',
    category: 'retro',
    author: 'Classic Collector',
    likes: 3241
  },
  {
    id: 68,
    title: 'Underwater World',
    description: 'Exploring ocean depths',
    image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab',
    size: 'medium',
    category: 'nature',
    author: 'Marine Explorer',
    likes: 2876
  },
  {
    id: 69,
    title: 'Space Galaxy',
    description: 'Distant stars and cosmic dust',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
    size: 'large',
    category: 'space',
    author: 'Star Gazer',
    likes: 4532
  },
  {
    id: 70,
    title: 'Forest Pathway',
    description: 'Journey through ancient woods',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b',
    size: 'medium',
    category: 'nature',
    author: 'Woodland Guide',
    likes: 1987
  },
  {
    id: 71,
    title: 'Minimalist Interior',
    description: 'Clean lines and open space',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85',
    size: 'small',
    category: 'minimal',
    author: 'Interior Designer',
    likes: 2543
  },
  {
    id: 72,
    title: 'Tokyo Streets',
    description: 'Bustling urban pathways',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
    size: 'large',
    category: 'city',
    author: 'Urban Explorer',
    likes: 3654
  },
  {
    id: 73,
    title: 'Coffee Art',
    description: 'Latte foam creativity',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    size: 'medium',
    category: 'food',
    author: 'Barista Pro',
    likes: 1765
  },
  {
    id: 74,
    title: 'Snow Peak',
    description: 'Winter mountain landscape',
    image: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e',
    size: 'large',
    category: 'nature',
    author: 'Winter Climber',
    likes: 2987
  },
  {
    id: 75,
    title: 'Retro Camera',
    description: 'Vintage photography equipment',
    image: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848',
    size: 'small',
    category: 'retro',
    author: 'Film Photographer',
    likes: 1432
  },
  {
    id: 76,
    title: 'Sunrise Mountains',
    description: 'First light on the peaks',
    image: 'https://images.unsplash.com/photo-1455156218388-5e61b526818b',
    size: 'large',
    category: 'nature',
    author: 'Dawn Hiker',
    likes: 3876
  },
  {
    id: 77,
    title: 'Geometric Building',
    description: 'Modern architectural marvel',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
    size: 'medium',
    category: 'architecture',
    author: 'Structure Critic',
    likes: 2354
  },
  {
    id: 78,
    title: 'Rainy Window',
    description: 'Droplets on glass cityscape',
    image: 'https://images.unsplash.com/photo-1501999635878-71cb5379c2d8',
    size: 'small',
    category: 'city',
    author: 'Rain Walker',
    likes: 1876
  },
  {
    id: 79,
    title: 'Northern Lights',
    description: 'Aurora borealis display',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7',
    size: 'large',
    category: 'nature',
    author: 'Arctic Explorer',
    likes: 4298
  },
  {
    id: 80,
    title: 'Futuristic Tech',
    description: "Tomorrow's innovations",
    image: 'https://images.unsplash.com/photo-1478358161113-b0e11994a36b',
    size: 'medium',
    category: 'technology',
    author: 'Future Thinker',
    likes: 2765
  },
  {
    id: 81,
    title: 'Autumn Path',
    description: 'Fall colors in the forest',
    image: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891',
    size: 'large',
    category: 'nature',
    author: 'Seasonal Walker',
    likes: 3421
  },
  {
    id: 82,
    title: 'Vinyl Collection',
    description: 'Classic record albums',
    image: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1',
    size: 'small',
    category: 'retro',
    author: 'Music Collector',
    likes: 1987
  },
  {
    id: 83,
    title: 'Coastal Cliffs',
    description: 'Dramatic ocean meeting land',
    image: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1',
    size: 'medium',
    category: 'nature',
    author: 'Coastal Hiker',
    likes: 2876
  },
  {
    id: 84,
    title: 'Neon District',
    description: 'Vibrant night in the city',
    image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f',
    size: 'large',
    category: 'city',
    author: 'Night Crawler',
    likes: 3654
  },
  {
    id: 85,
    title: 'Abstract Colors',
    description: 'Spectrum of fluid paint',
    image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb',
    size: 'small',
    category: 'abstract',
    author: 'Color Artist',
    likes: 1543
  },
  {
    id: 86,
    title: 'Desert Road',
    description: 'Highway through arid landscape',
    image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a',
    size: 'medium',
    category: 'travel',
    author: 'Road Tripper',
    likes: 2198
  },
  {
    id: 87,
    title: 'Starry Night',
    description: 'Milky way over mountains',
    image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45',
    size: 'large',
    category: 'space',
    author: 'Night Photographer',
    likes: 4321
  },
  {
    id: 88,
    title: 'Ancient Ruins',
    description: 'Historic structures standing tall',
    image: 'https://images.unsplash.com/photo-1526582720660-76b25c65613d',
    size: 'medium',
    category: 'travel',
    author: 'History Buff',
    likes: 2654
  },
  {
    id: 89,
    title: 'Misty Lake',
    description: 'Foggy morning by the water',
    image: 'https://images.unsplash.com/photo-1477322524744-0eece9e79640',
    size: 'large',
    category: 'nature',
    author: 'Lake Explorer',
    likes: 3187
  },
  {
    id: 90,
    title: 'Retro Diner',
    description: 'Classic Americana eatery',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
    size: 'small',
    category: 'retro',
    author: 'Vintage Foodie',
    likes: 1876
  }
];

// Combine original and additional items for testing virtualization
export const extendedGalleryItems: GalleryItem[] = [
  ...galleryItems,
  ...additionalGalleryItems
];
