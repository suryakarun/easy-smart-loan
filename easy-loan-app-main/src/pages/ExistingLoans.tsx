
import Navbar from '../components/Navbar';
import AnimatedSection from '../components/AnimatedSection';
import CopilotHelp from '../components/CopilotHelp';
import { FileText, Calendar, CreditCard, BarChart4, Download } from 'lucide-react';

const ExistingLoans = () => {
  // Dummy data for demonstration
  const loans = [
    {
      id: 'L12345',
      type: 'Personal Loan',
      amount: 250000,
      disbursedDate: '2023-09-15',
      term: 24,
      emi: 11800,
      nextPayment: '2023-11-15',
      remainingPayments: 22,
      interestRate: 10.5,
      status: 'Active'
    },
    {
      id: 'L12675',
      type: 'Vehicle Loan',
      amount: 500000,
      disbursedDate: '2022-03-10',
      term: 48,
      emi: 12500,
      nextPayment: '2023-11-10',
      remainingPayments: 28,
      interestRate: 9.2,
      status: 'Active'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <AnimatedSection>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Existing Loans</h1>
          <p className="text-gray-600 mb-8">
            Manage and track your active loans in one place.
          </p>
        </AnimatedSection>
        
        <div className="space-y-8">
          {loans.map((loan, index) => (
            <AnimatedSection key={loan.id} delay={0.1 * index}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <span className="text-xs font-medium bg-blue-100 text-blue-700 rounded-full px-2.5 py-1">
                      {loan.status}
                    </span>
                    <h2 className="text-xl font-semibold mt-2">{loan.type} - ₹{loan.amount.toLocaleString()}</h2>
                    <p className="text-gray-500 text-sm">Loan ID: {loan.id}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-2">
                    <button className="px-4 py-2 bg-loan-primary hover:bg-loan-button-hover text-white rounded-md transition-colors text-sm">
                      Pay EMI
                    </button>
                    <button className="px-4 py-2 bg-white border border-loan-primary text-loan-primary hover:bg-loan-accent rounded-md transition-colors text-sm flex items-center gap-1">
                      <Download size={16} />
                      <span>Statement</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-loan-accent rounded-full p-2 mt-1">
                        <CreditCard className="h-5 w-5 text-loan-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Monthly EMI</h3>
                        <p className="text-xl font-semibold text-gray-900">₹{loan.emi.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Next payment: {new Date(loan.nextPayment).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-loan-accent rounded-full p-2 mt-1">
                        <Calendar className="h-5 w-5 text-loan-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Loan Term</h3>
                        <p className="text-xl font-semibold text-gray-900">{loan.term} months</p>
                        <p className="text-xs text-gray-500">{loan.remainingPayments} payments remaining</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-loan-accent rounded-full p-2 mt-1">
                        <BarChart4 className="h-5 w-5 text-loan-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Interest Rate</h3>
                        <p className="text-xl font-semibold text-gray-900">{loan.interestRate}%</p>
                        <p className="text-xs text-gray-500">Fixed rate</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Repayment Progress</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-loan-primary h-2.5 rounded-full" 
                        style={{ width: `${((loan.term - loan.remainingPayments) / loan.term) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Disbursed: {new Date(loan.disbursedDate).toLocaleDateString()}</span>
                      <span>{Math.round((loan.term - loan.remainingPayments) / loan.term * 100)}% complete</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Loan Agreement</span>
                  </div>
                  <button className="text-loan-primary hover:text-loan-secondary transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        
        <AnimatedSection delay={0.3}>
          <div className="mt-8 glass-panel p-6 rounded-xl">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Ready for Another Loan?</h2>
              <p className="text-gray-600">
                As an existing customer, you may qualify for preferential rates on new loans.
              </p>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={() => window.location.href = '/new-loan'}
                className="px-6 py-3 bg-loan-primary hover:bg-loan-button-hover text-white rounded-lg transition-colors"
              >
                Apply for a New Loan
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
      
      <CopilotHelp context="repayment" />
    </div>
  );
};

export default ExistingLoans;
