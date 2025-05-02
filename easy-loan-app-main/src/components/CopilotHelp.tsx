
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader } from 'lucide-react';

interface CopilotHelpProps {
  context: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

const CopilotHelp: React.FC<CopilotHelpProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Predefined help messages based on context
  const helpMessages: Record<string, string[]> = {
    'aadhar': [
      'Make sure your Aadhar card image is clear and all details are visible',
      'You can upload either the e-Aadhar or physical Aadhar card',
      'Try scanning the QR code instead if you\'re having trouble with the image',
      'Ensure your Aadhar number, name, and date of birth are clearly visible',
      'If you don\'t have your Aadhar card, you can download an e-Aadhar from the UIDAI website'
    ],
    'pan': [
      'Ensure your PAN card is not laminated to avoid glare',
      'The PAN number should be clearly visible',
      'Both front and back sides may be required',
      'Alternative documents: Form 49A acknowledgment or e-PAN'
    ],
    'bank': [
      'Upload a cancelled cheque leaf or bank statement',
      'Statement should not be older than 3 months',
      'All pages of the statement may be required',
      'Alternative documents: Passbook first page or bank account details letter'
    ],
    'income': [
      'Salary slips for the last 3 months are required',
      'Form 16 can be used as an alternative proof',
      'Business owners can provide ITR acknowledgment',
      'Alternative documents: Bank statement showing salary credits'
    ],
    'photo': [
      'Upload a recent passport-sized photograph',
      'Ensure your face is clearly visible with good lighting',
      'Remove any glasses, hats or accessories that may hide facial features',
      'The background should be plain and light-colored',
      'Digital photo should be at least 400x400 pixels in size'
    ],
    'address': [
      'Utility bills not older than 3 months are accepted',
      'Rental agreement can be used as proof of address',
      'Passport is also accepted as address proof',
      'Alternative documents: Voter ID, driving license, or gas connection bill'
    ],
    'documents': [
      'Make sure all documents are in PDF, JPG, or PNG format',
      'Each file should not exceed 5MB in size',
      'Documents should be in color and clearly visible',
      'If your document is rejected, try uploading a clearer version',
      'Need alternative document options? Just ask!'
    ],
    'general': [
      'I can answer questions about loan eligibility, interest rates, and repayment terms',
      'Need help with document requirements? Just ask!',
      'Having trouble with the application process? Let me know what step you\'re on'
    ]
  };

