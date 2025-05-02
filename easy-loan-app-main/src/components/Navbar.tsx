
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HelpCircle, Menu, X, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white nav-shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="text-loan-primary font-bold text-xl tracking-tight flex items-center"
            >
              <span className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-loan-primary to-loan-secondary">
                EasyLoan
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {userEmail && (
              <span className="text-gray-600 text-sm">{userEmail}</span>
            )}
            <Link 
              to="/faq" 
              className={`text-gray-700 hover:text-loan-primary transition-colors duration-200 flex items-center gap-1 ${
                location.pathname === '/faq' ? 'text-loan-primary font-medium' : ''
              }`}
            >
              <HelpCircle size={18} />
              <span>FAQ</span>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-700 hover:text-loan-primary flex items-center gap-1"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-loan-primary focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="bg-white shadow-lg rounded-b-md pt-2 pb-3 space-y-1 px-4">
            {userEmail && (
              <div className="py-2 px-3 text-gray-600 text-sm">
                {userEmail}
              </div>
            )}
            <Link
              to="/faq"
              className="block py-2 px-3 text-gray-700 hover:bg-loan-accent rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <HelpCircle size={18} />
                <span>FAQ</span>
              </div>
            </Link>
            <button
              className="w-full text-left py-2 px-3 text-gray-700 hover:bg-loan-accent rounded-md flex items-center gap-2"
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
