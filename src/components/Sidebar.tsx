import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="px-4 py-6">
        <h2 className="text-lg font-medium text-gray-900">Folders</h2>
        <nav className="mt-6 space-y-2">
          <a
            href="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Inbox
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Starred
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Sent
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Drafts
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Trash
          </a>
        </nav>
      </div>
    </aside>
  );
}
