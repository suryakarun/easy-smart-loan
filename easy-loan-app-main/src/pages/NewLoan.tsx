
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoanForm, { LoanFormData } from '../components/LoanForm';
import AnimatedSection from '../components/AnimatedSection';
import CopilotHelp from '../components/CopilotHelp';

const NewLoan = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (data: LoanFormData) => {
    // In a real application, you might want to store this in a context or state management
    // For now, we'll pass the data in the navigation state
    navigate('/documents', { state: { loanData: data } });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4 md:px-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <AnimatedSection>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for a New Loan</h1>
            <p className="text-gray-600">
              Complete the form below to start your loan application. Once submitted, you'll need to upload the required documents.
            </p>
          </AnimatedSection>
        </div>
        
        <AnimatedSection delay={0.2}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <LoanForm onSubmit={handleSubmit} />
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.3}>
          <div className="mt-8 bg-loan-accent rounded-lg p-4 border border-blue-200">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex">
                <span className="mr-2">1.</span>
                <span>Upload required documents based on your loan type</span>
              </li>
              <li className="flex">
                <span className="mr-2">2.</span>
                <span>Our system verifies your documents automatically</span>
              </li>
              <li className="flex">
                <span className="mr-2">3.</span>
                <span>Once verified, you'll receive your loan offer</span>
              </li>
              <li className="flex">
                <span className="mr-2">4.</span>
                <span>Accept the offer and receive funds in your account</span>
              </li>
            </ul>
          </div>
        </AnimatedSection>
      </div>
      
      <CopilotHelp context="documents" />
    </div>
  );
};

export default NewLoan;
