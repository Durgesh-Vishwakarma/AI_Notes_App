import React from 'react';

// === LOADING SPINNER ===
export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeMap = { sm: 16, md: 32, lg: 48 };
  const s = sizeMap[size] || 32;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative" style={{ width: s, height: s }}>
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            border: `3px solid rgba(168, 85, 247, 0.1)`,
            borderTopColor: '#a855f7',
          }}
        />
        <div
          className="absolute inset-1 rounded-full animate-spin"
          style={{
            border: `2px solid rgba(99, 102, 241, 0.1)`,
            borderBottomColor: '#6366f1',
            animationDirection: 'reverse',
            animationDuration: '0.8s',
          }}
        />
      </div>
      {text && (
        <p className="mt-4 text-sm animate-pulse-soft" style={{ color: 'var(--text-muted)' }}>
          {text}
        </p>
      )}
    </div>
  );
};

// === TOAST NOTIFICATION ===
export const Toast = ({ message, type = 'info', onClose }) => {
  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const bgMap = {
    success: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(6, 182, 212, 0.9))',
    error: 'linear-gradient(135deg, rgba(244, 63, 94, 0.9), rgba(225, 29, 72, 0.9))',
    warning: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9))',
    info: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(168, 85, 247, 0.9))',
  };

  React.useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed top-6 right-6 z-50 animate-slide-in-right"
      style={{
        background: bgMap[type],
        backdropFilter: 'blur(16px)',
        borderRadius: '14px',
        padding: '14px 20px',
        minWidth: '280px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{iconMap[type]}</span>
        <span className="text-white font-medium text-sm flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white text-lg leading-none transition-colors"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
      <div
        className="mt-2 h-0.5 rounded-full toast-progress"
        style={{ background: 'rgba(255,255,255,0.3)' }}
      />
    </div>
  );
};

// === BUTTON ===
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  ...props
}) => {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    warning: 'btn-warning',
    outline: 'btn-outline',
  };

  const sizeClass = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`btn ${variantClass[variant] || 'btn-primary'} ${sizeClass[size] || 'btn-md'} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" text="" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

// === INPUT ===
export const Input = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div
            className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          >
            {icon}
          </div>
        )}
        <input
          className={`input-glass ${icon ? 'pl-11' : ''} ${error ? 'border-red-500' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm flex items-center gap-1" style={{ color: '#fb7185' }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

// === CARD ===
export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`glass-card ${hover ? '' : 'hover:transform-none hover:shadow-glass'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// === BADGE ===
export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variantClass = {
    default: 'badge-default',
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
  };

  return (
    <span className={`badge ${variantClass[variant] || 'badge-default'} ${className}`}>
      {children}
    </span>
  );
};

// === EMPTY STATE ===
export const EmptyState = ({ icon = '📝', title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="text-6xl mb-6 animate-float">{icon}</div>
      <h3
        className="text-xl font-bold mb-3 gradient-text"
      >
        {title}
      </h3>
      <p
        className="text-center max-w-md mb-8 leading-relaxed"
        style={{ color: 'var(--text-muted)' }}
      >
        {description}
      </p>
      {action && action}
    </div>
  );
};

// === CONFIRM DIALOG ===
export const ConfirmDialog = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="glass p-6 max-w-sm w-full mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant={variant} size="sm" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};