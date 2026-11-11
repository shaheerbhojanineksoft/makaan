/**
 * Dummy Instagram-style property reels for `/reels` (frontend-only).
 * Videos are local 1080p clips under /public/reels (HD, smoother playback).
 */
export const DUMMY_REELS = [
  {
    id: 'reel-1',
    title: 'DHA Phase 6 Villa Walkthrough',
    location: 'Karachi · DHA Phase 6',
    caption: 'Soft-launch villa tour — lawn, servant quarter and evening lighting done right.',
    hashtags: ['#DHA', '#KarachiHomes', '#MakaanReels'],
    music: 'Evening Keys · Makaan Audio',
    likes: 12840,
    comments: 312,
    shares: 96,
    verified: true,
    creator: {
      name: 'Raza Estates',
      username: 'raza.estates',
      avatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    },
    poster:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80',
    video: '/reels/villa.mp4?v=hd2',
    audio: '/reels/audio/soft1.wav',
    sampleComments: [
      {
        id: 'c1',
        user: 'sara.khan',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        text: 'Layout looks clean — is possession ready?',
        time: '2h',
      },
      {
        id: 'c2',
        user: 'ali.buys',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        text: 'Need price range for 4 bed units please.',
        time: '5h',
      },
    ],
  },
  {
    id: 'reel-2',
    title: 'Bahria Town Apartment Tour',
    location: 'Islamabad · Bahria Town',
    caption: 'Ready 2 bed apartment with open kitchen, covered parking and park view.',
    hashtags: ['#BahriaTown', '#Islamabad', '#Apartments'],
    music: 'City Soft Beat · Makaan Audio',
    likes: 8920,
    comments: 188,
    shares: 54,
    verified: true,
    creator: {
      name: 'Capital Homes',
      username: 'capital.homes',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    },
    poster:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    video: '/reels/living.mp4?v=hd2',
    audio: '/reels/audio/soft2.wav',
    sampleComments: [
      {
        id: 'c1',
        user: 'nadia.r',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
        text: 'Love the kitchen light — monthly rent?',
        time: '1h',
      },
    ],
  },
  {
    id: 'reel-3',
    title: 'Modern Living Room Reveal',
    location: 'Lahore · Gulberg',
    caption: 'Investor-ready corner plot vibe with boulevard access and high footfall.',
    hashtags: ['#Lahore', '#Gulberg', '#Plots'],
    music: 'Warm Piano Loop · Makaan Audio',
    likes: 15402,
    comments: 421,
    shares: 120,
    verified: false,
    creator: {
      name: 'Gulberg Desk',
      username: 'gulberg.desk',
      avatar:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    },
    poster:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    video: '/reels/lobby.mp4?v=hd2',
    audio: '/reels/audio/soft3.wav',
    sampleComments: [
      {
        id: 'c1',
        user: 'hamza.m',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
        text: 'Size and facing details please.',
        time: '3h',
      },
    ],
  },
  {
    id: 'reel-4',
    title: 'Clifton Sea-View Flat',
    location: 'Karachi · Clifton',
    caption: 'Furnished sea-view floors with steady rental demand and quick lease cycles.',
    hashtags: ['#Clifton', '#SeaView', '#Rentals'],
    music: 'Ocean Soft · Makaan Audio',
    likes: 21044,
    comments: 560,
    shares: 201,
    verified: true,
    creator: {
      name: 'Clifton Desk',
      username: 'clifton.desk',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    },
    poster:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
    video: '/reels/exterior.mp4?v=hd2',
    audio: '/reels/audio/soft4.wav',
    sampleComments: [
      {
        id: 'c1',
        user: 'mira.s',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
        text: 'Is parking reserved with the unit?',
        time: '40m',
      },
    ],
  },
  {
    id: 'reel-5',
    title: 'Luxury Interior Detail Shot',
    location: 'Islamabad · F-7',
    caption: 'Premium finishes walkthrough for buyers shortlisting F-series inventory.',
    hashtags: ['#Islamabad', '#F7', '#LuxuryHomes'],
    music: 'Soft House Tour · Makaan Audio',
    likes: 6733,
    comments: 149,
    shares: 38,
    verified: true,
    creator: {
      name: 'Blue Area Realty',
      username: 'bluearea.realty',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    poster:
      'https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=900&q=80',
    video: '/reels/interior.mp4?v=hd2',
    audio: '/reels/audio/soft5.wav',
    sampleComments: [
      {
        id: 'c1',
        user: 'zainab.k',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        text: 'Cabinet finish looks premium',
        time: '6h',
      },
    ],
  },
]
