
import { Bot } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import CopilotHelp from '../CopilotHelp';
import { Button } from '../ui/button';

interface CopilotButtonProps {
  documentType: string;
  documentName: string;
}

const CopilotButton: React.FC<CopilotButtonProps> = ({ documentType, documentName }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="flex items-center justify-center bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
        title="Get help with document verification"
      >
        <Bot size={18} className="mr-2" />
        <span>Copilot</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Help - {documentName}</DialogTitle>
          </DialogHeader>
          <div className="h-96">
            <CopilotHelp context={documentType} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CopilotButton;
