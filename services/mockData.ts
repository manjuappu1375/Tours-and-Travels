
import { Tour, User, Booking, Review, DailyItinerary } from '../types';

export const MOCK_REVIEWS: Review[] = [
    { _id: 'r1', user: 'u2', name: 'Jane Doe', rating: 5, comment: 'Absolutely breathtaking! A must-do experience.', createdAt: '2023-06-15' },
    { _id: 'r2', user: 'u3', name: 'Sam Wilson', rating: 4, comment: 'Great tour, well organized. The guide was fantastic.', createdAt: '2023-06-18' },
];

export const MOCK_TOURS: Tour[] = [
  {
    _id: '1',
    title: 'Kerala Backwaters Cruise',
    location: 'Alleppey',
    state: 'Kerala',
    price: 14500,
    duration: 3,
    description: 'Experience the serene backwaters of Kerala on a traditional houseboat. Enjoy lush green landscapes, tranquil canals, and delicious local cuisine.',
    images: ['https://picsum.photos/seed/kerala/800/600', 'https://picsum.photos/seed/kerala2/800/600'],
    category: 'Relaxation',
    reviews: MOCK_REVIEWS,
    rating: 4.8,
    numReviews: MOCK_REVIEWS.length,
    // FIX: Added missing itinerary property.
    itinerary: [
      { day: 1, title: 'Arrival & Houseboat Check-in', description: 'Arrive in Alleppey and check into your private houseboat. Enjoy a delicious lunch as you begin your cruise.' },
      { day: 2, title: 'Village Tour & Canoeing', description: 'Explore a local village, interact with the residents, and enjoy a peaceful canoe ride through narrow canals.' },
      { day: 3, title: 'Sunrise Cruise & Departure', description: 'Wake up to a beautiful sunrise over the backwaters. Enjoy breakfast before disembarking.' },
    ],
  },
  {
    _id: '2',
    title: 'Ooty Hills Getaway',
    location: 'Ooty',
    state: 'Tamil Nadu',
    price: 12000,
    duration: 4,
    description: 'Escape to the "Queen of Hill Stations". This getaway offers stunning views of rolling hills, tea gardens, and colonial architecture.',
    images: ['https://picsum.photos/seed/ooty/800/600', 'https://picsum.photos/seed/ooty2/800/600'],
    category: 'Nature',
    reviews: [],
    rating: 4.6,
    numReviews: 0,
    // FIX: Added missing itinerary property.
    itinerary: [
      { day: 1, title: 'Arrival in Ooty', description: 'Check into your hotel and enjoy a walk around Ooty Lake in the evening.' },
      { day: 2, title: 'Botanical Gardens & Doddabetta Peak', description: 'Visit the Government Botanical Garden and then head to Doddabetta Peak for panoramic views.' },
      { day: 3, title: 'Toy Train & Tea Museum', description: 'Take a ride on the Nilgiri Mountain Railway toy train. Visit a tea factory and museum.' },
      { day: 4, title: 'Departure', description: 'Enjoy a final breakfast before departing from Ooty.' },
    ],
  },
  {
    _id: '3',
    title: 'Coorg Coffee Estate Retreat',
    location: 'Coorg',
    state: 'Karnataka',
    price: 11000,
    duration: 3,
    description: 'Discover the "Scotland of India". Stay amidst lush coffee plantations, learn about the coffee-making process, and enjoy the misty landscapes.',
    images: ['https://picsum.photos/seed/coorg/800/600', 'https://picsum.photos/seed/coorg2/800/600'],
    category: 'Relaxation',
    reviews: MOCK_REVIEWS,
    rating: 4.7,
    numReviews: MOCK_REVIEWS.length,
    // FIX: Added missing itinerary property.
    itinerary: [
        { day: 1, title: 'Arrival in Coorg', description: 'Check into your resort and relax. Evening visit to Raja\'s Seat to watch the sunset.' },
        { day: 2, title: 'Coffee Plantations & Abbey Falls', description: 'Take a guided tour of a coffee estate. Later, visit the cascading Abbey Falls and the Dubare Elephant Camp.' },
        { day: 3, title: 'Talacauvery & Departure', description: 'Visit Talacauvery, the origin of the river Cauvery, before departing.' },
    ],
  },
  {
    _id: '4',
    title: 'Pondicherry French Quarters',
    location: 'Pondicherry',
    state: 'Puducherry',
    price: 9500,
    duration: 2,
    description: 'Explore the charming French Quarter of Pondicherry with its colonial villas, beautiful beaches, and spiritual ashrams.',
    images: ['https://picsum.photos/seed/pondi/800/600', 'https://picsum.photos/seed/pondi2/800/600'],
    category: 'Cultural',
    reviews: [],
    rating: 4.5,
    numReviews: 0,
    // FIX: Added missing itinerary property.
    itinerary: [
        { day: 1, title: 'French Quarter Walk & Beach', description: 'Explore the White Town (French Quarter) on foot. In the evening, relax at Promenade Beach.' },
        { day: 2, title: 'Auroville & Departure', description: 'Visit the experimental township of Auroville and the Matrimandir viewpoint before departing.' },
    ],
  },
  {
    _id: '5',
    title: 'Royal Rajasthan Desert Safari',
    location: 'Jaisalmer',
    state: 'Rajasthan',
    price: 18000,
    duration: 5,
    description: 'Explore the golden sands of the Thar Desert. Enjoy camel safaris, stay in desert camps under the stars, and witness the majestic forts of Jaisalmer.',
    images: ['https://picsum.photos/seed/rajasthan/800/600', 'https://picsum.photos/seed/rajasthan2/800/600'],
    category: 'Adventure',
    reviews: [],
    rating: 4.9,
    numReviews: 0,
    // FIX: Added missing itinerary property.
    itinerary: [
        { day: 1, title: 'Arrival in Jaisalmer', description: 'Arrive in the Golden City, check-in, and explore the local markets.' },
        { day: 2, title: 'Jaisalmer Fort & Havelis', description: 'Visit the living Jaisalmer Fort, Patwon Ki Haveli, and Salim Singh Ki Haveli.' },
        { day: 3, title: 'Desert Safari & Camp Stay', description: 'Drive to the Sam Sand Dunes for a camel safari. Enjoy a cultural evening and overnight stay at a desert camp.' },
        { day: 4, title: 'Kuldhara Village & Return', description: 'Visit the abandoned village of Kuldhara on your way back to Jaisalmer.' },
        { day: 5, title: 'Departure', description: 'After breakfast, depart from Jaisalmer.' },
    ],
  },
  {
    _id: '6',
    title: 'Goa Beach Paradise',
    location: 'North Goa',
    state: 'Goa',
    price: 15000,
    duration: 5,
    description: 'Relax on the sun-kissed beaches of North Goa, enjoy vibrant nightlife, and savor delicious seafood. This package is all about sun, sand, and sea.',
    images: ['https://picsum.photos/seed/goa/800/600', 'https://picsum.photos/seed/goa2/800/600'],
    category: 'Relaxation',
    reviews: [],
    rating: 4.7,
    numReviews: 0,
    // FIX: Added missing itinerary property.
    itinerary: [
        { day: 1, title: 'Arrival in Goa', description: 'Arrive in Goa and check into your hotel near Calangute beach. Relax and explore the vicinity.' },
        { day: 2, title: 'North Goa Beaches', description: 'Explore famous beaches like Baga, Anjuna, and Vagator. Enjoy water sports or relax by the sea.' },
        { day: 3, title: 'South Goa Exploration', description: 'Take a day trip to South Goa to visit serene beaches like Palolem and Agonda.' },
        { day: 4, title: 'Historical Tour & Panjim', description: 'Visit Fort Aguada and the historic churches of Old Goa. Spend the evening in Panjim.' },
        { day: 5, title: 'Departure', description: 'Enjoy a final Goan breakfast before your departure.' },
    ],
  },
  {
    _id: '7',
    title: 'Himalayan Adventure in Manali',
    location: 'Manali',
    state: 'Himachal Pradesh',
    price: 22000,
    duration: 6,
    description: 'Embark on an adventure in the heart of the Himalayas. Go trekking, paragliding, and explore the scenic beauty of Solang Valley and Rohtang Pass.',
    images: ['https://picsum.photos/seed/manali/800/600', 'https://picsum.photos/seed/manali2/800/600'],
    category: 'Adventure',
    reviews: [],
    rating: 4.8,
    numReviews: 0,
    // FIX: Added missing itinerary property.
    itinerary: [
        { day: 1, title: 'Arrival in Manali', description: 'Arrive and check into your hotel. Acclimatize to the altitude.' },
        { day: 2, title: 'Manali Local Sightseeing', description: 'Visit Hadimba Temple, Manu Temple, and the Vashisht hot springs.' },
        { day: 3, title: 'Solang Valley Adventure', description: 'Experience activities like paragliding, zorbing, and skiing (seasonal) in Solang Valley.' },
        { day: 4, title: 'Rohtang Pass Expedition', description: 'Full day excursion to Rohtang Pass for breathtaking mountain scenery (subject to availability).' },
        { day: 5, title: 'Naggar Castle & Art Gallery', description: 'Visit the historic Naggar Castle and Roerich Art Gallery.' },
        { day: 6, title: 'Departure', description: 'Depart from Manali with unforgettable memories.' },
    ],
  },
  {
    _id: '8',
    title: 'Darjeeling Tea Gardens Tour',
    location: 'Darjeeling',
    state: 'West Bengal',
    price: 13500,
    duration: 4,
    description: 'Witness the stunning sunrise over Kanchenjunga, ride the famous Toy Train, and walk through fragrant tea gardens in the Queen of the Hills.',
    images: ['https://picsum.photos/seed/darjeeling/800/600', 'https://picsum.photos/seed/darjeeling2/800/600'],
    category: 'Nature',
    reviews: [],
    rating: 4.6,
    numReviews: 0,
    // FIX: Added missing itinerary property.
    itinerary: [
        { day: 1, title: 'Arrival in Darjeeling', description: 'Arrive and check in. Enjoy a walk on the Mall Road.' },
        { day: 2, title: 'Tiger Hill Sunrise & Ghoom Monastery', description: 'Early morning trip to Tiger Hill for sunrise over Kanchenjunga. Visit Ghoom Monastery and Batasia Loop.' },
        { day: 3, title: 'Tea Gardens & Toy Train', description: 'Visit a tea estate to learn about tea processing. Enjoy a joyride on the Darjeeling Himalayan Railway (Toy Train).' },
        { day: 4, title: 'Departure', description: 'Depart from Darjeeling.' },
    ],
  },
  {
    _id: '9',
    title: 'Spiritual Journey in Rishikesh',
    location: 'Rishikesh',
    state: 'Uttarakhand',
    price: 10500,
    duration: 3,
    description: 'Find your inner peace in the Yoga Capital of the World. Attend the Ganga Aarti, practice yoga and meditation, and experience thrilling river rafting.',
    images: ['https://picsum.photos/seed/rishikesh/800/600', 'https://picsum.photos/seed/rishikesh2/800/600'],
    category: 'Spiritual',
    reviews: [],
    rating: 4.7,
    numReviews: 0,
    // FIX: Added missing itinerary property.
    itinerary: [
        { day: 1, title: 'Arrival and Ganga Aarti', description: 'Arrive in Rishikesh. In the evening, witness the mesmerizing Ganga Aarti ceremony at Parmarth Niketan.' },
        { day: 2, title: 'River Rafting & Bungee Jumping', description: 'Experience the thrill of white-water rafting on the Ganges. Optional bungee jumping.' },
        { day: 3, title: 'Yoga Session and Departure', description: 'Start your day with a rejuvenating yoga session before departing.' },
    ],
  },
];

