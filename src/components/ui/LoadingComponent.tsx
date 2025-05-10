import React from 'react';

const LoadingComponent: React.FC = () => {
  return (
    <div className="w-full py-16 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 bg-emerald-500 rounded-full animate-pulse"></div>
        <div className="h-4 w-4 bg-emerald-500 rounded-full animate-pulse delay-150"></div>
        <div className="h-4 w-4 bg-emerald-500 rounded-full animate-pulse delay-300"></div>
      </div>
    </div>
  );
};

export default LoadingComponent; 