  // Add initial welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        message: `Welcome to EasyLoan Chat Support! How can I help you with your ${context === 'general' ? 'loan application' : context} today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      // Add context-specific help messages
      const contextHelp = helpMessages[context] || helpMessages['general'];
      setTimeout(() => {
        const tipMessage: ChatMessage = {
          id: `bot-tip-${Date.now()}`,
          sender: 'bot',
          message: 'Here are some helpful tips:',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, tipMessage]);
        
        contextHelp.forEach((tip, index) => {
          setTimeout(() => {
            const tipDetail: ChatMessage = {
              id: `bot-tip-detail-${Date.now()}-${index}`,
              sender: 'bot',
              message: tip,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, tipDetail]);
          }, 300 * (index + 1));
        });
      }, 500);
    }
  }, [isOpen, context]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Prepare responses based on common questions
    const lowerQuestion = question.toLowerCase();
    let botResponse = "I'm not sure I understand. Could you please rephrase your question?";
    
    // Document-specific keyword-based responses
    if (context === 'aadhar') {
      if (lowerQuestion.includes('rejected') || lowerQuestion.includes('not accept') || lowerQuestion.includes('fail')) {
        botResponse = "Your Aadhar card might be rejected if the card number, name, or date of birth are not clearly visible. Make sure there's no glare or shadow on the document. You can also try uploading the e-Aadhar PDF from the UIDAI website.";
      } else if (lowerQuestion.includes('alternative') || lowerQuestion.includes('instead of') || lowerQuestion.includes('substitute')) {
        botResponse = "If you don't have your Aadhar card, you can provide a Voter ID along with a self-declaration. For NRIs, a passport can be used. Please note that Aadhar is a mandatory KYC document for most loan products.";
      } else if (lowerQuestion.includes('format') || lowerQuestion.includes('type') || lowerQuestion.includes('file')) {
        botResponse = "We accept Aadhar cards in JPG, PNG or PDF formats. For best results, upload a color scan or photo with at least 300 DPI resolution. The file size should not exceed 5MB.";
      }
    } else if (context === 'photo') {
      if (lowerQuestion.includes('rejected') || lowerQuestion.includes('not accept') || lowerQuestion.includes('fail')) {
        botResponse = "Your photo might be rejected if it's blurry, poorly lit, or if your face isn't clearly visible. Make sure your photo is recent, taken against a plain background, and your face takes up about 70-80% of the frame.";
      } else if (lowerQuestion.includes('size') || lowerQuestion.includes('dimension') || lowerQuestion.includes('resolution')) {
        botResponse = "Your photo should ideally be passport size (35mm x 45mm) with resolution of at least 300 DPI. For digital photos, a minimum of 400x400 pixels is required.";
      }
    }
    
    // Generic responses for any document type
    if (botResponse.includes("I'm not sure")) {
      if (lowerQuestion.includes('interest') || lowerQuestion.includes('rate')) {
        botResponse = "Our current interest rates range from 8% to 16% depending on the loan type and your credit score. Personal loans typically start at 10.5%, home loans at 8%, and business loans at 12%.";
      } else if (lowerQuestion.includes('document') || lowerQuestion.includes('upload')) {
        botResponse = "For document uploads, make sure your files are clear, under 5MB, and in JPG, PNG, or PDF format. If you're having trouble with a specific document, try uploading it again or contact our support team.";
      } else if (lowerQuestion.includes('time') || lowerQuestion.includes('how long') || lowerQuestion.includes('when')) {
        botResponse = "Loan processing typically takes 24-48 hours once all documents are verified. Disbursement happens within 1-3 business days after approval.";
      } else if (lowerQuestion.includes('eligibility') || lowerQuestion.includes('qualify')) {
        botResponse = "Loan eligibility depends on your credit score (650+ preferred), income stability, existing debt obligations, and loan type. You can check your eligibility without affecting your credit score from our main page.";
      } else if (lowerQuestion.includes('help') || lowerQuestion.includes('support')) {
        botResponse = "I'm here to help! You can ask me about document requirements, alternative documents, or why a document might be rejected. If you need additional support, you can call our customer service at 1800-123-4567.";
      }
    }
    
    // Simulate typing delay based on response length
    const typingDelay = Math.min(1500, 500 + botResponse.length * 10);
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        message: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, typingDelay);
  };

  return (
    <div className={isOpen ? "h-full" : "relative z-10"}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 bg-loan-primary text-white rounded-full p-4 shadow-lg hover:bg-loan-button-hover transition-colors"
          aria-label="Open help"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      )}

      {isOpen && (
        <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden animate-fade-in">
          {!context.includes("embedded") && (
            <div className="bg-loan-primary text-white p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">EasyLoan Live Chat</h3>
                <button onClick={() => setIsOpen(false)} className="text-white">
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm opacity-90">Ask us anything about your loan application</p>
            </div>
          )}
          
          <div className="p-4 flex-grow overflow-y-auto" id="chat-messages">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-loan-primary text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    <div className="flex items-center mb-1">
                      {msg.sender === 'bot' ? (
                        <Bot size={14} className="mr-1" />
                      ) : (
                        <User size={14} className="mr-1" />
                      )}
                      <span className="text-xs opacity-75">
                        {msg.sender === 'user' ? 'You' : 'EasyLoan Support'} • {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-2 rounded-lg bg-gray-100 text-gray-800 rounded-tl-none">
                    <div className="flex items-center mb-1">
                      <Bot size={14} className="mr-1" />
                      <span className="text-xs opacity-75">
                        EasyLoan Support • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Loader size={14} className="animate-spin mr-2" />
                      <span className="text-sm">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <form className="p-3 border-t border-gray-200" onSubmit={handleSubmit}>
            <div className="flex">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-loan-primary"
                placeholder="Type your message..."
                disabled={isTyping}
              />
              <button
                type="submit"
                className="bg-loan-primary text-white px-4 py-2 rounded-r-md hover:bg-loan-button-hover disabled:bg-gray-400"
                disabled={isTyping || !question.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CopilotHelp;
