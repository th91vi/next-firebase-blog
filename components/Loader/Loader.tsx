import React from 'react';

export const Loader = ({ show }) => {
  return show ? <div className="loader"></div> : null;
};
