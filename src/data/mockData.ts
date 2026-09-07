import { Product, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Tailored Wool Overcoat",
    price: 420,
    cat: "men",
    tag: "Signature",
    img: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
    stock: 14,
    description: "Architectural double-faced virgin wool cut with clean lapels and concealed horn buttoning. Timeless silhouette engineered for cold seasons.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Classic Monochrome Oxford",
    price: 95,
    cat: "men",
    tag: "Essential",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
    stock: 28,
    description: "Heavyweight organic cotton oxford cloth with refined mother-of-pearl buttons. Pre-washed for a supple drape.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 3,
    name: "Slim Architectural Trousers",
    price: 150,
    cat: "men",
    img: "https://images.unsplash.com/photo-1584865288642-42078afe6942?q=80&w=800&auto=format&fit=crop",
    stock: 19,
    description: "Creased pleat wool blend trousers featuring clean hidden clasp and adjustable side tabs.",
    sizes: ["30", "32", "34", "36"]
  },
  {
    id: 4,
    name: "Nappa Leather Biker Jacket",
    price: 560,
    cat: "men",
    tag: "Best Seller",
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
    stock: 8,
    description: "Full-grain supple calfskin with matte ruthenium hardware. Asymmetric closure lined with premium cupro.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 5,
    name: "Merino Wool Crewneck",
    price: 140,
    cat: "men",
    img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
    stock: 22,
    description: "Superfine 19.5-micron Merino knit with ribbed borders and seamless shoulder linking.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 6,
    name: "Double-Breasted Atelier Blazer",
    price: 480,
    cat: "men",
    tag: "New",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    stock: 11,
    description: "Six-on-two buttoning pattern crafted from Italian hopsack wool with soft structured roped shoulders.",
    sizes: ["38R", "40R", "42R", "44R"]
  },
  {
    id: 7,
    name: "Pure Silk Bias-Cut Wrap Dress",
    price: 310,
    cat: "women",
    tag: "New",
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
    stock: 16,
    description: "22mm mulberry silk cut on the true bias to drape smoothly along the contour. Deep V-neckline with self-tie belt.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 8,
    name: "Sculptural Structured Blazer",
    price: 340,
    cat: "women",
    tag: "Best Seller",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    stock: 15,
    description: "Defined waistline with peaked satin lapels and contrast pocket piping in obsidian black.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 9,
    name: "Monochrome Pleated Midi Skirt",
    price: 180,
    cat: "women",
    img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop",
    stock: 25,
    description: "Permanent knife-pleated crepe georgette with an elastic grosgrain interior waistband.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 10,
    name: "Cashmere Ribbed Turtleneck",
    price: 260,
    cat: "women",
    tag: "Signature",
    img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop",
    stock: 18,
    description: "100% grade-A Mongolian cashmere. Thick 7-gauge knit engineered for enduring warmth and cloud softness.",
    sizes: ["S", "M", "L"]
  },
  {
    id: 11,
    name: "Tailored Minimalist Trench Coat",
    price: 520,
    cat: "women",
    tag: "New",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
    stock: 9,
    description: "Heavy water-repellent Japanese gabardine cotton with gun flap, storm shield, and matte black hardware.",
    sizes: ["S", "M", "L"]
  },
  {
    id: 12,
    name: "Satin Obsidian Slip Gown",
    price: 220,
    cat: "women",
    img: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=800&auto=format&fit=crop",
    stock: 12,
    description: "Flowing floor-length liquid satin with delicate adjustable straps and low back scoop.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 13,
    name: "Full Grain Leather Tote",
    price: 340,
    cat: "accessories",
    tag: "Best Seller",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    stock: 20,
    description: "Hand-burnished Italian vegetable-tanned leather designed to accommodate up to a 16-inch laptop with interior suede compartments.",
    sizes: ["One Size"]
  },
  {
    id: 14,
    name: "Monochrome Minimalist Chrono",
    price: 410,
    cat: "accessories",
    tag: "Limited",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    stock: 7,
    description: "Surgical grade 316L matte black stainless steel case, sapphire crystal glass, and Swiss quartz movement.",
    sizes: ["40mm"]
  },
  {
    id: 15,
    name: "Geometric Acetate Sunglasses",
    price: 165,
    cat: "accessories",
    img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop",
    stock: 31,
    description: "Custom hand-polished Mazzucchelli acetate frame with 100% UVA/UVB category 3 black nylon lenses.",
    sizes: ["One Size"]
  },
  {
    id: 16,
    name: "Double Buckle Leather Belt",
    price: 95,
    cat: "accessories",
    img: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop",
    stock: 24,
    description: "32mm width full vegetable bridle leather with brushed silver custom sculpted buckle.",
    sizes: ["85cm", "95cm", "105cm"]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "MN-7841",
    createdAt: "2026-09-07T08:45:00.000Z",
    customer: {
      fullName: "Adeola Adeleke",
      email: "adeola@example.com",
      phone: "+234 803 456 7890",
      altPhone: "+234 812 345 6789",
      address: "Penthouse 4, Eko Pearl Towers, Eko Atlantic",
      city: "Victoria Island",
      state: "Lagos",
      deliveryWindow: "Morning (9am - 1pm)",
      notes: "Please call 10 mins before arrival so concierge can clear access."
    },
    items: [
      {
        id: 1,
        name: "Tailored Wool Overcoat",
        price: 420,
        qty: 1,
        size: "L",
        img: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop"
      },
      {
        id: 13,
        name: "Full Grain Leather Tote",
        price: 340,
        qty: 1,
        size: "One Size",
        img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"
      }
    ],
    subtotal: 760,
    shipping: 0,
    total: 760,
    paymentMethod: "cod",
    status: "Pending",
    paymentStatus: "Pending (Pay on Delivery)"
  },
  {
    id: "MN-7839",
    createdAt: "2026-09-06T19:20:00.000Z",
    customer: {
      fullName: "Chioma Okonjo",
      email: "chioma.o@fashionintl.org",
      phone: "+234 818 990 1234",
      address: "12 Bourdillon Road, Apt 5B",
      city: "Ikoyi",
      state: "Lagos",
      deliveryWindow: "Afternoon (1pm - 5pm)",
      notes: "Payment with POS card terminal on arrival is preferred."
    },
    items: [
      {
        id: 7,
        name: "Pure Silk Bias-Cut Wrap Dress",
        price: 310,
        qty: 1,
        size: "M",
        img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
      }
    ],
    subtotal: 310,
    shipping: 0,
    total: 310,
    paymentMethod: "cod",
    status: "Out for Delivery",
    paymentStatus: "Pending (Pay on Delivery)"
  },
  {
    id: "MN-7825",
    createdAt: "2026-09-06T11:15:00.000Z",
    customer: {
      fullName: "David Sterling",
      email: "d.sterling@studioarch.co.uk",
      phone: "+44 7700 900342",
      address: "48 Kensington Park Road",
      city: "London",
      state: "Greater London",
      deliveryWindow: "Express Same-Day",
      notes: "Leave in front porch locker if not in."
    },
    items: [
      {
        id: 4,
        name: "Nappa Leather Biker Jacket",
        price: 560,
        qty: 1,
        size: "M",
        img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"
      },
      {
        id: 2,
        name: "Classic Monochrome Oxford",
        price: 95,
        qty: 2,
        size: "L",
        img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop"
      }
    ],
    subtotal: 750,
    shipping: 0,
    total: 750,
    paymentMethod: "card",
    status: "Confirmed",
    paymentStatus: "Paid (Card)"
  },
  {
    id: "MN-7810",
    createdAt: "2026-09-05T14:30:00.000Z",
    customer: {
      fullName: "Zainab Ibrahim",
      email: "zainab.ib@horizon.ng",
      phone: "+234 905 112 3344",
      address: "Plot 82, Maitama District, Danube Close",
      city: "Abuja",
      state: "FCT",
      deliveryWindow: "Morning (9am - 1pm)",
      notes: "Cash on delivery ready."
    },
    items: [
      {
        id: 8,
        name: "Sculptural Structured Blazer",
        price: 340,
        qty: 1,
        size: "S",
        img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
      }
    ],
    subtotal: 340,
    shipping: 0,
    total: 340,
    paymentMethod: "cod",
    status: "Delivered",
    paymentStatus: "Paid on Delivery (Cash)"
  }
];
