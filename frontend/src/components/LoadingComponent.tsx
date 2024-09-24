import React from 'react';
import Spinner from './Spinner';

const LoadingComponent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Spinner/>
      <p className="mt-4 text-gray-700">Loading...</p>
    </div>
  );
};

export default LoadingComponent;