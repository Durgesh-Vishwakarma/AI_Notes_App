import React, { useEffect, useRef, useCallback, useId } from 'react';

/* ==========================================================================
   ICONS
   Inline stroke icons drawn at currentColor, so they inherit whatever colour
   the surrounding surface sets. Replaces the previous emoji usage.
   ========================================================================== */

const iconBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export const Icon = {
  Mail: (p) => (
    <svg width="18" height="18" {...iconBase} {...p}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Lock: (p) => (
    <svg width="18" height="18" {...iconBase} {...p}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  User: (p) => (
    <svg width="18" height="18" {...iconBase} {...p}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Search: (p) => (
    <svg width="18" height="18" {...iconBase} {...p}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Plus: (p) => (
    <svg width="16" height="16" {...iconBase} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Pencil: (p) => (
    <svg width="16" height="16" {...iconBase} {...p}>
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  ),
  Trash: (p) => (
    <svg width="16" height="16" {...iconBase} {...p}>
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6" />
    </svg>
  ),
  Download: (p) => (
    <svg width="16" height="16" {...iconBase} {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  ),
  Sparkle: (p) => (
    <svg width="16" height="16" {...iconBase} {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  ),
  Close: (p) => (
    <svg width="16" height="16" {...iconBase} {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  Check: (p) => (
    <svg width="16" height="16" {...iconBase} {...p}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  ),
  Alert: (p) => (
    <svg width="16" height="16" {...iconBase} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  ),
  Note: (p) => (
    <svg width="24" height="24" {...iconBase} {...p}>
      <path d="M15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9Z" />
      <path d="M15 3v6h6M9 13h6M9 17h4" />
    </svg>
  ),
  Logo: (p) => (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden focusable="false" {...p}>
      <rect width="24" height="24" rx="6" fill="currentColor" />
      <path
        d="M7 8.5h10M7 12h10M7 15.5h6"
        stroke="var(--bg)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  ),
};

/* ==========================================================================
   SPINNER
   ========================================================================== */

export const Spinner = ({ size = 16, className = '' }) => (
  <span
    className={`spinner ${className}`}
    style={{ width: size, height: size }}
    role="status"
    aria-label="Loading"
  />
);

/* ==========================================================================
   SKELETON
   Mirrors the shape of a note card so the layout doesn't jump when data lands.
   ========================================================================== */

export const NoteSkeleton = () => (
  <div className="card" style={{ padding: 20 }} aria-hidden="true">
    <div className="skeleton" style={{ height: 18, width: '45%', marginBottom: 14 }} />
    <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 8 }} />
    <div className="skeleton" style={{ height: 12, width: '88%', marginBottom: 8 }} />
    <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 16 }} />
    <div style={{ display: 'flex', gap: 8 }}>
      <div className="skeleton" style={{ height: 20, width: 56 }} />
      <div className="skeleton" style={{ height: 20, width: 72 }} />
    </div>
  </div>
);

export const SkeletonList = ({ count = 3 }) => (
  <div style={{ display: 'grid', gap: 16 }}>
    <span className="sr-only" role="status">
      Loading notes
    </span>
    {Array.from({ length: count }, (_, i) => (
      <NoteSkeleton key={i} />
    ))}
  </div>
);

/* ==========================================================================
   BUTTON
   ========================================================================== */

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={`btn btn-${variant} btn-${size} ${className}`}
    {...props}
  >
    {loading ? <Spinner size={14} /> : icon}
    {children}
  </button>
);

/* ==========================================================================
   INPUT
   Label bound via htmlFor/id; errors wired through aria-invalid and
   aria-describedby so screen readers actually announce them.
   ========================================================================== */

export const Input = ({
  label,
  error,
  hint,
  icon,
  id: providedId,
  className = '',
  ...props
}) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [error && errorId, hint && !error && hintId].filter(Boolean).join(' ');

  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="label" htmlFor={id}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && <span className="field-icon">{icon}</span>}
        <input
          id={id}
          className={`input ${icon ? 'input-with-icon' : ''}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          {...props}
        />
      </div>
      {error && (
        <p className="hint hint-error" id={errorId} role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="hint" id={hintId}>
          {hint}
        </p>
      )}
    </div>
  );
};

/* ==========================================================================
   TEXTAREA
   ========================================================================== */

export const Textarea = ({ label, error, hint, id: providedId, className = '', ...props }) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const hintId = `${id}-hint`;

  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="label" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        className="input"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={hint ? hintId : undefined}
        {...props}
      />
      {hint && (
        <p className="hint" id={hintId}>
          {hint}
        </p>
      )}
    </div>
  );
};

/* ==========================================================================
   CARD / BADGE / ALERT
   ========================================================================== */

export const Card = ({ children, interactive = false, className = '', ...props }) => (
  <div className={`card ${interactive ? 'card-interactive' : ''} ${className}`} {...props}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'default', className = '', ...props }) => (
  <span className={`badge ${variant === 'accent' ? 'badge-accent' : ''} ${className}`} {...props}>
    {children}
  </span>
);

export const Alert = ({ type = 'error', children, className = '' }) => {
  const Glyph = type === 'success' ? Icon.Check : Icon.Alert;

  return (
    <div className={`alert alert-${type} ${className}`} role={type === 'error' ? 'alert' : 'status'}>
      <span style={{ flexShrink: 0, marginTop: 2 }}>
        <Glyph />
      </span>
      <span>{children}</span>
    </div>
  );
};

/* ==========================================================================
   TOAST
   ========================================================================== */

export const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const colour = {
    success: 'var(--success)',
    error: 'var(--danger)',
    warning: 'var(--warning)',
    info: 'var(--accent)',
  }[type];

  return (
    <div className="toast" role="status" aria-live="polite">
      <span style={{ color: colour, display: 'flex', flexShrink: 0 }}>
        {type === 'success' ? <Icon.Check /> : <Icon.Alert />}
      </span>
      <span style={{ color: 'var(--text)' }}>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="btn btn-ghost btn-sm"
        style={{ padding: 4, height: 'auto', marginLeft: 4 }}
        aria-label="Dismiss notification"
      >
        <Icon.Close />
      </button>
    </div>
  );
};

/* ==========================================================================
   MODAL
   Handles Escape, click-outside, focus trapping, and restoring focus to
   whatever was focused before the dialog opened.
   ========================================================================== */

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal = ({ title, description, children, onClose, labelledBy }) => {
  const modalRef = useRef(null);
  const previouslyFocused = useRef(null);
  const generatedId = useId();
  const titleId = labelledBy || `${generatedId}-title`;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll(FOCUSABLE);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    previouslyFocused.current = document.activeElement;

    // Move focus into the dialog so keyboard users aren't stranded behind it
    modalRef.current?.querySelector(FOCUSABLE)?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const restoreTo = previouslyFocused.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      if (restoreTo && typeof restoreTo.focus === 'function') restoreTo.focus();
    };
  }, []);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
      >
        <div style={{ padding: '20px 20px 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div>
              <h2
                id={titleId}
                style={{ fontSize: '1.0625rem', marginBottom: description ? 4 : 0 }}
              >
                {title}
              </h2>
              {description && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              style={{ padding: 6, height: 'auto', flexShrink: 0 }}
              aria-label="Close dialog"
            >
              <Icon.Close />
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

/* ==========================================================================
   CONFIRM DIALOG
   ========================================================================== */

export const ConfirmDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => (
  <Modal title={title} onClose={onCancel}>
    <div style={{ padding: '12px 20px 20px' }}>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
        {message}
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="secondary" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </div>
  </Modal>
);

/* ==========================================================================
   EMPTY STATE
   ========================================================================== */

export const EmptyState = ({ title, description, action }) => (
  <div
    className="animate-fade-in"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '64px 24px',
      border: '1px dashed var(--border-strong)',
      borderRadius: 'var(--radius-lg)',
    }}
  >
    <span style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
      <Icon.Note width={32} height={32} />
    </span>
    <h3 style={{ marginBottom: 8 }}>{title}</h3>
    <p
      style={{
        fontSize: '0.9375rem',
        color: 'var(--text-muted)',
        maxWidth: '42ch',
        marginBottom: action ? 24 : 0,
      }}
    >
      {description}
    </p>
    {action}
  </div>
);
