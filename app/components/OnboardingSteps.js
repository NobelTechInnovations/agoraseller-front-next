"use client";

import React from 'react';

export default function OnboardingSteps({ currentStep }) {
  const steps = [
    {
      id: 'personal',
      label: 'Personal Details',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'business',
      label: 'Business Details',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'bank',
      label: 'Bank Details',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }
  ];

  // Find the index of the current step
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="flex justify-between mb-6">
      {steps.map((step, index) => {
        // Determine the status of this step
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;
        
        // Styles based on step status
        let stepStyles = '';
        let labelStyles = '';
        
        if (isCompleted) {
          stepStyles = "w-8 h-8 rounded-full bg-white text-[#6800cd] flex items-center justify-center border-2 border-[#6800cd]";
          labelStyles = "text-xs font-medium text-[#6800cd] mt-1";
        } else if (isCurrent) {
          stepStyles = "w-8 h-8 rounded-full bg-[#6800cd] text-white flex items-center justify-center border-4 border-[#f5eeff]";
          labelStyles = "text-xs font-medium text-[#6800cd] mt-1";
        } else {
          stepStyles = "w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center border-2 border-gray-300";
          labelStyles = "text-xs font-medium text-gray-500 mt-1";
        }
        
        // Connector line styles
        const connectorStyles = index < steps.length - 1 
          ? "flex-1 border-t-2 border-gray-200 self-center mx-2" 
          : "";
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={stepStyles}>
                {step.icon}
              </div>
              <span className={labelStyles}>{step.label}</span>
            </div>
            {index < steps.length - 1 && <div className={connectorStyles}></div>}
          </React.Fragment>
        );
      })}
    </div>
  );
} 