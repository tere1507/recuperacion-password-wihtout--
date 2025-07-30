import React from 'react';
import { createRoot } from 'react-dom/client';//capa que permite a react interactuar con el DOM
import { Meteor } from 'meteor/meteor';
import './main.css';
import { App } from '/imports/ui/App';


Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = createRoot(container);
  root.render(<App />);
});
