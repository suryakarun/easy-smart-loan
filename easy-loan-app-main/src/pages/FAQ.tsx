import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Activity, Zap, FileDigit, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
// Assuming LoanOption is flexible enough or we adapt it slightly if needed.
// If LoanOption strictly enforces a card look, we might need a different component
// for the sidebar links or adjust LoanOption props. For now, let's assume it works.
import LoanOption from '../components/LoanOption'; 
import AnimatedSection from '../components/AnimatedSection';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();

  // Feature items data
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      title: "Quick Approvals",
      description: "Get your loan approved in as little as 24 hours.",
    },
    {
      icon: <FileDigit className="w-6 h-6 text-blue-600" />,
      title: "Minimal Documentation",
      description: "Upload documents digitally with AI verification.",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      title: "Competitive Rates",
      description: "Get the best interest rates tailored to your profile.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      <div className="pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          
          {/* Main Content Area (Takes 2 columns on large screens) */}
          <div className="lg:col-span-2">
            <AnimatedSection delay={0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                  Streamlined Loans, <br className="hidden md:inline"/> Brighter Financial Future.
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Access the funds you need with our simple, fast, and transparent loan process. Manage everything online, hassle-free.
                </p>
              </motion.div>
            </AnimatedSection>

            {/* Primary Action: New Loan */}
            <AnimatedSection delay={0.2}>
              <div 
                className="bg-white p-6 rounded-lg shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300 cursor-pointer mb-12 group"
                onClick={() => navigate('/new-loan')}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-full p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Plus size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">Apply for a New Loan</h2>
                    <p className="text-gray-600 mt-1">Start your application with our simplified process.</p>
                  </div>
                  <div className="ml-auto text-blue-500 group-hover:translate-x-1 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Why Choose Us Section */}
            <AnimatedSection delay={0.3}>
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Why Choose EasyLoan?</h3>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div 
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-white/50 rounded-lg border border-gray-200/80"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar Area (Takes 1 column on large screens) */}
          <div className="lg:col-span-1 mt-10 lg:mt-0">
             <AnimatedSection delay={0.4}>
               <h3 className="text-xl font-semibold mb-6 text-gray-700">Manage & Track</h3>
               <div className="space-y-5">
                  {/* Using a slightly different style for sidebar options */}
                  <div 
                    className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate('/existing-loans')}
                  >
                     <div className="bg-gray-100 rounded-full p-2 mr-4 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-300">
                        <FileText size={20} />
                     </div>
                     <div>
                        <h4 className="font-medium text-gray-800">Existing Loans</h4>
                        <p className="text-sm text-gray-500">View statements & manage payments</p>
                     </div>
                  </div>

                  <div 
                    className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate('/track-loan')}
                  >
                     <div className="bg-gray-100 rounded-full p-2 mr-4 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-300">
                        <Activity size={20} />
                     </div>
                     <div>
                        <h4 className="font-medium text-gray-800">Track Loan</h4>
                        <p className="text-sm text-gray-500">Check application status</p>
                     </div>
                  </div>
               </div>
             </AnimatedSection>
          </div>

        </div> 
      </div>
    </div>
  );
};

export default Index;
