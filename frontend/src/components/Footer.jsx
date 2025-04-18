import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const socialIcons = [
    { icon: <Wallet size={18} />, link: '#' },
    { icon: <Wallet size={18} />, link: '#' },
    { icon: <Wallet size={18} />, link: '#' },
    { icon: <Wallet size={18} />, link: '#' }
  ];

  const footerLinks = [
    { name: 'Home', link: '#' },
    { name: 'About', link: '#about' },
    { name: 'How It Works', link: '#how-it-works' },
    { name: 'Contact', link: '#contact' },
    { name: 'Privacy Policy', link: '#' },
    { name: 'Terms of Service', link: '#' }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white pt-16 pb-8 px-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-600 blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-4">
              <Wallet className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">Hisaab Barabar</span>
            </div>
            <p className="text-gray-400 mb-4">
              Split expenses fairly among friends during trips, outings, and group activities with our smart expense calculator.
            </p>
            <div className="flex space-x-3">
              {socialIcons.map((social, index) => (
                <motion.a 
                  key={index}
                  href={social.link} 
                  className="bg-gray-700 p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.slice(0, 3).map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                  <a href={link.link} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Legal */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.slice(3).map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                  <a href={link.link} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-blue-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">+91 9876543210</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-blue-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">support@hisaabbarabar.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">123 Tech Park, Innovation Street, Bangalore, Karnataka, India - 560001</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        {/* Copyright Bar */}
        <motion.div 
          className="pt-8 mt-8 border-t border-gray-700 text-center text-gray-400 flex flex-col md:flex-row justify-between items-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p>© {currentYear} Hisaab Barabar. All rights reserved.</p>
          <motion.div 
            className="flex space-x-4 mt-4 md:mt-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <button className="text-sm hover:text-blue-400 transition-colors">Privacy Policy</button>
            <span className="text-gray-600">•</span>
            <button className="text-sm hover:text-blue-400 transition-colors">Terms of Service</button>
            <span className="text-gray-600">•</span>
            <button className="text-sm hover:text-blue-400 transition-colors">Cookies</button>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;