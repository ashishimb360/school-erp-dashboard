import React from 'react';
import { motion } from 'framer-motion';

const CredentialCard = ({ account, onSelect }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(account)}
      className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all group flex items-center justify-between"
    >
      <div>
        <div className="text-sm font-bold text-[#03045e] group-hover:text-blue-700">{account.displayName}</div>
        <div className="text-xs text-gray-500 font-mono mt-1">{account.username}</div>
        {account.description && (
          <div className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">{account.description}</div>
        )}
      </div>
      <div className="text-xs font-semibold px-2 py-1 bg-white rounded shadow-sm text-gray-400 group-hover:text-blue-500">
        Use
      </div>
    </motion.button>
  );
};

export default CredentialCard;