export const MOCK_USERS: User[] = [
  { _id: 'u1', name: 'Admin User', email: 'admin@travelx.com', role: 'admin' },
  { _id: 'u2', name: 'Jane Doe', email: 'jane.doe@example.com', role: 'user' },
  { _id: 'u3', name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'user' }
];

export const MOCK_BOOKINGS: Booking[] = [
    { 
      _id: 'b1', 
      tour: { _id: '1', title: 'Kerala Backwaters Cruise', location: 'Alleppey, Kerala', images: [] }, 
      user: { _id: 'u2', name: 'Jane Doe' }, 
      bookingDate: '2023-07-10', 
      travelers: 2, 
      totalPrice: 29000, 
      status: 'confirmed'
    },
    { 
      _id: 'b2', 
      tour: { _id: '3', title: 'Coorg Coffee Estate Retreat', location: 'Coorg, Karnataka', images: [] }, 
      user: { _id: 'u3', name: 'Sam Wilson' }, 
      bookingDate: '2023-08-05', 
      travelers: 1, 
      totalPrice: 11000, 
      status: 'pending'
    },
    { 
      _id: 'b3', 
      tour: { _id: '2', title: 'Ooty Hills Getaway', location: 'Ooty, Tamil Nadu', images: [] }, 
      user: { _id: 'u2', name: 'Jane Doe' }, 
      bookingDate: '2023-05-20', 
      travelers: 4, 
      totalPrice: 48000, 
      status: 'confirmed'
    },
];
