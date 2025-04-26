import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Wallet, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({userLogin, setUserLogin}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const { scrollY } = useScroll();
  const navbarScale = useTransform(scrollY, [0, 100], [1, 0.95]);
  const navbarOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const navbarShadow = useTransform(scrollY, [0, 100], [0, 25]);
  const logoSize = useTransform(scrollY, [0, 100], [32, 28]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('hisaabUser');
    if (user) {
      setUserLogin(true);
      setCurrentUser(JSON.parse(user));
    } else {
      setUserLogin(false);
      setCurrentUser(null);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('hisaabUser');
    setUserLogin(false);
    setCurrentUser(null);
    // Redirect to home or login page if needed
    // window.location.href = '/';
  };

  return (
    <motion.nav 
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-gray-900'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{ 
        scale: navbarScale,
        opacity: navbarOpacity,
        boxShadow: scrolled ? `0px 5px ${navbarShadow.get()}px rgba(0, 180, 100, 0.2)` : 'none'
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div 
              style={{ height: logoSize, width: logoSize }}
              className="flex items-center justify-center bg-emerald-600 rounded-full p-1"
            >
              <Wallet className="text-gray-900 w-full h-full" />
            </motion.div>
            <motion.span 
              className={`ml-2 font-bold text-emerald-400 transition-all duration-300 ${scrolled ? 'text-lg' : 'text-xl'}`}
              layout
            >
              Hisaab Barabar
            </motion.span>
          </motion.div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            {['Home', 'About', 'How It Works', 'Contact'].map((item, index) => (
              <motion.a 
                key={index}
                href={item === 'Home' ? '#' : `#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-300 hover:text-emerald-400 relative font-medium"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {item}
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-500 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
            
            {/* Auth Button */}
            {userLogin ? (
              <div className="flex items-center space-x-3">
                <motion.div className="text-sm text-gray-300 flex items-center">
                  <User size={16} className="mr-1 text-emerald-400" />
                  <span>{currentUser?.username || 'User'}</span>
                </motion.div>
                <motion.button
                  className="flex items-center space-x-1 text-gray-900 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <Link
                to={'/login'}
                className="flex items-center space-x-1 text-gray-900 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-md font-medium text-sm"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button 
              onClick={toggleMenu}
              className="text-gray-300 hover:text-emerald-400 focus:outline-none"
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <motion.div 
        className="md:hidden overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: isMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 border-t border-gray-700 shadow-lg">
          {['Home', 'About', 'How It Works', 'Contact'].map((item, index) => (
            <motion.a 
              key={index}
              href={item === 'Home' ? '#' : `#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                index === 0 ? 'text-emerald-400 bg-gray-900' : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-900'
              }`}
              onClick={toggleMenu}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </motion.a>
          ))}
          
          {/* Auth Button for mobile */}
          {userLogin ? (
            <>
              <div className="px-3 py-2 text-sm text-gray-300 flex items-center">
                <User size={16} className="mr-1 text-emerald-400" />
                <span>{currentUser?.username || 'User'}</span>
              </div>
              <motion.button
                className="w-full flex items-center justify-center space-x-1 text-gray-900 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md font-medium text-base"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </motion.button>
            </>
          ) : (
            <Link
              to={'/login'}
              className="w-full flex items-center justify-center space-x-1 text-gray-900 bg-emerald-500 hover:bg-emerald-600 px-3 py-2 rounded-md font-medium text-base"
              onClick={toggleMenu}
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;