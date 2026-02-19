// ===== TYPES =====
export interface Seller {
     id: string;
     name: string;
     avatar: string;
     university: string;
     isVerified: boolean;
     rating: number;
     reviewCount: number;
     memberSince: string;
     responseTime: string;
     totalSold: number;
     activeListings: number;
     responseRate: number;
     bio: string;
}

export interface Listing {
     id: string;
     title: string;
     description: string;
     price: number;
     category: string;
     condition: "Like New" | "Good" | "Fair";
     images: string[];
     sellerId: string;
     tags: string[];
     views: number;
     status: "Active" | "Paused" | "Sold";
     createdAt: string;
     isSaved?: boolean;
}

export interface Order {
     id: string;
     listingId: string;
     buyerId: string;
     sellerId: string;
     price: number;
     status: "placed" | "confirmed" | "preparing" | "ready" | "delivered" | "completed";
     createdAt: string;
     txHash: string;
     estimatedDelivery: string;
     timeline: {
          step: string;
          label: string;
          timestamp: string | null;
          completed: boolean;
          active: boolean;
     }[];
}

export interface Message {
     id: string;
     senderId: string;
     text: string;
     timestamp: string;
     type: "text" | "system" | "image";
}

export interface Conversation {
     id: string;
     participantIds: string[];
     listingId: string;
     messages: Message[];
     lastMessage: string;
     lastMessageTime: string;
     unreadCount: number;
}

export interface Review {
     id: string;
     reviewerId: string;
     reviewerName: string;
     reviewerAvatar: string;
     rating: number;
     text: string;
     date: string;
     itemPurchased: string;
}

// ===== SELLERS =====
export const sellers: Seller[] = [
     {
          id: "seller-1",
          name: "Alex Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
          university: "MIT",
          isVerified: true,
          rating: 4.9,
          reviewCount: 42,
          memberSince: "2024-03-15",
          responseTime: "< 1 hour",
          totalSold: 28,
          activeListings: 5,
          responseRate: 98,
          bio: "CS major at MIT. Selling textbooks and electronics I no longer need. Fast shipping, great condition guaranteed!",
     },
     {
          id: "seller-2",
          name: "Priya Sharma",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
          university: "Stanford",
          isVerified: true,
          rating: 4.7,
          reviewCount: 31,
          memberSince: "2024-01-20",
          responseTime: "< 2 hours",
          totalSold: 19,
          activeListings: 3,
          responseRate: 95,
          bio: "Engineering student. Minimalist lifestyle — selling quality items at fair prices.",
     },
     {
          id: "seller-3",
          name: "Jordan Williams",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
          university: "Berkeley",
          isVerified: true,
          rating: 4.8,
          reviewCount: 56,
          memberSince: "2023-09-01",
          responseTime: "< 30 min",
          totalSold: 45,
          activeListings: 8,
          responseRate: 99,
          bio: "Serial seller on campus. If I have it, it's in great shape. Check out my listings!",
     },
     {
          id: "seller-4",
          name: "Emma Rodriguez",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
          university: "UCLA",
          isVerified: false,
          rating: 4.5,
          reviewCount: 12,
          memberSince: "2024-08-10",
          responseTime: "< 4 hours",
          totalSold: 8,
          activeListings: 4,
          responseRate: 90,
          bio: "Art student clearing out my dorm. Furniture, supplies, and more!",
     },
     {
          id: "seller-5",
          name: "Liam O'Connor",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
          university: "Harvard",
          isVerified: true,
          rating: 5.0,
          reviewCount: 18,
          memberSince: "2024-06-01",
          responseTime: "< 1 hour",
          totalSold: 15,
          activeListings: 2,
          responseRate: 100,
          bio: "Pre-med student. Selling textbooks and study equipment. Everything is in excellent condition.",
     },
];

// ===== CATEGORIES (using Lucide icon names) =====
export const categories = [
     { id: "all", label: "All", iconName: "LayoutGrid" },
     { id: "books", label: "Books", iconName: "BookOpen" },
     { id: "electronics", label: "Electronics", iconName: "Laptop" },
     { id: "furniture", label: "Furniture", iconName: "Armchair" },
     { id: "clothing", label: "Clothing", iconName: "Shirt" },
     { id: "gaming", label: "Gaming", iconName: "Gamepad2" },
     { id: "transport", label: "Transport", iconName: "Bike" },
     { id: "supplies", label: "Supplies", iconName: "Pencil" },
];

