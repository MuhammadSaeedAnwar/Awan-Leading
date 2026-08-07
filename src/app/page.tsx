"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/lib/supabase/types";
import {
  FaTruck as Truck, FaBox as Package, FaLocationDot as MapPin, FaPhone as Phone,
  FaEnvelope as Mail, FaClock as Clock, FaStar as Star, FaChevronRight as ChevronRight,
  FaChevronLeft as ChevronLeft, FaChevronDown as ChevronDown, FaBars as Menu,
  FaXmark as X, FaGlobe as Globe, FaMoon as Moon, FaSun as Sun,
  FaMagnifyingGlass as Search, FaBell as Bell, FaUser as User, FaGear as Settings,
  FaChartColumn as BarChart3, FaFileLines as FileText, FaUsers as Users,
  FaShieldHalved as Shield, FaRightFromBracket as LogOut, FaCalendarDays as Calendar,
  FaArrowRight as ArrowRight, FaCheck as Check, FaWarehouse as Warehouse,
  FaBuilding as Building2, FaBolt as Zap, FaRoute as Route,
  FaBoxesStacked as Container, FaWeightHanging as Weight,
  FaCommentDots as MessageCircle, FaPaperPlane as Send, FaDownload as Download,
  FaFilter as Filter, FaEllipsisVertical as MoreVertical, FaEye as Eye,
  FaArrowTrendUp as TrendingUp, FaChartLine as Activity, FaCircleCheck as CheckCircle2,
  FaBoxOpen as Boxes, FaWrench as Wrench, FaCreditCard as CreditCard,
  FaReceipt as Receipt, FaClipboardList as ClipboardList, FaHeadset as Headphones,
  FaFacebook as Facebook, FaXTwitter as Twitter, FaInstagram as Instagram,
  FaLinkedin as Linkedin, FaLocationArrow as Navigation, FaStopwatch as Timer,
  FaPlus as Plus, FaPenToSquare as Edit, FaAward as Award, FaBullseye as Target,
  FaHeart as Heart, FaCamera as Camera, FaCar as Car
} from "react-icons/fa6";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ─── TRANSLATIONS ─────────────────────────────────────────────────
const translations = {
  en: {
    nav: { home: "Home", about: "About", services: "Services", fleet: "Equipment", booking: "Book Now", contact: "Contact", login: "Login", dashboard: "Dashboard" },
    hero: { title: "Leading Heavy Equipment Rental", subtitle: "Reliable. Efficient. Nationwide.", desc: "Awan Leading Company's trusted fleet of cranes, forklifts, generators, and specialized machinery for construction and industrial projects. From Jeddah to every corner of the Kingdom.", bookNow: "Book Now", requestQuote: "Request Quote", trackShipment: "Track Shipment" },
    stats: { bookings: "Rentals Completed", clients: "Happy Clients", vehicles: "Equipment Units", cities: "Cities Covered" },
    services: { title: "Our Services", subtitle: "Comprehensive heavy equipment rental solutions tailored to your project" },
    fleet: { title: "Our Equipment", subtitle: "Modern, well-maintained machinery ready for your project", capacity: "Capacity", maxWeight: "Specification", available: "Available", booked: "Booked", bookThis: "Book This Equipment" },
    testimonials: { title: "What Our Clients Say", subtitle: "Trusted by leading companies across Saudi Arabia" },
    faq: { title: "Frequently Asked Questions", subtitle: "Everything you need to know about our services" },
    contact: { title: "Get In Touch", subtitle: "We're here to help with your equipment rental needs", name: "Full Name", email: "Email Address", phone: "Phone Number", message: "Your Message", send: "Send Message", address: "Jeddah, Saudi Arabia", hours: "Sat-Thu: 8AM - 10PM" },
    booking: { title: "Book Equipment", subtitle: "Fill in your rental details", customerName: "Full Name", company: "Company Name", phone: "Phone", whatsapp: "WhatsApp", email: "Email", pickupAddr: "Project Site Address", dropoffAddr: "Delivery Address", pickupDate: "Start Date", pickupTime: "Start Time", vehicleType: "Equipment Type", cargoType: "Project Type", weight: "Required Capacity (Tons)", dimensions: "Required Height / Length", urgency: "Rental Duration", instructions: "Special Instructions", attachments: "Attachments", submit: "Submit Booking", normal: "Daily", express: "Weekly", urgent: "Monthly", success: "Booking submitted successfully!" },
    about: { title: "About Awan Leading Company", story: "Our Story", mission: "Our Mission", vision: "Our Vision", values: "Our Goals", whyUs: "Why Choose Us", certs: "Certifications" },
    dashboard: { overview: "Overview", bookings: "Bookings", profile: "Profile", invoices: "Invoices", tracking: "Tracking", support: "Support", notifications: "Notifications", addresses: "Saved Addresses" },
    admin: { dashboard: "Dashboard", bookings: "Bookings", customers: "Customers", drivers: "Drivers", fleet: "Equipment", invoices: "Invoices", reports: "Reports", settings: "Settings", revenue: "Revenue", totalBookings: "Total Bookings", activeDrivers: "Active Drivers", fleetUtil: "Equipment Utilization" },
    status: { pending: "Pending", confirmed: "Confirmed", assigned: "Assigned", dispatched: "Dispatched", pickup: "Pickup Done", transit: "In Transit", delivered: "Delivered", completed: "Completed", cancelled: "Cancelled" },
    footer: { desc: "Awan Leading Company for Logistics is Saudi Arabia's trusted partner for heavy equipment rental, delivering excellence from Jeddah to every corner of the Kingdom.", quickLinks: "Quick Links", contactInfo: "Contact Info", newsletter: "Newsletter", emailPlaceholder: "Enter your email", subscribe: "Subscribe", rights: "All rights reserved." },
    cta: { title: "Ready for Your Next Project?", subtitle: "Get a free quote or book your equipment today.", getQuote: "Get Free Quote" }
  },
  ar: {
    nav: { home: "الرئيسية", about: "عن الشركة", services: "خدماتنا", fleet: "معداتنا", booking: "احجز الآن", contact: "اتصل بنا", login: "تسجيل الدخول", dashboard: "لوحة التحكم" },
    hero: { title: "الشركة الرائدة في تأجير المعدات الثقيلة", subtitle: "موثوقة. فعّالة. على مستوى المملكة.", desc: "أوان للنقل شريكك الموثوق بأسطول من الرافعات والشاحنات الرافعة والمولدات والمعدات المتخصصة لمشاريع البناء والصناعة. من جدة إلى كل ركن في المملكة.", bookNow: "احجز الآن", requestQuote: "طلب عرض سعر", trackShipment: "تتبع الشحنة" },
    stats: { bookings: "عمليات تأجير مكتملة", clients: "عملاء سعداء", vehicles: "وحدات معدات", cities: "مدن مغطاة" },
    services: { title: "خدماتنا", subtitle: "حلول تأجير معدات ثقيلة شاملة مصممة لمشروعك" },
    fleet: { title: "معداتنا", subtitle: "معدات حديثة وجاهزة لمشروعك", capacity: "السعة", maxWeight: "المواصفات", available: "متاح", booked: "محجوز", bookThis: "احجز هذه المعدة" },
    testimonials: { title: "ماذا يقول عملاؤنا", subtitle: "موثوق من قبل الشركات الرائدة في المملكة" },
    faq: { title: "الأسئلة الشائعة", subtitle: "كل ما تحتاج معرفته عن خدماتنا" },
    contact: { title: "تواصل معنا", subtitle: "نحن هنا لمساعدتك في احتياجات تأجير المعدات", name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف", message: "رسالتك", send: "إرسال الرسالة", address: "جدة، المملكة العربية السعودية", hours: "السبت-الخميس: ٨ص - ١٠م" },
    booking: { title: "حجز معدات", subtitle: "أدخل تفاصيل التأجير", customerName: "الاسم الكامل", company: "اسم الشركة", phone: "الهاتف", whatsapp: "واتساب", email: "البريد الإلكتروني", pickupAddr: "عنوان موقع المشروع", dropoffAddr: "عنوان التسليم", pickupDate: "تاريخ البدء", pickupTime: "وقت البدء", vehicleType: "نوع المعدة", cargoType: "نوع المشروع", weight: "السعة المطلوبة (طن)", dimensions: "الارتفاع / الطول المطلوب", urgency: "مدة التأجير", instructions: "تعليمات خاصة", attachments: "المرفقات", submit: "إرسال الحجز", normal: "يومي", express: "أسبوعي", urgent: "شهري", success: "تم إرسال الحجز بنجاح!" },
    about: { title: "عن أوان للنقل", story: "قصتنا", mission: "مهمتنا", vision: "رؤيتنا", values: "أهدافنا", whyUs: "لماذا تختارنا", certs: "الشهادات" },
    dashboard: { overview: "نظرة عامة", bookings: "الحجوزات", profile: "الملف الشخصي", invoices: "الفواتير", tracking: "التتبع", support: "الدعم", notifications: "الإشعارات", addresses: "العناوين المحفوظة" },
    admin: { dashboard: "لوحة التحكم", bookings: "الحجوزات", customers: "العملاء", drivers: "السائقين", fleet: "المعدات", invoices: "الفواتير", reports: "التقارير", settings: "الإعدادات", revenue: "الإيرادات", totalBookings: "إجمالي الحجوزات", activeDrivers: "السائقين النشطين", fleetUtil: "استخدام المعدات" },
    status: { pending: "قيد الانتظار", confirmed: "مؤكد", assigned: "معين", dispatched: "تم الإرسال", pickup: "تم الاستلام", transit: "في الطريق", delivered: "تم التسليم", completed: "مكتمل", cancelled: "ملغي" },
    footer: { desc: "أوان للنقل شركة رائدة في تأجير المعدات الثقيلة في المملكة العربية السعودية، تقدم التميز من جدة إلى كل ركن في المملكة.", quickLinks: "روابط سريعة", contactInfo: "معلومات الاتصال", newsletter: "النشرة الإخبارية", emailPlaceholder: "أدخل بريدك الإلكتروني", subscribe: "اشترك", rights: "جميع الحقوق محفوظة." },
    cta: { title: "مستعد لمشروعك القادم؟", subtitle: "احصل على عرض سعر مجاني أو احجز معداتك اليوم.", getQuote: "عرض سعر مجاني" }
  }
};

const rentalPlansData = [
  { icon: Clock, nameEn: "Daily Flexibility", nameAr: "المرونة اليومية", descEn: "Heavy equipment on a daily basis, providing the flexibility to meet short-term and immediate project needs.", descAr: "معدات ثقيلة على أساس يومي، توفر المرونة لتلبية احتياجات المشاريع قصيرة المدى والفورية." },
  { icon: Calendar, nameEn: "Weekly Convenience", nameAr: "الراحة الأسبوعية", descEn: "Rental services for projects with an extended timeframe, offering a cost-effective, convenient solution.", descAr: "خدمات تأجير للمشاريع ذات المدة الأطول، توفر حلاً مريحاً وفعالاً من حيث التكلفة." },
  { icon: Award, nameEn: "Monthly Commitment", nameAr: "الالتزام الشهري", descEn: "Sustained access to top-tier machinery for long-term projects, coupled with the assurance of regular maintenance.", descAr: "وصول مستمر لأفضل المعدات للمشاريع طويلة المدى، مع ضمان الصيانة الدورية." }
];

// ─── DATA ──────────────────────────────────────────────────────────
// Local copies (downloaded from Wikimedia Commons, see public/images/equipment)
// avoid depending on live hotlinking, which Wikimedia rate-limits aggressively.
const EQUIPMENT_IMAGES: Record<string, string> = {
  "Mobile_crane.jpg": "/images/equipment/mobile-crane.jpg",
  "Forklift-Truck.jpg": "/images/equipment/forklift.jpg",
  "Cumminspower.jpg": "/images/equipment/diesel-generator.jpg",
  "Truck-mounted_crane.jpg": "/images/equipment/boom-truck.jpg",
  "Talbert_Lowboy_Trailer.jpg": "/images/equipment/lowbed-trailer.jpg",
  "Swift_flatbed_colorado.JPG": "/images/equipment/flatbed-trailer.jpg",
  "Scissor_Lift_Aerial_Work_Platform.JPG": "/images/equipment/scissor-lift.jpg",
  "Straight_Boom_Lift_with_telescopic_boom_extended.jpg": "/images/equipment/man-lift.jpg",
  "Liebherr_314_excavator.JPG": "/images/equipment/excavator.jpg",
  "Manitou_telehandler_in_2013.JPG": "/images/equipment/telehandler.jpg",
};
const WIKIMEDIA = (file: string) => EQUIPMENT_IMAGES[file] ?? "";

const servicesData = [
  { icon: Weight, image: WIKIMEDIA("Mobile_crane.jpg"), nameEn: "Crane Rental", nameAr: "تأجير الرافعات", descEn: "Specialized crane operations from 20 to 500 tons, ensuring safe and efficient lifting for diverse projects.", descAr: "عمليات رفع متخصصة من 20 إلى 500 طن، تضمن حلول رفع آمنة وفعالة لمشاريع متنوعة." },
  { icon: Package, image: WIKIMEDIA("Forklift-Truck.jpg"), nameEn: "Forklift Rental", nameAr: "تأجير الرافعات الشوكية", descEn: "Efficient material handling with forklift capacities from 2 to 25 tons for seamless logistics on site.", descAr: "مناولة فعالة للمواد برافعات شوكية بسعة من 2 إلى 25 طن لخدمات لوجستية سلسة في الموقع." },
  { icon: Zap, image: WIKIMEDIA("Cumminspower.jpg"), nameEn: "Generator Rental", nameAr: "تأجير المولدات", descEn: "Reliable power generation from 50 kVA to 1000 kVA for construction sites, facilities, and events.", descAr: "توليد طاقة موثوق من 50 إلى 1000 كيلوفولت أمبير لمواقع البناء والمرافق والفعاليات." },
  { icon: Truck, image: WIKIMEDIA("Truck-mounted_crane.jpg"), nameEn: "Boom Truck Rental", nameAr: "تأجير الشاحنات الرافعة", descEn: "Truck-mounted cranes from 3 to 15 tons for versatile lifting and loading on tight sites.", descAr: "رافعات مثبتة على شاحنات من 3 إلى 15 طن لعمليات رفع وتحميل مرنة في المواقع الضيقة." },
  { icon: Container, image: WIKIMEDIA("Talbert_Lowboy_Trailer.jpg"), nameEn: "Lowbed Transport", nameAr: "نقل بمقطورات منخفضة", descEn: "Normal and hydraulic lowbed trailers specialized for oversized and extra-heavy machinery.", descAr: "مقطورات منخفضة عادية وهيدروليكية متخصصة للآلات الكبيرة والثقيلة جداً." },
  { icon: Route, image: WIKIMEDIA("Swift_flatbed_colorado.JPG"), nameEn: "Flatbed Trailers", nameAr: "مقطورات مسطحة", descEn: "Flatbed trailers from 12 to 24 meters for long cargo, pipes, and structural steel.", descAr: "مقطورات مسطحة من 12 إلى 24 متر للبضائع الطويلة والأنابيب والحديد الإنشائي." },
  { icon: TrendingUp, image: WIKIMEDIA("Straight_Boom_Lift_with_telescopic_boom_extended.jpg"), nameEn: "Access & Lift Rental", nameAr: "تأجير معدات الوصول والرفع", descEn: "Scissor lifts (8-18m) and man lifts (12-47m) for safe elevated access on any project.", descAr: "رافعات مقصية (8-18م) ورافعات بشرية (12-47م) للوصول الآمن للأماكن المرتفعة." },
  { icon: Wrench, image: WIKIMEDIA("Liebherr_314_excavator.JPG"), nameEn: "Excavation & Telehandlers", nameAr: "الحفر والرافعات الشوكية الطويلة", descEn: "Excavators and telehandler booms for earthmoving and flexible material placement.", descAr: "حفارات ورافعات شوكية طويلة لأعمال الحفر ووضع المواد بمرونة." }
];

const fleetData = [
  { image: WIKIMEDIA("Mobile_crane.jpg"), nameEn: "Mobile Crane", nameAr: "رافعة متحركة", capacity: "20 - 500 Tons", weight: "Full Range Fleet", available: true, descEn: "Precise crane operations for heavy lifting on construction and industrial projects.", descAr: "عمليات رفع دقيقة للرفع الثقيل في مشاريع البناء والصناعة." },
  { image: WIKIMEDIA("Forklift-Truck.jpg"), nameEn: "Forklift", nameAr: "رافعة شوكية", capacity: "2 - 25 Tons", weight: "Diesel & Electric", available: true, descEn: "Efficient material handling solutions for seamless logistics within your workspace.", descAr: "حلول مناولة فعالة للمواد لخدمات لوجستية سلسة في مكان العمل." },
  { image: WIKIMEDIA("Cumminspower.jpg"), nameEn: "Diesel Generator", nameAr: "مولد ديزل", capacity: "50 - 1000 kVA", weight: "Silent & Standard", available: true, descEn: "Reliable power backup for construction sites, facilities, and events.", descAr: "طاقة احتياطية موثوقة لمواقع البناء والمرافق والفعاليات." },
  { image: WIKIMEDIA("Truck-mounted_crane.jpg"), nameEn: "Boom Truck", nameAr: "شاحنة رافعة", capacity: "3 - 15 Tons", weight: "Truck-Mounted Crane", available: true, descEn: "Versatile lifting and loading equipment for tight and busy sites.", descAr: "معدات رفع وتحميل متعددة الاستخدامات للمواقع الضيقة والمزدحمة." },
  { image: WIKIMEDIA("Talbert_Lowboy_Trailer.jpg"), nameEn: "Lowbed Trailer", nameAr: "مقطورة منخفضة", capacity: "Normal & Hydraulic", weight: "Heavy Machinery Transport", available: false, descEn: "Specialized transport for oversized and extra-heavy machinery.", descAr: "نقل متخصص للآلات الكبيرة والثقيلة جداً." },
  { image: WIKIMEDIA("Swift_flatbed_colorado.JPG"), nameEn: "Flatbed Trailer", nameAr: "مقطورة مسطحة", capacity: "12 - 24 Meters", weight: "Multiple Configurations", available: true, descEn: "For long cargo, pipes, and structural steel across the Kingdom.", descAr: "للبضائع الطويلة والأنابيب والحديد الإنشائي في جميع أنحاء المملكة." },
  { image: WIKIMEDIA("Scissor_Lift_Aerial_Work_Platform.JPG"), nameEn: "Scissor Lift", nameAr: "رافعة مقصية", capacity: "8 - 18 Meters", weight: "Indoor & Outdoor", available: true, descEn: "Safe elevated access for maintenance and installation work.", descAr: "وصول آمن للأماكن المرتفعة لأعمال الصيانة والتركيب." },
  { image: WIKIMEDIA("Straight_Boom_Lift_with_telescopic_boom_extended.jpg"), nameEn: "Man Lift / Boom Lift", nameAr: "رافعة بشرية", capacity: "12 - 47 Meters", weight: "Articulating & Telescopic", available: true, descEn: "Extended reach for high-access construction and inspection work.", descAr: "مدى وصول ممتد لأعمال البناء والفحص في المرتفعات." },
  { image: WIKIMEDIA("Liebherr_314_excavator.JPG"), nameEn: "Excavator", nameAr: "حفارة", capacity: "Multiple Sizes", weight: "Tracked & Wheeled", available: true, descEn: "Earthmoving and excavation equipment for any project scale.", descAr: "معدات حفر ونقل تراب لمشاريع بجميع الأحجام." },
  { image: WIKIMEDIA("Manitou_telehandler_in_2013.JPG"), nameEn: "Telehandler Boom", nameAr: "رافعة شوكية طويلة", capacity: "Multiple Capacities", weight: "All-Terrain", available: true, descEn: "Flexible lifting and placement on rough and uneven terrain.", descAr: "رفع ووضع مرن على التضاريس الوعرة وغير المستوية." }
];

const testimonialsData = [
  { name: "Ahmed Al-Rashid", company: "Saudi Construction Co.", rating: 5, textEn: "Awan Leading Company has been our go-to equipment rental partner for years. Their heavy equipment fleet is unmatched in reliability.", textAr: "أوان للنقل شريكنا المفضل في تأجير المعدات منذ سنوات. أسطول معداتهم الثقيلة لا مثيل له في الموثوقية." },
  { name: "Fatima Hassan", company: "Gulf Trading LLC", rating: 5, textEn: "The booking system is seamless and the real-time tracking gives us complete peace of mind. Highly recommended.", textAr: "نظام الحجز سلس والتتبع المباشر يمنحنا راحة بال تامة. موصى به بشدة." },
  { name: "Omar Khalid", company: "Jeddah Imports", rating: 5, textEn: "Professional drivers, well-maintained fleet, and excellent customer service. They handle our cargo with exceptional care.", textAr: "سائقين محترفين وأسطول صيانة ممتازة وخدمة عملاء متميزة." }
];

const faqData = [
  { qEn: "How do I rent equipment?", qAr: "كيف أستأجر المعدات؟", aEn: "You can book through our website by clicking 'Book Now', calling our office, or sending a WhatsApp message. Our team will confirm your booking within 30 minutes.", aAr: "يمكنك الحجز عبر موقعنا بالنقر على 'احجز الآن'، أو الاتصال بمكتبنا، أو إرسال رسالة واتساب. سيؤكد فريقنا حجزك خلال 30 دقيقة." },
  { qEn: "What rental durations do you offer?", qAr: "ما مدد التأجير المتوفرة؟", aEn: "We offer daily, weekly, and monthly rental plans. Daily rentals suit short-term needs, weekly plans are cost-effective for extended work, and monthly plans give long-term projects sustained access with regular maintenance included.", aAr: "نقدم خطط تأجير يومية وأسبوعية وشهرية. التأجير اليومي مناسب للاحتياجات قصيرة المدى، والأسبوعي فعال من حيث التكلفة للأعمال الممتدة، والشهري يوفر وصولاً مستمراً للمشاريع طويلة المدى مع صيانة دورية." },
  { qEn: "Do you provide maintenance for rented equipment?", qAr: "هل توفرون صيانة للمعدات المؤجرة؟", aEn: "Yes, all our equipment is maintained to the highest standards, and monthly rental plans include the assurance of regular maintenance throughout your project.", aAr: "نعم، جميع معداتنا تخضع للصيانة بأعلى المعايير، وتشمل خطط التأجير الشهرية ضمان الصيانة الدورية طوال مدة مشروعك." },
  { qEn: "What payment methods do you accept?", qAr: "ما طرق الدفع المقبولة؟", aEn: "We accept cash, bank transfer, Mada, Visa, and Mastercard. Corporate accounts can set up invoiced billing.", aAr: "نقبل النقد والتحويل البنكي ومدى وفيزا وماستركارد. يمكن لحسابات الشركات إعداد الفوترة." }
];

const chartData = [
  { month: "Jan", revenue: 45000, bookings: 120 },
  { month: "Feb", revenue: 52000, bookings: 145 },
  { month: "Mar", revenue: 48000, bookings: 132 },
  { month: "Apr", revenue: 61000, bookings: 178 },
  { month: "May", revenue: 55000, bookings: 156 },
  { month: "Jun", revenue: 67000, bookings: 198 },
  { month: "Jul", revenue: 72000, bookings: 215 }
];

const pieData = [
  { name: "Local", value: 35, color: "#C8102E" },
  { name: "Intercity", value: 28, color: "#DC2626" },
  { name: "Heavy Eq.", value: 20, color: "#7A0C18" },
  { name: "Express", value: 17, color: "#22C55E" }
];

const sampleBookings = [
  { id: "AWN-2026-0847", customer: "Ahmed Al-Rashid", from: "Jeddah", to: "Riyadh", date: "2026-07-28", status: "transit", vehicle: "Mobile Crane", amount: "SAR 4,500" },
  { id: "AWN-2026-0846", customer: "Fatima Hassan", from: "Jeddah", to: "Dammam", date: "2026-07-28", status: "confirmed", vehicle: "Forklift", amount: "SAR 2,800" },
  { id: "AWN-2026-0845", customer: "Omar Khalid", from: "Mecca", to: "Jeddah", date: "2026-07-27", status: "delivered", vehicle: "Diesel Generator", amount: "SAR 850" },
  { id: "AWN-2026-0844", customer: "Sara Mohammed", from: "Jeddah", to: "Medina", date: "2026-07-27", status: "pending", vehicle: "Boom Truck", amount: "SAR 3,200" },
  { id: "AWN-2026-0843", customer: "Khalid Ibrahim", from: "Riyadh", to: "Jeddah", date: "2026-07-26", status: "completed", vehicle: "Lowbed Trailer", amount: "SAR 8,750" },
  { id: "AWN-2026-0842", customer: "Nora Al-Saud", from: "Jeddah", to: "Taif", date: "2026-07-26", status: "assigned", vehicle: "Scissor Lift", amount: "SAR 1,900" }
];

// ─── STATUS CONFIG ─────────────────────────────────────────────────
const statusConfig: Record<string, { color: string; dot: string }> = {
  pending: { color: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
  confirmed: { color: "bg-blue-100 text-blue-800", dot: "bg-blue-500" },
  assigned: { color: "bg-purple-100 text-purple-800", dot: "bg-purple-500" },
  dispatched: { color: "bg-cyan-100 text-cyan-800", dot: "bg-cyan-500" },
  transit: { color: "bg-orange-100 text-orange-800", dot: "bg-orange-500" },
  delivered: { color: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" },
  completed: { color: "bg-green-100 text-green-800", dot: "bg-green-700" },
  cancelled: { color: "bg-red-100 text-red-800", dot: "bg-red-500" }
};

const bookingSteps = ["pending", "confirmed", "assigned", "dispatched", "transit", "delivered", "completed"];

// ─── TOAST NOTIFICATIONS ─────────────────────────────────────────────
// Module-level pub/sub (not React state) so triggering a toast from any
// section — e.g. the Contact form embedded in the middle of the scrolling
// home page — never re-renders the rest of the page or resets scroll
// position, the same class of bug fixed for the FAQ accordion above.
type ToastMsg = { id: number; message: string; type: "success" | "error" };
let toastListeners: Array<(msg: ToastMsg) => void> = [];
let toastIdCounter = 0;
function showToast(message: string, type: "success" | "error" = "success") {
  const msg: ToastMsg = { id: ++toastIdCounter, message, type };
  toastListeners.forEach((fn) => fn(msg));
}

// ─── MAIN APP ──────────────────────────────────────────────────────
export default function AwanTransport() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedBookingNumber, setConfirmedBookingNumber] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [custTab, setCustTab] = useState("overview");
  const [loginModal, setLoginModal] = useState(false);
  const [loginRole, setLoginRole] = useState("customer");
  const t = translations[lang];
  const isRtl = lang === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  const supabase = useMemo(() => createClient(), []);
  const { user, profile, signIn, signUp, signOut } = useAuth();

  useEffect(() => {
    if (page === "admin" && profile && profile.role !== "admin") setPage("home");
    if (page === "customer-dashboard" && !user) setPage("home");
  }, [page, user, profile]);

  const navigate = (p: string) => { setPage(p); setMobileMenu(false); window.scrollTo(0, 0); };

  const [pendingScroll, setPendingScroll] = useState<string | null>(null);

  useEffect(() => {
    if (page === "home" && pendingScroll) {
      const id = pendingScroll;
      setPendingScroll(null);
      requestAnimationFrame(() => {
        if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
        else document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [page, pendingScroll]);

  const goToSection = (id: string) => {
    setMobileMenu(false);
    if (page !== "home") {
      setPendingScroll(id);
      setPage("home");
    } else if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Theme classes
  const bg = dark ? "bg-[#171717]" : "bg-white";
  const bgAlt = dark ? "bg-[#111D33]" : "bg-[#F8FAFC]";
  const bgCard = dark ? "bg-[#262626]/80" : "bg-white";
  const text = dark ? "text-gray-100" : "text-[#1E293B]";
  const textMuted = dark ? "text-gray-400" : "text-[#64748B]";
  const border = dark ? "border-[#404040]" : "border-gray-200";

  // ─── HEADER ────────────────────────────────────────────────────
  const Header = () => {
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY || 0);
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const scrolled = scrollY > 20;
    const navItems = [
      { key: "home", label: t.nav.home, isPage: false },
      { key: "about", label: t.nav.about, isPage: false },
      { key: "services", label: t.nav.services, isPage: false },
      { key: "fleet", label: t.nav.fleet, isPage: false },
      { key: "track", label: t.hero.trackShipment, isPage: true },
      { key: "contact", label: t.nav.contact, isPage: false }
    ];
    const handleNavClick = (item: { key: string; isPage: boolean }) => {
      if (item.isPage) navigate(item.key);
      else goToSection(item.key);
    };
    return (
      <header dir={dir} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? `${dark ? "bg-[#171717]/95" : "bg-white/95"} backdrop-blur-xl shadow-lg` : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
          <button onClick={() => goToSection("home")} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8102E] to-[#DC2626] flex items-center justify-center shadow-lg">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className={`font-bold text-lg leading-tight ${scrolled || page !== "home" ? text : "text-white"}`}>AWAN LEADING</div>
              <div className={`text-[10px] tracking-[0.2em] uppercase ${scrolled || page !== "home" ? textMuted : "text-white/70"}`}>Company For Logistics</div>
            </div>
          </button>
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button key={item.key} onClick={() => handleNavClick(item)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${page === item.key ? "bg-[#C8102E]/10 text-[#C8102E]" : `${scrolled || page !== "home" ? textMuted : "text-white/80"} hover:bg-white/10`}`}>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className={`p-2 rounded-lg transition-all hover:bg-white/10 ${scrolled || page !== "home" ? textMuted : "text-white/80"}`} title="Switch Language">
              <Globe className="w-4 h-4" />
            </button>
            <button onClick={() => setDark(!dark)} className={`p-2 rounded-lg transition-all hover:bg-white/10 ${scrolled || page !== "home" ? textMuted : "text-white/80"}`}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {user ? (
              <button onClick={() => navigate(profile?.role === "admin" ? "admin" : "customer-dashboard")} className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${scrolled || page !== "home" ? `${textMuted} hover:bg-gray-100` : "text-white/80 hover:bg-white/10"}`}>
                <User className="w-4 h-4" />{t.nav.dashboard}
              </button>
            ) : (
              <button onClick={() => setLoginModal(true)} className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${scrolled || page !== "home" ? `${textMuted} hover:bg-gray-100` : "text-white/80 hover:bg-white/10"}`}>
                <User className="w-4 h-4" />{t.nav.login}
              </button>
            )}
            <button onClick={() => navigate("booking")} className="hidden sm:block px-4 py-2 bg-gradient-to-r from-[#DC2626] to-[#7A0C18] text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              {t.nav.booking}
            </button>
            <button onClick={() => setMobileMenu(true)} className={`lg:hidden p-2 ${scrolled || page !== "home" ? text : "text-white"}`}>
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenu(false)} />
            <div className={`absolute ${isRtl ? "left-0" : "right-0"} top-0 bottom-0 w-72 ${dark ? "bg-[#171717]" : "bg-white"} shadow-2xl p-6`}>
              <button onClick={() => setMobileMenu(false)} className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} ${text}`}><X className="w-5 h-5" /></button>
              <div className="mt-12 flex flex-col gap-2">
                {navItems.map(item => (
                  <button key={item.key} onClick={() => handleNavClick(item)} className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${page === item.key ? "bg-[#C8102E]/10 text-[#C8102E]" : `${text} hover:bg-gray-50`}`}>
                    {item.label}
                  </button>
                ))}
                <hr className={`my-3 ${border}`} />
                <button onClick={() => { navigate("booking"); setMobileMenu(false); }} className="px-4 py-3 bg-gradient-to-r from-[#DC2626] to-[#7A0C18] text-white rounded-xl text-sm font-semibold">
                  {t.nav.booking}
                </button>
                {user ? (
                  <button onClick={() => { navigate(profile?.role === "admin" ? "admin" : "customer-dashboard"); }} className={`px-4 py-3 rounded-xl text-sm font-medium ${text} border ${border}`}>
                    {t.nav.dashboard}
                  </button>
                ) : (
                  <button onClick={() => { setLoginModal(true); setMobileMenu(false); }} className={`px-4 py-3 rounded-xl text-sm font-medium ${text} border ${border}`}>
                    {t.nav.login}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    );
  };

  // ─── TOAST CONTAINER ───────────────────────────────────────────
  const ToastContainer = () => {
    const [toasts, setToasts] = useState<ToastMsg[]>([]);

    useEffect(() => {
      const handler = (msg: ToastMsg) => {
        setToasts((prev) => [...prev, msg]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== msg.id)), 4000);
      };
      toastListeners.push(handler);
      return () => { toastListeners = toastListeners.filter((fn) => fn !== handler); };
    }, []);

    if (toasts.length === 0) return null;

    return (
      <div dir={dir} className={`fixed top-20 ${isRtl ? "left-4" : "right-4"} z-[100] flex flex-col gap-2 max-w-sm`}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium text-white animate-[fadeIn_0.2s_ease-out] ${t.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
          >
            {t.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <X className="w-5 h-5 flex-shrink-0" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    );
  };

  // ─── LOGIN MODAL ───────────────────────────────────────────────
  const LoginModal = () => {
    const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [authError, setAuthError] = useState<string | null>(null);
    const [authMsg, setAuthMsg] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    if (!loginModal) return null;

    const resetAndClose = () => {
      setLoginModal(false);
      setAuthError(null);
      setAuthMsg(null);
      setEmail("");
      setPassword("");
      setFullName("");
      setPhone("");
    };

    const handleSubmit = async () => {
      setAuthError(null);
      setAuthMsg(null);
      setSubmitting(true);
      try {
        if (authMode === "signup") {
          const { data, error } = await signUp(email, password, fullName, phone);
          if (error) { setAuthError(error.message); return; }
          if (!data.session) {
            setAuthMsg(isRtl ? "تحقق من بريدك الإلكتروني لتأكيد الحساب." : "Check your email to confirm your account.");
            return;
          }
          resetAndClose();
          showToast(isRtl ? `مرحباً ${fullName}! تم إنشاء حسابك بنجاح.` : `Welcome ${fullName}! Your account was created successfully.`, "success");
          navigate("customer-dashboard");
        } else {
          const { data, error } = await signIn(email, password);
          if (error || !data.user) { setAuthError(error?.message ?? "Sign in failed"); return; }
          const { data: profileRow } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();
          resetAndClose();
          showToast(isRtl ? "تم تسجيل الدخول بنجاح!" : "Signed in successfully!", "success");
          navigate(profileRow?.role === "admin" ? "admin" : "customer-dashboard");
        }
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={resetAndClose} />
        <div dir={dir} className={`relative w-full max-w-md ${bgCard} rounded-2xl shadow-2xl p-8 ${border} border`}>
          <button onClick={resetAndClose} className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} ${textMuted}`}><X className="w-5 h-5" /></button>
          <h3 className={`text-xl font-bold mb-6 ${text}`}>{t.nav.login}</h3>
          <div className={`flex rounded-xl ${dark ? "bg-[#171717]" : "bg-gray-100"} p-1 mb-6`}>
            {(["signin", "signup"] as const).map(mode => (
              <button key={mode} onClick={() => setAuthMode(mode)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authMode === mode ? "bg-[#C8102E] text-white shadow" : textMuted}`}>
                {mode === "signin" ? (isRtl ? "تسجيل الدخول" : "Sign In") : (isRtl ? "إنشاء حساب" : "Sign Up")}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {authMode === "signup" && (
              <>
                <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t.booking.customerName} className={`w-full px-4 py-3 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`} />
                <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder={t.booking.phone} className={`w-full px-4 py-3 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`} />
              </>
            )}
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder={t.booking.email} className={`w-full px-4 py-3 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`} />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className={`w-full px-4 py-3 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`} />
            {authError && <p className="text-sm text-red-500">{authError}</p>}
            {authMsg && <p className="text-sm text-emerald-500">{authMsg}</p>}
            <button disabled={submitting || !email || !password} onClick={handleSubmit} className="w-full py-3 bg-gradient-to-r from-[#C8102E] to-[#C8102E]/80 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
              {submitting ? (isRtl ? "جارٍ..." : "Please wait...") : authMode === "signin" ? t.nav.login : (isRtl ? "إنشاء حساب" : "Sign Up")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── HERO ──────────────────────────────────────────────────────
  const Hero = () => (
    <section dir={dir} id="home" className="relative min-h-[100vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#171717] via-[#262626] to-[#C8102E]" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DC2626' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#DC2626]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#C8102E]/20 rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-32 sm:py-40 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-8 border border-white/10">
            <MapPin className="w-4 h-4 text-[#DC2626]" />
            <span>Jeddah, Saudi Arabia</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
            {t.hero.title.split(" ").map((w, i) => (
              <span key={i} className={i >= t.hero.title.split(" ").length - 2 ? "text-[#DC2626]" : ""}>{w} </span>
            ))}
          </h1>
          <p className="text-lg sm:text-xl text-white/60 mb-4 font-medium tracking-wide">{t.hero.subtitle}</p>
          <p className="text-base text-white/40 mb-10 max-w-xl leading-relaxed">{t.hero.desc}</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate("booking")} className="group px-8 py-4 bg-gradient-to-r from-[#DC2626] to-[#7A0C18] text-white rounded-xl font-bold text-lg shadow-2xl shadow-[#DC2626]/30 hover:shadow-[#DC2626]/50 hover:scale-[1.02] transition-all flex items-center gap-2">
              {t.hero.bookNow}
              <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRtl ? "rotate-180" : ""}`} />
            </button>
            <button onClick={() => goToSection("contact")} className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all">
              {t.hero.requestQuote}
            </button>
            <button onClick={() => navigate("track")} className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all">
              {t.hero.trackShipment}
            </button>
          </div>
        </div>
        <div className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2">
          <div className="relative w-[420px] h-[300px]">
            <div className="absolute bottom-8 left-0 right-0 h-2 bg-[#DC2626]/30 rounded-full" />
            <div className="absolute bottom-10 left-8 w-[320px] h-[140px] bg-gradient-to-br from-[#C8102E]/40 to-[#C8102E]/20 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-center">
              <Truck className="w-20 h-20 text-white/30" />
            </div>
            <div className="absolute bottom-10 right-8 w-[100px] h-[100px] bg-gradient-to-br from-[#DC2626]/30 to-[#DC2626]/10 rounded-xl border border-white/10 backdrop-blur-sm flex items-center justify-center">
              <Package className="w-10 h-10 text-[#DC2626]/50" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );

  // ─── STATS ─────────────────────────────────────────────────────
  const Stats = () => {
    const items = [
      { value: "12,500+", label: t.stats.bookings, icon: ClipboardList },
      { value: "3,200+", label: t.stats.clients, icon: Users },
      { value: "150+", label: t.stats.vehicles, icon: Truck },
      { value: "45+", label: t.stats.cities, icon: MapPin }
    ];
    return (
      <section dir={dir} className={`${bgAlt} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, i) => (
              <div key={i} className={`${bgCard} rounded-2xl p-6 text-center shadow-sm ${border} border hover:shadow-lg transition-all group`}>
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#C8102E]/10 to-[#DC2626]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-[#C8102E]" />
                </div>
                <div className={`text-3xl font-black ${text} mb-1`}>{item.value}</div>
                <div className={`text-sm ${textMuted}`}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // ─── SERVICES ──────────────────────────────────────────────────
  const Services = () => (
    <section dir={dir} id="services" className={`${bg} py-20 sm:py-28`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8102E]/10 rounded-full text-[#C8102E] text-xs font-semibold mb-4 uppercase tracking-wider">
            <Boxes className="w-3.5 h-3.5" /> {t.services.title}
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black ${text} mb-4`}>{t.services.title}</h2>
          <p className={`${textMuted} max-w-xl mx-auto`}>{t.services.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((svc, i) => (
            <div key={i} className={`group ${bgCard} rounded-2xl overflow-hidden shadow-sm ${border} border hover:shadow-2xl hover:-translate-y-1.5 hover:border-[#C8102E]/40 transition-all duration-300 ease-out cursor-pointer`}>
              <div className="h-36 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={svc.image}
                  alt={isRtl ? svc.nameAr : svc.nameEn}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>
              <div className="px-6 pb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C8102E] to-[#C8102E]/70 flex items-center justify-center -mt-7 mb-4 relative z-10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 ease-out shadow-lg shadow-[#C8102E]/30 ring-4 ${dark ? "ring-[#262626]" : "ring-white"}`}>
                  <svc.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`font-bold text-lg mb-2 ${text} transition-colors duration-300 group-hover:text-[#C8102E]`}>{isRtl ? svc.nameAr : svc.nameEn}</h3>
                <p className={`text-sm ${textMuted} leading-relaxed`}>{isRtl ? svc.descAr : svc.descEn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ─── FLEET ─────────────────────────────────────────────────────
  const Fleet = () => (
    <section dir={dir} id="fleet" className={`${bgAlt} py-20 sm:py-28`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DC2626]/10 rounded-full text-[#DC2626] text-xs font-semibold mb-4 uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" /> {t.fleet.title}
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black ${text} mb-4`}>{t.fleet.title}</h2>
          <p className={`${textMuted} max-w-xl mx-auto`}>{t.fleet.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleetData.map((v, i) => (
            <div key={i} className={`${bgCard} rounded-2xl overflow-hidden shadow-sm ${border} border hover:shadow-2xl hover:-translate-y-1.5 hover:border-[#C8102E]/50 transition-all duration-300 ease-out group cursor-default`}>
              <div className="h-48 bg-[#262626] relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.image}
                  alt={isRtl ? v.nameAr : v.nameEn}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} transition-transform duration-300 group-hover:scale-105`}>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${v.available ? "bg-emerald-500/90 text-white" : "bg-red-500/90 text-white"}`}>
                    {v.available ? t.fleet.available : t.fleet.booked}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className={`font-bold text-lg mb-3 ${text} transition-colors duration-300 group-hover:text-[#C8102E]`}>{isRtl ? v.nameAr : v.nameEn}</h3>
                <p className={`text-sm ${textMuted} mb-4`}>{isRtl ? v.descAr : v.descEn}</p>
                <div className="flex items-center gap-4 mb-5">
                  <div className={`flex items-center gap-1.5 text-sm ${textMuted}`}>
                    <Package className="w-4 h-4 text-[#C8102E]" />
                    {v.capacity}
                  </div>
                  <div className={`flex items-center gap-1.5 text-sm ${textMuted}`}>
                    <Weight className="w-4 h-4 text-[#DC2626]" />
                    {v.weight}
                  </div>
                </div>
                <button onClick={() => navigate("booking")} disabled={!v.available} className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${v.available ? "bg-gradient-to-r from-[#C8102E] to-[#C8102E]/80 text-white hover:shadow-lg hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                  {t.fleet.bookThis}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ─── RENTAL PLANS ──────────────────────────────────────────────
  const RentalPlans = () => (
    <section dir={dir} className={`${bg} py-20 sm:py-28`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8102E]/10 rounded-full text-[#C8102E] text-xs font-semibold mb-4 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" /> {isRtl ? "خطط التأجير" : "Rental Plans"}
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black ${text} mb-4`}>{isRtl ? "خطط تأجير مصممة لك" : "Tailored Rental Plans"}</h2>
          <p className={`${textMuted} max-w-xl mx-auto`}>{isRtl ? "مرونة في مدة التأجير تناسب حجم مشروعك" : "Flexible rental durations that scale with your project"}</p>
        </div>
        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
          {rentalPlansData.map((p, i) => (
            <div key={i} className={`${bgCard} rounded-2xl p-8 text-center shadow-sm ${border} border hover:shadow-xl hover:-translate-y-1 transition-all`}>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#C8102E] to-[#7A0C18] flex items-center justify-center mb-5 shadow-lg shadow-[#C8102E]/20">
                <p.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`font-bold text-lg mb-2 ${text}`}>{isRtl ? p.nameAr : p.nameEn}</h3>
              <p className={`text-sm ${textMuted} leading-relaxed`}>{isRtl ? p.descAr : p.descEn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ─── TESTIMONIALS ──────────────────────────────────────────────
  const Testimonials = () => (
    <section dir={dir} className={`${bg} py-20 sm:py-28`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className={`text-3xl sm:text-4xl font-black ${text} mb-4`}>{t.testimonials.title}</h2>
          <p className={`${textMuted} max-w-xl mx-auto`}>{t.testimonials.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonialsData.map((tm, i) => (
            <div key={i} className={`${bgCard} rounded-2xl p-8 shadow-sm ${border} border hover:shadow-lg transition-all`}>
              <div className="flex gap-1 mb-4">{Array(tm.rating).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-[#DC2626] text-[#DC2626]" />)}</div>
              <p className={`text-sm ${textMuted} leading-relaxed mb-6 italic`}>&quot;{isRtl ? tm.textAr : tm.textEn}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C8102E] to-[#DC2626] flex items-center justify-center text-white font-bold text-sm">
                  {tm.name.charAt(0)}
                </div>
                <div>
                  <div className={`font-semibold text-sm ${text}`}>{tm.name}</div>
                  <div className={`text-xs ${textMuted}`}>{tm.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ─── FAQ ───────────────────────────────────────────────────────
  const FAQ = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    return (
    <section dir={dir} className={`${bgAlt} py-20 sm:py-28`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className={`text-3xl sm:text-4xl font-black ${text} mb-4`}>{t.faq.title}</h2>
          <p className={`${textMuted}`}>{t.faq.subtitle}</p>
        </div>
        <div className="space-y-3">
          {faqData.map((fq, i) => (
            <div key={i} className={`${bgCard} rounded-2xl ${border} border overflow-hidden shadow-sm`}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className={`w-full flex items-center justify-between p-5 text-left ${text}`}>
                <span className="font-semibold text-sm pr-4">{isRtl ? fq.qAr : fq.qEn}</span>
                <ChevronDown className={`w-5 h-5 ${textMuted} transition-transform flex-shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className={`px-5 pb-5 text-sm ${textMuted} leading-relaxed`}>{isRtl ? fq.aAr : fq.aEn}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
    );
  };

  // ─── CTA ───────────────────────────────────────────────────────
  const CTA = () => (
    <section dir={dir} className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#171717] via-[#262626] to-[#C8102E]" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #DC2626 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">{t.cta.title}</h2>
        <p className="text-white/60 mb-10 text-lg">{t.cta.subtitle}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate("booking")} className="px-10 py-4 bg-gradient-to-r from-[#DC2626] to-[#7A0C18] text-white rounded-xl font-bold text-lg shadow-2xl shadow-[#DC2626]/30 hover:scale-[1.02] transition-all">
            {t.hero.bookNow}
          </button>
          <button onClick={() => goToSection("contact")} className="px-10 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all">
            {t.cta.getQuote}
          </button>
        </div>
      </div>
    </section>
  );

  // ─── TRACK BOOKING ─────────────────────────────────────────────
  const TrackPage = () => {
    const [bookingNumber, setBookingNumber] = useState("");
    const [result, setResult] = useState<{ booking_number: string; status: string; equipment_type: string | null; start_date: string; created_at: string } | null>(null);
    const [searching, setSearching] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const handleTrack = async () => {
      if (!bookingNumber.trim()) return;
      setSearching(true);
      setNotFound(false);
      setResult(null);
      const { data, error } = await supabase.rpc("get_booking_status", { p_booking_number: bookingNumber.trim() });
      setSearching(false);
      if (error || !data || data.length === 0) { setNotFound(true); return; }
      setResult(data[0]);
    };

    return (
      <div dir={dir} className={`${bg} pt-24 min-h-screen`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h1 className={`text-3xl sm:text-4xl font-black ${text} mb-3`}>{t.hero.trackShipment}</h1>
            <p className={`${textMuted}`}>{isRtl ? "أدخل رقم الحجز لمعرفة حالة طلبك" : "Enter your booking number to see its current status"}</p>
          </div>
          <div className={`${bgCard} rounded-2xl p-6 sm:p-8 ${border} border shadow-sm`}>
            <div className="flex items-center gap-3 mb-6">
              <input
                value={bookingNumber}
                onChange={e => setBookingNumber(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleTrack()}
                placeholder={isRtl ? "مثال: AWN-2026-1234" : "e.g. AWN-2026-1234"}
                className={`flex-1 px-4 py-3 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`}
              />
              <button onClick={handleTrack} disabled={searching} className="px-6 py-3 bg-[#C8102E] text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                {searching ? (isRtl ? "جارٍ البحث..." : "Searching...") : (isRtl ? "تتبع" : "Track")}
              </button>
            </div>
            {notFound && (
              <p className="text-sm text-red-500 text-center">{isRtl ? "لم يتم العثور على حجز بهذا الرقم" : "No booking found with that number"}</p>
            )}
            {result && (
              <div>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div><span className={`text-xs ${textMuted}`}>{isRtl ? "رقم الحجز" : "Booking ID"}</span><div className={`font-mono font-bold text-sm ${text}`}>{result.booking_number}</div></div>
                  <div><span className={`text-xs ${textMuted}`}>{isRtl ? "المعدة" : "Equipment"}</span><div className={`font-semibold text-sm ${text}`}>{result.equipment_type || "—"}</div></div>
                </div>
                <TrackingTimeline currentStatus={result.status} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── CONTACT ───────────────────────────────────────────────────
  const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
      if (!form.name || !form.email || !form.message) {
        showToast(isRtl ? "يرجى تعبئة الاسم والبريد الإلكتروني والرسالة" : "Please fill in name, email, and message", "error");
        return;
      }
      setSending(true);
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message: form.message,
      });
      setSending(false);
      if (error) {
        showToast(isRtl ? "تعذر إرسال رسالتك. حاول مرة أخرى." : "Couldn't send your message. Please try again.", "error");
        return;
      }
      showToast(isRtl ? "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً." : "Message sent! We'll get back to you soon.", "success");
      setForm({ name: "", email: "", phone: "", message: "" });
    };

    return (
    <section dir={dir} id="contact" className={`${bg} py-20 sm:py-28`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className={`text-3xl sm:text-4xl font-black ${text} mb-4`}>{t.contact.title}</h2>
          <p className={`${textMuted}`}>{t.contact.subtitle}</p>
        </div>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: MapPin, label: t.contact.address, color: "text-[#C8102E]" },
              { icon: Phone, label: "+966 54 433 4933 | +966 50 469 1463", color: "text-[#DC2626]", href: "tel:+966544334933" },
              { icon: Mail, label: "Awanlogistics@yahoo.com", color: "text-[#7A0C18]", href: "mailto:Awanlogistics@yahoo.com" },
              { icon: Clock, label: t.contact.hours, color: "text-emerald-500" },
              { icon: MessageCircle, label: "WhatsApp: +966 54 433 4933", color: "text-green-500", href: "https://wa.me/966544334933" }
            ].map((item, i) => {
              const Wrapper = item.href ? "a" : "div";
              return (
                <Wrapper
                  key={i}
                  {...(item.href ? { href: item.href, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`flex items-start gap-4 ${bgCard} rounded-xl p-4 ${border} border ${item.href ? "hover:border-[#C8102E]/40 transition-all cursor-pointer" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-xl ${dark ? "bg-white/5" : "bg-gray-50"} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className={`text-sm ${text} pt-2`}>{item.label}</span>
                </Wrapper>
              );
            })}
          </div>
          <div className="lg:col-span-3">
            <div className={`${bgCard} rounded-2xl p-8 ${border} border shadow-sm`}>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t.contact.name} className={`px-4 py-3 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`} />
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" placeholder={t.contact.email} className={`px-4 py-3 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`} />
              </div>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} type="tel" placeholder={t.contact.phone} className={`w-full px-4 py-3 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30 mb-4`} />
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={5} placeholder={t.contact.message} className={`w-full px-4 py-3 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30 resize-none mb-4`} />
              <button onClick={handleSend} disabled={sending} className="w-full py-3.5 bg-gradient-to-r from-[#C8102E] to-[#C8102E]/80 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <Send className="w-4 h-4" /> {sending ? (isRtl ? "جارٍ الإرسال..." : "Sending...") : t.contact.send}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    );
  };

  // ─── ABOUT ─────────────────────────────────────────────────────
  const AboutPage = () => (
    <section dir={dir} id="about" className={`${bg} py-20 sm:py-28`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-black ${text} mb-4`}>{t.about.title}</h2>
          <p className={`${textMuted} max-w-2xl mx-auto`}>
            {isRtl ? "أوان للنقل، وجهتك الأولى لخدمات تأجير المعدات الثقيلة عالية الجودة في المملكة العربية السعودية" : "Your premier destination for top-notch heavy equipment rental services in Saudi Arabia"}
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="relative h-80 rounded-2xl bg-gradient-to-br from-[#171717] to-[#C8102E] overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <Truck className="w-20 h-20 text-white/20 mx-auto mb-4" />
              <div className="text-white/40 text-sm">Company Photo</div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-white font-bold">{isRtl ? "أوان للنقل" : "Awan Leading Company"}</div>
              <div className="text-white/60 text-sm">{isRtl ? "شريكك الموثوق لتأجير المعدات" : "Your trusted equipment rental partner"}</div>
            </div>
          </div>
          <div className="space-y-8">
            {[
              { title: t.about.mission, icon: Target, text: isRtl ? "تقديم خدمات تأجير معدات متميزة، مع تقديم التميز والموثوقية لعملائنا. نهدف إلى أن نكون شريكاً موثوقاً، نقدم أسطولاً عالي الجودة من المعدات المُصانة بعناية، ونساهم في نجاح وكفاءة مشاريع عملائنا." : "To provide top-notch rental equipment services, delivering excellence and reliability to our clients. We aim to be a trusted partner, offering a high-quality fleet of meticulously maintained equipment, and contributing to the success and efficiency of our clients' projects." },
              { title: t.about.vision, icon: Eye, text: isRtl ? "أن نكون الخيار الأول لخدمات تأجير المعدات، معروفين بالتزامنا بالتميز ورضا العملاء. نسعى لتوسيع وتنويع عروض معداتنا عالية الجودة باستمرار لتلبية الاحتياجات المتطورة للصناعات." : "To be the premier choice for rental equipment services, recognized for our commitment to excellence and customer satisfaction. We strive to continuously expand and diversify our high-quality equipment offerings, meeting the evolving needs of industries." },
            ].map((item, i) => (
              <div key={i} className={`${bgCard} rounded-2xl p-6 ${border} border`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8102E] to-[#DC2626] flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`font-bold text-lg ${text}`}>{item.title}</h3>
                </div>
                <p className={`text-sm ${textMuted} leading-relaxed`}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-20">
          <h2 className={`text-2xl font-black ${text} text-center mb-10`}>{t.about.values}</h2>
          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { icon: Heart, en: "Customer Satisfaction", ar: "رضا العملاء", descEn: "Our primary goal is to consistently surpass customer expectations by providing tailored solutions that meet their specific needs.", descAr: "هدفنا الأساسي هو تجاوز توقعات العملاء بشكل مستمر من خلال تقديم حلول مصممة خصيصاً لتلبية احتياجاتهم." },
              { icon: Shield, en: "Operational Excellence", ar: "التميز التشغيلي", descEn: "We strive for operational efficiency and safety, optimizing our diverse equipment fleet and implementing industry-leading practices.", descAr: "نسعى لتحقيق الكفاءة التشغيلية والسلامة، وتحسين أسطول معداتنا المتنوع وتطبيق أفضل الممارسات في الصناعة." },
              { icon: Zap, en: "Innovation and Leadership", ar: "الابتكار والقيادة", descEn: "Awan Leading Company aims to lead the industry through continuous innovation, setting new standards for quality.", descAr: "تهدف أوان للنقل إلى قيادة الصناعة من خلال الابتكار المستمر وتحديد معايير جديدة للجودة." }
            ].map((v, i) => (
              <div key={i} className={`${bgCard} rounded-2xl p-6 text-center ${border} border hover:shadow-lg transition-all`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DC2626]/20 to-[#7A0C18]/20 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-[#DC2626]" />
                </div>
                <h3 className={`font-bold mb-2 ${text}`}>{isRtl ? v.ar : v.en}</h3>
                <p className={`text-sm ${textMuted}`}>{isRtl ? v.descAr : v.descEn}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={`${bgCard} rounded-2xl p-8 ${border} border mb-4`}>
          <h2 className={`text-2xl font-black ${text} mb-4`}>{t.about.whyUs}</h2>
          <p className={`text-sm ${textMuted} leading-relaxed`}>
            {isRtl
              ? "اختر أوان للنقل لتلبية احتياجات تأجير معداتك، واستمتع بميزة أسطولنا المتنوع ونهجنا الذي يركز على العميل. تشمل مجموعتنا الواسعة من المعدات الرافعات والشاحنات الشوكية والرافعات المتخصصة، مما يتيح لنا تقديم حلول مصممة خصيصاً لكل مشروع. نحن ملتزمون بالتميز، ونحافظ على معداتنا بأعلى المعايير لضمان الموثوقية والكفاءة. ما يميزنا هو تفانينا الثابت في رضا العملاء - نجاحك هو أولويتنا."
              : "Choose Awan Leading Company for your equipment rental needs, and experience the unparalleled advantage of our diverse fleet and customer-centric approach. Our extensive range of equipment, from cranes and forklifts to specialized lifts, allows us to provide tailored solutions for every project. Committed to excellence, we maintain our equipment to the highest standards, ensuring reliability and efficiency. What sets us apart is our unwavering dedication to customer satisfaction — your success is our priority."}
          </p>
        </div>
      </div>
    </section>
  );

  // ─── BOOKING FORM ──────────────────────────────────────────────
  const BookingPage = () => {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [form, setForm] = useState({
      fullName: "",
      companyName: "",
      phone: "",
      whatsapp: "",
      email: user?.email ?? "",
      siteAddress: "",
      deliveryAddress: "",
      startDate: "",
      startTime: "",
      equipmentType: "",
      projectType: "",
      requiredCapacity: "",
      requiredDimensions: "",
      rentalDuration: "daily" as "daily" | "weekly" | "monthly",
      notes: "",
    });

    const update = (field: keyof typeof form) => (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => setForm(f => ({ ...f, [field]: e.target.value }));

    const canSubmit = form.fullName && form.phone && form.email && form.startDate;

    const handleSubmit = async () => {
      setSubmitError(null);
      setSubmitting(true);
      try {
        const bookingNumber = `AWN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const { error } = await supabase.from("bookings").insert({
          booking_number: bookingNumber,
          customer_id: user?.id ?? null,
          full_name: form.fullName,
          company_name: form.companyName || null,
          phone: form.phone,
          whatsapp: form.whatsapp || null,
          email: form.email,
          project_site_address: form.siteAddress || null,
          delivery_address: form.deliveryAddress || null,
          start_date: form.startDate,
          start_time: form.startTime || null,
          equipment_type: form.equipmentType || null,
          project_type: form.projectType || null,
          required_capacity: form.requiredCapacity || null,
          required_dimensions: form.requiredDimensions || null,
          rental_duration: form.rentalDuration,
          notes: form.notes || null,
        });
        if (error) {
          setSubmitError(error.message);
          showToast(isRtl ? "تعذر إرسال الحجز. حاول مرة أخرى." : "Couldn't submit your booking. Please try again.", "error");
          return;
        }
        setConfirmedBookingNumber(bookingNumber);
        setBookingSuccess(true);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div dir={dir} className={`${bg} pt-24 min-h-screen`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-10">
            <h1 className={`text-3xl sm:text-4xl font-black ${text} mb-3`}>{t.booking.title}</h1>
            <p className={`${textMuted}`}>{t.booking.subtitle}</p>
          </div>
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-[#C8102E] text-white" : `${dark ? "bg-[#262626]" : "bg-gray-100"} ${textMuted}`}`}>{s}</div>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-[#C8102E]" : dark ? "bg-[#404040]" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {bookingSuccess ? (
            <div className={`${bgCard} rounded-2xl p-12 text-center ${border} border shadow-lg`}>
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className={`text-2xl font-bold ${text} mb-3`}>{t.booking.success}</h2>
              <p className={`${textMuted} mb-2`}>Booking ID: <span className="font-mono font-bold text-[#C8102E]">{confirmedBookingNumber}</span></p>
              <p className={`text-sm ${textMuted} mb-8`}>{isRtl ? "سيتواصل فريقنا معك خلال 30 دقيقة" : "Our team will contact you within 30 minutes"}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => { setBookingSuccess(false); navigate("home"); }} className="px-6 py-3 bg-[#C8102E] text-white rounded-xl font-semibold">{t.nav.home}</button>
                <button onClick={() => navigate(user ? "customer-dashboard" : "track")} className={`px-6 py-3 rounded-xl font-semibold ${border} border ${text}`}>{user ? t.nav.dashboard : t.hero.trackShipment}</button>
              </div>
            </div>
          ) : (
            <div className={`${bgCard} rounded-2xl p-6 sm:p-8 ${border} border shadow-sm`}>
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className={`font-bold text-lg ${text} mb-4`}>{isRtl ? "معلومات العميل" : "Customer Information"}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={form.fullName} onChange={update("fullName")} type="text" placeholder={t.booking.customerName} className={`px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30 transition-all`} />
                    <input value={form.companyName} onChange={update("companyName")} type="text" placeholder={t.booking.company} className={`px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30 transition-all`} />
                    <input value={form.phone} onChange={update("phone")} type="tel" placeholder={t.booking.phone} className={`px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30 transition-all`} />
                    <input value={form.whatsapp} onChange={update("whatsapp")} type="tel" placeholder={t.booking.whatsapp} className={`px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30 transition-all`} />
                    <input value={form.email} onChange={update("email")} type="email" placeholder={t.booking.email} className={`sm:col-span-2 px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30 transition-all`} />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className={`font-bold text-lg ${text} mb-4`}>{isRtl ? "تفاصيل الشحنة" : "Shipment Details"}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={form.siteAddress} onChange={update("siteAddress")} placeholder={t.booking.pickupAddr} className={`px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`} />
                    <input value={form.deliveryAddress} onChange={update("deliveryAddress")} placeholder={t.booking.dropoffAddr} className={`px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`} />
                    <input value={form.startDate} onChange={update("startDate")} type="date" className={`px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`} />
                    <input value={form.startTime} onChange={update("startTime")} type="time" className={`px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`} />
                    <select value={form.equipmentType} onChange={update("equipmentType")} className={`px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`}>
                      <option value="">{t.booking.vehicleType}</option>
                      {fleetData.map((v, i) => <option key={i} value={v.nameEn}>{isRtl ? v.nameAr : v.nameEn}</option>)}
                    </select>
                    <select value={form.projectType} onChange={update("projectType")} className={`px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`}>
                      <option value="">{t.booking.cargoType}</option>
                      <option value="Construction Project">{isRtl ? "مشروع بناء" : "Construction Project"}</option>
                      <option value="Industrial Project">{isRtl ? "مشروع صناعي" : "Industrial Project"}</option>
                      <option value="Infrastructure">{isRtl ? "بنية تحتية" : "Infrastructure"}</option>
                      <option value="Event / Warehousing">{isRtl ? "فعالية / مستودع" : "Event / Warehousing"}</option>
                    </select>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className={`font-bold text-lg ${text} mb-4`}>{isRtl ? "تفاصيل إضافية" : "Additional Details"}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={form.requiredCapacity} onChange={update("requiredCapacity")} placeholder={t.booking.weight} className={`px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`} />
                    <input value={form.requiredDimensions} onChange={update("requiredDimensions")} placeholder={t.booking.dimensions} className={`px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30`} />
                  </div>
                  <div>
                    <label className={`text-sm font-medium ${text} block mb-2`}>{t.booking.urgency}</label>
                    <div className="flex gap-3">
                      {(["daily", "weekly", "monthly"] as const).map((u, idx) => (
                        <button key={u} type="button" onClick={() => setForm(f => ({ ...f, rentalDuration: u }))} className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.rentalDuration === u ? "bg-[#C8102E] text-white border-[#C8102E]" : `${border} ${text} hover:border-[#C8102E]`}`}>
                          {t.booking[(["normal", "express", "urgent"] as const)[idx]]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={form.notes} onChange={update("notes")} rows={3} placeholder={t.booking.instructions} className={`w-full px-4 py-3.5 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none focus:ring-2 focus:ring-[#C8102E]/30 resize-none`} />
                  {submitError && <p className="text-sm text-red-500">{submitError}</p>}
                </div>
              )}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium ${text} ${border} border hover:shadow transition-all`}>
                    {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    {isRtl ? "السابق" : "Back"}
                  </button>
                ) : <div />}
                {step < 3 ? (
                  <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 px-6 py-2.5 bg-[#C8102E] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                    {isRtl ? "التالي" : "Next"}
                    {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                ) : (
                  <button disabled={submitting || !canSubmit} onClick={handleSubmit} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#DC2626] to-[#7A0C18] text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50">
                    {submitting ? (isRtl ? "جارٍ الإرسال..." : "Submitting...") : t.booking.submit}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── TRACKING TIMELINE ─────────────────────────────────────────
  const TrackingTimeline = ({ currentStatus = "transit" }: { currentStatus?: string }) => {
    const currentIdx = bookingSteps.indexOf(currentStatus);
    return (
      <div className="flex items-center gap-0 overflow-x-auto py-4 px-2" dir="ltr">
        {bookingSteps.map((step, i) => {
          const isDone = i <= currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCurrent ? `${statusConfig[step]?.dot} text-white ring-4 ring-opacity-30` : isDone ? "bg-emerald-500 text-white" : dark ? "bg-[#404040] text-gray-400" : "bg-gray-200 text-gray-400"}`}>
                  {isDone && !isCurrent ? <Check className="w-4 h-4" /> : (i + 1)}
                </div>
                <span className={`text-[10px] mt-1.5 font-medium whitespace-nowrap ${isCurrent ? "text-[#C8102E]" : textMuted}`}>
                  {t.status[step as keyof typeof t.status]}
                </span>
              </div>
              {i < bookingSteps.length - 1 && (
                <div className={`w-8 sm:w-14 h-0.5 mx-1 ${isDone && i < currentIdx ? "bg-emerald-500" : dark ? "bg-[#404040]" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ─── CUSTOMER DASHBOARD ────────────────────────────────────────
  const CustomerDashboard = () => {
    type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
    const [bookings, setBookings] = useState<BookingRow[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);

    useEffect(() => {
      if (!user) return;
      setBookingsLoading(true);
      supabase
        .from("bookings")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setBookings(data ?? []);
          setBookingsLoading(false);
        });
    }, [user]);

    const activeCount = bookings.filter(b => !["completed", "cancelled"].includes(b.status)).length;
    const transitCount = bookings.filter(b => b.status === "transit").length;
    const completedCount = bookings.filter(b => b.status === "completed").length;
    const latest = bookings[0];

    const tabs = [
      { key: "overview", label: t.dashboard.overview, icon: BarChart3 },
      { key: "bookings", label: t.dashboard.bookings, icon: ClipboardList },
      { key: "tracking", label: t.dashboard.tracking, icon: Navigation },
      { key: "invoices", label: t.dashboard.invoices, icon: Receipt },
      { key: "support", label: t.dashboard.support, icon: Headphones }
    ];
    return (
      <div dir={dir} className={`${bg} min-h-screen pt-20`}>
        <div className="flex">
          <aside className={`hidden lg:block w-64 ${bgCard} border-r ${border} min-h-[calc(100vh-5rem)] p-4`}>
            <div className="flex items-center gap-3 p-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C8102E] to-[#DC2626] flex items-center justify-center text-white font-bold">{(profile?.full_name ?? user?.email ?? "?").charAt(0).toUpperCase()}</div>
              <div>
                <div className={`font-semibold text-sm ${text}`}>{profile?.full_name || user?.email}</div>
                <div className={`text-xs ${textMuted}`}>{isRtl ? "حساب عميل" : "Customer Account"}</div>
              </div>
            </div>
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setCustTab(tab.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all ${custTab === tab.key ? "bg-[#C8102E]/10 text-[#C8102E]" : `${textMuted} hover:${dark ? "bg-white/5" : "bg-gray-50"}`}`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
            <hr className={`my-4 ${border}`} />
            <button onClick={() => { signOut(); navigate("home"); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${textMuted} hover:text-red-500`}>
              <LogOut className="w-4 h-4" /> {isRtl ? "تسجيل الخروج" : "Logout"}
            </button>
          </aside>
          <main className="flex-1 p-4 sm:p-8">
            <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setCustTab(tab.key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${custTab === tab.key ? "bg-[#C8102E] text-white" : `${bgCard} ${textMuted} ${border} border`}`}>
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>

            {custTab === "overview" && (
              <div className="space-y-6">
                <h2 className={`text-2xl font-bold ${text}`}>{isRtl ? `مرحباً، ${profile?.full_name ?? ""}` : `Welcome, ${profile?.full_name ?? ""}`}</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: isRtl ? "الحجوزات النشطة" : "Active Bookings", value: String(activeCount), color: "text-[#C8102E]" },
                    { label: isRtl ? "في الطريق" : "In Transit", value: String(transitCount), color: "text-orange-500" },
                    { label: isRtl ? "المكتملة" : "Completed", value: String(completedCount), color: "text-emerald-500" },
                  ].map((s, i) => (
                    <div key={i} className={`${bgCard} rounded-2xl p-5 ${border} border`}>
                      <div className={`text-sm ${textMuted} mb-2`}>{s.label}</div>
                      <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                    </div>
                  ))}
                </div>
                {bookingsLoading ? (
                  <div className={`${bgCard} rounded-2xl p-6 ${border} border text-sm ${textMuted}`}>{isRtl ? "جارٍ التحميل..." : "Loading..."}</div>
                ) : latest ? (
                  <div className={`${bgCard} rounded-2xl p-6 ${border} border`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-bold ${text}`}>{isRtl ? "آخر حجز" : "Latest Booking"}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig[latest.status]?.color}`}>{t.status[latest.status as keyof typeof t.status]}</span>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                      <div><span className={`text-xs ${textMuted}`}>{isRtl ? "رقم الحجز" : "Booking ID"}</span><div className={`font-mono font-bold text-sm ${text}`}>{latest.booking_number}</div></div>
                      <div><span className={`text-xs ${textMuted}`}>{isRtl ? "المعدة" : "Equipment"}</span><div className={`font-semibold text-sm ${text}`}>{latest.equipment_type || "—"}</div></div>
                      <div><span className={`text-xs ${textMuted}`}>{isRtl ? "تاريخ البدء" : "Start Date"}</span><div className={`font-semibold text-sm ${text}`}>{latest.start_date}</div></div>
                    </div>
                    <TrackingTimeline currentStatus={latest.status} />
                  </div>
                ) : (
                  <div className={`${bgCard} rounded-2xl p-8 text-center ${border} border`}>
                    <p className={`text-sm ${textMuted} mb-4`}>{isRtl ? "لا توجد حجوزات بعد" : "No bookings yet"}</p>
                    <button onClick={() => navigate("booking")} className="px-5 py-2.5 bg-[#C8102E] text-white rounded-xl text-sm font-semibold">{t.nav.booking}</button>
                  </div>
                )}
              </div>
            )}

            {custTab === "bookings" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-bold ${text}`}>{t.dashboard.bookings}</h2>
                  <button onClick={() => navigate("booking")} className="px-4 py-2 bg-[#C8102E] text-white rounded-xl text-sm font-semibold flex items-center gap-2">
                    <Plus className="w-4 h-4" /> {t.nav.booking}
                  </button>
                </div>
                {bookingsLoading ? (
                  <p className={`text-sm ${textMuted}`}>{isRtl ? "جارٍ التحميل..." : "Loading..."}</p>
                ) : bookings.length === 0 ? (
                  <p className={`text-sm ${textMuted}`}>{isRtl ? "لا توجد حجوزات بعد" : "No bookings yet"}</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((bk) => (
                      <div key={bk.id} className={`${bgCard} rounded-xl p-4 sm:p-5 ${border} border hover:shadow-md transition-all`}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl ${statusConfig[bk.status]?.color} flex items-center justify-center`}>
                              <Truck className="w-5 h-5" />
                            </div>
                            <div>
                              <div className={`font-mono font-bold text-sm ${text}`}>{bk.booking_number}</div>
                              <div className={`text-xs ${textMuted}`}>{bk.equipment_type || "—"} · {bk.start_date}</div>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig[bk.status]?.color}`}>{t.status[bk.status as keyof typeof t.status]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {custTab === "tracking" && (
              <div className="space-y-6">
                <h2 className={`text-xl font-bold ${text}`}>{t.dashboard.tracking}</h2>
                <div className={`${bgCard} rounded-2xl p-6 ${border} border`}>
                  <p className={`text-sm ${textMuted} mb-4`}>{isRtl ? "استخدم صفحة التتبع العامة لتتبع أي حجز برقم الحجز." : "Use the public tracking page to look up any booking by its booking number."}</p>
                  <button onClick={() => navigate("track")} className="px-6 py-3 bg-[#C8102E] text-white rounded-xl text-sm font-semibold">{t.hero.trackShipment}</button>
                </div>
              </div>
            )}

            {custTab === "invoices" && (
              <div className="space-y-4">
                <h2 className={`text-xl font-bold ${text}`}>{t.dashboard.invoices}</h2>
                {[
                  { id: "INV-2026-0412", booking: "AWN-2026-0843", amount: "SAR 8,750", status: "paid", date: "Jul 26, 2026" },
                  { id: "INV-2026-0411", booking: "AWN-2026-0840", amount: "SAR 3,200", status: "paid", date: "Jul 24, 2026" },
                  { id: "INV-2026-0410", booking: "AWN-2026-0847", amount: "SAR 4,500", status: "unpaid", date: "Jul 28, 2026" }
                ].map((inv, i) => (
                  <div key={i} className={`${bgCard} rounded-xl p-5 ${border} border flex flex-wrap items-center justify-between gap-3`}>
                    <div>
                      <div className={`font-mono font-bold text-sm ${text}`}>{inv.id}</div>
                      <div className={`text-xs ${textMuted}`}>Booking: {inv.booking} · {inv.date}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {inv.status === "paid" ? (isRtl ? "مدفوع" : "Paid") : (isRtl ? "غير مدفوع" : "Unpaid")}
                      </span>
                      <span className={`font-bold ${text}`}>{inv.amount}</span>
                      <button className={`p-2 rounded-lg hover:bg-gray-100 ${textMuted}`}><Download className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {custTab === "support" && (
              <div className="space-y-6">
                <h2 className={`text-xl font-bold ${text}`}>{t.dashboard.support}</h2>
                <div className={`${bgCard} rounded-2xl p-6 ${border} border`}>
                  <div className="space-y-4">
                    <input placeholder={isRtl ? "موضوع التذكرة" : "Ticket Subject"} className={`w-full px-4 py-3 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none`} />
                    <textarea rows={4} placeholder={isRtl ? "صف مشكلتك" : "Describe your issue"} className={`w-full px-4 py-3 rounded-xl ${dark ? "bg-[#171717] border-[#404040]" : "bg-gray-50 border-gray-200"} border text-sm ${text} outline-none resize-none`} />
                    <button className="px-6 py-3 bg-[#C8102E] text-white rounded-xl text-sm font-semibold">{isRtl ? "إرسال التذكرة" : "Submit Ticket"}</button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  };

  // ─── ADMIN DASHBOARD ───────────────────────────────────────────
  const AdminDashboard = () => {
    type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
    const [bookings, setBookings] = useState<BookingRow[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const loadBookings = () => {
      setBookingsLoading(true);
      supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setBookings(data ?? []);
          setBookingsLoading(false);
        });
    };

    useEffect(() => { loadBookings(); }, []);

    const updateStatus = async (id: string, status: BookingRow["status"], bookingNumber: string) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) {
        showToast(isRtl ? "فشل تحديث الحالة" : "Failed to update status", "error");
        return;
      }
      setBookings(prev => prev.map(b => (b.id === id ? { ...b, status } : b)));
      showToast(
        isRtl ? `تم تحديث ${bookingNumber} إلى ${t.status[status as keyof typeof t.status]}` : `${bookingNumber} updated to ${t.status[status as keyof typeof t.status]}`,
        "success"
      );
    };

    const filteredBookings = bookings.filter(b => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (searchQuery && !`${b.booking_number} ${b.full_name} ${b.email}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    const tabs = [
      { key: "dashboard", label: t.admin.dashboard, icon: BarChart3 },
      { key: "bookings", label: t.admin.bookings, icon: ClipboardList },
      { key: "customers", label: t.admin.customers, icon: Users },
      { key: "drivers", label: t.admin.drivers, icon: Car },
      { key: "fleet", label: t.admin.fleet, icon: Truck },
      { key: "invoices", label: t.admin.invoices, icon: Receipt },
      { key: "reports", label: t.admin.reports, icon: FileText },
      { key: "settings", label: t.admin.settings, icon: Settings }
    ];
    return (
      <div dir={dir} className={`${bg} min-h-screen pt-20`}>
        <div className="flex">
          <aside className={`hidden lg:block w-64 ${bgCard} border-r ${border} min-h-[calc(100vh-5rem)] p-4 flex-shrink-0`}>
            <div className="flex items-center gap-3 p-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8102E] to-[#DC2626] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`font-semibold text-sm ${text}`}>Admin Panel</div>
                <div className={`text-xs ${textMuted}`}>Awan Leading</div>
              </div>
            </div>
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setAdminTab(tab.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all ${adminTab === tab.key ? "bg-[#C8102E]/10 text-[#C8102E]" : `${textMuted} hover:${dark ? "bg-white/5" : "bg-gray-50"}`}`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
            <hr className={`my-4 ${border}`} />
            <button onClick={() => { signOut(); navigate("home"); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${textMuted} hover:text-red-500`}>
              <LogOut className="w-4 h-4" /> {isRtl ? "خروج" : "Logout"}
            </button>
          </aside>
          <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
            <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
              {tabs.slice(0, 5).map(tab => (
                <button key={tab.key} onClick={() => setAdminTab(tab.key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${adminTab === tab.key ? "bg-[#C8102E] text-white" : `${bgCard} ${textMuted} ${border} border`}`}>
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>

            {adminTab === "dashboard" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className={`text-2xl font-bold ${text}`}>{t.admin.dashboard}</h2>
                  <div className="flex items-center gap-2">
                    <button className={`p-2 rounded-lg ${bgCard} ${border} border ${textMuted}`}><Bell className="w-4 h-4" /></button>
                    <button className={`p-2 rounded-lg ${bgCard} ${border} border ${textMuted}`}><Download className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: t.admin.totalBookings, value: String(bookings.length), change: "", icon: ClipboardList, color: "text-[#C8102E]", bgc: "bg-[#C8102E]/10" },
                    { label: t.status.pending, value: String(bookings.filter(b => b.status === "pending").length), change: "", icon: Activity, color: "text-amber-500", bgc: "bg-amber-50" },
                    { label: t.status.transit, value: String(bookings.filter(b => b.status === "transit").length), change: "", icon: Truck, color: "text-orange-500", bgc: "bg-orange-50" },
                    { label: t.status.completed, value: String(bookings.filter(b => b.status === "completed").length), change: "", icon: CheckCircle2, color: "text-emerald-500", bgc: "bg-emerald-50" }
                  ].map((s, i) => (
                    <div key={i} className={`${bgCard} rounded-2xl p-5 ${border} border`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm ${textMuted}`}>{s.label}</span>
                        <div className={`w-9 h-9 rounded-xl ${dark ? "bg-white/5" : s.bgc} flex items-center justify-center`}>
                          <s.icon className={`w-4 h-4 ${s.color}`} />
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${text}`}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className={`lg:col-span-2 ${bgCard} rounded-2xl p-6 ${border} border`}>
                    <h3 className={`font-bold mb-4 ${text}`}>{isRtl ? "نظرة عامة على الإيرادات" : "Revenue Overview"}</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C8102E" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#C8102E" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#404040" : "#E5E7EB"} />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: dark ? "#94A3B8" : "#64748B" }} />
                        <YAxis tick={{ fontSize: 12, fill: dark ? "#94A3B8" : "#64748B" }} />
                        <Tooltip contentStyle={{ background: dark ? "#262626" : "#fff", border: "none", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                        <Area type="monotone" dataKey="revenue" stroke="#C8102E" strokeWidth={2} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className={`${bgCard} rounded-2xl p-6 ${border} border`}>
                    <h3 className={`font-bold mb-4 ${text}`}>{isRtl ? "توزيع الخدمات" : "Service Distribution"}</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4}>
                          {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {pieData.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                          <span className={`text-xs ${textMuted}`}>{d.name} ({d.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`${bgCard} rounded-2xl p-6 ${border} border`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-bold ${text}`}>{isRtl ? "آخر الحجوزات" : "Recent Bookings"}</h3>
                    <button onClick={() => setAdminTab("bookings")} className="text-sm text-[#C8102E] font-semibold">{isRtl ? "عرض الكل" : "View All"}</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`border-b ${border}`}>
                          {["ID", isRtl ? "العميل" : "Customer", isRtl ? "المعدة" : "Equipment", isRtl ? "الحالة" : "Status", isRtl ? "التاريخ" : "Date"].map((h, i) => (
                            <th key={i} className={`text-left py-3 px-2 font-semibold ${textMuted} text-xs uppercase tracking-wider`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookingsLoading ? (
                          <tr><td colSpan={5} className={`py-6 text-center text-sm ${textMuted}`}>{isRtl ? "جارٍ التحميل..." : "Loading..."}</td></tr>
                        ) : bookings.length === 0 ? (
                          <tr><td colSpan={5} className={`py-6 text-center text-sm ${textMuted}`}>{isRtl ? "لا توجد حجوزات بعد" : "No bookings yet"}</td></tr>
                        ) : bookings.slice(0, 6).map((bk) => (
                          <tr key={bk.id} className={`border-b ${border} last:border-0 hover:${dark ? "bg-white/5" : "bg-gray-50"} transition-colors`}>
                            <td className={`py-3 px-2 font-mono font-bold ${text}`}>{bk.booking_number}</td>
                            <td className={`py-3 px-2 ${text}`}>{bk.full_name}</td>
                            <td className={`py-3 px-2 ${textMuted}`}>{bk.equipment_type || "—"}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusConfig[bk.status]?.color}`}>{t.status[bk.status as keyof typeof t.status]}</span>
                            </td>
                            <td className={`py-3 px-2 ${textMuted}`}>{bk.start_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {adminTab === "bookings" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className={`text-2xl font-bold ${text}`}>{t.admin.bookings}</h2>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${bgCard} ${border} border`}>
                      <Search className={`w-4 h-4 ${textMuted}`} />
                      <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={isRtl ? "بحث..." : "Search..."} className={`bg-transparent text-sm ${text} outline-none w-40`} />
                    </div>
                    <button onClick={loadBookings} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${bgCard} ${border} border ${textMuted} text-sm`}>
                      <Filter className="w-4 h-4" /> {isRtl ? "تحديث" : "Refresh"}
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["all", "pending", "confirmed", "assigned", "transit", "delivered", "completed", "cancelled"].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${statusFilter === s ? "bg-[#C8102E] text-white" : `${bgCard} ${textMuted} ${border} border hover:border-[#C8102E]`}`}>
                      {s === "all" ? (isRtl ? "الكل" : "All") : t.status[s as keyof typeof t.status]}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {bookingsLoading ? (
                    <p className={`text-sm ${textMuted}`}>{isRtl ? "جارٍ التحميل..." : "Loading..."}</p>
                  ) : filteredBookings.length === 0 ? (
                    <p className={`text-sm ${textMuted}`}>{isRtl ? "لا توجد حجوزات مطابقة" : "No matching bookings"}</p>
                  ) : filteredBookings.map((bk) => (
                    <div key={bk.id} className={`${bgCard} rounded-xl p-5 ${border} border hover:shadow-md transition-all`}>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl ${statusConfig[bk.status]?.color} flex items-center justify-center`}>
                            <Truck className="w-6 h-6" />
                          </div>
                          <div>
                            <div className={`font-mono font-bold ${text}`}>{bk.booking_number}</div>
                            <div className={`text-sm ${textMuted}`}>{bk.full_name} · {bk.phone}</div>
                            <div className={`text-xs ${textMuted} mt-0.5`}>{bk.equipment_type || "—"} · {bk.start_date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={bk.status}
                            onChange={e => updateStatus(bk.id, e.target.value as BookingRow["status"], bk.booking_number)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none ${statusConfig[bk.status]?.color} ${border}`}
                          >
                            {bookingSteps.concat("cancelled").map(s => (
                              <option key={s} value={s}>{t.status[s as keyof typeof t.status]}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminTab === "drivers" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className={`text-2xl font-bold ${text}`}>{t.admin.drivers}</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#C8102E] text-white rounded-xl text-sm font-semibold"><Plus className="w-4 h-4" /> {isRtl ? "إضافة سائق" : "Add Driver"}</button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Mohammed Ali", status: "active", jobs: 8, rating: 4.9, vehicle: "Heavy Flatbed" },
                    { name: "Abdullah Hassan", status: "active", jobs: 6, rating: 4.7, vehicle: "Box Truck" },
                    { name: "Yousef Omar", status: "off", jobs: 0, rating: 4.8, vehicle: "Lowbed Trailer" },
                    { name: "Khalid Nasser", status: "active", jobs: 5, rating: 4.6, vehicle: "Curtainside" },
                    { name: "Faisal Ahmed", status: "active", jobs: 3, rating: 4.9, vehicle: "Pickup Truck" },
                    { name: "Tariq Saeed", status: "off", jobs: 0, rating: 4.5, vehicle: "Refrigerated" }
                  ].map((d, i) => (
                    <div key={i} className={`${bgCard} rounded-2xl p-5 ${border} border hover:shadow-md transition-all`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C8102E] to-[#DC2626] flex items-center justify-center text-white font-bold">{d.name.charAt(0)}</div>
                        <div>
                          <div className={`font-bold ${text}`}>{d.name}</div>
                          <div className={`text-xs ${textMuted}`}>{d.vehicle}</div>
                        </div>
                        <div className={`${isRtl ? "mr-auto" : "ml-auto"} px-2.5 py-1 rounded-full text-xs font-bold ${d.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                          {d.status === "active" ? (isRtl ? "نشط" : "Active") : (isRtl ? "غير متصل" : "Offline")}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#DC2626] text-[#DC2626]" />
                          <span className={`text-sm font-semibold ${text}`}>{d.rating}</span>
                        </div>
                        <span className={`text-sm ${textMuted}`}>{d.jobs} {isRtl ? "مهام اليوم" : "jobs today"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminTab === "customers" && (
              <div className="space-y-6">
                <h2 className={`text-2xl font-bold ${text}`}>{t.admin.customers}</h2>
                <div className="space-y-3">
                  {[
                    { name: "Ahmed Al-Rashid", company: "Saudi Construction Co.", bookings: 47, spent: "SAR 125,000", type: "Corporate" },
                    { name: "Fatima Hassan", company: "Gulf Trading LLC", bookings: 23, spent: "SAR 67,500", type: "Corporate" },
                    { name: "Omar Khalid", company: "Jeddah Imports", bookings: 31, spent: "SAR 89,200", type: "Corporate" },
                    { name: "Sara Mohammed", company: "-", bookings: 5, spent: "SAR 12,800", type: "Individual" }
                  ].map((c, i) => (
                    <div key={i} className={`${bgCard} rounded-xl p-5 ${border} border flex flex-wrap items-center justify-between gap-4`}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C8102E] to-[#DC2626] flex items-center justify-center text-white font-bold text-sm">{c.name.charAt(0)}</div>
                        <div>
                          <div className={`font-bold ${text}`}>{c.name}</div>
                          <div className={`text-xs ${textMuted}`}>{c.company}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center"><div className={`text-lg font-bold ${text}`}>{c.bookings}</div><div className={`text-xs ${textMuted}`}>Bookings</div></div>
                        <div className="text-center"><div className={`text-lg font-bold ${text}`}>{c.spent}</div><div className={`text-xs ${textMuted}`}>Total</div></div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.type === "Corporate" ? "bg-[#C8102E]/10 text-[#C8102E]" : "bg-[#DC2626]/10 text-[#DC2626]"}`}>{c.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(adminTab === "fleet" || adminTab === "invoices" || adminTab === "reports" || adminTab === "settings") && (
              <div className="space-y-6">
                <h2 className={`text-2xl font-bold ${text}`}>{tabs.find(tb => tb.key === adminTab)?.label}</h2>
                <div className={`${bgCard} rounded-2xl p-12 text-center ${border} border`}>
                  <Settings className={`w-12 h-12 ${textMuted} mx-auto mb-4`} />
                  <p className={`${textMuted}`}>{isRtl ? "محتوى هذا القسم قيد التطوير" : "This section content is coming soon"}</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  };

  // ─── DRIVER PORTAL ─────────────────────────────────────────────
  const DriverPortal = () => (
    <div dir={dir} className={`${bg} min-h-screen pt-20`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C8102E] to-[#DC2626] flex items-center justify-center text-white font-bold">M</div>
            <div>
              <div className={`font-bold text-lg ${text}`}>Mohammed Ali</div>
              <div className={`text-sm ${textMuted}`}>{isRtl ? "سائق · متاح" : "Driver · Available"}</div>
            </div>
          </div>
          <button onClick={() => navigate("home")} className={`p-2 rounded-xl ${bgCard} ${border} border ${textMuted}`}><LogOut className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: isRtl ? "مهام اليوم" : "Today's Jobs", value: "3" },
            { label: isRtl ? "المكتملة" : "Completed", value: "45" },
            { label: isRtl ? "التقييم" : "Rating", value: "4.9 ★" }
          ].map((s, i) => (
            <div key={i} className={`${bgCard} rounded-2xl p-4 text-center ${border} border`}>
              <div className={`text-2xl font-bold ${text}`}>{s.value}</div>
              <div className={`text-xs ${textMuted}`}>{s.label}</div>
            </div>
          ))}
        </div>
        <h3 className={`font-bold text-lg ${text} mb-4`}>{isRtl ? "المهام المعينة" : "Assigned Jobs"}</h3>
        <div className="space-y-4">
          {[
            { id: "AWN-2026-0847", from: "Jeddah", to: "Riyadh", customer: "Ahmed Al-Rashid", status: "transit", time: "Arriving in 4h 23m" },
            { id: "AWN-2026-0846", from: "Jeddah", to: "Dammam", customer: "Fatima Hassan", status: "confirmed", time: "Pickup at 2:00 PM" },
            { id: "AWN-2026-0842", from: "Jeddah", to: "Taif", customer: "Nora Al-Saud", status: "assigned", time: "Pickup at 5:00 PM" }
          ].map((job, i) => (
            <div key={i} className={`${bgCard} rounded-2xl p-5 ${border} border`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`font-mono font-bold ${text}`}>{job.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig[job.status]?.color}`}>{t.status[job.status as keyof typeof t.status]}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-[#C8102E]" />
                <span className={`text-sm ${text}`}>{job.from}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <MapPin className="w-4 h-4 text-[#DC2626]" />
                <span className={`text-sm ${text}`}>{job.to}</span>
              </div>
              <div className={`text-sm ${textMuted} mb-4`}>{job.customer} · {job.time}</div>
              <div className="flex gap-2">
                {job.status === "transit" && (
                  <>
                    <button className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2"><Check className="w-4 h-4" /> {isRtl ? "تم التسليم" : "Mark Delivered"}</button>
                    <button className={`py-2.5 px-4 rounded-xl text-sm font-semibold ${bgCard} ${border} border ${text}`}><Camera className="w-4 h-4" /></button>
                  </>
                )}
                {job.status === "confirmed" && (
                  <button className="flex-1 py-2.5 bg-[#C8102E] text-white rounded-xl text-sm font-semibold">{isRtl ? "بدء الرحلة" : "Start Trip"}</button>
                )}
                {job.status === "assigned" && (
                  <button className="flex-1 py-2.5 bg-purple-500 text-white rounded-xl text-sm font-semibold">{isRtl ? "قبول المهمة" : "Accept Job"}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── FOOTER ────────────────────────────────────────────────────
  const Footer = () => (
    <footer dir={dir} className="bg-[#171717] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8102E] to-[#DC2626] flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">AWAN LEADING</div>
                <div className="text-[10px] tracking-[0.2em] text-white/50 uppercase">Company For Logistics</div>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">{t.footer.desc}</p>
            <div className="flex gap-3 mt-6">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                  <Icon className="w-4 h-4 text-white/60" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t.footer.quickLinks}</h4>
            <div className="space-y-2.5">
              {[
                { label: t.nav.about, key: "about", isPage: false },
                { label: t.nav.services, key: "services", isPage: false },
                { label: t.nav.fleet, key: "fleet", isPage: false },
                { label: t.nav.booking, key: "booking", isPage: true },
                { label: t.nav.contact, key: "contact", isPage: false }
              ].map((link, i) => (
                <button key={i} onClick={() => (link.isPage ? navigate(link.key) : goToSection(link.key))} className="block text-white/50 text-sm hover:text-[#DC2626] transition-colors">
                  {link.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t.footer.contactInfo}</h4>
            <div className="space-y-3">
              {[
                { icon: MapPin, text: t.contact.address },
                { icon: Phone, text: "+966 54 433 4933" },
                { icon: Mail, text: "Awanlogistics@yahoo.com" },
                { icon: Clock, text: t.contact.hours }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <item.icon className="w-4 h-4 text-[#DC2626] mt-0.5 flex-shrink-0" />
                  <span className="text-white/50 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t.footer.newsletter}</h4>
            <p className="text-white/50 text-sm mb-4">{isRtl ? "اشترك للحصول على آخر الأخبار والعروض" : "Subscribe for the latest news and offers"}</p>
            <div className="flex gap-2">
              <input placeholder={t.footer.emailPlaceholder} className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-[#DC2626]/50" />
              <button className="px-4 py-2.5 bg-gradient-to-r from-[#DC2626] to-[#7A0C18] rounded-xl">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="text-white/40 text-sm">© 2026 Awan Leading. {t.footer.rights}</div>
          <div className="flex items-center gap-4">
            {[
              { icon: CreditCard, label: "Mada" },
              { icon: CreditCard, label: "Visa" },
              { icon: CreditCard, label: "MC" }
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-1 text-white/30 text-xs">
                <p.icon className="w-4 h-4" /> {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );

  // ─── RENDER ────────────────────────────────────────────────────
  const showHeaderFooter = !["admin", "customer-dashboard", "driver"].includes(page);

  return (
    <div className={`${bg} min-h-screen ${dark ? "dark" : ""}`} style={{ fontFamily: isRtl ? "'Noto Sans Arabic', 'Inter', sans-serif" : "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Arabic:wght@400;500;600;700;800;900&display=swap');
      `}</style>
      <Header />
      <LoginModal />
      <ToastContainer />

      {page === "home" && (<><Hero /><Stats /><AboutPage /><Services /><Fleet /><RentalPlans /><Testimonials /><FAQ /><CTA /><Contact /></>)}
      {page === "track" && <TrackPage />}
      {page === "booking" && <BookingPage />}
      {page === "customer-dashboard" && <CustomerDashboard />}
      {page === "admin" && <AdminDashboard />}
      {page === "driver" && <DriverPortal />}

      {showHeaderFooter && <Footer />}

      <a
        href="https://wa.me/966544334933"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
        title="WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}
