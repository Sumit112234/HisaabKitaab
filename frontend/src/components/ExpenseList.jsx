
import { useState, useEffect } from 'react';
import { Search, Plus, Check, X, DollarSign, Users, AlertCircle, CheckCircle, Clock, UserPlus, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

let backend_url = import.meta.env.VITE_APP_BACKEND_URL;

// Add auth token to requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default function ExpenseManager() {
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupCreated, setGroupCreated] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [verifiedExpenses, setVerifiedExpenses] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    paidBy: '',
    description: '',
    splitBetween: []
  });
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [view, setView] = useState('pending'); // 'pending' or 'verified'
  const [activeMember, setActiveMember] = useState(null);
  const [showBalances, setShowBalances] = useState(false);
  const [settlements, setSettlements] = useState([]);
  const [balances, setBalances] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const localUser = JSON.parse(localStorage.getItem('hisaabUser'));
  // Check if user is authenticated and get user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);

        // setCurrentUser(JSON.parse(localUser));
        const { data } = await api.get(backend_url + `/user/${localUser.id}`);
        // console.log("data : " ,  data)
        setCurrentUser(data.data);
        
        // Fetch user's groups
        const groupsResponse = await api.post(backend_url + '/user/me/groups', {id : localUser.id});
        console.log("groupResponse : ", groupsResponse)
        setUserGroups(groupsResponse.data.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Authentication failed. Please login.');
        setLoading(false);
        // Redirect to login if not authenticated
        navigate('/login');
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // Search users by email
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      // Assuming there's an endpoint to search users by email
      // You might need to create this endpoint if it doesn't exist
      const { data } = await api.get(backend_url + `/user/find?email=${query}`);
      
      // Filter out current members and current user
      const filteredResults = data.data.filter(
        user => !members.some(member => member._id === user._id) && user._id !== currentUser._id
      );
      
      setSearchResults(filteredResults);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    console.log("Members state updated:", members);
  }, [members]);
  
  
  // Debounce search to prevent too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchEmail) {
        searchUsers(searchEmail);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchEmail]);

  // Select a group to view/manage
  const selectGroup = async (groupId) => {
    try {
      setLoading(true);
      
      // Get group details
      const { data : groupData } = await api.get(backend_url + `/groups/${groupId}`);
      console.log(groupData)
      setGroupName(groupData.data.name);
      setMembers(groupData.data.members);
      setCurrentGroupId(groupId);
      setGroupCreated(true);
      
      // Get expenses for the group
      await fetchGroupExpenses(groupId);
      
      // Get settlements for the group
      console.log("Fetching settlements ...")
      await fetchSettlements(groupId);
      
      setLoading(false);
    } catch (err) {
      console.error('Error selecting group:', err);
      setError('Failed to load group details');
      setLoading(false);
    }
  };
  
  // Fetch group expenses
  const fetchGroupExpenses = async (groupId) => {
    try {
      
      const { data } = await api.get(backend_url + `/expenses?groupId=${groupId}`);
      
      // Separate pending and verified expenses
      console.log(data)
      const pending = data.data.filter(expense => expense.status === 'pending');
      const verified = data.data.filter(expense => expense.status === 'verified');
      console.log(pending, verified)
      console.log(members)
      setPendingExpenses(pending);
      setVerifiedExpenses(verified);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to load expenses');
    }
  };
  
  // Fetch settlements for a group
  const fetchSettlements = async (groupId) => {
    try {
      // const { data } = await api.get(backend_url + `/groups/${groupId}/settlements?id=${localUser.id}`);
      const { data } = await api.get(backend_url + `/settlement/get-settlements/${groupId}`);
      console.log(data)
      setSettlements(data.data.settlements);
      setBalances(data.data.balances);
    } catch (err) {
      console.error('Error fetching settlements:', err);
    }
  };

  // Add member to group
  // Add member to group
// Add member to group
const addMember = async (user) => {
  console.log("Adding member:", user);
  console.log("Current members array:", members);
  
  // Create a copy of the current members array
  const currentMembers = [...members];
  
  // Check if member already exists in the array
  if (currentMembers.some(member => member._id === user._id)) {
    console.log("Member already exists, skipping");
    return;
  }
  
  // Add the new member to our copy
  const newMembersArray = [...currentMembers, user];
  console.log("New members array:", newMembersArray);
  
  // Update the state with the new array
  setMembers(newMembersArray);
  setSearchEmail('');
  setSearchResults([]);
  
  // If we have a group ID, also update on the server
  if (currentGroupId) {
    try {
      await api.put(backend_url + `/groups/${currentGroupId}/members`, { userId: user._id });
    } catch (err) {
      console.error('Error adding member to server:', err);
      setError('Failed to add member to group on the server');
    }
  }
};
  // const addMember = async (user) => {
  //   console.log("came to addMembers : " ,currentGroupId)
  //   if (currentGroupId) {
  //     try {
  //       await api.put(backend_url + `/groups/${currentGroupId}/members`, { userId: user._id });
  //       setMembers([...members, user]);
  //       setSearchEmail('');
  //       setSearchResults([]);
  //     } catch (err) {
  //       console.error('Error adding member:', err);
  //       setError('Failed to add member to group');
  //     }
  //   }
  // };

  // Remove member from group
 
  const removeMember = async (userId) => {
    console.log("query for removeMember : ", currentGroupId)
    if (currentGroupId) {
      try {
        await api.delete(backend_url + `/groups/${currentGroupId}/members/${userId}`);
        setMembers(members.filter(member => member._id !== userId));
      } catch (err) {
        console.error('Error removing member:', err);
        setError('Failed to remove member from group');
      }
    }
    else{
      setMembers(members.filter(member => member._id !== userId));
    }
  };

  // Create group
  // Create group
