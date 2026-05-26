import type { User } from "../App";

export default function UserChip({
  user,
  onSignOut,
}: {
  user: User;
  onSignOut: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-5 h-5 rounded-full"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 font-medium">
          {user.name[0]}
        </div>
      )}
      <span className="text-xs text-gray-500 max-w-[100px] truncate">{user.email}</span>
      <button
        onClick={onSignOut}
        className="text-xs text-gray-400 hover:text-gray-600 transition-colors leading-none"
        title="Sign out"
      >
        ↗
      </button>
    </div>
  );
}
