import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Users, Calculator, Phone, Menu, X, ChevronRight, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const HomePage = ({userLogin}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const user = localStorage.getItem('hisaabUser') || null;

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Hisaab Barabar</span>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600">Home</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">How It Works</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50">Home</a>
              <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50">About</a>
              <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50">How It Works</a>
              <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="py-12 md:py-20 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
            variants={fadeIn}
          >
            One Person Won't Face All The Burden Of The Trip
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto"
            variants={fadeIn}
          >
            Split expenses fairly among friends during trips, outings, and group activities with Hisaab Barabar - the smart expense calculator that keeps finances transparent and friendships intact.
          </motion.p>
          <motion.div variants={fadeIn}>
            <Link 
              to={userLogin ? '/expense-list' : '/login'}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md transition duration-300"
            >
              Manage Expenses <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-12 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Hisaab Barabar</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-blue-50 p-6 rounded-lg shadow-md"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="mb-4 rounded-full bg-blue-100 p-3 inline-block">
                <Wallet className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Expenses</h3>
              <p className="text-gray-700">Easily record who paid for what during your group trips and activities. No more confusion about who owes whom.</p>
            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-6 rounded-lg shadow-md"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <div className="mb-4 rounded-full bg-blue-100 p-3 inline-block">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Split Fairly</h3>
              <p className="text-gray-700">Our smart algorithm divides expenses equally among all group members, ensuring everyone pays their fair share.</p>
            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-6 rounded-lg shadow-md"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <div className="mb-4 rounded-full bg-blue-100 p-3 inline-block">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Maintain Transparency</h3>
              <p className="text-gray-700">Keep all financial records transparent for everyone in the group, building trust and avoiding disputes.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-blue-50 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">Follow these simple steps to start using Hisaab Barabar for your group expenses</p>
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
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-blue-600 text-white h-8 w-8 flex items-center justify-center font-bold">1</div>
                    <h3 className="text-xl font-semibold ml-3">Create a Group</h3>
                  </div>
                  <p className="text-gray-700">Start by creating a new group for your trip or event. Add all members who will be sharing expenses.</p>
                </div>
              </motion.div>
              <motion.div className="order-1 md:order-2" variants={stepVariants}>
                <motion.div 
                  className="bg-blue-600 text-white p-8 rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Users className="h-16 w-16 mx-auto mb-4" />
                </motion.div>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
              <motion.div className="order-1" variants={stepVariants}>
                <motion.div 
                  className="bg-blue-600 text-white p-8 rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Wallet className="h-16 w-16 mx-auto mb-4" />
                </motion.div>
              </motion.div>
              <motion.div className="order-2" variants={stepVariants}>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-blue-600 text-white h-8 w-8 flex items-center justify-center font-bold">2</div>
                    <h3 className="text-xl font-semibold ml-3">Record Expenses</h3>
                  </div>
                  <p className="text-gray-700">Any member can add expenses they've paid for. Simply enter the amount, category, and description.</p>
                </div>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
              <motion.div className="order-2 md:order-1" variants={stepVariants}>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-blue-600 text-white h-8 w-8 flex items-center justify-center font-bold">3</div>
                    <h3 className="text-xl font-semibold ml-3">Calculate Splits</h3>
                  </div>
                  <p className="text-gray-700">Hisaab Barabar automatically calculates how much each person owes or is owed based on all recorded expenses.</p>
                </div>
              </motion.div>
              <motion.div className="order-1 md:order-2" variants={stepVariants}>
                <motion.div 
                  className="bg-blue-600 text-white p-8 rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Calculator className="h-16 w-16 mx-auto mb-4" />
                </motion.div>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
              <motion.div className="order-1" variants={stepVariants}>
                <motion.div 
                  className="bg-blue-600 text-white p-8 rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Share2 className="h-16 w-16 mx-auto mb-4" />
                </motion.div>
              </motion.div>
              <motion.div className="order-2" variants={stepVariants}>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-blue-600 text-white h-8 w-8 flex items-center justify-center font-bold">4</div>
                    <h3 className="text-xl font-semibold ml-3">Share Results</h3>
                  </div>
                  <p className="text-gray-700">Share the final expense report with all group members. Everyone can see who needs to pay whom to settle up.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-700">Have questions or suggestions? We'd love to hear from you!</p>
          </motion.div>
          
          <motion.div 
            className="bg-blue-50 p-8 rounded-lg shadow-md"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <div className="flex items-center mb-4">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">+91 9876543210</span>
                </div>
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">support@hisaabbarabar.com</span>
                </div>
                <div className="flex items-start mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">123 Tech Park, Innovation Street, Bangalore, Karnataka, India - 560001</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
                <form>
                  <div className="mb-4">
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <textarea 
                      placeholder="Your Message" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default HomePage;