import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Wallet, Map, Compass, Settings, Send, ArrowRight } from 'lucide-react';

export default function SuggestionPage() {
  const [formData, setFormData] = useState({
    totalMembers: 2,
    totalBudget: 5000,
    place: '',
    theme: ''
  });
  
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalMembers' || name === 'totalBudget' ? Number(value) : value
    }));
  };

  async function getTripPlans(formData) {
    const { place, theme, totalBudget, totalMembers } = formData;
  
    // Create the prompt based on formData
    const prompt = `
  You are a travel planner.
  I have a group of ${totalMembers} members with a total budget of ₹${totalBudget}.
  We are interested in a "${theme}" theme and the location is "${place}".
  Suggest 3 trip plans within our budget.
  Each trip should have:
  - a name,
  - a cost (within budget),
  - and 3 activities (as an array).
  
  Respond strictly in JSON array format like:
  [
    { "name": "Trip Name", "cost": 2500, "activities": ["activity1", "activity2", "activity3"] },
    ...
  ]
  `;
  
    // Call the API
    const response = await fetch(`https://raghav-aiserver.vercel.app/chat?query=${encodeURIComponent(prompt)}`);
    const data = await response.json();
  
    try {
      // The API returns response as a string, so we parse it
      const trips = JSON.parse(data.response);
      return trips;
    } catch (error) {
      console.error("Error parsing trips:", error);
      return [];
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);

    console.log(formData);
    await getTripPlans(formData).then((trips) => {
      setSuggestions(trips);
    });

    setLoading(false);
  };

  const themes = ['Adventure', 'Relax', 'Culture', 'Food'];

  return (
    <div className="min-h-screen pt-8 bg-gray-900 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-gray-800 rounded-lg pt-16 shadow-xl overflow-hidden border border-gray-700">
          <div className="bg-emerald-700 p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-100 flex items-center">
              <Compass className="mr-2" />
              Hisaab Barabar - Trip Suggestions
            </h1>
            <p className="text-emerald-100 mt-2">
              Find perfect destinations that fit your group size and budget
            </p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-300 font-medium mb-2 flex items-center">
                    <Users className="mr-2 text-emerald-400" size={18} />
                    Number of People
                  </label>
                  <input
                    type="number"
                    name="totalMembers"
                    value={formData.totalMembers}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-gray-300 font-medium mb-2 flex items-center">
                    <Wallet className="mr-2 text-emerald-400" size={18} />
                    Total Budget (₹)
                  </label>
                  <input
                    type="number"
                    name="totalBudget"
                    value={formData.totalBudget}
                    onChange={handleChange}
                    min="100"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-gray-300 font-medium mb-2 flex items-center">
                    <Map className="mr-2 text-emerald-400" size={18} />
                    Place Preference (Optional)
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleChange}
                    placeholder="e.g., Beach, Mountain, City, Indoor"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-200 placeholder-gray-500"
                  />
                </div>
                
                <div>
                  <label className="text-gray-300 font-medium mb-2 flex items-center">
                    <Settings className="mr-2 text-emerald-400" size={18} />
                    Theme (Optional)
                  </label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-200"
                  >
                    <option value="">Select a theme</option>
                    {themes.map((theme) => (
                      <option key={theme} value={theme.toLowerCase()}>
                        {theme}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-gray-100 py-3 px-4 rounded-md hover:bg-emerald-700 transition flex items-center justify-center font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating Perfect Trips...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2" size={18} />
                      Find Perfect Trips
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {suggestions && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-gray-700 p-6"
            >
              <h2 className="text-xl font-bold text-emerald-400 mb-4">
                Suggested Places to Visit
              </h2>
              
              {suggestions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.map((place, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index}
                      className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:shadow-md hover:border-emerald-600 transition"
                    >
                      <h3 className="font-bold text-emerald-400 text-lg">{place.name}</h3>
                      <p className="text-gray-300 mt-1">
                        <span className="font-medium">Cost per person:</span> ₹{place.cost}
                      </p>
                      <div className="mt-2">
                        <span className="font-medium text-gray-300">Activities:</span>
                        <ul className="mt-1 space-y-1">
                          {place.activities.map((activity, i) => (
                            <li key={i} className="flex items-center text-gray-400">
                              <ArrowRight size={14} className="mr-1 text-emerald-400" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-700 rounded-lg">
                  <p className="text-gray-300">
                    No matching suggestions found. Try adjusting your preferences.
                  </p>
                </div>
              )}
              
              <div className="mt-6 bg-gray-700 p-4 rounded-lg border border-emerald-700">
                <p className="text-sm text-emerald-300">
                  Budget per person: <span className="font-bold">₹{(formData.totalBudget / formData.totalMembers).toFixed(2)}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  These suggestions are based on your inputs and budget constraints. Actual costs may vary.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}