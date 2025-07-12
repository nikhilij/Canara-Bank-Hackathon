import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div className="error-boundary">
            <h2>Something went wrong.</h2>
            <p>We're sorry, but something unexpected happened.</p>
            <button onClick={resetErrorBoundary}>
                Try again
            </button>
        </div>
    );
}

// Usage
function App() {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <YourComponent />
        </ErrorBoundary>
    );
}
