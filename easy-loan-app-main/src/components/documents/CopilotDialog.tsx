
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import CopilotHelp from '../CopilotHelp';

interface CopilotDialogProps {
  showCopilot: boolean;
  setShowCopilot: (show: boolean) => void;
  context: string;
}

const CopilotDialog: React.FC<CopilotDialogProps> = ({
  showCopilot,
  setShowCopilot,
  context
}) => {
  return (
    <Dialog open={showCopilot} onOpenChange={setShowCopilot}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>EasyLoan Document Help</DialogTitle>
        </DialogHeader>
        <div className="h-[500px]">
          <CopilotHelp context={context} />
        </div>
        {context === 'documents' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Document Verification Guidelines</h3>
            <p className="text-blue-700 text-sm mb-2">
              Our advanced AI system can detect if you're uploading the wrong document type. Please ensure:
            </p>
            <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
              <li>Each document matches the requested type (e.g., upload Aadhar card for Aadhar verification)</li>
              <li>Documents are clear, with all text legible</li>
              <li>Photos show the entire document with no cropped information</li>
              <li>For personal photographs, ensure your face is clearly visible with good lighting</li>
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CopilotDialog;
