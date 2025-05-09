
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  error: string | null;
}

export default function FormError({ error }: FormErrorProps) {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-4 py-2">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
