import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import DemoAccountsPanel from './DemoAccountsPanel';

const LoginForm = ({ selectedRole, onSelectRole, onLogin, error, isLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isInactive = !selectedRole;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole && username.trim() && password.trim()) {
      onLogin(selectedRole, username, password);
    }
  };

  const handleSelectDemoAccount = (account) => {
    if (onSelectRole && account.role) {
      onSelectRole(account.role);
    }
    setUsername(account.username);
    setPassword(account.password);
  };

  const getButtonText = () => {
    if (isLoading) return 'Authenticating...';
    if (!selectedRole) return 'Select a Role to Continue';
    if (selectedRole === 'STUDENT') return 'Sign In as Student';
    if (selectedRole === 'PARENT') return 'Sign In as Parent';
    if (selectedRole === 'TEACHER') return 'Sign In as Teacher';
    return 'Sign In as Admin';
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className={`text-xs font-bold uppercase tracking-widest ml-1 transition-colors ${isInactive ? 'text-gray-300' : 'text-gray-500'}`}>
            {selectedRole === 'STUDENT' || selectedRole === 'PARENT' ? 'Admission Number' : 'Username'}
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isInactive || isLoading}
            className={`w-full p-3.5 rounded-xl border border-gray-200 outline-none transition-all font-medium text-[#03045e] ${
              isInactive 
                ? 'bg-gray-100/40 cursor-not-allowed opacity-50 border-gray-150' 
                : 'bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent'
            }`}
            placeholder={isInactive ? "Select a role first..." : (selectedRole === 'STUDENT' || selectedRole === 'PARENT') ? "Enter admission number (e.g. 1001)" : "Enter your username"}
          />
        </div>

        <div className="space-y-1.5">
          <label className={`text-xs font-bold uppercase tracking-widest ml-1 transition-colors ${isInactive ? 'text-gray-300' : 'text-gray-500'}`}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isInactive || isLoading}
              className={`w-full p-3.5 pr-12 rounded-xl border border-gray-200 outline-none transition-all font-medium text-[#03045e] ${
                isInactive 
                  ? 'bg-gray-100/40 cursor-not-allowed opacity-50 border-gray-150' 
                  : 'bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent'
              }`}
              placeholder={isInactive ? "Select a role first..." : "Enter your password"}
            />
            {!isInactive && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isInactive || !username.trim() || !password.trim() || isLoading}
          className="w-full py-3.5 rounded-xl bg-[#03045e] hover:bg-[#0077b6] text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 select-none"
        >
          {isLoading && <Loader2 size={18} className="animate-spin" />}
          <span>{getButtonText()}</span>
        </button>
      </form>

      <DemoAccountsPanel 
        selectedRole={selectedRole}
        onSelectAccount={handleSelectDemoAccount} 
      />
    </div>
  );
};

export default LoginForm;
