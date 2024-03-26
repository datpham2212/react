import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AxiosErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state to show the error
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error("AxiosErrorBoundary caught an error:", error, errorInfo);
  }

  render(): ReactNode {
    console.log(this.state);
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div>Error: {this.state.error?.message}</div>;
    }

    return this.props.children;
  }
}

export default AxiosErrorBoundary;