const createGroup = async () => {

  // console.log(members, currentUser)
  // return ;
   
    if (groupName.trim() && members.length > 0) {
    try {
      // Ensure current user is included as a member
      let allMembers = [...members];
      if (!allMembers.some(member => member._id === currentUser._id)) {
        allMembers.push(currentUser);
      }
      
      // Create new group with current user as admin
      const { data } = await api.post(backend_url + '/groups', {
        name: groupName,
        id : localUser.id,
        memberIds: allMembers.map(member => member._id),
        createdBy: currentUser._id
      });
      
      console.log("Group created:", data);
      setCurrentGroupId(data.data._id);
      setGroupCreated(true);
      
      // Refresh user's groups
      const groupsResponse = await api.post(backend_url + '/user/me/groups', {id: localUser.id});
      setUserGroups(groupsResponse.data.data);
      await selectGroup(data.data._id);
      
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group');
    }
  }
};
  // const createGroup = async () => {
  //   if (groupName.trim() && members.length > 0) {
  //     try {
  //       // Create new group with current user as admin
  //       const { data } = await api.post('/groups', {
  //         name: groupName,
  //         memberIds: members.map(member => member._id)
  //       });
        
  //       setCurrentGroupId(data.data._id);
  //       setGroupCreated(true);
        
  //       // Refresh user's groups
  //       const groupsResponse = await api.get('/users/me/groups');
  //       setUserGroups(groupsResponse.data.data);
  //     } catch (err) {
  //       console.error('Error creating group:', err);
  //       setError('Failed to create group');
  //     }
  //   }
  // };

  // Add new expense
  


  const addExpense = async () => {
    console.log('reached', newExpense, currentGroupId)
    if (newExpense.title && newExpense.amount > 0 && newExpense.paidBy && currentGroupId) {
      try {
        // Prepare split users array - if none selected, use all members
        const splitBetween = newExpense.splitBetween.length > 0 
          ? newExpense.splitBetween 
          : members.map(member => member._id);
        
        // Create new expense request
        await api.post(backend_url + `/expenses`, {
          title: newExpense.title,
          group : currentGroupId,
          amount: parseFloat(newExpense.amount),
          paidBy: newExpense.paidBy,
          currentUser : localUser.id,
          description: newExpense.description,
          splitBetween: splitBetween
        })
        .then(()=>{
          console.log("expenses saved! ")
        })
        
        // Refresh expenses
        await fetchGroupExpenses(currentGroupId);
        
        // Reset form
        // setNewExpense({
        //   title: '',
        //   amount: '',
        //   paidBy: '',
        //   description: '',
        //   splitBetween: []
        // });
        setShowExpenseForm(false);
      } catch (err) {
        console.error('Error adding expense:', err);
        setError('Failed to add expense');
      }
    }
  };

  // Toggle verification for an expense
  const toggleVerification = async (expenseId, isCurrentlyVerified) => {
    try {
      await api.put(backend_url + `/expenses/${expenseId}/verify?userId=${localUser.id}`);
      
      // Refresh expenses to show updated verification status
      await fetchGroupExpenses(currentGroupId);
      
      // Refresh settlements if an expense is verified
      if (!isCurrentlyVerified) {
        await fetchSettlements(currentGroupId);
      }
    } catch (err) {
      console.error('Error verifying expense:', err);
      setError('Failed to verify expense');
    }
  };

  // Settle an expense
  const settleExpense = async (expenseId) => {
    try {
      await api.put(backend_url + `/expenses/${expenseId}/settle`);
      
      // Refresh settlements after settling
      await fetchSettlements(currentGroupId);
    } catch (err) {
      console.error('Error settling expense:', err);
      setError('Failed to settle expense');
    }
  };

  // Toggle member selection for expense split
  const toggleMemberForSplit = (memberId) => {
    const isSelected = newExpense.splitBetween.includes(memberId);
    if (isSelected) {
      setNewExpense({
        ...newExpense,
        splitBetween: newExpense.splitBetween.filter(id => id !== memberId)
      });
    } else {
      setNewExpense({
        ...newExpense,
        splitBetween: [...newExpense.splitBetween, memberId]
      });
    }
  };

  // Get member name by ID
  const getMemberName = (id) => {
    // console.log("members : ", members, id)
    const member = members.find(m => m.user._id === id);
    return member ? member.name : 'Unknown';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Check if user has verified an expense
  const hasUserVerified = (expense) => {
    console.log(currentUser._id)
    return expense.approvals?.includes(currentUser?._id);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <h3 className="font-medium">Error</h3>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => navigate('/login')} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Go to Login
        </button>
      </div>
    );
  }

  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black rounded-lg shadow-lg text-white">
    <div className="mb-8 mt-16">
      <h1 className="text-3xl font-bold text-green-400 mb-2">Hisaab Barabar</h1>
      <p className="text-gray-400">Split expenses easily with friends and family.</p>
    </div>
    
    {!groupCreated ? (
      <div>
        {/* Show user's existing groups if any */}
        {userGroups.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-green-300 mb-4">Your Groups</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {userGroups.map(group => (
                <div 
                  key={group._id}
                  onClick={() => selectGroup(group._id)}
                  className="border border-green-800 rounded-lg p-4 hover:bg-green-900 hover:border-green-500 cursor-pointer transition"
                >
                  <h3 className="font-medium text-green-400">{group.name}</h3>
                  <div className="flex items-center text-gray-400 mt-2">
                    <Users size={16} className="mr-1" />
                    <span>{group.members?.length || 0} members</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-300 mb-6">Create a New Group</h2>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-medium">Group Name</label>
            <input
              type="text"
              className="w-full p-3 border border-green-700 bg-gray-800 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-white"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name (e.g., Trip to Goa)"
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-300 mb-2 font-medium">Add Members</label>
            <div className="flex items-center mb-2">
              <input
                type="email"
                className="flex-1 p-3 border border-green-700 bg-gray-800 rounded-l-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-white"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Search by email address"
              />
              <button className="bg-green-600 text-white p-3 rounded-r-md hover:bg-green-700 transition">
                <Search size={20} />
              </button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-2 mb-4 border border-green-700 rounded-md shadow-sm overflow-hidden bg-gray-800">
                {searchResults.map(user => (
                  <div 
                    key={user._id}
                    className="flex items-center justify-between p-3 hover:bg-green-900 cursor-pointer border-b border-green-800 last:border-b-0"
                    onClick={() => addMember(user)}
                  >
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <UserPlus size={18} className="text-green-400" />
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-gray-300 mb-3 font-medium">Selected Members:</h3>
              {members.length === 0 ? (
                <div className="p-4 bg-gray-800 rounded-md border border-dashed border-green-700 text-gray-400 text-center">
                  No members added yet. Add members to create a group.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {members.map(member => (
                    <div
                      key={member._id}
                      className="flex items-center bg-green-900 text-green-200 px-3 py-2 rounded-full"
                    >
                      <span className="mr-1">{member.name}</span>
                      <button 
                        onClick={() => removeMember(member._id)}
                        className="text-green-400 hover:text-green-200 ml-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={createGroup}
            disabled={!groupName.trim() || members.length === 0}
            className={`w-full py-3 rounded-md font-medium transition ${
              !groupName.trim() || members.length === 0
                ? 'bg-gray-700 cursor-not-allowed text-gray-500'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Create Group
          </button>
        </div>
      </div>
    ) : (
      <div className='min-h-screen'>
        {/* Group Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-green-300">{groupName}</h2>
            <div className="flex items-center text-gray-400 mt-1">
              <Users size={18} className="mr-1" />
              <span>{members.length} members</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setGroupCreated(false); 
                setCurrentGroupId(null);
              }}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
            >
              Back to Groups
            </button>
            
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center transition"
            >
              {showBalances ? 'Hide' : 'Show'} Balances
            </button>
            
            <button
              onClick={() => setShowExpenseForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition"
            >
              <Plus size={18} className="mr-1" />
              Add Expense
            </button>
          </div>
        </div>
        
        {/* Balance Summary */}
        {showBalances && (
          <div className="mb-8 bg-gray-900 p-6 rounded-lg shadow border border-green-800">
            <h3 className="text-xl font-semibold text-green-300 mb-4">Balances & Settlements</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Member Balances */}
              <div>
                <h4 className="font-medium text-green-400 mb-3">Member Balances</h4>
                <div className="space-y-2">
                  {members.map(member => {
                    const memberBalance = balances.find((m) => m.userId === member.user._id)?.amount || 0;
                    return (
                      <div 
                        key={member._id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-md"
                      >
                        <span className="font-medium">{member.user.name}</span>
                        <span className={`font-medium ${
                          memberBalance > 0 
                            ? 'text-green-400' 
                            : memberBalance < 0 
                              ? 'text-red-400' 
                              : 'text-gray-400'
                        }`}>
                          {memberBalance > 0 ? '+' : ''}
                          ₹{memberBalance.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Settlement Plan */}
              <div>
                <h4 className="font-medium text-green-400 mb-3">Settlement Plan</h4>
                {settlements.length === 0 ? (
                  <div className="p-4 bg-gray-800 rounded-md text-gray-400 text-center">
                    All balances are settled.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {settlements.map((settlement, index) => {
                      const fromUser = members.find(m => m.user._id === settlement.from._id);
                      const toUser = members.find(m => m.user._id === settlement.to._id);
                      
                      return (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-800 rounded-md"
                        >
                          <div className="flex items-center">
                            <span className="font-medium text-red-400">
                              {fromUser?.user?.name || 'Unknown'}
                              {fromUser?.user?._id === currentUser?._id ? ' (You)' : ''}
                            </span>
                            <ArrowRight size={16} className="mx-2 text-gray-400" />
                            <span className="font-medium text-green-400">
                              {toUser?.user?.name || 'Unknown'}
                              {toUser?.user?._id === currentUser?._id ? ' (You)' : ''}
                            </span>
                          </div>
                          <span className="font-medium">₹{parseFloat(settlement.amount).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Expense List Tabs */}
        <div className="mb-4 border-b border-green-800">
          <div className="flex space-x-4">
            <button
              onClick={() => setView('pending')}
              className={`py-2 px-4 font-medium ${
                view === 'pending'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Pending Verification ({pendingExpenses.length})
            </button>
            <button
              onClick={() => setView('verified')}
              className={`py-2 px-4 font-medium ${
                view === 'verified'
                  ? 'text-green-400 border-b-2 border-green-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Verified Expenses ({verifiedExpenses.length})
            </button>
          </div>
        </div>
        
        {/* Pending Expenses List */}
        {view === 'pending' && (
          <div className="mb-6">
            {pendingExpenses.length === 0 ? (
              <div className="text-center p-8 bg-gray-800 rounded-lg border border-dashed border-green-700">
                <p className="text-gray-400">No pending expenses.</p>
                <p className="text-gray-400 text-sm mt-1">
                  Add an expense to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingExpenses.map(expense => {
                  const payer = members.find(m => m.user._id === expense.paidBy._id);
                  const isVerified = hasUserVerified(expense);
                  const requiredApprovals = Math.ceil(members.length / 2);
                  const splitAmount = expense.splitBetween?.length > 0
                    ? (expense.amount / expense.splitBetween.length).toFixed(2)
                    : (expense.amount / members.length).toFixed(2);
                  
                  return (
                    <div
                      key={expense._id}
                      className="p-4 rounded-lg border border-green-800 bg-gray-800"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-white">{expense.title}</h4>
                          <p className="text-sm text-gray-400">
                            {formatDate(expense.date)} • Paid by {payer?.user?.name} {payer?.user?._id === currentUser?._id ? '(You)' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-400">₹{expense.amount}</p>
                          <p className="text-sm text-gray-400">₹{splitAmount} per person</p>
                        </div>
                      </div>
                      
                      {expense.description && (
                        <p className="text-gray-300 text-sm mt-2 mb-3">{expense.description}</p>
                      )}
                      
                      <div className="mt-4 flex flex-wrap justify-between items-center">
                        <div className="flex items-center">
                          <span className="flex items-center text-green-300 text-sm bg-green-900 px-2 py-1 rounded-full">
                            <Clock size={14} className="mr-1" />
                            {expense.approvals?.length || 0}/{requiredApprovals} approvals needed
                          </span>
                          <div className="ml-2 flex -space-x-1">
                            {expense.verifiedBy?.slice(0, 3).map(userId => {
                              const verifier = members.find(m => m._id === userId);
                              return (
                                <div 
                                  key={userId}
                                  className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-medium border-2 border-gray-900"
                                  title={verifier?.name || 'Unknown'}
                                >
                                  {verifier?.name.charAt(0) || '?'}
                                </div>
                              );
                            })}
                            {(expense.verifiedBy?.length || 0) > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium border-2 border-gray-900">
                                +{(expense.verifiedBy?.length || 0) - 3}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {expense.paidBy !== currentUser?._id && (
                          <button
                            onClick={() => toggleVerification(expense._id, isVerified)}
                            className={`px-3 py-1 rounded-md text-sm ${
                              isVerified
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            {isVerified ? 'Revoke Approval' : 'Approve'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* Verified Expenses List */}
        {view === 'verified' && (
          <div className="mb-6">
            {verifiedExpenses.length === 0 ? (
              <div className="text-center p-8 bg-gray-800 rounded-lg border border-dashed border-green-700">
                <p className="text-gray-400">No verified expenses yet.</p>
                <p className="text-gray-400 text-sm mt-1">
                  Expenses need to be approved by at least half of the group members.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {verifiedExpenses.map(expense => {
                  const payer = members.find(m => m.user._id === expense.paidBy._id);
                  const splitAmount = expense.splitBetween?.length > 0
                    ? (expense.amount / expense.splitBetween.length).toFixed(2)
                    : (expense.amount / members.length).toFixed(2);
                  
                  const isSettled = expense.splitBetween?.includes(currentUser?._id);
                  const isOwedByCurrentUser = expense.splitBetween?.includes(currentUser?._id) && 
                                             expense.paidBy._id !== currentUser?._id;

                  let isVerified = hasUserVerified(expense);
                  
                  return (
                    <div
                      key={expense._id}
                      className="p-4 rounded-lg border border-green-700 bg-gray-800"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-white">{expense.title}</h4>
                            {!isVerified ? (
                              <button
                                onClick={() =>{ toggleVerification(expense._id, isVerified); isVerified = true}}
                                className={`px-3 mx-3 py-1 rounded-md text-sm ${
                                  isVerified
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                              >
                                {isVerified ? 'Revoke Approval' : 'Approve'}
                              </button>
                            ) : (
                              <span className="ml-2 flex items-center text-green-300 text-xs bg-green-900 px-2 py-1 rounded-full">
                                <CheckCircle size={12} className="mr-1" />
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">
                            {formatDate(expense.date)} • Paid by {payer?.user?.name} {payer?.user?._id === currentUser?._id ? '(You)' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-400">₹{expense.amount}</p>
                          <p className="text-sm text-gray-400">₹{splitAmount} per person</p>
                        </div>
                      </div>
                      
                      {expense.description && (
                        <p className="text-gray-300 text-sm mt-2 mb-3">{expense.description}</p>
                      )}
                      
                      {expense.splitBetween && expense.splitBetween.length <= members.length && (
                        <div className="mt-3 text-sm text-gray-400">
                          <p>Split between: {expense.splitBetween.map(id => getMemberName(id)).join(', ')}</p>
                        </div>
                      )}
                      
                      {isOwedByCurrentUser && !isSettled && (
                        <div className="mt-4 flex justify-end">
                          <button 
                            onClick={() => settleExpense(expense._id)}
                            className="flex items-center text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition"
                          >
                            <Check size={14} className="mr-1" />
                            Mark as Settled
                          </button>
                        </div>
                      )}
                      
                      {/* Show settled status if applicable */}
                      {isSettled && (
                        <div className="mt-4 flex justify-end">
                          <span className="flex items-center text-sm bg-gray-700 text-gray-300 px-3 py-1 rounded-md">
                            <CheckCircle size={14} className="mr-1" />
                            You've settled this expense
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* New Expense Form Modal */}
        {showExpenseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md border border-green-700">
              <h3 className="text-xl font-bold text-green-400 mb-4">Add New Expense</h3>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-1 font-medium">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-700 bg-gray-800 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-white"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                  placeholder="What was this expense for?"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-1 font-medium">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <DollarSign size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="number"
                    className="w-full p-2 pl-8 border border-green-700 bg-gray-800 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-white"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-1 font-medium">Paid By</label>
                <select
                  className="w-full p-2 border border-green-700 bg-gray-800 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-white"
                  value={newExpense.paidBy}
                  onChange={(e) => setNewExpense({...newExpense, paidBy: e.target.value})}
                >
                  <option value="">Select who paid</option>
                  {members.length > 0 && members.map(member => (
                    <option key={member._id} value={member?.user?._id}>
                      {member?.user.name} {member?.user._id === currentUser?._id ? '(You)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-1 font-medium">Split Between</label>
                <div className="text-sm text-gray-400 mb-2">
                  {newExpense.splitBetween.length === 0 ? 
                    "Split equally among all members (default)" : 
                    `Split between ${newExpense.splitBetween.length} selected members`}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {members.length > 0 && members.map(member => (
                    <div
                      key={member._id}
                      onClick={() => toggleMemberForSplit(member?.user._id)}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer transition ${
                        newExpense.splitBetween.includes(member?.user._id) || newExpense.splitBetween.length === 0
                          ? 'bg-green-900 text-green-200 border border-green-700'
                          : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}
                    >
                      {member?.user.name}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Deselect all members to split equally among everyone
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-1 font-medium">Description (Optional)</label>
                <textarea
                  className="w-full p-2 border border-green-700 bg-gray-800 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition min-h-20 text-white"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="Add any additional details..."
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowExpenseForm(false)}
                  className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addExpense}
                  disabled={!newExpense.title || !newExpense.amount || !newExpense.paidBy}
                  className={`px-4 py-2 rounded-md ${
                    !newExpense.title || !newExpense.amount || !newExpense.paidBy
                      ? 'bg-green-800 cursor-not-allowed text-gray-400'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        )}
        
          
          {/* View Member Details Modal */}
          {activeMember && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{activeMember.name}</h3>
                
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Balance Summary</h4>
                  <div className="flex justify-between">
                    <span>Current Balance:</span>
                    <span className={`font-bold ${
                      (balances[activeMember._id]?.net || 0) > 0 
                        ? 'text-green-600' 
                        : (balances[activeMember._id]?.net || 0) < 0 
                          ? 'text-red-600' 
                          : 'text-gray-600'
                    }`}>
                      {(balances[activeMember._id]?.net || 0) > 0 ? '+' : ''}
                      ₹{(balances[activeMember._id]?.net || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Total Paid:</span>
                    <span className="text-green-600 font-medium">
                      ₹{(balances[activeMember._id]?.paid || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Total Owed:</span>
                    <span className="text-red-600 font-medium">
                      ₹{(balances[activeMember._id]?.owed || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-700 mt-4 mb-2">Recent Activity</h4>
                <div className="max-h-64 overflow-y-auto">
                  {[...pendingExpenses, ...verifiedExpenses]
                    .filter(exp => exp.paidBy === activeMember._id || exp.splitBetween?.includes(activeMember._id))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map(exp => (
                      <div 
                        key={exp._id}
                        className={`p-3 mb-2 rounded-md ${
                          exp.isVerified ? 'bg-green-50' : 'bg-amber-50'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{exp.title}</span>
                          <span className="font-medium">₹{exp.amount}</span>
                        </div>
                        <div className="text-sm text-gray-600 flex justify-between mt-1">
                          <span>{formatDate(exp.createdAt)}</span>
                          <span>{exp.paidBy === activeMember._id ? 'Paid' : 'Owes'}</span>
                        </div>
                      </div>
                    ))}
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setActiveMember(null)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// sumit Rohan Ram
// paid Natasha devil(you) 1000 
// paid devil you hotel 3000



// import { useState, useEffect } from 'react';
// import { Search, Plus, Check, X, DollarSign, Users, AlertCircle, CheckCircle, Clock, UserPlus, ArrowRight } from 'lucide-react';

// export default function ExpenseManager() {
//   // States
//   const [searchEmail, setSearchEmail] = useState('');
//   const [members, setMembers] = useState([]);
//   const [groupName, setGroupName] = useState('');
//   const [groupCreated, setGroupCreated] = useState(false);
//   const [pendingExpenses, setPendingExpenses] = useState([]);
//   const [verifiedExpenses, setVerifiedExpenses] = useState([]);
//   const [newExpense, setNewExpense] = useState({
//     title: '',
//     amount: '',
//     paidBy: '',
//     description: '',
//     splitBetween: []
//   });
//   const [showExpenseForm, setShowExpenseForm] = useState(false);
//   const [view, setView] = useState('pending'); // 'pending' or 'verified'
//   const [activeMember, setActiveMember] = useState(null);
//   const [showBalances, setShowBalances] = useState(false);

//   // Mock user search results - in a real app, this would be an API call
//   const [searchResults, setSearchResults] = useState([]);
  
//   // Current user - in a real app, this would come from auth context
//   const currentUser = {
//     id: '123',
//     name: 'You',
//     email: 'current@example.com'
//   };

//   // Search users by email
//   const searchUsers = (query) => {
//     // Simulate API call with mock data
//     const mockUsers = [
//       { id: '456', name: 'John Doe', email: 'john@example.com' },
//       { id: '789', name: 'Jane Smith', email: 'jane@example.com' },
//       { id: '101', name: 'Raj Kumar', email: 'raj@example.com' },
//       { id: '102', name: 'Priya Singh', email: 'priya@example.com' }
//     ];
    
//     const results = mockUsers.filter(user => 
//       user.email.toLowerCase().includes(query.toLowerCase()) && 
//       user.id !== currentUser.id
//     );
    
//     setSearchResults(results);
//   };

//   useEffect(() => {
//     if (searchEmail.trim()) {
//       searchUsers(searchEmail);
//     } else {
//       setSearchResults([]);
//     }
//   }, [searchEmail]);

//   // Add member to group
//   const addMember = (user) => {
//     if (!members.some(member => member.id === user.id)) {
//       setMembers([...members, user]);
//     }
//     setSearchEmail('');
//     setSearchResults([]);
//   };

//   // Remove member from group
//   const removeMember = (userId) => {
//     setMembers(members.filter(member => member.id !== userId));
//   };

//   // Create group
//   const createGroup = () => {
//     if (groupName.trim() && members.length > 0) {
//       // Add current user to members list if not already there
//       if (!members.some(member => member.id === currentUser.id)) {
//         setMembers([currentUser, ...members]);
//       }
//       setGroupCreated(true);
//     }
//   };

//   // Add new expense
//   const addExpense = () => {
//     if (newExpense.title && newExpense.amount > 0 && newExpense.paidBy) {
//       const allMembers = members.map(member => member.id);
//       const splitBetween = newExpense.splitBetween.length > 0 ? 
//         newExpense.splitBetween : allMembers;
      
//       const expense = {
//         ...newExpense,
//         id: Date.now().toString(),
//         date: new Date(),
//         splitBetween,
//         approvals: [currentUser.id], // Auto-approve by creator
//         status: 'pending',
//         requiredApprovals: Math.ceil((members.length) / 2)
//       };
      
//       setPendingExpenses([...pendingExpenses, expense]);
//       setNewExpense({
//         title: '',
//         amount: '',
//         paidBy: '',
//         description: '',
//         splitBetween: []
//       });
//       setShowExpenseForm(false);
//     }
//   };

//   // Toggle approval for an expense
//   const toggleApproval = (expenseId) => {
//     const updatedExpenses = pendingExpenses.map(expense => {
//       if (expense.id === expenseId) {
//         const isApproved = expense.approvals.includes(currentUser.id);
//         const updatedApprovals = isApproved 
//           ? expense.approvals.filter(id => id !== currentUser.id)
//           : [...expense.approvals, currentUser.id];
        
//         const updatedStatus = updatedApprovals.length >= expense.requiredApprovals ? 'verified' : 'pending';
        
//         return {
//           ...expense,
//           approvals: updatedApprovals,
//           status: updatedStatus
//         };
//       }
//       return expense;
//     });
    
//     // Move verified expenses to the verified list
//     const newPendingExpenses = updatedExpenses.filter(expense => expense.status === 'pending');
//     const newVerifiedExpenses = [
//       ...verifiedExpenses,
//       ...updatedExpenses.filter(expense => expense.status === 'verified')
//     ];
    
//     setPendingExpenses(newPendingExpenses);
//     setVerifiedExpenses(newVerifiedExpenses);
//   };

//   // Calculate balances - who owes whom
//   const calculateBalances = () => {
//     const balances = {};
    
//     // Initialize balances for all members
//     members.forEach(member => {
//       balances[member.id] = { paid: 0, owes: 0, net: 0 };
//     });
    
//     // Calculate from verified expenses
//     verifiedExpenses.forEach(expense => {
//       const paidBy = expense.paidBy;
//       const amount = parseFloat(expense.amount);
//       const splitBetween = expense.splitBetween || members.map(m => m.id);
//       const splitAmount = amount / splitBetween.length;
      
//       // Add to payer's paid amount
//       balances[paidBy].paid += amount;
      
//       // Add to each member's owed amount
//       splitBetween.forEach(memberId => {
//         balances[memberId].owes += splitAmount;
//       });
//     });
    
//     // Calculate net balance for each member
//     members.forEach(member => {
//       balances[member.id].net = balances[member.id].paid - balances[member.id].owes;
//     });
    
//     return balances;
//   };

//   // Get settlement plan - optimized transfers to settle all debts
//   const getSettlementPlan = () => {
//     const balances = calculateBalances();
//     const settlements = [];
    
//     // Find debtors (negative net) and creditors (positive net)
//     const debtors = members
//       .filter(m => balances[m.id].net < -0.01)
//       .map(m => ({ id: m.id, name: m.name, amount: -balances[m.id].net }));
    
//     const creditors = members
//       .filter(m => balances[m.id].net > 0.01)
//       .map(m => ({ id: m.id, name: m.name, amount: balances[m.id].net }));
    
//     // Match debtors with creditors
//     debtors.forEach(debtor => {
//       let remainingDebt = debtor.amount;
      
//       while (remainingDebt > 0.01 && creditors.length > 0) {
//         const creditor = creditors[0];
        
//         if (creditor.amount <= remainingDebt) {
//           // Creditor gets fully paid
//           settlements.push({
//             from: debtor.id,
//             fromName: debtor.name,
//             to: creditor.id,
//             toName: creditor.name,
//             amount: creditor.amount.toFixed(2)
//           });
          
//           remainingDebt -= creditor.amount;
//           creditors.shift(); // Remove fully paid creditor
//         } else {
//           // Creditor gets partially paid
//           settlements.push({
//             from: debtor.id,
//             fromName: debtor.name,
//             to: creditor.id,
//             toName: creditor.name,
//             amount: remainingDebt.toFixed(2)
//           });
          
//           creditor.amount -= remainingDebt;
//           remainingDebt = 0;
//         }
//       }
//     });
    
//     return settlements;
//   };

//   // Toggle member selection for expense split
//   const toggleMemberForSplit = (memberId) => {
//     const isSelected = newExpense.splitBetween.includes(memberId);
//     if (isSelected) {
//       setNewExpense({
//         ...newExpense,
//         splitBetween: newExpense.splitBetween.filter(id => id !== memberId)
//       });
//     } else {
//       setNewExpense({
//         ...newExpense,
//         splitBetween: [...newExpense.splitBetween, memberId]
//       });
//     }
//   };

//   // Get member name by ID
//   const getMemberName = (id) => {
//     const member = members.find(m => m.id === id);
//     return member ? member.name : 'Unknown';
//   };

//   // Format date
//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       day: 'numeric',
//       month: 'short'
//     });
//   };

//   const balances = calculateBalances();
//   const settlements = getSettlementPlan();

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-indigo-800 mb-2">Hisaab Barabar</h1>
//         <p className="text-gray-600">Split expenses easily with friends and family.</p>
//       </div>
      
//       {!groupCreated ? (
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold text-gray-800 mb-6">Create a New Group</h2>
          
//           <div className="mb-6">
//             <label className="block text-gray-700 mb-2 font-medium">Group Name</label>
//             <input
//               type="text"
//               className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//               placeholder="Enter group name (e.g., Trip to Goa)"
//             />
//           </div>
          
//           <div className="mb-8">
//             <label className="block text-gray-700 mb-2 font-medium">Add Members</label>
//             <div className="flex items-center mb-2">
//               <input
//                 type="email"
//                 className="flex-1 p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
//                 value={searchEmail}
//                 onChange={(e) => setSearchEmail(e.target.value)}
//                 placeholder="Search by email address"
//               />
//               <button className="bg-indigo-500 text-white p-3 rounded-r-md hover:bg-indigo-600 transition">
//                 <Search size={20} />
//               </button>
//             </div>
            
//             {searchResults.length > 0 && (
//               <div className="mt-2 mb-4 border border-gray-200 rounded-md shadow-sm overflow-hidden bg-white">
//                 {searchResults.map(user => (
//                   <div 
//                     key={user.id}
//                     className="flex items-center justify-between p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                     onClick={() => addMember(user)}
//                   >
//                     <div>
//                       <p className="font-medium text-gray-800">{user.name}</p>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                     </div>
//                     <UserPlus size={18} className="text-indigo-500" />
//                   </div>
//                 ))}
//               </div>
//             )}
            
//             <div className="mt-6">
//               <h3 className="text-gray-700 mb-3 font-medium">Selected Members:</h3>
//               {members.length === 0 ? (
//                 <div className="p-4 bg-gray-50 rounded-md border border-dashed border-gray-300 text-gray-500 text-center">
//                   No members added yet. Add members to create a group.
//                 </div>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {members.map(member => (
//                     <div
//                       key={member.id}
//                       className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-2 rounded-full"
//                     >
//                       <span className="mr-1">{member.name}</span>
//                       <button 
//                         onClick={() => removeMember(member.id)}
//                         className="text-indigo-500 hover:text-indigo-700 ml-1"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <button
//             onClick={createGroup}
//             disabled={!groupName.trim() || members.length === 0}
//             className={`w-full py-3 rounded-md font-medium transition ${
//               !groupName.trim() || members.length === 0
//                 ? 'bg-gray-300 cursor-not-allowed text-gray-500'
//                 : 'bg-indigo-600 hover:bg-indigo-700 text-white'
//             }`}
//           >
//             Create Group
//           </button>
//         </div>
//       ) : (
//         <div>
//           {/* Group Header */}
//           <div className="flex items-start justify-between mb-8">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">{groupName}</h2>
//               <div className="flex items-center text-gray-600 mt-1">
//                 <Users size={18} className="mr-1" />
//                 <span>{members.length} members</span>
//               </div>
//             </div>
            
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowBalances(!showBalances)}
//                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center transition"
//               >
//                 {showBalances ? 'Hide' : 'Show'} Balances
//               </button>
              
//               <button
//                 onClick={() => setShowExpenseForm(true)}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition"
//               >
//                 <Plus size={18} className="mr-1" />
//                 Add Expense
//               </button>
//             </div>
//           </div>
          
//           {/* Balance Summary */}
//           {showBalances && (
//             <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">Balances & Settlements</h3>
              
//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Member Balances */}
//                 <div>
//                   <h4 className="font-medium text-gray-700 mb-3">Member Balances</h4>
//                   <div className="space-y-2">
//                     {members.map(member => {
//                       const memberBalance = balances[member.id]?.net || 0;
//                       return (
//                         <div 
//                           key={member.id}
//                           className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
//                         >
//                           <span className="font-medium">{member.name}</span>
//                           <span className={`font-medium ${
//                             memberBalance > 0 
//                               ? 'text-green-600' 
//                               : memberBalance < 0 
//                                 ? 'text-red-600' 
//                                 : 'text-gray-600'
//                           }`}>
//                             {memberBalance > 0 ? '+' : ''}
//                             ₹{memberBalance.toFixed(2)}
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
                
//                 {/* Settlement Plan */}
//                 <div>
//                   <h4 className="font-medium text-gray-700 mb-3">Settlement Plan</h4>
//                   {settlements.length === 0 ? (
//                     <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-center">
//                       All balances are settled.
//                     </div>
//                   ) : (
//                     <div className="space-y-2">
//                       {settlements.map((settlement, index) => (
//                         <div 
//                           key={index}
//                           className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
//                         >
//                           <div className="flex items-center">
//                             <span className="font-medium text-red-600">{settlement.fromName}</span>
//                             <ArrowRight size={16} className="mx-2 text-gray-500" />
//                             <span className="font-medium text-green-600">{settlement.toName}</span>
//                           </div>
//                           <span className="font-medium">₹{parseFloat(settlement.amount).toFixed(2)}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {/* Expense List Tabs */}
//           <div className="mb-4 border-b border-gray-200">
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => setView('pending')}
//                 className={`py-2 px-4 font-medium ${
//                   view === 'pending'
//                     ? 'text-indigo-600 border-b-2 border-indigo-600'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Pending Verification ({pendingExpenses.length})
//               </button>
//               <button
//                 onClick={() => setView('verified')}
//                 className={`py-2 px-4 font-medium ${
//                   view === 'verified'
//                     ? 'text-indigo-600 border-b-2 border-indigo-600' 
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Verified Expenses ({verifiedExpenses.length})
//               </button>
//             </div>
//           </div>
          
//           {/* Pending Expenses List */}
//           {view === 'pending' && (
//             <div className="mb-6">
//               {pendingExpenses.length === 0 ? (
//                 <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//                   <p className="text-gray-500">No pending expenses.</p>
//                   <p className="text-gray-500 text-sm mt-1">
//                     Add an expense to get started.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {pendingExpenses.map(expense => {
//                     const payer = members.find(m => m.id === expense.paidBy);
//                     const isApproved = expense.approvals.includes(currentUser.id);
//                     const splitAmount = expense.splitBetween.length > 0 
//                       ? (expense.amount / expense.splitBetween.length).toFixed(2)
//                       : (expense.amount / members.length).toFixed(2);
                    
//                     return (
//                       <div
//                         key={expense.id}
//                         className="p-4 rounded-lg border border-amber-200 bg-amber-50"
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <h4 className="font-medium text-gray-800">{expense.title}</h4>
//                             <p className="text-sm text-gray-600">
//                               {formatDate(expense.date)} • Paid by {payer?.name} {payer?.id === currentUser.id ? '(You)' : ''}
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-bold text-lg">₹{expense.amount}</p>
//                             <p className="text-sm text-gray-600">₹{splitAmount} per person</p>
//                           </div>
//                         </div>
                        
//                         {expense.description && (
//                           <p className="text-gray-700 text-sm mt-2 mb-3">{expense.description}</p>
//                         )}
                        
//                         <div className="mt-4 flex flex-wrap justify-between items-center">
//                           <div className="flex items-center">
//                             <span className="flex items-center text-amber-700 text-sm bg-amber-100 px-2 py-1 rounded-full">
//                               <Clock size={14} className="mr-1" />
//                               {expense.approvals.length}/{expense.requiredApprovals} approvals needed
//                             </span>
//                             <div className="ml-2 flex -space-x-1">
//                               {expense.approvals.slice(0, 3).map(approvalId => {
//                                 const approver = members.find(m => m.id === approvalId);
//                                 return (
//                                   <div 
//                                     key={approvalId}
//                                     className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
//                                     title={approver?.name || 'Unknown'}
//                                   >
//                                     {approver?.name.charAt(0) || '?'}
//                                   </div>
//                                 );
//                               })}
//                               {expense.approvals.length > 3 && (
//                                 <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-medium border-2 border-white">
//                                   +{expense.approvals.length - 3}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
                          
//                           {expense.paidBy !== currentUser.id && (
//                             <button
//                               onClick={() => toggleApproval(expense.id)}
//                               className={`px-3 py-1 rounded-md text-sm ${
//                                 isApproved
//                                   ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
//                                   : 'bg-indigo-600 hover:bg-indigo-700 text-white'
//                               }`}
//                             >
//                               {isApproved ? 'Revoke Approval' : 'Approve'}
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}
          
//           {/* Verified Expenses List */}
//           {view === 'verified' && (
//             <div className="mb-6">
//               {verifiedExpenses.length === 0 ? (
//                 <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//                   <p className="text-gray-500">No verified expenses yet.</p>
//                   <p className="text-gray-500 text-sm mt-1">
//                     Expenses need to be approved by at least half of the group members.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {verifiedExpenses.map(expense => {
//                     const payer = members.find(m => m.id === expense.paidBy);
//                     const splitAmount = expense.splitBetween.length > 0 
//                       ? (expense.amount / expense.splitBetween.length).toFixed(2)
//                       : (expense.amount / members.length).toFixed(2);
                    
//                     return (
//                       <div
//                         key={expense.id}
//                         className="p-4 rounded-lg border border-green-200 bg-green-50"
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <div className="flex items-center">
//                               <h4 className="font-medium text-gray-800">{expense.title}</h4>
//                               <span className="ml-2 flex items-center text-green-700 text-xs bg-green-100 px-2 py-1 rounded-full">
//                                 <CheckCircle size={12} className="mr-1" />
//                                 Verified
//                               </span>
//                             </div>
//                             <p className="text-sm text-gray-600">
//                               {formatDate(expense.date)} • Paid by {payer?.name} {payer?.id === currentUser.id ? '(You)' : ''}
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-bold text-lg">₹{expense.amount}</p>
//                             <p className="text-sm text-gray-600">₹{splitAmount} per person</p>
//                           </div>
//                         </div>
                        
//                         {expense.description && (
//                           <p className="text-gray-700 text-sm mt-2">{expense.description}</p>
//                         )}
                        
//                         {expense.splitBetween && expense.splitBetween.length < members.length && (
//                           <div className="mt-3 text-sm text-gray-600">
//                             <p>Split between: {expense.splitBetween.map(id => getMemberName(id)).join(', ')}</p>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}
          
//           {/* New Expense Form Modal */}
//           {showExpenseForm && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//                 <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Expense</h3>
                
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-1 font-medium">Title</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
//                     value={newExpense.title}
//                     onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
//                     placeholder="What was this expense for?"
//                   />
//                 </div>
                
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-1 font-medium">Amount</label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <DollarSign size={16} className="text-gray-400" />
//                     </div>
//                     <input
//                       type="number"
//                       className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
//                       value={newExpense.amount}
//                       onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
//                       placeholder="0.00"
//                     />
//                   </div>
//                 </div>
                
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-1 font-medium">Paid By</label>
//                   <select
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
//                     value={newExpense.paidBy}
//                     onChange={(e) => setNewExpense({...newExpense, paidBy: e.target.value})}
//                   >
//                     <option value="">Select who paid</option>
//                     {members.map(member => (
//                       <option key={member.id} value={member.id}>
//                         {member.name} {member.id === currentUser.id ? '(You)' : ''}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-1 font-medium">Split Between</label>
//                   <div className="text-sm text-gray-600 mb-2">
//                     {newExpense.splitBetween.length === 0 ? 
//                       "Split equally among all members (default)" : 
//                       `Split between ${newExpense.splitBetween.length} selected members`}
//                   </div>
//                   <div className="flex flex-wrap gap-2 mb-2">
//                     {members.map(member => (
//                       <div
//                         key={member.id}
//                         onClick={() => toggleMemberForSplit(member.id)}
//                         className={`px-3 py-1 rounded-full text-sm cursor-pointer transition ${
//                           newExpense.splitBetween.includes(member.id) || newExpense.splitBetween.length === 0
//                             ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
//                             : 'bg-gray-100 text-gray-600 border border-gray-200'
//                         }`}
//                       >
//                         {member.name}
//                       </div>
//                     ))}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     Deselect all members to split equally among everyone
//                   </div>
//                 </div>
                
//                 <div className="mb-6">
//                   <label className="block text-gray-700 mb-1 font-medium">Description (Optional)</label>
//                   <textarea
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition min-h-20"
//                     value={newExpense.description}
//                     onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
//                     placeholder="Add any additional details..."
//                   />
//                 </div>
                
//                 <div className="flex justify-end gap-3">
//                   <button
//                     onClick={() => setShowExpenseForm(false)}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={addExpense}
//                     disabled={!newExpense.title || !newExpense.amount || !newExpense.paidBy}
//                     className={`px-4 py-2 rounded-md ${
//                       !newExpense.title || !newExpense.amount || !newExpense.paidBy
//                         ? 'bg-indigo-300 cursor-not-allowed'
//                         : 'bg-indigo-600 hover:bg-indigo-700 text-white'
//                     }`}
//                   >
//                     Add Expense
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {/* View Member Details Modal */}
//           {activeMember && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//                 <h3 className="text-xl font-bold text-gray-800 mb-4">{activeMember.name}</h3>
                
//                 {/* Member expense statistics would go here */}
                
//                 <div className="flex justify-end mt-6">
//                   <button
//                     onClick={() => setActiveMember(null)}
//                     className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }




