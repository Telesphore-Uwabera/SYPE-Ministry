import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className = "" }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 w-full animate-in fade-in duration-500 ${className}`}>
      <div className="relative">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
      <p className="text-muted-foreground font-medium text-lg tracking-wide">{message}</p>
      <div className="flex gap-1 mt-2">
        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
      </div>
    </div>
  );
}
