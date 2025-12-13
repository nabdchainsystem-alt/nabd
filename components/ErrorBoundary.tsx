import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        // this.setState({ error, errorInfo }); // Standard class components handle this, but React.Component type needs generic Props/State
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', fontFamily: 'monospace', color: 'red', backgroundColor: '#fff0f0' }}>
                    <h1>Something went wrong.</h1>
                    <h3>{this.state.error?.toString()}</h3>
                </div>
            );
        }

        return this.props.children;
    }
}
