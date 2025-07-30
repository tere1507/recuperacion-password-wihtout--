import React from 'react';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { LinksCollection } from '../api/links';

export const Info = () => {
  const isLoading = useSubscribe('links');
  const links = useFind(() => LinksCollection.find());

  if(isLoading()) {
    return <div className="mt-8 text-center text-gray-600">Loading Links...</div>;
  }

  return (
    <div className="mt-8 p-6 bg-green-50 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Learn Meteor!</h2>
      <ul className="list-disc list-inside space-y-2">
        {links.map(
          link => <li key={link._id} className="text-gray-700">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 underline transition duration-300 ease-in-out"
            >
              {link.title}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};
