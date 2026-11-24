import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  // Имя remote для сообщения в fallback UI.
  remoteName: string;
  // Retry: пересоздание ленивого компонента на уровне вызывающего кода.
  onRetry?: () => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// ErrorBoundary уровня host-shell: падение remote не роняет хост (AGENTS.md).
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error): void {
    console.error('[host-shell] Remote упал с ошибкой:', error);
  }

  render(): ReactNode {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }
    return (
      <div className="host-remote-fallback" role="alert">
        <p className="host-remote-fallback__message">
          Не удалось загрузить «{this.props.remoteName}». Remote недоступен или завершился с ошибкой.
        </p>
        {this.props.onRetry && (
          <button
            type="button"
            className="host-remote-fallback__retry"
            onClick={this.props.onRetry}
          >
            Перезагрузить remote
          </button>
        )}
      </div>
    );
  }
}
