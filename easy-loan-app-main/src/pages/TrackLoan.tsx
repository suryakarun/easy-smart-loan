import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AnimatedSection from '../components/AnimatedSection';
import CopilotHelp from '../components/CopilotHelp';
import DocumentTracker from '../components/DocumentTracker';
import { Search, FileCheck, FileX, Check, Clock, AlertCircle, Bot } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { DocumentStatus } from '../components/DocumentCard';

const TrackLoan = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  
  const [storedDocuments, setStoredDocuments] = useState<any[]>([]);
  
  useEffect(() => {
    const loadedDocs = localStorage.getItem('easyLoanDocuments');
    if (loadedDocs) {
      setStoredDocuments(JSON.parse(loadedDocs));
    }
  }, []);
  
  const applications = [
    {
      id: 'APP12456',
      type: 'Personal Loan',
      amount: 300000,
      applicationDate: '2023-10-28',
      status: 'In Progress',
      stage: 'Document Verification',
      completedSteps: 2,
      totalSteps: 5,
      documents: storedDocuments.length > 0 ? storedDocuments : [
        { id: 'identity', name: 'Identity Proof', status: 'approved' as DocumentStatus },
        { id: 'address', name: 'Address Proof', status: 'approved' as DocumentStatus },
        { id: 'income', name: 'Income Proof', status: 'pending' as DocumentStatus },
        { id: 'bank', name: 'Bank Statements', status: 'attention' as DocumentStatus, feedback: 'Statement is too old' },
      ]
    },
    {
      id: 'APP12890',
      type: 'Home Loan',
      amount: 2500000,
      applicationDate: '2023-10-15',
      status: 'Approved',
      stage: 'Final Approval',
      completedSteps: 5,
      totalSteps: 5,
      documents: [
        { id: 'identity', name: 'Identity Proof', status: 'approved' as DocumentStatus },
        { id: 'address', name: 'Address Proof', status: 'approved' as DocumentStatus },
        { id: 'income', name: 'Income Proof', status: 'approved' as DocumentStatus },
        { id: 'bank', name: 'Bank Statements', status: 'approved' as DocumentStatus },
        { id: 'property', name: 'Property Documents', status: 'approved' as DocumentStatus },
        { id: 'estimation', name: 'Cost Estimation', status: 'approved' as DocumentStatus },
      ]
    },
  ];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPerformed(true);
  };
  
  const filteredApplications = applications.filter(app => 
    app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'attention':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Loan Application</h1>
              <p className="text-gray-600 mb-8">
                Enter your application ID or loan type to check the status of your loan application.
              </p>
            </div>
            
            <Button
              onClick={() => setShowCopilot(true)}
              variant="outline"
              className="flex items-center justify-center bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 h-10"
            >
              <Bot size={18} className="mr-2" />
              <span>Need Help?</span>
            </Button>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.1}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by application ID or loan type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-loan-primary"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-loan-primary hover:bg-loan-button-hover text-white rounded-lg transition-colors"
              >
                Track Application
              </button>
            </form>
          </div>
        </AnimatedSection>
        
        {searchPerformed && (
          <>
            {filteredApplications.length > 0 ? (
              <div className="space-y-8">
                {filteredApplications.map((app, index) => (
                  <AnimatedSection key={app.id} delay={0.1 * (index + 1)}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                          <h2 className="text-xl font-semibold mt-2">{app.type} - ₹{app.amount.toLocaleString()}</h2>
                          <p className="text-gray-500 text-sm">Application ID: {app.id} • Applied on: {new Date(app.applicationDate).toLocaleDateString()}</p>
                        </div>
                        {app.status === 'Approved' && (
                          <div className="mt-4 md:mt-0">
                            <button className="px-4 py-2 bg-loan-primary hover:bg-loan-button-hover text-white rounded-md transition-colors text-sm">
                              Accept Offer
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <h3 className="font-medium mb-4">Application Progress</h3>
                        <div className="mb-4">
                          <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-loan-primary h-2.5 rounded-full" 
                                style={{ width: `${(app.completedSteps / app.totalSteps) * 100}%` }}
                              ></div>
                            </div>
                            <div className="absolute -top-2 left-0 right-0">
                              {Array.from({ length: app.totalSteps }).map((_, i) => (
                                <div 
                                  key={i}
                                  className={`absolute rounded-full h-6 w-6 flex items-center justify-center ${
                                    i < app.completedSteps 
                                      ? 'bg-loan-primary text-white' 
                                      : 'bg-white border border-gray-300'
                                  }`}
                                  style={{ left: `calc(${(i / (app.totalSteps - 1)) * 100}% - 12px)` }}
                                >
                                  {i < app.completedSteps && <Check className="h-3 w-3" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-2 text-center">
                          <div className={`p-2 rounded ${app.completedSteps >= 1 ? 'bg-blue-50 text-loan-primary' : 'bg-gray-50 text-gray-500'}`}>
                            <div className="text-xs font-medium">Step 1</div>
                            <div className="text-sm">Application Submitted</div>
                          </div>
                          <div className={`p-2 rounded ${app.completedSteps >= 2 ? 'bg-blue-50 text-loan-primary' : 'bg-gray-50 text-gray-500'}`}>
                            <div className="text-xs font-medium">Step 2</div>
                            <div className="text-sm">Initial Verification</div>
                          </div>
                          <div className={`p-2 rounded ${app.completedSteps >= 3 ? 'bg-blue-50 text-loan-primary' : 'bg-gray-50 text-gray-500'}`}>
                            <div className="text-xs font-medium">Step 3</div>
                            <div className="text-sm">Document Verification</div>
                          </div>
                          <div className={`p-2 rounded ${app.completedSteps >= 4 ? 'bg-blue-50 text-loan-primary' : 'bg-gray-50 text-gray-500'}`}>
                            <div className="text-xs font-medium">Step 4</div>
                            <div className="text-sm">Underwriting</div>
                          </div>
                          <div className={`p-2 rounded ${app.completedSteps >= 5 ? 'bg-blue-50 text-loan-primary' : 'bg-gray-50 text-gray-500'}`}>
                            <div className="text-xs font-medium">Step 5</div>
                            <div className="text-sm">Final Approval</div>
                          </div>
                        </div>
                        
                        <div className="mt-8">
                          <h3 className="font-medium mb-3">Document Status</h3>
                          <DocumentTracker documents={app.documents} showDetailed={true} />
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="mb-3 sm:mb-0">
                          <div className="text-sm font-medium">Current Stage</div>
                          <div className="text-gray-600">{app.stage}</div>
                        </div>
                        <div className="flex gap-3">
                          <button className="text-gray-700 hover:text-loan-primary transition-colors text-sm flex items-center gap-1">
                            <FileCheck className="h-4 w-4" />
                            <span>View Details</span>
                          </button>
                          {app.status === 'In Progress' && (
                            <button className="text-red-600 hover:text-red-700 transition-colors text-sm flex items-center gap-1">
                              <FileX className="h-4 w-4" />
                              <span>Cancel Application</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <AnimatedSection delay={0.2}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 16a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-1">No applications found</h3>
                  <p className="text-gray-500 mb-4">We couldn't find any loan applications matching your search.</p>
                  <p className="text-gray-500 text-sm">Try searching with a different application ID or loan type.</p>
                </div>
              </AnimatedSection>
            )}
          </>
        )}
        
        {!searchPerformed && (
          <AnimatedSection delay={0.2}>
            <div className="glass-panel p-6 md:p-8 rounded-xl text-center">
              <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
              {applications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applications.map((app, index) => (
                    <div 
                      key={app.id}
                      className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setSearchQuery(app.id);
                        setSearchPerformed(true);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                          <h3 className="font-medium mt-1">{app.type}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">₹{app.amount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{new Date(app.applicationDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-loan-primary">App ID:</span>
                        <span>{app.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-600">
                  <p>You don't have any recent loan applications.</p>
                  <button 
                    onClick={() => window.location.href = '/new-loan'}
                    className="mt-4 px-6 py-2 bg-loan-primary hover:bg-loan-button-hover text-white rounded-md transition-colors"
                  >
                    Apply for a Loan
                  </button>
                </div>
              )}
            </div>
          </AnimatedSection>
        )}
      </div>
      
      <Dialog open={showCopilot} onOpenChange={setShowCopilot}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>EasyLoan Application Tracking Help</DialogTitle>
          </DialogHeader>
          <div className="h-[500px]">
            <CopilotHelp context="process" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrackLoan;
