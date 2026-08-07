import React from 'react';
import { User } from '@/types';

interface UserListProps {
  users: User[];
  revealed: boolean;
  currentUserId: string;
}

const UserList: React.FC<UserListProps> = ({ users, revealed, currentUserId }) => {
  const connectedUsers = users.filter(u => u.connected);

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold text-brand-black dark:text-gray-200 mb-6 uppercase tracking-wide border-b-2 border-brand-yellow pb-3">
        Team Members ({connectedUsers.length})
      </h2>
      <div className="space-y-3">
        {connectedUsers.map((user) => (
          <div
            key={user.id}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${user.id === currentUserId
                ? 'bg-brand-yellow/10 dark:bg-brand-yellow/20 border-brand-yellow shadow-md'
                : 'bg-brand-gray-50 dark:bg-gray-700 border-brand-gray-300 dark:border-gray-600'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`
                  w-3 h-3 rounded-full transition-all
                  ${user.vote !== null ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-brand-gray-400 dark:bg-gray-600'}
                `} />
                <span className="font-semibold text-brand-black dark:text-gray-200">
                  {user.name}
                  {user.id === currentUserId && <span className="text-brand-yellow ml-1">(You)</span>}
                </span>
              </div>
              <div className="text-right">
                {user.vote !== null ? (
                  revealed ? (
                    <span className="text-2xl font-bold text-brand-yellow dark:text-brand-yellow">
                      {user.vote}
                    </span>
                  ) : (
                    <span className="text-xl">✅</span>
                  )
                ) : (
                  <span className="text-sm text-brand-gray-500 dark:text-gray-400 font-medium">
                    Waiting...
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {connectedUsers.length === 0 && (
        <div className="text-center py-8 text-brand-gray-500 dark:text-gray-400">
          <p className="font-semibold">No team members yet</p>
          <p className="text-sm mt-1">Waiting for others to join...</p>
        </div>
      )}
    </div>
  );
};

export default UserList;
