/* ============ GlowCity Data Layer ============ */
/* Tries the RESTful Table API first; falls back to embedded seed data
   so the site works even on static hosting without the API. */

const FALLBACK_SALONS = [
  {id:"s1",name:"Lumière Luxury Salon & Spa",area:"Bandra West",address:"Linking Road, Bandra West, Mumbai 400050",category:"Luxury Spa",rating:4.9,reviews_count:482,price_level:"₹₹₹₹",image:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",description:"Mumbai's most coveted luxury salon experience. From signature hair transformations to indulgent spa rituals, our award-winning stylists deliver red-carpet results in a serene, world-class setting.",services:["Hair Spa","Keratin Treatment","Balayage","Facial","Body Massage","Manicure & Pedicure"],amenities:["AC","Valet Parking","Card Payment","WiFi","Refreshments"],phone:"+91 98200 11111",open_hours:"10:00 AM - 9:00 PM",featured:true,verified:true},
  {id:"s2",name:"Urban Edge Men's Grooming",area:"Andheri West",address:"Lokhandwala Complex, Andheri West, Mumbai 400053",category:"Men's Grooming",rating:4.7,reviews_count:356,price_level:"₹₹",image:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",description:"The modern man's grooming destination. Precision haircuts, classic hot-towel shaves, beard sculpting and skincare — all delivered by master barbers in a sharp, contemporary space.",services:["Haircut","Beard Trim","Hot Towel Shave","Hair Color","Men's Facial","Head Massage"],amenities:["AC","Card Payment","WiFi","TV"],phone:"+91 98200 22222",open_hours:"11:00 AM - 10:00 PM",featured:true,verified:true},
  {id:"s3",name:"Blush Bridal Beauty Studio",area:"Juhu",address:"Juhu Tara Road, Juhu, Mumbai 400049",category:"Bridal Studio",rating:4.95,reviews_count:290,price_level:"₹₹₹₹",image:"https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80",description:"Your dream bridal look, perfected. Specialists in HD & airbrush bridal makeup, traditional and contemporary styling, pre-bridal packages and trials for the most important day of your life.",services:["Bridal Makeup","Engagement Makeup","Pre-Bridal Package","Hair Styling","Saree Draping","Mehendi"],amenities:["AC","Card Payment","Trial Available","Home Service"],phone:"+91 98200 33333",open_hours:"By Appointment",featured:true,verified:true},
  {id:"s4",name:"Glow & Co. Unisex Salon",area:"Powai",address:"Hiranandani Gardens, Powai, Mumbai 400076",category:"Unisex Salon",rating:4.6,reviews_count:412,price_level:"₹₹",image:"https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",description:"A friendly neighbourhood unisex salon offering everything from quick trims to complete makeovers. Trendy styles, affordable packages and a welcoming vibe for the whole family.",services:["Haircut","Hair Color","Facial","Waxing","Threading","Manicure"],amenities:["AC","Card Payment","WiFi","Kids Friendly"],phone:"+91 98200 44444",open_hours:"10:00 AM - 9:00 PM",featured:false,verified:true},
  {id:"s5",name:"Serenity Women's Wellness",area:"Lower Parel",address:"Senapati Bapat Marg, Lower Parel, Mumbai 400013",category:"Women's Salon",rating:4.8,reviews_count:268,price_level:"₹₹₹",image:"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",description:"An exclusive women-only sanctuary in the heart of Mumbai's business district. Indulge in premium hair, skin and nail care delivered by an all-female team of certified experts.",services:["Hair Spa","Highlights","Facial","Body Polishing","Nail Art","Waxing"],amenities:["AC","Women Only","Card Payment","WiFi","Refreshments"],phone:"+91 98200 55555",open_hours:"10:00 AM - 8:00 PM",featured:false,verified:true},
  {id:"s6",name:"QuickClip Express Barbers",area:"Dadar",address:"Ranade Road, Dadar West, Mumbai 400028",category:"Men's Grooming",rating:4.4,reviews_count:521,price_level:"₹",image:"https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80",description:"No-fuss, fast and affordable grooming for the busy Mumbaikar. Walk in for a sharp haircut or shave and walk out looking your best — no appointment needed.",services:["Haircut","Shave","Beard Trim","Hair Color","Head Massage"],amenities:["AC","Walk-in","Cash & Card"],phone:"+91 98200 66666",open_hours:"9:00 AM - 10:00 PM",featured:false,verified:true},
  {id:"s7",name:"Doorstep Diva Home Salon",area:"Malad",address:"Serves Malad, Goregaon, Kandivali",category:"Home Service",rating:4.7,reviews_count:198,price_level:"₹₹",image:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",description:"Salon-quality beauty services in the comfort of your home. Our verified professionals bring hygienic, premium-grade equipment right to your doorstep across the western suburbs.",services:["Haircut","Waxing","Facial","Manicure & Pedicure","Threading","Bleach"],amenities:["Home Service","Hygiene Certified","Online Payment","Female Staff"],phone:"+91 98200 77777",open_hours:"8:00 AM - 8:00 PM",featured:true,verified:true},
  {id:"s8",name:"The Hair Lounge",area:"Colaba",address:"Colaba Causeway, Colaba, Mumbai 400005",category:"Unisex Salon",rating:4.5,reviews_count:174,price_level:"₹₹₹",image:"https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&q=80",description:"A chic South Mumbai salon known for creative cuts and bold colour work. Our internationally trained stylists stay ahead of every trend to give you a look that turns heads.",services:["Haircut","Global Color","Balayage","Hair Spa","Smoothening","Styling"],amenities:["AC","Card Payment","WiFi","Sea View"],phone:"+91 98200 88888",open_hours:"10:00 AM - 9:00 PM",featured:false,verified:true},
  {id:"s9",name:"Zen Thai Spa & Massage",area:"Khar West",address:"14th Road, Khar West, Mumbai 400052",category:"Luxury Spa",rating:4.85,reviews_count:233,price_level:"₹₹₹",image:"https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",description:"Escape the city chaos with authentic Thai and Balinese therapies. Our trained therapists offer deep-tissue, aromatherapy and signature wellness rituals in a tranquil oasis.",services:["Thai Massage","Aromatherapy","Deep Tissue","Foot Reflexology","Body Scrub","Facial"],amenities:["AC","Card Payment","Couple Rooms","Steam","Refreshments"],phone:"+91 98200 99999",open_hours:"11:00 AM - 11:00 PM",featured:false,verified:true},
  {id:"s10",name:"Trendsetters Salon Academy",area:"Borivali",address:"S.V. Road, Borivali West, Mumbai 400092",category:"Unisex Salon",rating:4.3,reviews_count:309,price_level:"₹",image:"https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",description:"Get premium services at academy prices. Supervised by senior experts, our talented trainees deliver great results on haircuts, colour, facials and more — value beauty for everyone.",services:["Haircut","Hair Color","Facial","Waxing","Threading","Pedicure"],amenities:["AC","Card Payment","Budget Friendly"],phone:"+91 98200 10101",open_hours:"10:00 AM - 8:00 PM",featured:false,verified:true}
];

/** Load all salons — API with graceful fallback to embedded data. */
async function loadSalons(){
  try{
    const res = await fetch('tables/salons?limit=100');
    if(!res.ok) throw new Error('api');
    const json = await res.json();
    if(json && Array.isArray(json.data) && json.data.length) return json.data;
    throw new Error('empty');
  }catch(e){
    return FALLBACK_SALONS;
  }
}

/** Load a single salon by id. */
async function loadSalon(id){
  try{
    const res = await fetch('tables/salons/'+encodeURIComponent(id));
    if(!res.ok) throw new Error('api');
    return await res.json();
  }catch(e){
    return FALLBACK_SALONS.find(s=>s.id===id) || null;
  }
}

/** Create a booking — API with localStorage fallback. */
async function createBooking(data){
  data.status = data.status || 'Pending';
  try{
    const res = await fetch('tables/bookings',{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)
    });
    if(!res.ok) throw new Error('api');
    const rec = await res.json();
    saveLocalBooking(rec);   // keep a local copy so "My Bookings" shows it offline too
    return rec;
  }catch(e){
    const rec = {...data,id:'local-'+Date.now(),created_at:Date.now()};
    saveLocalBooking(rec);
    return rec;
  }
}

/** Load bookings — merges API + local. */
async function loadBookings(){
  let apiRows = [];
  try{
    const res = await fetch('tables/bookings?limit=100&sort=created_at');
    if(res.ok){const json = await res.json(); apiRows = (json.data||[]);}
  }catch(e){/* ignore */}
  const local = getLocalBookings();
  // Merge, dedupe by id
  const map = {};
  [...apiRows,...local].forEach(b=>{if(b&&b.id) map[b.id]=b;});
  return Object.values(map).sort((a,b)=>(b.created_at||0)-(a.created_at||0));
}

/* ---- localStorage helpers ---- */
function getLocalBookings(){
  try{return JSON.parse(localStorage.getItem('glowcity_bookings')||'[]');}catch(e){return [];}
}
function saveLocalBooking(rec){
  const list = getLocalBookings();
  if(!list.find(b=>b.id===rec.id)) list.unshift(rec);
  localStorage.setItem('glowcity_bookings',JSON.stringify(list));
}
