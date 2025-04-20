import { useState, useEffect } from 'react';
import { User, CreditCard, DollarSign, Users, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'


export default function AuthPage({userLogin , setUserLogin}) {

    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('hisaabUser');
    if (user) {
      setIsLoggedIn(true);
      setUserLogin(true);
      navigate('/')
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createUser = async(data)=>{
    try {
        const newUser = {
            name: formData.username,
            email: formData.email.toLocaleLowerCase(),
            password: formData.password,
            groups: [],
          };
          console.log(newUser)
    
          let res = await axios.post(backendUrl + '/auth/register', newUser);
          console.log(res);
          return {status : true, id : res.data._id};    
    } catch (error) {
      console.log("some error occured")  ;
      return {status : false};
    }
  }
  const loginUser = async(data)=>{
    try {
        const newUser = {
          
            email: formData.email,
            password: formData.password,
           
          };
    
          let res = await axios.post(backendUrl + '/auth/login', data);
          console.log(res);
          return {status : true , id : res.data._id};    
    } catch (error) {
      console.log("some error occured")  ;
      return {status : false};
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');

    console.log(isLogin, backendUrl + '/auth/login', formData)

    if (isLogin) {
      // Login logic
      let { status , id} = await loginUser(formData);
      if(status)
      {
        const newUser = {
          id,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          groups: [],
        };
        localStorage.setItem('hisaabUser', JSON.stringify(newUser));
        
        setIsLoggedIn(true);
        setUserLogin(true);
        navigate('/');
        setCurrentUser(newUser);
        
      }
      else{
        console.log("incorrect credentials...");
      }


      
      // if (user) {
      //   setCurrentUser(user);
      // } else {
      //   setError('Invalid email or password');
      // }

    } else {
      // Signup logic
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

    console.log( formData)
    let { status , id} = await createUser(formData);
    console.log(status, formData)
    
    if(status)
    {
        
      const newUser = {
        id,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        groups: [],
      };
      localStorage.setItem('hisaabUser', JSON.stringify(newUser));
      
      setIsLoggedIn(true);
      setUserLogin(true);
      navigate('/');
      setCurrentUser(newUser);

    }
    else{
        console.log("user save nahi hua");
    }
    //   users.push(newUser);
    //   localStorage.setItem('hisaabUsers', JSON.stringify(users));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hisaabUser');
    setIsLoggedIn(false);
    setUserLogin(true);
    setCurrentUser(null);
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-emerald-500 p-3 rounded-full">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Welcome to Hisaab Barabar</h2>
          <p className="text-center text-gray-600 mb-6">
            Hello, <span className="font-semibold">{currentUser.username}</span>! You are logged in.
          </p>
          <div className="bg-emerald-50 rounded-lg p-4 mb-6">
            <p className="text-center text-emerald-800">
              Start tracking expenses and split bills fairly with your friends!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="bg-emerald-500 p-3 rounded-full">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Hisaab Barabar</h2>
        <p className="text-center text-gray-600 mb-6">Split expenses, maintain friendships</p>
        
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                isLogin ? 'bg-emerald-500 text-white' : 'text-gray-600'
              }`}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                !isLogin ? 'bg-emerald-500 text-white' : 'text-gray-600'
              }`}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 bg-red-50 text-red-500 p-3 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="Your name"
                  className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="••••••••"
                  className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </motion.button>
        </form>

        {isLogin && <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hisaab Barabar Features</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Track Expenses</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Split Bills</span>
            </div>
          </div>
        </div>}
      </motion.div>
    </div>
  );
}