// ===== LISTINGS =====
export const listings: Listing[] = [
     {
          id: "listing-1",
          title: "Calculus: Early Transcendentals 8th Edition",
          description: "Barely used calculus textbook. Some highlighting in chapters 1–4, otherwise pristine condition. Perfect for MATH 101/102. Includes the student solutions manual.",
          price: 45,
          category: "books",
          condition: "Like New",
          images: [
               "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop",
               "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop",
               "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-1",
          tags: ["textbook", "math", "calculus"],
          views: 234,
          status: "Active",
          createdAt: "2025-02-10T10:30:00Z",
     },
     {
          id: "listing-2",
          title: "MacBook Air M2 2023 — 16GB / 512GB",
          description: "Selling my MacBook Air M2. Midnight color, 16GB RAM, 512GB SSD. Battery cycle count: 47. Comes with original charger and box. AppleCare+ until Dec 2025.",
          price: 850,
          category: "electronics",
          condition: "Like New",
          images: [
               "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
               "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-3",
          tags: ["laptop", "apple", "macbook"],
          views: 891,
          status: "Active",
          createdAt: "2025-02-08T14:15:00Z",
     },
     {
          id: "listing-3",
          title: "IKEA MARKUS Office Chair — Black",
          description: "Great ergonomic desk chair. Used for one semester. Adjustable height, tilt lock, lumbar support. Minor scratches on the base, otherwise perfect.",
          price: 75,
          category: "furniture",
          condition: "Good",
          images: [
               "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=600&fit=crop",
               "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-4",
          tags: ["chair", "desk", "ergonomic"],
          views: 156,
          status: "Active",
          createdAt: "2025-02-12T09:00:00Z",
     },
     {
          id: "listing-4",
          title: "Sony WH-1000XM5 Headphones",
          description: "Industry-leading noise cancellation. Silver color. Includes carrying case, cable, and airplane adapter. Battery still lasts 28+ hours.",
          price: 200,
          category: "electronics",
          condition: "Like New",
          images: [
               "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
               "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-2",
          tags: ["headphones", "sony", "audio"],
          views: 445,
          status: "Active",
          createdAt: "2025-02-05T11:20:00Z",
     },
     {
          id: "listing-5",
          title: "Vintage Levi's 501 Jeans — Size 32",
          description: "Authentic vintage Levi's 501 jeans in great condition. Slightly faded for that classic look. True to size.",
          price: 35,
          category: "clothing",
          condition: "Good",
          images: [
               "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop",
               "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-3",
          tags: ["jeans", "vintage", "levis"],
          views: 189,
          status: "Active",
          createdAt: "2025-02-11T16:45:00Z",
     },
     {
          id: "listing-6",
          title: "Nintendo Switch OLED + 4 Games",
          description: "White model Nintendo Switch OLED. Includes Zelda TOTK, Mario Kart 8, Smash Bros, and Animal Crossing. Screen protector applied since day one.",
          price: 320,
          category: "gaming",
          condition: "Like New",
          images: [
               "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&h=600&fit=crop",
               "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-1",
          tags: ["nintendo", "switch", "console"],
          views: 678,
          status: "Active",
          createdAt: "2025-02-07T13:30:00Z",
     },
     {
          id: "listing-7",
          title: "Electric Scooter — Xiaomi Mi Pro 2",
          description: "Max speed 25km/h, 45km range. Foldable, very portable. Used for one semester of commuting. New tires installed last month.",
          price: 280,
          category: "transport",
          condition: "Good",
          images: [
               "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop",
               "https://images.unsplash.com/photo-1604868189414-2f8fc6c5e09a?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-5",
          tags: ["scooter", "electric", "transport"],
          views: 312,
          status: "Active",
          createdAt: "2025-02-09T10:00:00Z",
     },
     {
          id: "listing-8",
          title: "Organic Chemistry 9th Edition — McMurry",
          description: "Required text for CHEM 201. No writing or highlighting. Comes with the model kit (unused).",
          price: 55,
          category: "books",
          condition: "Like New",
          images: [
               "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-5",
          tags: ["textbook", "chemistry", "organic"],
          views: 167,
          status: "Active",
          createdAt: "2025-02-13T08:15:00Z",
     },
     {
          id: "listing-9",
          title: "Herman Miller Aeron Clone Chair",
          description: "High-quality ergonomic mesh chair. Fully adjustable armrests, lumbar support, and headrest. 2 years old but in excellent shape.",
          price: 150,
          category: "furniture",
          condition: "Good",
          images: [
               "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-2",
          tags: ["chair", "ergonomic", "office"],
          views: 298,
          status: "Active",
          createdAt: "2025-02-06T15:30:00Z",
     },
     {
          id: "listing-10",
          title: "iPad Air 5th Gen — Wi-Fi 256GB",
          description: "Space Gray iPad Air with Apple Pencil 2nd gen included. Used for note-taking only. No scratches, always had a case on it.",
          price: 420,
          category: "electronics",
          condition: "Like New",
          images: [
               "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop",
               "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-1",
          tags: ["ipad", "apple", "tablet"],
          views: 534,
          status: "Active",
          createdAt: "2025-02-04T12:00:00Z",
     },
     {
          id: "listing-11",
          title: "PS5 Controller — Cosmic Red",
          description: "DualSense wireless controller in Cosmic Red. No drift, works perfectly. Used for about 3 months.",
          price: 40,
          category: "gaming",
          condition: "Good",
          images: [
               "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-3",
          tags: ["ps5", "controller", "gaming"],
          views: 201,
          status: "Active",
          createdAt: "2025-02-14T09:45:00Z",
     },
     {
          id: "listing-12",
          title: "North Face Puffer Jacket — Medium",
          description: "Black 700-fill North Face Nuptse jacket. Size M, fits true. Worn for one winter season. Machine washed and ready to go.",
          price: 120,
          category: "clothing",
          condition: "Good",
          images: [
               "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-4",
          tags: ["jacket", "winter", "north-face"],
          views: 145,
          status: "Active",
          createdAt: "2025-02-01T14:00:00Z",
     },
     {
          id: "listing-13",
          title: "Fender Stratocaster Player Series",
          description: "Sunburst Fender Strat in excellent condition. Comes with gig bag, strap, and extra set of strings. Maple neck, SSS pickups.",
          price: 500,
          category: "electronics",
          condition: "Like New",
          images: [
               "https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-2",
          tags: ["guitar", "fender", "music"],
          views: 267,
          status: "Active",
          createdAt: "2025-01-28T11:00:00Z",
     },
     {
          id: "listing-14",
          title: "Canon EOS R50 Mirrorless Camera",
          description: "Includes 18-45mm kit lens, 128GB SD card, camera bag, and extra battery. Perfect for photography classes. Shutter count: ~2,000.",
          price: 550,
          category: "electronics",
          condition: "Like New",
          images: [
               "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-5",
          tags: ["camera", "canon", "photography"],
          views: 389,
          status: "Active",
          createdAt: "2025-02-03T16:20:00Z",
     },
     {
          id: "listing-15",
          title: "Standing Desk — Electric Adjustable",
          description: "48x24 inch electric standing desk. White top, black frame. Memory presets for sitting and standing heights. Minor scratch on edge.",
          price: 180,
          category: "furniture",
          condition: "Good",
          images: [
               "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-3",
          tags: ["desk", "standing", "furniture"],
          views: 423,
          status: "Active",
          createdAt: "2025-02-02T10:30:00Z",
     },
     {
          id: "listing-16",
          title: "TI-84 Plus CE Graphing Calculator",
          description: "Required for many math/science courses. Color screen, rechargeable. All functions work perfectly. Includes USB cable.",
          price: 60,
          category: "supplies",
          condition: "Good",
          images: [
               "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-1",
          tags: ["calculator", "math", "ti-84"],
          views: 178,
          status: "Active",
          createdAt: "2025-02-15T08:00:00Z",
     },
     {
          id: "listing-17",
          title: "Road Bike — Giant Contend 3",
          description: "Size M road bike, great for campus commuting. Shimano Claris groupset, 700c wheels. Recently tuned up. Includes lock and lights.",
          price: 350,
          category: "transport",
          condition: "Good",
          images: [
               "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-4",
          tags: ["bike", "road", "cycling"],
          views: 256,
          status: "Active",
          createdAt: "2025-01-30T13:15:00Z",
     },
     {
          id: "listing-18",
          title: "Introduction to Algorithms (CLRS) 4th Ed",
          description: "The classic algorithms textbook. Hardcover, no markings. Essential for any CS major.",
          price: 70,
          category: "books",
          condition: "Like New",
          images: [
               "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-2",
          tags: ["textbook", "algorithms", "cs"],
          views: 567,
          status: "Active",
          createdAt: "2025-02-11T07:30:00Z",
     },
     {
          id: "listing-19",
          title: "AirPods Pro 2nd Generation",
          description: "USB-C case. Active noise cancellation still works perfectly. Ear tips (all sizes) included. Battery health: 92%.",
          price: 150,
          category: "electronics",
          condition: "Good",
          images: [
               "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-1",
          tags: ["airpods", "apple", "audio"],
          views: 723,
          status: "Active",
          createdAt: "2025-02-13T14:50:00Z",
     },
     {
          id: "listing-20",
          title: "Mini Fridge — Midea 3.3 cu ft",
          description: "Perfect dorm fridge. Black finish, includes small freezer compartment. Very quiet operation. Moving out and can't take it.",
          price: 65,
          category: "furniture",
          condition: "Good",
          images: [
               "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-4",
          tags: ["fridge", "appliance", "dorm"],
          views: 134,
          status: "Active",
          createdAt: "2025-02-16T11:20:00Z",
     },
     {
          id: "listing-21",
          title: "Logitech MX Master 3S Mouse",
          description: "Graphite color. Ergonomic wireless mouse with USB-C charging. MagSpeed scroll wheel. Pairs with up to 3 devices.",
          price: 55,
          category: "electronics",
          condition: "Like New",
          images: [
               "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-5",
          tags: ["mouse", "logitech", "wireless"],
          views: 201,
          status: "Active",
          createdAt: "2025-02-17T09:00:00Z",
     },
     {
          id: "listing-22",
          title: "Skateboard — Element Complete",
          description: "8.0 inch complete setup. Barely ridden — bought it thinking I'd learn but never did. Great for beginners.",
          price: 50,
          category: "transport",
          condition: "Like New",
          images: [
               "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=600&h=600&fit=crop",
          ],
          sellerId: "seller-3",
          tags: ["skateboard", "element", "transport"],
          views: 98,
          status: "Active",
          createdAt: "2025-02-18T15:00:00Z",
     },
];

// ===== ORDERS =====
export const orders: Order[] = [
     {
          id: "order-1",
          listingId: "listing-2",
          buyerId: "buyer-1",
          sellerId: "seller-3",
          price: 850,
          status: "completed",
          createdAt: "2025-02-01T09:00:00Z",
          txHash: "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
          estimatedDelivery: "2025-02-03",
          timeline: [
               { step: "placed", label: "Order Placed", timestamp: "2025-02-01T09:00:00Z", completed: true, active: false },
               { step: "confirmed", label: "Payment Confirmed", timestamp: "2025-02-01T09:02:00Z", completed: true, active: false },
               { step: "preparing", label: "Seller Preparing", timestamp: "2025-02-01T10:30:00Z", completed: true, active: false },
               { step: "ready", label: "Ready for Pickup", timestamp: "2025-02-02T14:00:00Z", completed: true, active: false },
               { step: "delivered", label: "Delivered", timestamp: "2025-02-03T11:00:00Z", completed: true, active: false },
               { step: "completed", label: "Funds Released", timestamp: "2025-02-03T11:05:00Z", completed: true, active: false },
          ],
     },
     {
          id: "order-2",
          listingId: "listing-4",
          buyerId: "buyer-1",
          sellerId: "seller-2",
          price: 200,
          status: "ready",
          createdAt: "2025-02-14T10:00:00Z",
          txHash: "0xb2c3d4e5f6a789012345678901234567890abcdef1234567890abcdef234567",
          estimatedDelivery: "2025-02-16",
          timeline: [
               { step: "placed", label: "Order Placed", timestamp: "2025-02-14T10:00:00Z", completed: true, active: false },
               { step: "confirmed", label: "Payment Confirmed", timestamp: "2025-02-14T10:01:00Z", completed: true, active: false },
               { step: "preparing", label: "Seller Preparing", timestamp: "2025-02-14T12:00:00Z", completed: true, active: false },
               { step: "ready", label: "Ready for Pickup", timestamp: "2025-02-15T09:00:00Z", completed: true, active: true },
               { step: "delivered", label: "Delivered", timestamp: null, completed: false, active: false },
               { step: "completed", label: "Funds Released", timestamp: null, completed: false, active: false },
          ],
     },
     {
          id: "order-3",
          listingId: "listing-6",
          buyerId: "buyer-2",
          sellerId: "seller-1",
          price: 320,
          status: "preparing",
          createdAt: "2025-02-15T14:30:00Z",
          txHash: "0xc3d4e5f6a7b89012345678901234567890abcdef1234567890abcdef345678",
          estimatedDelivery: "2025-02-18",
          timeline: [
               { step: "placed", label: "Order Placed", timestamp: "2025-02-15T14:30:00Z", completed: true, active: false },
               { step: "confirmed", label: "Payment Confirmed", timestamp: "2025-02-15T14:32:00Z", completed: true, active: false },
               { step: "preparing", label: "Seller Preparing", timestamp: "2025-02-16T08:00:00Z", completed: false, active: true },
               { step: "ready", label: "Ready for Pickup", timestamp: null, completed: false, active: false },
               { step: "delivered", label: "Delivered", timestamp: null, completed: false, active: false },
               { step: "completed", label: "Funds Released", timestamp: null, completed: false, active: false },
          ],
     },
     {
          id: "order-4",
          listingId: "listing-1",
          buyerId: "buyer-3",
          sellerId: "seller-1",
          price: 45,
          status: "confirmed",
          createdAt: "2025-02-17T11:00:00Z",
          txHash: "0xd4e5f6a7b8c9012345678901234567890abcdef1234567890abcdef456789",
          estimatedDelivery: "2025-02-19",
          timeline: [
               { step: "placed", label: "Order Placed", timestamp: "2025-02-17T11:00:00Z", completed: true, active: false },
               { step: "confirmed", label: "Payment Confirmed", timestamp: "2025-02-17T11:02:00Z", completed: true, active: true },
               { step: "preparing", label: "Seller Preparing", timestamp: null, completed: false, active: false },
               { step: "ready", label: "Ready for Pickup", timestamp: null, completed: false, active: false },
               { step: "delivered", label: "Delivered", timestamp: null, completed: false, active: false },
               { step: "completed", label: "Funds Released", timestamp: null, completed: false, active: false },
          ],
     },
     {
          id: "order-5",
          listingId: "listing-10",
          buyerId: "buyer-1",
          sellerId: "seller-1",
          price: 420,
          status: "delivered",
          createdAt: "2025-02-10T08:00:00Z",
          txHash: "0xe5f6a7b8c9d0012345678901234567890abcdef1234567890abcdef567890",
          estimatedDelivery: "2025-02-12",
          timeline: [
               { step: "placed", label: "Order Placed", timestamp: "2025-02-10T08:00:00Z", completed: true, active: false },
               { step: "confirmed", label: "Payment Confirmed", timestamp: "2025-02-10T08:03:00Z", completed: true, active: false },
               { step: "preparing", label: "Seller Preparing", timestamp: "2025-02-10T10:00:00Z", completed: true, active: false },
               { step: "ready", label: "Ready for Pickup", timestamp: "2025-02-11T09:00:00Z", completed: true, active: false },
               { step: "delivered", label: "Delivered", timestamp: "2025-02-12T13:00:00Z", completed: true, active: true },
               { step: "completed", label: "Funds Released", timestamp: null, completed: false, active: false },
          ],
     },
     {
          id: "order-6",
          listingId: "listing-8",
          buyerId: "buyer-2",
          sellerId: "seller-5",
          price: 55,
          status: "placed",
          createdAt: "2025-02-18T16:00:00Z",
          txHash: "0xf6a7b8c9d0e1012345678901234567890abcdef1234567890abcdef678901",
          estimatedDelivery: "2025-02-21",
          timeline: [
               { step: "placed", label: "Order Placed", timestamp: "2025-02-18T16:00:00Z", completed: true, active: true },
               { step: "confirmed", label: "Payment Confirmed", timestamp: null, completed: false, active: false },
               { step: "preparing", label: "Seller Preparing", timestamp: null, completed: false, active: false },
               { step: "ready", label: "Ready for Pickup", timestamp: null, completed: false, active: false },
               { step: "delivered", label: "Delivered", timestamp: null, completed: false, active: false },
               { step: "completed", label: "Funds Released", timestamp: null, completed: false, active: false },
          ],
     },
     {
          id: "order-7",
          listingId: "listing-15",
          buyerId: "buyer-3",
          sellerId: "seller-3",
          price: 180,
          status: "completed",
          createdAt: "2025-01-25T10:00:00Z",
          txHash: "0xa7b8c9d0e1f2012345678901234567890abcdef1234567890abcdef789012",
          estimatedDelivery: "2025-01-28",
          timeline: [
               { step: "placed", label: "Order Placed", timestamp: "2025-01-25T10:00:00Z", completed: true, active: false },
               { step: "confirmed", label: "Payment Confirmed", timestamp: "2025-01-25T10:01:00Z", completed: true, active: false },
               { step: "preparing", label: "Seller Preparing", timestamp: "2025-01-25T14:00:00Z", completed: true, active: false },
               { step: "ready", label: "Ready for Pickup", timestamp: "2025-01-26T11:00:00Z", completed: true, active: false },
               { step: "delivered", label: "Delivered", timestamp: "2025-01-27T16:00:00Z", completed: true, active: false },
               { step: "completed", label: "Funds Released", timestamp: "2025-01-27T16:05:00Z", completed: true, active: false },
          ],
     },
     {
          id: "order-8",
          listingId: "listing-19",
          buyerId: "buyer-2",
          sellerId: "seller-1",
          price: 150,
          status: "ready",
          createdAt: "2025-02-16T09:30:00Z",
          txHash: "0xb8c9d0e1f2a3012345678901234567890abcdef1234567890abcdef890123",
          estimatedDelivery: "2025-02-18",
          timeline: [
               { step: "placed", label: "Order Placed", timestamp: "2025-02-16T09:30:00Z", completed: true, active: false },
               { step: "confirmed", label: "Payment Confirmed", timestamp: "2025-02-16T09:32:00Z", completed: true, active: false },
               { step: "preparing", label: "Seller Preparing", timestamp: "2025-02-16T11:00:00Z", completed: true, active: false },
               { step: "ready", label: "Ready for Pickup", timestamp: "2025-02-17T10:00:00Z", completed: true, active: true },
               { step: "delivered", label: "Delivered", timestamp: null, completed: false, active: false },
               { step: "completed", label: "Funds Released", timestamp: null, completed: false, active: false },
          ],
     },
];

// ===== REVIEWS =====
export const reviews: Review[] = [
     { id: "rev-1", reviewerId: "buyer-1", reviewerName: "Sarah Kim", reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", rating: 5, text: "Super fast response and the laptop was in perfect condition. Exactly as described!", date: "2025-02-05", itemPurchased: "MacBook Air M2" },
     { id: "rev-2", reviewerId: "buyer-2", reviewerName: "Marcus Lee", reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", rating: 5, text: "Great seller, very communicative. The Switch bundle was an amazing deal.", date: "2025-02-08", itemPurchased: "Nintendo Switch OLED" },
     { id: "rev-3", reviewerId: "buyer-3", reviewerName: "Tanya Rodriguez", reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanya", rating: 4, text: "Good condition textbook. Minor highlighting but overall happy with purchase.", date: "2025-02-12", itemPurchased: "Calculus Textbook" },
     { id: "rev-4", reviewerId: "buyer-1", reviewerName: "Sarah Kim", reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", rating: 5, text: "Amazing seller! iPad was in pristine condition with no scratches.", date: "2025-02-14", itemPurchased: "iPad Air" },
     { id: "rev-5", reviewerId: "buyer-2", reviewerName: "Marcus Lee", reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", rating: 4, text: "Headphones work great. Case had a small scuff but seller was upfront about it.", date: "2025-02-10", itemPurchased: "Sony WH-1000XM5" },
     { id: "rev-6", reviewerId: "buyer-3", reviewerName: "Tanya Rodriguez", reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanya", rating: 5, text: "Desk was exactly as described. Seller even helped me carry it!", date: "2025-01-29", itemPurchased: "Standing Desk" },
];

// ===== CONVERSATIONS =====
export const conversations: Conversation[] = [
     {
          id: "conv-1",
          participantIds: ["buyer-1", "seller-3"],
          listingId: "listing-2",
          lastMessage: "I can meet you at the library at 3pm tomorrow",
          lastMessageTime: "2025-02-18T14:30:00Z",
          unreadCount: 2,
          messages: [
               { id: "msg-1", senderId: "buyer-1", text: "Hi! Is the MacBook still available?", timestamp: "2025-02-18T10:00:00Z", type: "text" },
               { id: "msg-2", senderId: "seller-3", text: "Yes it is! Want to meet up?", timestamp: "2025-02-18T10:15:00Z", type: "text" },
               { id: "msg-3", senderId: "buyer-1", text: "Can you do 800 ALGO?", timestamp: "2025-02-18T10:30:00Z", type: "text" },
               { id: "msg-4", senderId: "seller-3", text: "I can do 825. It's basically new.", timestamp: "2025-02-18T11:00:00Z", type: "text" },
               { id: "msg-5", senderId: "buyer-1", text: "Deal! Where should we meet?", timestamp: "2025-02-18T12:00:00Z", type: "text" },
               { id: "msg-6", senderId: "seller-3", text: "I can meet you at the library at 3pm tomorrow", timestamp: "2025-02-18T14:30:00Z", type: "text" },
          ],
     },
     {
          id: "conv-2",
          participantIds: ["buyer-1", "seller-2"],
          listingId: "listing-4",
          lastMessage: "Offer sent: 180 ALGO",
          lastMessageTime: "2025-02-17T16:00:00Z",
          unreadCount: 0,
          messages: [
               { id: "msg-7", senderId: "buyer-1", text: "Interested in the Sony headphones. Any scratches?", timestamp: "2025-02-17T14:00:00Z", type: "text" },
               { id: "msg-8", senderId: "seller-2", text: "No scratches at all. I have the original receipt too.", timestamp: "2025-02-17T14:30:00Z", type: "text" },
               { id: "msg-9", senderId: "buyer-1", text: "Offer sent: 180 ALGO", timestamp: "2025-02-17T16:00:00Z", type: "system" },
          ],
     },
     {
          id: "conv-3",
          participantIds: ["buyer-2", "seller-1"],
          listingId: "listing-6",
          lastMessage: "Perfect, payment sent!",
          lastMessageTime: "2025-02-15T15:00:00Z",
          unreadCount: 0,
          messages: [
               { id: "msg-10", senderId: "buyer-2", text: "Is the Switch OLED still available?", timestamp: "2025-02-15T13:00:00Z", type: "text" },
               { id: "msg-11", senderId: "seller-1", text: "Yes! All games included as listed.", timestamp: "2025-02-15T13:15:00Z", type: "text" },
               { id: "msg-12", senderId: "buyer-2", text: "I'll take it at the listed price.", timestamp: "2025-02-15T14:00:00Z", type: "text" },
               { id: "msg-13", senderId: "seller-1", text: "Great! Go ahead and buy through the app.", timestamp: "2025-02-15T14:30:00Z", type: "text" },
               { id: "msg-14", senderId: "buyer-2", text: "Perfect, payment sent!", timestamp: "2025-02-15T15:00:00Z", type: "text" },
          ],
     },
     {
          id: "conv-4",
          participantIds: ["buyer-3", "seller-1"],
          listingId: "listing-1",
          lastMessage: "Can I pick it up today?",
          lastMessageTime: "2025-02-17T16:45:00Z",
          unreadCount: 1,
          messages: [
               { id: "msg-15", senderId: "buyer-3", text: "Is this the Stewart textbook?", timestamp: "2025-02-17T15:00:00Z", type: "text" },
               { id: "msg-16", senderId: "seller-1", text: "Yes, Stewart's Calculus. Great condition.", timestamp: "2025-02-17T15:30:00Z", type: "text" },
               { id: "msg-17", senderId: "buyer-3", text: "Can I pick it up today?", timestamp: "2025-02-17T16:45:00Z", type: "text" },
          ],
     },
     {
          id: "conv-5",
          participantIds: ["buyer-1", "seller-5"],
          listingId: "listing-7",
          lastMessage: "The scooter has been serviced regularly",
          lastMessageTime: "2025-02-16T11:00:00Z",
          unreadCount: 0,
          messages: [
               { id: "msg-18", senderId: "buyer-1", text: "How's the battery life on the scooter?", timestamp: "2025-02-16T10:00:00Z", type: "text" },
               { id: "msg-19", senderId: "seller-5", text: "The scooter has been serviced regularly", timestamp: "2025-02-16T11:00:00Z", type: "text" },
          ],
     },
     {
          id: "conv-6",
          participantIds: ["buyer-2", "seller-2"],
          listingId: "listing-13",
          lastMessage: "Would you consider 450 ALGO?",
          lastMessageTime: "2025-02-18T09:00:00Z",
          unreadCount: 1,
          messages: [
               { id: "msg-20", senderId: "buyer-2", text: "Is the Fender still available? Can I try it?", timestamp: "2025-02-18T08:00:00Z", type: "text" },
               { id: "msg-21", senderId: "seller-2", text: "Absolutely! I'm at the music building most afternoons.", timestamp: "2025-02-18T08:30:00Z", type: "text" },
               { id: "msg-22", senderId: "buyer-2", text: "Would you consider 450 ALGO?", timestamp: "2025-02-18T09:00:00Z", type: "text" },
          ],
     },
     {
          id: "conv-7",
          participantIds: ["buyer-3", "seller-4"],
          listingId: "listing-17",
          lastMessage: "The bike is tuned and ready!",
          lastMessageTime: "2025-02-14T17:00:00Z",
          unreadCount: 0,
          messages: [
               { id: "msg-23", senderId: "buyer-3", text: "What size frame is the bike?", timestamp: "2025-02-14T16:00:00Z", type: "text" },
               { id: "msg-24", senderId: "seller-4", text: "It's size M, fits riders 5'7 to 5'11", timestamp: "2025-02-14T16:30:00Z", type: "text" },
               { id: "msg-25", senderId: "seller-4", text: "The bike is tuned and ready!", timestamp: "2025-02-14T17:00:00Z", type: "text" },
          ],
     },
     {
          id: "conv-8",
          participantIds: ["buyer-1", "seller-1"],
          listingId: "listing-16",
          lastMessage: "I'll include fresh batteries too",
          lastMessageTime: "2025-02-15T20:00:00Z",
          unreadCount: 0,
          messages: [
               { id: "msg-26", senderId: "buyer-1", text: "Does the TI-84 have the latest firmware?", timestamp: "2025-02-15T18:00:00Z", type: "text" },
               { id: "msg-27", senderId: "seller-1", text: "Yes, updated it last week!", timestamp: "2025-02-15T18:30:00Z", type: "text" },
               { id: "msg-28", senderId: "seller-1", text: "I'll include fresh batteries too", timestamp: "2025-02-15T20:00:00Z", type: "text" },
          ],
     },
     {
          id: "conv-9",
          participantIds: ["buyer-2", "seller-5"],
          listingId: "listing-8",
          lastMessage: "The model kit is completely unused",
          lastMessageTime: "2025-02-18T13:00:00Z",
          unreadCount: 3,
          messages: [
               { id: "msg-29", senderId: "buyer-2", text: "Is the organic chem textbook still available?", timestamp: "2025-02-18T12:00:00Z", type: "text" },
               { id: "msg-30", senderId: "seller-5", text: "Yes! It's in perfect condition.", timestamp: "2025-02-18T12:30:00Z", type: "text" },
               { id: "msg-31", senderId: "seller-5", text: "The model kit is completely unused", timestamp: "2025-02-18T13:00:00Z", type: "text" },
          ],
     },
     {
          id: "conv-10",
          participantIds: ["buyer-3", "seller-3"],
          listingId: "listing-22",
          lastMessage: "Can you ship it or pickup only?",
          lastMessageTime: "2025-02-19T08:00:00Z",
          unreadCount: 1,
          messages: [
               { id: "msg-32", senderId: "buyer-3", text: "Love the skateboard! Is it still available?", timestamp: "2025-02-19T07:30:00Z", type: "text" },
               { id: "msg-33", senderId: "buyer-3", text: "Can you ship it or pickup only?", timestamp: "2025-02-19T08:00:00Z", type: "text" },
          ],
     },
];

// ===== HELPER FUNCTIONS =====
export function getSellerById(id: string): Seller | undefined {
     return sellers.find((s) => s.id === id);
}

export function getListingById(id: string): Listing | undefined {
     return listings.find((l) => l.id === id);
}

export function getOrderById(id: string): Order | undefined {
     return orders.find((o) => o.id === id);
}

export function getListingsBySeller(sellerId: string): Listing[] {
     return listings.filter((l) => l.sellerId === sellerId);
}

export function getOrdersByBuyer(buyerId: string): Order[] {
     return orders.filter((o) => o.buyerId === buyerId);
}

export function getReviewsBySeller(sellerId: string): Review[] {
     return reviews;
}
