import { useState, useEffect } from 'react';
import { Search, Plus, Check, X, DollarSign, Users, AlertCircle, CheckCircle, Clock, UserPlus, ArrowRight } from 'lucide-react';

export default function ExpenseManager() {
  // States
  const [searchEmail, setSearchEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupCreated, setGroupCreated] = useState(false);
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [verifiedExpenses, setVerifiedExpenses] = useState([]);
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

  // Mock user search results - in a real app, this would be an API call
  const [searchResults, setSearchResults] = useState([]);
  
  // Current user - in a real app, this would come from auth context
  const currentUser = {
    id: '123',
    name: 'You',
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
      // Add current user to members list if not already there
      if (!members.some(member => member.id === currentUser.id)) {
        setMembers([currentUser, ...members]);
      }
      setGroupCreated(true);
    }
  };

  // Add new expense
  const addExpense = () => {
    if (newExpense.title && newExpense.amount > 0 && newExpense.paidBy) {
      const allMembers = members.map(member => member.id);
      const splitBetween = newExpense.splitBetween.length > 0 ? 
        newExpense.splitBetween : allMembers;
      
      const expense = {
        ...newExpense,
        id: Date.now().toString(),
        date: new Date(),
        splitBetween,
        approvals: [currentUser.id], // Auto-approve by creator
        status: 'pending',
        requiredApprovals: Math.ceil((members.length) / 2)
      };
      
      setPendingExpenses([...pendingExpenses, expense]);
      setNewExpense({
        title: '',
        amount: '',
        paidBy: '',
        description: '',
        splitBetween: []
      });
      setShowExpenseForm(false);
    }
  };

  // Toggle approval for an expense
  const toggleApproval = (expenseId) => {
    const updatedExpenses = pendingExpenses.map(expense => {
      if (expense.id === expenseId) {
        const isApproved = expense.approvals.includes(currentUser.id);
        const updatedApprovals = isApproved 
          ? expense.approvals.filter(id => id !== currentUser.id)
          : [...expense.approvals, currentUser.id];
        
        const updatedStatus = updatedApprovals.length >= expense.requiredApprovals ? 'verified' : 'pending';
        
        return {
          ...expense,
          approvals: updatedApprovals,
          status: updatedStatus
        };
      }
      return expense;
    });
    
    // Move verified expenses to the verified list
    const newPendingExpenses = updatedExpenses.filter(expense => expense.status === 'pending');
    const newVerifiedExpenses = [
      ...verifiedExpenses,
      ...updatedExpenses.filter(expense => expense.status === 'verified')
    ];
    
    setPendingExpenses(newPendingExpenses);
    setVerifiedExpenses(newVerifiedExpenses);
  };

  // Calculate balances - who owes whom
  const calculateBalances = () => {
    const balances = {};
    
    // Initialize balances for all members
    members.forEach(member => {
      balances[member.id] = { paid: 0, owes: 0, net: 0 };
    });
    
    // Calculate from verified expenses
    verifiedExpenses.forEach(expense => {
      const paidBy = expense.paidBy;
      const amount = parseFloat(expense.amount);
      const splitBetween = expense.splitBetween || members.map(m => m.id);
      const splitAmount = amount / splitBetween.length;
      
      // Add to payer's paid amount
      balances[paidBy].paid += amount;
      
      // Add to each member's owed amount
      splitBetween.forEach(memberId => {
        balances[memberId].owes += splitAmount;
      });
    });
    
    // Calculate net balance for each member
    members.forEach(member => {
      balances[member.id].net = balances[member.id].paid - balances[member.id].owes;
    });
    
    return balances;
  };

  // Get settlement plan - optimized transfers to settle all debts
  const getSettlementPlan = () => {
    const balances = calculateBalances();
    const settlements = [];
    
    // Find debtors (negative net) and creditors (positive net)
    const debtors = members
      .filter(m => balances[m.id].net < -0.01)
      .map(m => ({ id: m.id, name: m.name, amount: -balances[m.id].net }));
    
    const creditors = members
      .filter(m => balances[m.id].net > 0.01)
      .map(m => ({ id: m.id, name: m.name, amount: balances[m.id].net }));
    
    // Match debtors with creditors
    debtors.forEach(debtor => {
      let remainingDebt = debtor.amount;
      
      while (remainingDebt > 0.01 && creditors.length > 0) {
        const creditor = creditors[0];
        
        if (creditor.amount <= remainingDebt) {
          // Creditor gets fully paid
          settlements.push({
            from: debtor.id,
            fromName: debtor.name,
            to: creditor.id,
            toName: creditor.name,
            amount: creditor.amount.toFixed(2)
          });
          
          remainingDebt -= creditor.amount;
          creditors.shift(); // Remove fully paid creditor
        } else {
          // Creditor gets partially paid
          settlements.push({
            from: debtor.id,
            fromName: debtor.name,
            to: creditor.id,
            toName: creditor.name,
            amount: remainingDebt.toFixed(2)
          });
          
          creditor.amount -= remainingDebt;
          remainingDebt = 0;
        }
      }
    });
    
    return settlements;
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
    const member = members.find(m => m.id === id);
    return member ? member.name : 'Unknown';
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  const balances = calculateBalances();
  const settlements = getSettlementPlan();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">Hisaab Barabar</h1>
        <p className="text-gray-600">Split expenses easily with friends and family.</p>
      </div>
      
      {!groupCreated ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Create a New Group</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Group Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name (e.g., Trip to Goa)"
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-700 mb-2 font-medium">Add Members</label>
            <div className="flex items-center mb-2">
              <input
                type="email"
                className="flex-1 p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Search by email address"
              />
              <button className="bg-indigo-500 text-white p-3 rounded-r-md hover:bg-indigo-600 transition">
                <Search size={20} />
              </button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-2 mb-4 border border-gray-200 rounded-md shadow-sm overflow-hidden bg-white">
                {searchResults.map(user => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => addMember(user)}
                  >
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <UserPlus size={18} className="text-indigo-500" />
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-gray-700 mb-3 font-medium">Selected Members:</h3>
              {members.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-md border border-dashed border-gray-300 text-gray-500 text-center">
                  No members added yet. Add members to create a group.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {members.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-2 rounded-full"
                    >
                      <span className="mr-1">{member.name}</span>
                      <button 
                        onClick={() => removeMember(member.id)}
                        className="text-indigo-500 hover:text-indigo-700 ml-1"
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
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            Create Group
          </button>
        </div>
      ) : (
        <div>
          {/* Group Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{groupName}</h2>
              <div className="flex items-center text-gray-600 mt-1">
                <Users size={18} className="mr-1" />
                <span>{members.length} members</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center transition"
              >
                {showBalances ? 'Hide' : 'Show'} Balances
              </button>
              
              <button
                onClick={() => setShowExpenseForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition"
              >
                <Plus size={18} className="mr-1" />
                Add Expense
              </button>
            </div>
          </div>
          
          {/* Balance Summary */}
          {showBalances && (
            <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Balances & Settlements</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Member Balances */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Member Balances</h4>
                  <div className="space-y-2">
                    {members.map(member => {
                      const memberBalance = balances[member.id]?.net || 0;
                      return (
                        <div 
                          key={member.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                        >
                          <span className="font-medium">{member.name}</span>
                          <span className={`font-medium ${
                            memberBalance > 0 
                              ? 'text-green-600' 
                              : memberBalance < 0 
                                ? 'text-red-600' 
                                : 'text-gray-600'
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
                  <h4 className="font-medium text-gray-700 mb-3">Settlement Plan</h4>
                  {settlements.length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-center">
                      All balances are settled.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {settlements.map((settlement, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center">
                            <span className="font-medium text-red-600">{settlement.fromName}</span>
                            <ArrowRight size={16} className="mx-2 text-gray-500" />
                            <span className="font-medium text-green-600">{settlement.toName}</span>
                          </div>
                          <span className="font-medium">₹{parseFloat(settlement.amount).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Expense List Tabs */}
          <div className="mb-4 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={() => setView('pending')}
                className={`py-2 px-4 font-medium ${
                  view === 'pending'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending Verification ({pendingExpenses.length})
              </button>
              <button
                onClick={() => setView('verified')}
                className={`py-2 px-4 font-medium ${
                  view === 'verified'
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
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
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">No pending expenses.</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Add an expense to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingExpenses.map(expense => {
                    const payer = members.find(m => m.id === expense.paidBy);
                    const isApproved = expense.approvals.includes(currentUser.id);
                    const splitAmount = expense.splitBetween.length > 0 
                      ? (expense.amount / expense.splitBetween.length).toFixed(2)
                      : (expense.amount / members.length).toFixed(2);
                    
                    return (
                      <div
                        key={expense.id}
                        className="p-4 rounded-lg border border-amber-200 bg-amber-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-800">{expense.title}</h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(expense.date)} • Paid by {payer?.name} {payer?.id === currentUser.id ? '(You)' : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{expense.amount}</p>
                            <p className="text-sm text-gray-600">₹{splitAmount} per person</p>
                          </div>
                        </div>
                        
                        {expense.description && (
                          <p className="text-gray-700 text-sm mt-2 mb-3">{expense.description}</p>
                        )}
                        
                        <div className="mt-4 flex flex-wrap justify-between items-center">
                          <div className="flex items-center">
                            <span className="flex items-center text-amber-700 text-sm bg-amber-100 px-2 py-1 rounded-full">
                              <Clock size={14} className="mr-1" />
                              {expense.approvals.length}/{expense.requiredApprovals} approvals needed
                            </span>
                            <div className="ml-2 flex -space-x-1">
                              {expense.approvals.slice(0, 3).map(approvalId => {
                                const approver = members.find(m => m.id === approvalId);
                                return (
                                  <div 
                                    key={approvalId}
                                    className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                                    title={approver?.name || 'Unknown'}
                                  >
                                    {approver?.name.charAt(0) || '?'}
                                  </div>
                                );
                              })}
                              {expense.approvals.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-medium border-2 border-white">
                                  +{expense.approvals.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {expense.paidBy !== currentUser.id && (
                            <button
                              onClick={() => toggleApproval(expense.id)}
                              className={`px-3 py-1 rounded-md text-sm ${
                                isApproved
                                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              }`}
                            >
                              {isApproved ? 'Revoke Approval' : 'Approve'}
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
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">No verified expenses yet.</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Expenses need to be approved by at least half of the group members.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {verifiedExpenses.map(expense => {
                    const payer = members.find(m => m.id === expense.paidBy);
                    const splitAmount = expense.splitBetween.length > 0 
                      ? (expense.amount / expense.splitBetween.length).toFixed(2)
                      : (expense.amount / members.length).toFixed(2);
                    
                    return (
                      <div
                        key={expense.id}
                        className="p-4 rounded-lg border border-green-200 bg-green-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium text-gray-800">{expense.title}</h4>
                              <span className="ml-2 flex items-center text-green-700 text-xs bg-green-100 px-2 py-1 rounded-full">
                                <CheckCircle size={12} className="mr-1" />
                                Verified
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {formatDate(expense.date)} • Paid by {payer?.name} {payer?.id === currentUser.id ? '(You)' : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{expense.amount}</p>
                            <p className="text-sm text-gray-600">₹{splitAmount} per person</p>
                          </div>
                        </div>
                        
                        {expense.description && (
                          <p className="text-gray-700 text-sm mt-2">{expense.description}</p>
                        )}
                        
                        {expense.splitBetween && expense.splitBetween.length < members.length && (
                          <div className="mt-3 text-sm text-gray-600">
                            <p>Split between: {expense.splitBetween.map(id => getMemberName(id)).join(', ')}</p>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Expense</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 font-medium">Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                    placeholder="What was this expense for?"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 font-medium">Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 font-medium">Paid By</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
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
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 font-medium">Split Between</label>
                  <div className="text-sm text-gray-600 mb-2">
                    {newExpense.splitBetween.length === 0 ? 
                      "Split equally among all members (default)" : 
                      `Split between ${newExpense.splitBetween.length} selected members`}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {members.map(member => (
                      <div
                        key={member.id}
                        onClick={() => toggleMemberForSplit(member.id)}
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition ${
                          newExpense.splitBetween.includes(member.id) || newExpense.splitBetween.length === 0
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {member.name}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    Deselect all members to split equally among everyone
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-1 font-medium">Description (Optional)</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition min-h-20"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    placeholder="Add any additional details..."
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowExpenseForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addExpense}
                    disabled={!newExpense.title || !newExpense.amount || !newExpense.paidBy}
                    className={`px-4 py-2 rounded-md ${
                      !newExpense.title || !newExpense.amount || !newExpense.paidBy
                        ? 'bg-indigo-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
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
                
                {/* Member expense statistics would go here */}
                
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

// import { useState, useEffect } from 'react';
// import { Search, Plus, Check, X, DollarSign, Users, AlertCircle } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function ManageExpenses() {
//   // States
//   const [searchEmail, setSearchEmail] = useState('');
//   const [members, setMembers] = useState([]);
//   const [groupName, setGroupName] = useState('');
//   const [groupCreated, setGroupCreated] = useState(false);
//   const [expenses, setExpenses] = useState([]);
//   const [newExpense, setNewExpense] = useState({
//     title: '',
//     amount: '',
//     paidBy: '',
//     description: ''
//   });
//   const [showExpenseForm, setShowExpenseForm] = useState(false);

//   // Mock user search results - in a real app, this would be an API call
//   const [searchResults, setSearchResults] = useState([]);
  
//   // Current user - in a real app, this would come from auth context
//   const currentUser = {
//     id: '123',
//     name: 'Current User',
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
//       // In a real app, you would save this to a database
//       setGroupCreated(true);
//       // Add current user to members list if not already there
//       if (!members.some(member => member.id === currentUser.id)) {
//         setMembers([currentUser, ...members]);
//       }
//     }
//   };

//   // Add new expense
//   const addExpense = () => {
//     if (newExpense.title && newExpense.amount > 0 && newExpense.paidBy) {
//       const expense = {
//         ...newExpense,
//         id: Date.now().toString(),
//         timestamp: new Date(),
//         approvals: [currentUser.id], // Auto-approve by creator
//         status: 'pending',
//         requiredApprovals: Math.ceil((members.length) / 2)
//       };
      
//       setExpenses([...expenses, expense]);
//       setNewExpense({
//         title: '',
//         amount: '',
//         paidBy: '',
//         description: ''
//       });
//       setShowExpenseForm(false);
//     }
//   };

//   // Toggle approval for an expense
//   const toggleApproval = (expenseId) => {
//     setExpenses(expenses.map(expense => {
//       if (expense.id === expenseId) {
//         const isApproved = expense.approvals.includes(currentUser.id);
//         const updatedApprovals = isApproved 
//           ? expense.approvals.filter(id => id !== currentUser.id)
//           : [...expense.approvals, currentUser.id];
        
//         return {
//           ...expense,
//           approvals: updatedApprovals,
//           status: updatedApprovals.length >= expense.requiredApprovals ? 'verified' : 'pending'
//         };
//       }
//       return expense;
//     }));
//   };

//   return (
//     <div className="max-w-4xl mx-auto pt-36 p-6 bg-white rounded-lg shadow-lg">
//       <h1 className="text-3xl  font-bold text-gray-800 mb-6">Hisaab Barabar</h1>
      
//       {!groupCreated ? (
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="mb-8"
//         >
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">Create a New Group</h2>
          
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2">Group Name</label>
//             <input
//               type="text"
//               className="w-full p-2 border border-gray-300 rounded-md"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//               placeholder="Enter group name"
//             />
//           </div>
          
//           <div className="mb-6">
//             <label className="block text-gray-700 mb-2">Add Members</label>
//             <div className="flex items-center mb-2">
//               <input
//                 type="email"
//                 className="flex-1 p-2 border border-gray-300 rounded-l-md"
//                 value={searchEmail}
//                 onChange={(e) => setSearchEmail(e.target.value)}
//                 placeholder="Search by email"
//               />
//               <button className="bg-blue-500 text-white p-2 rounded-r-md">
//                 <Search size={20} />
//               </button>
//             </div>
            
//             {searchResults.length > 0 && (
//               <motion.div 
//                 initial={{ height: 0 }}
//                 animate={{ height: 'auto' }}
//                 className="mb-4 border border-gray-200 rounded-md shadow-sm overflow-hidden"
//               >
//                 {searchResults.map(user => (
//                   <div 
//                     key={user.id}
//                     className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => addMember(user)}
//                   >
//                     <div>
//                       <p className="font-medium">{user.name}</p>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                     </div>
//                     <Plus size={18} className="text-blue-500" />
//                   </div>
//                 ))}
//               </motion.div>
//             )}
            
//             <div className="mt-4">
//               <h3 className="text-gray-700 mb-2">Selected Members:</h3>
//               {members.length === 0 ? (
//                 <p className="text-gray-500 italic">No members added yet</p>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {members.map(member => (
//                     <motion.div
//                       key={member.id}
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
//                     >
//                       <span className="mr-1">{member.name}</span>
//                       <button 
//                         onClick={() => removeMember(member.id)}
//                         className="text-blue-500 hover:text-blue-700"
//                       >
//                         <X size={16} />
//                       </button>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <button
//             onClick={createGroup}
//             disabled={!groupName.trim() || members.length === 0}
//             className={`px-4 py-2 rounded-md ${
//               !groupName.trim() || members.length === 0
//                 ? 'bg-gray-300 cursor-not-allowed'
//                 : 'bg-blue-500 hover:bg-blue-600 text-white'
//             }`}
//           >
//             Create Group
//           </button>
//         </motion.div>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           <div className="mb-6 flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">{groupName}</h2>
//               <div className="flex items-center text-gray-600 mt-1">
//                 <Users size={18} className="mr-1" />
//                 <span>{members.length} members</span>
//               </div>
//             </div>
            
//             <button
//               onClick={() => setShowExpenseForm(true)}
//               className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
//             >
//               <Plus size={18} className="mr-1" />
//               Add Expense
//             </button>
//           </div>
          
//           {/* Expense Form Modal */}
//           <AnimatePresence>
//             {showExpenseForm && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               >
//                 <motion.div
//                   initial={{ y: 50, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   exit={{ y: 50, opacity: 0 }}
//                   className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
//                 >
//                   <h3 className="text-xl font-bold mb-4">Add New Expense</h3>
                  
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-1">Title</label>
//                     <input
//                       type="text"
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                       value={newExpense.title}
//                       onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
//                       placeholder="Expense title"
//                     />
//                   </div>
                  
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-1">Amount</label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                         <DollarSign size={16} className="text-gray-400" />
//                       </div>
//                       <input
//                         type="number"
//                         className="w-full p-2 pl-8 border border-gray-300 rounded-md"
//                         value={newExpense.amount}
//                         onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
//                         placeholder="0.00"
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-1">Paid By</label>
//                     <select
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                       value={newExpense.paidBy}
//                       onChange={(e) => setNewExpense({...newExpense, paidBy: e.target.value})}
//                     >
//                       <option value="">Select who paid</option>
//                       {members.map(member => (
//                         <option key={member.id} value={member.id}>
//                           {member.name} {member.id === currentUser.id ? '(You)' : ''}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div className="mb-6">
//                     <label className="block text-gray-700 mb-1">Description (Optional)</label>
//                     <textarea
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                       rows="3"
//                       value={newExpense.description}
//                       onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
//                       placeholder="Add details about this expense"
//                     />
//                   </div>
                  
//                   <div className="flex justify-end space-x-3">
//                     <button
//                       onClick={() => setShowExpenseForm(false)}
//                       className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={addExpense}
//                       className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                       disabled={!newExpense.title || !newExpense.amount || !newExpense.paidBy}
//                     >
//                       Save Expense
//                     </button>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>
          
//           {/* Expenses List */}
//           <div className="mb-6">
//             <h3 className="text-xl font-semibold text-gray-700 mb-4">Expenses</h3>
            
//             {expenses.length === 0 ? (
//               <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//                 <p className="text-gray-500">No expenses yet. Add your first expense!</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {expenses.map(expense => {
//                   const payer = members.find(m => m.id === expense.paidBy);
//                   const isApproved = expense.approvals.includes(currentUser.id);
//                   const splitAmount = (expense.amount / members.length).toFixed(2);
                  
//                   return (
//                     <motion.div
//                       key={expense.id}
//                       initial={{ y: 20, opacity: 0 }}
//                       animate={{ y: 0, opacity: 1 }}
//                       className={`p-4 rounded-lg border ${
//                         expense.status === 'verified' 
//                           ? 'border-green-200 bg-green-50' 
//                           : 'border-gray-200 bg-white'
//                       }`}
//                     >
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <h4 className="font-medium text-gray-800">{expense.title}</h4>
//                           <p className="text-sm text-gray-500">
//                             Paid by {payer?.name} {payer?.id === currentUser.id ? '(You)' : ''}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-bold text-lg">₹{expense.amount}</p>
//                           <p className="text-sm text-gray-500">₹{splitAmount} per person</p>
//                         </div>
//                       </div>
                      
//                       {expense.description && (
//                         <p className="text-gray-600 text-sm mt-1 mb-3">{expense.description}</p>
//                       )}
                      
//                       <div className="mt-3 flex justify-between items-center">
//                         <div className="flex items-center">
//                           {expense.status === 'verified' ? (
//                             <span className="flex items-center text-green-600 text-sm">
//                               <Check size={16} className="mr-1" />
//                               Verified
//                             </span>
//                           ) : (
//                             <span className="flex items-center text-amber-600 text-sm">
//                               <AlertCircle size={16} className="mr-1" />
//                               {expense.approvals.length}/{expense.requiredApprovals} approvals needed
//                             </span>
//                           )}
//                         </div>
                        
//                         {expense.paidBy !== currentUser.id && (
//                           <button
//                             onClick={() => toggleApproval(expense.id)}
//                             className={`px-3 py-1 rounded-md text-sm ${
//                               isApproved
//                                 ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
//                                 : 'bg-blue-500 hover:bg-blue-600 text-white'
//                             }`}
//                           >
//                             {isApproved ? 'Revoke Approval' : 'Approve'}
//                           </button>
//                         )}
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }