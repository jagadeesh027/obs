import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends (React.Component as any) {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let details = "";

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Firestore ${parsed.operationType} error: ${parsed.error}`;
            details = `Path: ${parsed.path || "unknown"}`;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
          <div className="max-w-md w-full bg-white/5 border border-white/10 p-12 rounded-2xl backdrop-blur-xl text-center space-y-8">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-light tracking-widest uppercase">Something went wrong</h2>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                {errorMessage}
              </p>
              {details && (
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">
                  {details}
                </p>
              )}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3 h-3" /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
