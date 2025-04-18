import { useState, useEffect } from 'react';
import { Search, Plus, Check, X, DollarSign, Users, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageExpenses() {
  // States
  const [searchEmail, setSearchEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupCreated, setGroupCreated] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    paidBy: '',
    description: ''
  });
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // Mock user search results - in a real app, this would be an API call
  const [searchResults, setSearchResults] = useState([]);
  
  // Current user - in a real app, this would come from auth context
  const currentUser = {
    id: '123',
    name: 'Current User',
    email: 'current@example.com'
  };

  // Search users by email
  const searchUsers = (query) => {
    // Simulate API call with mock data
    const mockUsers = [
      { id: '456', name: 'John Doe', email: 'john@example.com' },
      { id: '789', name: 'Jane Smith', email: 'jane@example.com' },
      { id: '101', name: 'Raj Kumar', email: 'raj@example.com' },
      { id: '102', name: 'Priya Singh', email: 'priya@example.com' }
    ];
    
    const results = mockUsers.filter(user => 
      user.email.toLowerCase().includes(query.toLowerCase()) && 
      user.id !== currentUser.id
    );
    
    setSearchResults(results);
  };

  useEffect(() => {
    if (searchEmail.trim()) {
      searchUsers(searchEmail);
    } else {
      setSearchResults([]);
    }
  }, [searchEmail]);

  // Add member to group
  const addMember = (user) => {
    if (!members.some(member => member.id === user.id)) {
      setMembers([...members, user]);
    }
    setSearchEmail('');
    setSearchResults([]);
  };

  // Remove member from group
  const removeMember = (userId) => {
    setMembers(members.filter(member => member.id !== userId));
  };

  // Create group
  const createGroup = () => {
    if (groupName.trim() && members.length > 0) {
      // In a real app, you would save this to a database
      setGroupCreated(true);
      // Add current user to members list if not already there
      if (!members.some(member => member.id === currentUser.id)) {
        setMembers([currentUser, ...members]);
      }
    }
  };

  // Add new expense
  const addExpense = () => {
    if (newExpense.title && newExpense.amount > 0 && newExpense.paidBy) {
      const expense = {
        ...newExpense,
        id: Date.now().toString(),
        timestamp: new Date(),
        approvals: [currentUser.id], // Auto-approve by creator
        status: 'pending',
        requiredApprovals: Math.ceil((members.length) / 2)
      };
      
      setExpenses([...expenses, expense]);
      setNewExpense({
        title: '',
        amount: '',
        paidBy: '',
        description: ''
      });
      setShowExpenseForm(false);
    }
  };

  // Toggle approval for an expense
  const toggleApproval = (expenseId) => {
    setExpenses(expenses.map(expense => {
      if (expense.id === expenseId) {
        const isApproved = expense.approvals.includes(currentUser.id);
        const updatedApprovals = isApproved 
          ? expense.approvals.filter(id => id !== currentUser.id)
          : [...expense.approvals, currentUser.id];
        
        return {
          ...expense,
          approvals: updatedApprovals,
          status: updatedApprovals.length >= expense.requiredApprovals ? 'verified' : 'pending'
        };
      }
      return expense;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto pt-36 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl  font-bold text-gray-800 mb-6">Hisaab Barabar</h1>
      
      {!groupCreated ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Create a New Group</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Group Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Add Members</label>
            <div className="flex items-center mb-2">
              <input
                type="email"
                className="flex-1 p-2 border border-gray-300 rounded-l-md"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Search by email"
              />
              <button className="bg-blue-500 text-white p-2 rounded-r-md">
                <Search size={20} />
              </button>
            </div>
            
            {searchResults.length > 0 && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                className="mb-4 border border-gray-200 rounded-md shadow-sm overflow-hidden"
              >
                {searchResults.map(user => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => addMember(user)}
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Plus size={18} className="text-blue-500" />
                  </div>
                ))}
              </motion.div>
            )}
            
            <div className="mt-4">
              <h3 className="text-gray-700 mb-2">Selected Members:</h3>
              {members.length === 0 ? (
                <p className="text-gray-500 italic">No members added yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {members.map(member => (
                    <motion.div
                      key={member.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                    >
                      <span className="mr-1">{member.name}</span>
                      <button 
                        onClick={() => removeMember(member.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={createGroup}
            disabled={!groupName.trim() || members.length === 0}
            className={`px-4 py-2 rounded-md ${
              !groupName.trim() || members.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Create Group
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{groupName}</h2>
              <div className="flex items-center text-gray-600 mt-1">
                <Users size={18} className="mr-1" />
                <span>{members.length} members</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowExpenseForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Add Expense
            </button>
          </div>
          
          {/* Expense Form Modal */}
          <AnimatePresence>
            {showExpenseForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                >
                  <h3 className="text-xl font-bold mb-4">Add New Expense</h3>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newExpense.title}
                      onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                      placeholder="Expense title"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Amount</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        className="w-full p-2 pl-8 border border-gray-300 rounded-md"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Paid By</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newExpense.paidBy}
                      onChange={(e) => setNewExpense({...newExpense, paidBy: e.target.value})}
                    >
                      <option value="">Select who paid</option>
                      {members.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name} {member.id === currentUser.id ? '(You)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows="3"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                      placeholder="Add details about this expense"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowExpenseForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addExpense}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      disabled={!newExpense.title || !newExpense.amount || !newExpense.paidBy}
                    >
                      Save Expense
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Expenses List */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Expenses</h3>
            
            {expenses.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No expenses yet. Add your first expense!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.map(expense => {
                  const payer = members.find(m => m.id === expense.paidBy);
                  const isApproved = expense.approvals.includes(currentUser.id);
                  const splitAmount = (expense.amount / members.length).toFixed(2);
                  
                  return (
                    <motion.div
                      key={expense.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className={`p-4 rounded-lg border ${
                        expense.status === 'verified' 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-800">{expense.title}</h4>
                          <p className="text-sm text-gray-500">
                            Paid by {payer?.name} {payer?.id === currentUser.id ? '(You)' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{expense.amount}</p>
                          <p className="text-sm text-gray-500">₹{splitAmount} per person</p>
                        </div>
                      </div>
                      
                      {expense.description && (
                        <p className="text-gray-600 text-sm mt-1 mb-3">{expense.description}</p>
                      )}
                      
                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex items-center">
                          {expense.status === 'verified' ? (
                            <span className="flex items-center text-green-600 text-sm">
                              <Check size={16} className="mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center text-amber-600 text-sm">
                              <AlertCircle size={16} className="mr-1" />
                              {expense.approvals.length}/{expense.requiredApprovals} approvals needed
                            </span>
                          )}
                        </div>
                        
                        {expense.paidBy !== currentUser.id && (
                          <button
                            onClick={() => toggleApproval(expense.id)}
                            className={`px-3 py-1 rounded-md text-sm ${
                              isApproved
                                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                          >
                            {isApproved ? 'Revoke Approval' : 'Approve'}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}