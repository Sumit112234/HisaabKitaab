import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Users, Calculator, Phone, Menu, X, ChevronRight, Share2, Map, Compass, Luggage, Camera, Coffee, Car, Plane, Utensils, Hotel, Gift, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const HomePage = ({userLogin}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const user = localStorage.getItem('hisaabUser') || null;

  useEffect(() => {
    setIsVisible(true);
    
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(testimonialInterval);
  }, []);

  const testimonials = [
    {
      name: "Anika Sharma",
      image: "/api/placeholder/100/100",
      text: "Our Goa trip was so much easier to manage with Hisaab Barabar. No more awkward money conversations with friends!",
      rating: 5
    },
    {
      name: "Raj Patel",
      image: "/api/placeholder/100/100",
      text: "Used this for our Manali trek with 6 friends. The expense tracking was flawless, even without internet connection.",
      rating: 5
    },
    {
      name: "Priya Gupta",
      image: "/api/placeholder/100/100",
      text: "Game changer for our family vacation. We could see who paid for what and settle up instantly.",
      rating: 4
    }
  ];

  const travelCategories = [
    { icon: <Plane />, name: "Flights" },
    { icon: <Hotel />, name: "Hotels" },
    { icon: <Utensils />, name: "Food" },
    { icon: <Car />, name: "Transport" },
    { icon: <Camera />, name: "Sightseeing" },
    { icon: <Gift />, name: "Shopping" }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  const popIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const slideIn = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      {/* Navbar */}
      <motion.nav 
        className="bg-gray-800 shadow-lg border-b border-gray-700 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Compass className="h-8 w-8 text-teal-400" />
              <span className="ml-2 text-xl font-bold text-white">Hisaab Barabar</span>
            </motion.div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-6">
              <motion.a 
                href="#" 
                className="text-gray-300 hover:text-teal-400"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Home
              </motion.a>
              <motion.a 
                href="#about" 
                className="text-gray-300 hover:text-teal-400"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                About
              </motion.a>
              <motion.a 
                href="#how-it-works" 
                className="text-gray-300 hover:text-teal-400"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                How It Works
              </motion.a>
              <motion.a 
                href="#testimonials" 
                className="text-gray-300 hover:text-teal-400"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Testimonials
              </motion.a>
              <motion.a 
                href="#contact" 
                className="text-gray-300 hover:text-teal-400"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Contact
              </motion.a>
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/dashboard" 
                    className="bg-teal-400 text-gray-900 py-2 px-4 rounded-md font-medium transition-colors hover:bg-teal-500"
                  >
                    Dashboard
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/login" 
                    className="bg-teal-400 text-gray-900 py-2 px-4 rounded-md font-medium transition-colors hover:bg-teal-500"
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <motion.button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-teal-400 focus:outline-none"
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-teal-400 bg-gray-700">Home</a>
                <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-teal-400 hover:bg-gray-700">About</a>
                <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-teal-400 hover:bg-gray-700">How It Works</a>
                <a href="#testimonials" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-teal-400 hover:bg-gray-700">Testimonials</a>
                <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-teal-400 hover:bg-gray-700">Contact</a>
                {user ? (
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 rounded-md text-base font-medium bg-teal-400 text-gray-900"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 rounded-md text-base font-medium bg-teal-400 text-gray-900"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section with Travel Background */}
      <motion.section 
        className="py-20 md:py-32 px-4 bg-gray-900 bg-opacity-70 relative overflow-hidden"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-gray-900 opacity-80"></div>
        <div className="absolute inset-0 z-0">
          <img 
            src="home_img.jpeg" 
            alt="Group of friends traveling" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div 
            className="inline-block p-3 rounded-full bg-teal-400 bg-opacity-20 mb-4"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <Luggage className="h-10 w-10 text-teal-400" />
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            variants={fadeIn}
          >
            Your Journey, <span className="text-teal-400">Shared Equally</span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            variants={fadeIn}
          >
            Split expenses fairly among friends during trips, adventures, and group activities with Hisaab Barabar - the traveler's companion that keeps finances transparent and friendships intact.
          </motion.p>
          <motion.div 
            variants={fadeIn}
            className="flex flex-col md:flex-row justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={userLogin ? '/expense-list' : '/login'}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-gray-900 bg-teal-400 hover:bg-teal-500 shadow-lg transition duration-300"
              >
                Start Your Journey <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={'/suggested-place'}
                className="inline-flex items-center justify-center px-8 py-4 border border-teal-400 text-base font-medium rounded-md text-teal-400 hover:bg-gray-800 shadow-lg transition duration-300"
              >
                Cheak Your Budget Now!
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Travel Categories */}
      <section className="py-12 bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {travelCategories.map((category, index) => (
              <motion.div 
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center hover:border-teal-400 cursor-pointer"
                variants={popIn}
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(79, 209, 197, 0.1)" }}
              >
                <div className="bg-gray-700 rounded-full p-3 inline-flex mb-3">
                  <div className="text-teal-400">{category.icon}</div>
                </div>
                <p className="text-gray-300">{category.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-800 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-white mb-4">About Hisaab Barabar</h2>
            <div className="h-1 w-20 bg-teal-400 mx-auto"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-600 overflow-hidden relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-teal-400 opacity-10 rounded-bl-full"></div>
              <div className="mb-4 rounded-full bg-gray-800 p-3 inline-block">
                <Map className="h-8 w-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Track Expenses Anywhere</h3>
              <p className="text-gray-300">Easily record who paid for what during your adventures. Works offline for those remote destinations.</p>
              <img 
                src="/api/placeholder/300/200" 
                alt="Map tracking"
                className="mt-4 rounded-lg w-full h-40 object-cover"
              />
            </motion.div>
            
            <motion.div 
              className="bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-600 overflow-hidden relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-teal-400 opacity-10 rounded-bl-full"></div>
              <div className="mb-4 rounded-full bg-gray-800 p-3 inline-block">
                <Calculator className="h-8 w-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Split Fairly</h3>
              <p className="text-gray-300">Our smart algorithm divides expenses equally among all travelers, ensuring everyone pays their fair share of the journey.</p>
              <img 
                src="/api/placeholder/300/200" 
                alt="Expense calculation"
                className="mt-4 rounded-lg w-full h-40 object-cover"
              />
            </motion.div>
            
            <motion.div 
              className="bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-600 overflow-hidden relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-teal-400 opacity-10 rounded-bl-full"></div>
              <div className="mb-4 rounded-full bg-gray-800 p-3 inline-block">
                <Users className="h-8 w-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Focus on Memories</h3>
              <p className="text-gray-300">Keep all financial records transparent for the group, so you can focus on making memories instead of tracking expenses.</p>
              <img 
                src="/api/placeholder/300/200" 
                alt="Friends enjoying trip"
                className="mt-4 rounded-lg w-full h-40 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-16 bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={slideIn}>
              <h2 className="text-3xl font-bold text-white mb-4">Experience Seamless Trip Finances</h2>
              <div className="h-1 w-20 bg-teal-400 mb-6"></div>
              <p className="text-lg text-gray-300 mb-6">Our intuitive app makes managing group expenses feel effortless. Track spending in real-time, split costs automatically, and focus on enjoying your travels.</p>
              
              <ul className="space-y-4">
                {[
                  "Simple expense entry with photo receipts",
                  "Currency conversion for international trips",
                  "Personalized split options for special cases",
                  "Instant notifications when expenses are added"
                ].map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-teal-400 rounded-full p-1 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              
              <motion.div 
                className="mt-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to={userLogin ? '/expense-list' : '/login'}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-teal-400 hover:bg-teal-500 shadow-lg transition duration-300"
                >
                  Try It Now <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative z-10 border-8 border-gray-800 rounded-3xl shadow-2xl overflow-hidden bg-gray-800">
                <img 
                  src="/api/placeholder/375/667" 
                  alt="Hisaab Barabar app interface" 
                  className="w-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-400 rounded-full opacity-20 z-0"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-teal-400 rounded-full opacity-10 z-0"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-800 px-4 relative overflow-hidden">
        <div className="absolute opacity-5 top-0 right-0">
          <svg width="400" height="400" viewBox="0 0 200 200">
            <path fill="none" stroke="#4FD1C5" strokeWidth="1" d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50" />
          </svg>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <div className="h-1 w-20 bg-teal-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">Follow these simple steps to start using Hisaab Barabar for your travel expenses</p>
          </motion.div>
          
          <motion.div 
            className="mt-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div className="order-2 md:order-1" variants={stepVariants}>
                <div className="bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-700 hover:border-teal-400 transition-colors duration-300">
                  <div className="flex items-center mb-4">
                    <motion.div 
                      className="rounded-full bg-teal-400 text-gray-900 h-8 w-8 flex items-center justify-center font-bold"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      1
                    </motion.div>
                    <h3 className="text-xl font-semibold ml-3 text-white">Create a Travel Group</h3>
                  </div>
                  <p className="text-gray-300 mb-4">Start by creating a new group for your journey. Add all fellow travelers who will be sharing expenses.</p>
                  <img 
                    src="/api/placeholder/500/280" 
                    alt="Creating travel group" 
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
              </motion.div>
              <motion.div className="order-1 md:order-2" variants={stepVariants}>
                <motion.div 
                  className="bg-gray-700 p-8 rounded-lg shadow-xl border border-gray-700 flex justify-center hover:border-teal-400 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <Users className="h-20 w-20 text-teal-400" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
              <motion.div className="order-1" variants={stepVariants}>
                <motion.div 
                  className="bg-gray-700 p-8 rounded-lg shadow-xl border border-gray-700 flex justify-center hover:border-teal-400 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <Wallet className="h-20 w-20 text-teal-400" />
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div className="order-2" variants={stepVariants}>
                <div className="bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-700 hover:border-teal-400 transition-colors duration-300">
                  <div className="flex items-center mb-4">
                    <motion.div 
                      className="rounded-full bg-teal-400 text-gray-900 h-8 w-8 flex items-center justify-center font-bold"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      2
                    </motion.div>
                    <h3 className="text-xl font-semibold ml-3 text-white">Record Travel Expenses</h3>
                  </div>
                  <p className="text-gray-300 mb-4">Any traveler can add expenses they've paid for. Simply enter the amount, category, and description of your adventure costs.</p>
                  <img 
                    src="/api/placeholder/500/280" 
                    alt="Recording expenses" 
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
              <motion.div className="order-2 md:order-1" variants={stepVariants}>
                <div className="bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-700 hover:border-teal-400 transition-colors duration-300">
                  <div className="flex items-center mb-4">
                    <motion.div 
                      className="rounded-full bg-teal-400 text-gray-900 h-8 w-8 flex items-center justify-center font-bold"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      3
                    </motion.div>
                    <h3 className="text-xl font-semibold ml-3 text-white">Calculate Travel Splits</h3>
                  </div>
                  <p className="text-gray-300 mb-4">Hisaab Barabar automatically calculates how much each traveler owes or is owed based on all recorded journey expenses.</p>
                  <img 
                    src="/api/placeholder/500/280" 
                    alt="Calculating splits" 
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
              </motion.div>
              <motion.div className="order-1 md:order-2" variants={stepVariants}>
                <motion.div 
                  className="bg-gray-700 p-8 rounded-lg shadow-xl border border-gray-700 flex justify-center hover:border-teal-400 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Calculator className="h-20 w-20 text-teal-400" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
              <motion.div className="order-1" variants={stepVariants}>
                <motion.div 
                  className="bg-gray-700 p-8 rounded-lg shadow-xl border border-gray-700 flex justify-center hover:border-teal-400 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <Share2 className="h-20 w-20 text-teal-400" />
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div className="order-2" variants={stepVariants}>
                <div className="bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-700 hover:border-teal-400 transition-colors duration-300">
                  <div className="flex items-center mb-4">
                    <motion.div 
                      className="rounded-full bg-teal-400 text-gray-900 h-8 w-8 flex items-center justify-center font-bold"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      4
                    </motion.div>
                    <h3 className="text-xl font-semibold ml-3 text-white">Share Journey Results</h3>
                  </div>
                  <p className="text-gray-300 mb-4">Share the final expense report with all travelers. Everyone can see who needs to pay whom to settle up, so you can plan your next adventure.</p>
                  <img 
                    src="/api/placeholder/500/280" 
                    alt="Sharing results" 
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <Users />, value: "10K+", label: "Happy Travelers" },
              { icon: <Map />, value: "500+", label: "Destinations" },
              { icon: <Wallet />, value: "₹8M+", label: "Expenses Tracked" },
              { icon: <Coffee />, value: "0", label: "Arguments Over Bills" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(79, 209, 197, 0.15)"
                }}
              >
                <motion.div 
                  className="inline-flex p-3 rounded-full bg-gray-700 mb-4"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: index * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <div className="text-teal-400 h-8 w-8">{stat.icon}</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-800 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-white mb-4">What Travelers Say</h2>
            <div className="h-1 w-20 bg-teal-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">See how Hisaab Barabar has transformed the travel experience for adventurers across India</p>
          </motion.div>
          
          <div className="mt-12 relative">
            <div className="absolute inset-0 flex items-center justify-between z-10 pointer-events-none">
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="bg-gray-900 bg-opacity-50 rounded-full p-2 text-white pointer-events-auto hover:bg-teal-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="bg-gray-900 bg-opacity-50 rounded-full p-2 text-white pointer-events-auto hover:bg-teal-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-hidden rounded-xl relative">
              <div className="flex">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex-shrink-0"
                  >
                    <div className="bg-gray-700 p-8 rounded-xl border border-gray-600 relative">
                      <div className="flex flex-col md:flex-row items-center md:items-start">
                        <div className="mb-6 md:mb-0 md:mr-6">
                          <div className="rounded-full overflow-hidden border-4 border-teal-400 h-24 w-24">
                            <img 
                              src={testimonials[activeTestimonial].image} 
                              alt={testimonials[activeTestimonial].name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-white">{testimonials[activeTestimonial].name}</h3>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-5 w-5 ${i < testimonials[activeTestimonial].rating ? 'text-teal-400' : 'text-gray-500'}`}
                                  fill={i < testimonials[activeTestimonial].rating ? '#4FD1C5' : 'none'}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-300 text-lg italic">"{testimonials[activeTestimonial].text}"</p>
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 text-gray-600 opacity-30">
                        <MessageCircle className="h-16 w-16" />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`mx-1 h-3 w-3 rounded-full ${index === activeTestimonial ? 'bg-teal-400' : 'bg-gray-600'}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
              <circle id="pattern-circle" cx="10" cy="10" r="1.5" fill="#4FD1C5" />
            </pattern>
            <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <motion.div 
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Compass className="h-16 w-16 text-teal-400" />
                </motion.div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">Stay Updated on Travel Tips</h3>
                <p className="text-gray-300 mb-6">Subscribe to our newsletter for travel hacks, expense management tips, and exclusive app updates.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
                  />
                  <motion.button 
                    className="bg-teal-400 text-gray-900 px-6 py-3 rounded-md hover:bg-teal-500 transition duration-300 font-medium whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe
                  </motion.button>
                </div>
                <p className="text-gray-400 text-sm mt-3">We respect your privacy. Unsubscribe at any time.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-800 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
            <div className="h-1 w-20 bg-teal-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-300">Have questions or suggestions about your travel expense tracking? We'd love to hear from you!</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-700 p-8 rounded-lg shadow-xl border border-gray-600"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-6 text-white">Get in Touch</h3>
                <motion.div 
                  className="flex items-center mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-teal-400 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <Phone className="h-5 w-5 text-teal-400 mr-4" />
                  <span className="text-gray-300">+91 9876543210</span>
                </motion.div>
                <motion.div 
                  className="flex items-center mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-teal-400 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">adventure@hisaabbarabar.com</span>
                </motion.div>
                <motion.div 
                  className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-teal-400 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400 mr-4 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-300">123 Wanderlust Avenue, Adventure District, Bangalore, Karnataka, India - 560001</span>
                </motion.div>
                
                <div className="mt-8">
                  <h4 className="text-white font-medium mb-4">Follow Our Adventures</h4>
                  <div className="flex space-x-4">
                    {[
                      { icon: "M18.42 3.006H21.6L14.4 11.338L22.8 21.594H16.5L11.16 15.354L5.04 21.594H1.8L9.42 12.762L1.2 3.006H7.68L12.54 8.734L18.42 3.006ZM17.4 19.698H19.2L6.72 4.842H4.8L17.4 19.698Z", name: "X" },
                      { icon: "M24 4.5C23.1 4.95 22.125 5.25 21.15 5.4C22.2 4.8 22.95 3.75 23.25 2.55C22.275 3.15 21.15 3.6 20.025 3.9C19.05 2.85 17.7 2.25 16.2 2.25C13.2 2.25 10.875 4.65 10.875 7.575C10.875 8.025 10.95 8.4 11.025 8.775C6.575 8.55 2.625 6.45 0.9 3.375C0.6 4.2 0.375 4.8 0.375 5.7C0.375 7.2 1.125 8.55 2.25 9.3C1.5 9.3 0.975 9.075 0.375 8.775V8.85C0.375 11.4 2.1 13.5 4.425 13.95C3.975 14.1 3.6 14.175 3.225 14.175C2.925 14.175 2.7 14.1 2.4 14.025C2.925 16.125 4.8 17.7 7.05 17.7C5.325 19.125 3.225 19.95 0.9 19.95C0.6 19.95 0.3 19.95 0 19.875C2.25 21.375 4.875 22.275 7.65 22.275C16.125 22.275 21 15.15 21 8.925C21 8.7 21 8.475 21 8.25C22.05 7.5 22.875 6.6 24 4.5Z", name: "Twitter" },
                      { icon: "M22.4 0H1.6C0.72 0 0 0.72 0 1.6V22.4C0 23.28 0.72 24 1.6 24H22.4C23.28 24 24 23.28 24 22.4V1.6C24 0.72 23.28 0 22.4 0ZM7.04 20.4H3.52V9.28H7.12V20.4H7.04ZM5.28 7.68C4.16 7.68 3.28 6.8 3.28 5.68C3.28 4.56 4.16 3.68 5.28 3.68C6.4 3.68 7.28 4.56 7.28 5.68C7.28 6.8 6.4 7.68 5.28 7.68ZM20.48 20.4H16.96V14.56C16.96 13.28 16.96 11.6 15.12 11.6C13.28 11.6 12.96 13.04 12.96 14.48V20.48H9.44V9.28H12.8V10.8H12.88C13.36 9.92 14.48 9.04 16.24 9.04C19.76 9.04 20.48 11.36 20.48 14.4V20.4Z", name: "LinkedIn" },
                      { icon: "M12 0C5.376 0 0 5.376 0 12C0 17.136 3.438 21.504 8.208 23.088C8.808 23.19 9.024 22.8 9.024 22.47C9.024 22.176 9.024 21.462 9.012 20.472C5.673 21.18 4.968 18.888 4.968 18.888C4.422 17.532 3.636 17.148 3.636 17.148C2.547 16.44 3.717 16.452 3.717 16.452C4.922 16.542 5.556 17.664 5.556 17.664C6.626 19.488 8.364 18.936 9.048 18.624C9.156 17.856 9.468 17.304 9.804 17.004C7.14 16.704 4.344 15.696 4.344 11.19C4.344 9.9 4.812 8.832 5.58 8.004C5.46 7.716 5.052 6.528 5.7 4.908C5.7 4.908 6.708 4.596 9 6.13C9.948 5.868 10.98 5.74 12 5.736C13.02 5.74 14.052 5.868 15 6.13C17.292 4.596 18.3 4.908 18.3 4.908C18.948 6.528 18.54 7.716 18.42 8.004C19.188 8.832 19.656 9.9 19.656 11.19C19.656 15.708 16.86 16.704 14.196 17.004C14.64 17.364 15.048 18.1 15.048 19.2C15.048 20.784 15.036 22.092 15.036 22.47C15.036 22.788 15.228 23.19 15.876 23.088C20.562 21.504 24 17.136 24 12C24 5.376 18.624 0 12 0Z", name: "GitHub" }
                    ].map((social, index) => (
                      <motion.a 
                        key={index}
                        href="#"
                        className="bg-gray-800 p-3 rounded-full border border-gray-600 hover:border-teal-400 transition-colors duration-300"
                        whileHover={{ y: -5, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-teal-400 h-5 w-5">
                          <path d={social.icon} />
                        </svg>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-6 text-white">Send Us a Message</h3>
                <form>
                  <motion.div 
                    className="mb-4"
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
                    />
                  </motion.div>
                  <motion.div 
                    className="mb-4"
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
                    />
                  </motion.div>
                  <motion.div 
                    className="mb-4"
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <textarea 
                      placeholder="Your Message" 
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-white h-32"
                    ></textarea>
                  </motion.div>
                  <motion.button 
                    type="submit" 
                    className="bg-teal-400 text-gray-900 px-6 py-3 rounded-md hover:bg-teal-500 transition duration-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
export default HomePage;

      {/* Download App Section */}
     



// import React from 'react';
// import { motion } from 'framer-motion';
// import { Wallet, Users, Calculator, Phone, Menu, X, ChevronRight, Share2, Map, Compass, Luggage } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import Footer from './Footer';

// const HomePage = ({userLogin}) => {
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
//   const user = localStorage.getItem('hisaabUser') || null;

//   const fadeIn = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.6 }
//     }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.3
//       }
//     }
//   };

//   const stepVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: { duration: 0.5 }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
//       {/* Navbar */}
//       <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <Compass className="h-8 w-8 text-teal-400" />
//               <span className="ml-2 text-xl font-bold text-white">Hisaab Barabar</span>
//             </div>
            
//             {/* Desktop menu */}
//             <div className="hidden md:flex items-center space-x-6">
//               <a href="#" className="text-gray-300 hover:text-teal-400">Home</a>
//               <a href="#about" className="text-gray-300 hover:text-teal-400">About</a>
//               <a href="#how-it-works" className="text-gray-300 hover:text-teal-400">How It Works</a>
//               <a href="#contact" className="text-gray-300 hover:text-teal-400">Contact</a>
//             </div>
            
//             {/* Mobile menu button */}
//             <div className="md:hidden flex items-center">
//               <button 
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="text-gray-300 hover:text-teal-400 focus:outline-none"
//               >
//                 {isMenuOpen ? <X /> : <Menu />}
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//               <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-teal-400 bg-gray-700">Home</a>
//               <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-teal-400 hover:bg-gray-700">About</a>
//               <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-teal-400 hover:bg-gray-700">How It Works</a>
//               <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-teal-400 hover:bg-gray-700">Contact</a>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Hero Section with Travel Background */}
//       <motion.section 
//         className="py-20 md:py-32 px-4 bg-gray-900 bg-opacity-70 relative"
//         initial="hidden"
//         animate="visible"
//         variants={fadeIn}
//         style={{
//           backgroundImage: "linear-gradient(rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0.9)), url('https://placeholder-images.herokuapp.com/1800/800')",
//           backgroundSize: "cover",
//           backgroundPosition: "center"
//         }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-gray-900 opacity-80"></div>
//         <div className="max-w-4xl mx-auto text-center relative z-10">
//           <motion.div 
//             className="inline-block p-2 rounded-full bg-teal-400 bg-opacity-20 mb-4"
//             variants={fadeIn}
//           >
//             <Luggage className="h-8 w-8 text-teal-400" />
//           </motion.div>
//           <motion.h1 
//             className="text-3xl md:text-5xl font-bold text-white mb-6"
//             variants={fadeIn}
//           >
//             Your Journey, <span className="text-teal-400">Shared Equally</span>
//           </motion.h1>
//           <motion.p 
//             className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
//             variants={fadeIn}
//           >
//             Split expenses fairly among friends during trips, adventures, and group activities with Hisaab Barabar - the traveler's companion that keeps finances transparent and friendships intact.
//           </motion.p>
//           <motion.div variants={fadeIn}>
//             <Link 
//               to={userLogin ? '/expense-list' : '/login'}
//               className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-teal-400 hover:bg-teal-500 shadow-lg transition duration-300"
//             >
//               Start Your Journey <ChevronRight className="ml-2 h-5 w-5" />
//             </Link>
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* About Section */}
//       <section id="about" className="py-16 bg-gray-800 px-4">
//         <div className="max-w-6xl mx-auto">
//           <motion.div 
//             className="text-center mb-12"
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={fadeIn}
//           >
//             <h2 className="text-3xl font-bold text-white mb-4">About Hisaab Barabar</h2>
//             <div className="h-1 w-20 bg-teal-400 mx-auto"></div>
//           </motion.div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <motion.div 
//               className="bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-600"
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeIn}
//             >
//               <div className="mb-4 rounded-full bg-gray-800 p-3 inline-block">
//                 <Map className="h-8 w-8 text-teal-400" />
//               </div>
//               <h3 className="text-xl font-semibold mb-3 text-white">Track Expenses Anywhere</h3>
//               <p className="text-gray-300">Easily record who paid for what during your adventures. Works offline for those remote destinations.</p>
//             </motion.div>
            
//             <motion.div 
//               className="bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-600"
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true, amount: 0.3 }}
//               variants={fadeIn}
//             >
//               <div className="mb-4 rounded-full bg-gray-800 p-3 inline-block">
//                 <Calculator className="h-8 w-8 text-teal-400" />
//               </div>
//               <h3 className="text-xl font-semibold mb-3 text-white">Split Fairly</h3>
//               <p className="text-gray-300">Our smart algorithm divides expenses equally among all travelers, ensuring everyone pays their fair share of the journey.</p>
//             </motion.div>
            
//             <motion.div 
//               className="bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-600"
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true, amount: 0.3 }}
//               variants={fadeIn}
//             >
//               <div className="mb-4 rounded-full bg-gray-800 p-3 inline-block">
//                 <Users className="h-8 w-8 text-teal-400" />
//               </div>
//               <h3 className="text-xl font-semibold mb-3 text-white">Focus on Memories</h3>
//               <p className="text-gray-300">Keep all financial records transparent for the group, so you can focus on making memories instead of tracking expenses.</p>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section id="how-it-works" className="py-16 bg-gray-900 px-4 relative overflow-hidden">
//         <div className="absolute opacity-5 top-0 right-0">
//           <svg width="400" height="400" viewBox="0 0 200 200">
//             <path fill="none" stroke="#4FD1C5" strokeWidth="1" d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50" />
//           </svg>
//         </div>
//         <div className="max-w-6xl mx-auto relative z-10">
//           <motion.div 
//             className="text-center mb-12"
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={fadeIn}
//           >
//             <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
//             <div className="h-1 w-20 bg-teal-400 mx-auto mb-6"></div>
//             <p className="text-lg text-gray-300 max-w-3xl mx-auto">Follow these simple steps to start using Hisaab Barabar for your travel expenses</p>
//           </motion.div>
          
//           <motion.div 
//             className="mt-12"
//             variants={staggerContainer}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//           >
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//               <motion.div className="order-2 md:order-1" variants={stepVariants}>
//                 <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
//                   <div className="flex items-center mb-4">
//                     <div className="rounded-full bg-teal-400 text-gray-900 h-8 w-8 flex items-center justify-center font-bold">1</div>
//                     <h3 className="text-xl font-semibold ml-3 text-white">Create a Travel Group</h3>
//                   </div>
//                   <p className="text-gray-300">Start by creating a new group for your journey. Add all fellow travelers who will be sharing expenses.</p>
//                 </div>
//               </motion.div>
//               <motion.div className="order-1 md:order-2" variants={stepVariants}>
//                 <motion.div 
//                   className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 flex justify-center"
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                 >
//                   <Users className="h-16 w-16 text-teal-400" />
//                 </motion.div>
//               </motion.div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
//               <motion.div className="order-1" variants={stepVariants}>
//                 <motion.div 
//                   className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 flex justify-center"
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                 >
//                   <Wallet className="h-16 w-16 text-teal-400" />
//                 </motion.div>
//               </motion.div>
//               <motion.div className="order-2" variants={stepVariants}>
//                 <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
//                   <div className="flex items-center mb-4">
//                     <div className="rounded-full bg-teal-400 text-gray-900 h-8 w-8 flex items-center justify-center font-bold">2</div>
//                     <h3 className="text-xl font-semibold ml-3 text-white">Record Travel Expenses</h3>
//                   </div>
//                   <p className="text-gray-300">Any traveler can add expenses they've paid for. Simply enter the amount, category, and description of your adventure costs.</p>
//                 </div>
//               </motion.div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
//               <motion.div className="order-2 md:order-1" variants={stepVariants}>
//                 <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
//                   <div className="flex items-center mb-4">
//                     <div className="rounded-full bg-teal-400 text-gray-900 h-8 w-8 flex items-center justify-center font-bold">3</div>
//                     <h3 className="text-xl font-semibold ml-3 text-white">Calculate Travel Splits</h3>
//                   </div>
//                   <p className="text-gray-300">Hisaab Barabar automatically calculates how much each traveler owes or is owed based on all recorded journey expenses.</p>
//                 </div>
//               </motion.div>
//               <motion.div className="order-1 md:order-2" variants={stepVariants}>
//                 <motion.div 
//                   className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 flex justify-center"
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                 >
//                   <Calculator className="h-16 w-16 text-teal-400" />
//                 </motion.div>
//               </motion.div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
//               <motion.div className="order-1" variants={stepVariants}>
//                 <motion.div 
//                   className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 flex justify-center"
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                 >
//                   <Share2 className="h-16 w-16 text-teal-400" />
//                 </motion.div>
//               </motion.div>
//               <motion.div className="order-2" variants={stepVariants}>
//                 <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
//                   <div className="flex items-center mb-4">
//                     <div className="rounded-full bg-teal-400 text-gray-900 h-8 w-8 flex items-center justify-center font-bold">4</div>
//                     <h3 className="text-xl font-semibold ml-3 text-white">Share Journey Results</h3>
//                   </div>
//                   <p className="text-gray-300">Share the final expense report with all travelers. Everyone can see who needs to pay whom to settle up, so you can plan your next adventure.</p>
//                 </div>
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" className="py-16 bg-gray-800 px-4">
//         <div className="max-w-4xl mx-auto">
//           <motion.div 
//             className="text-center mb-12"
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={fadeIn}
//           >
//             <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
//             <div className="h-1 w-20 bg-teal-400 mx-auto mb-6"></div>
//             <p className="text-lg text-gray-300">Have questions or suggestions about your travel expense tracking? We'd love to hear from you!</p>
//           </motion.div>
          
//           <motion.div 
//             className="bg-gray-700 p-8 rounded-lg shadow-xl border border-gray-600"
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={fadeIn}
//           >
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div>
//                 <h3 className="text-xl font-semibold mb-4 text-white">Get in Touch</h3>
//                 <div className="flex items-center mb-4">
//                   <Phone className="h-5 w-5 text-teal-400 mr-3" />
//                   <span className="text-gray-300">+91 9876543210</span>
//                 </div>
//                 <div className="flex items-center mb-4">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                   <span className="text-gray-300">adventure@hisaabbarabar.com</span>
//                 </div>
//                 <div className="flex items-start mb-4">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                   <span className="text-gray-300">123 Wanderlust Avenue, Adventure District, Bangalore, Karnataka, India - 560001</span>
//                 </div>
//               </div>
              
//               <div>
//                 <h3 className="text-xl font-semibold mb-4 text-white">Send Us a Message</h3>
//                 <form>
//                   <div className="mb-4">
//                     <input 
//                       type="text" 
//                       placeholder="Your Name" 
//                       className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <input 
//                       type="email" 
//                       placeholder="Your Email" 
//                       className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <textarea 
//                       placeholder="Your Message" 
//                       className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-white h-32"
//                     ></textarea>
//                   </div>
//                   <button 
//                     type="submit" 
//                     className="bg-teal-400 text-gray-900 px-6 py-2 rounded-md hover:bg-teal-500 transition duration-300 font-medium"
//                   >
//                     Send Message
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer/>
//     </div>
//   );
// };

// export default HomePage;