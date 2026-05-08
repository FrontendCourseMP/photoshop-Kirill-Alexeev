import React, { createContext, useState, useCallback, useContext } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface Toast {
    message: string;
    severity: AlertColor;
}

interface ToastContextType {
    showToast: (message: string, severity?: AlertColor) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<Toast | null>(null);
    const [open, setOpen] = useState(false);

    const showToast = useCallback((message: string, severity: AlertColor = 'info') => {
        setToast({ message, severity });
        setOpen(true);
    }, []);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={toast?.severity} sx={{ width: '100%' }} variant="filled">
                    {toast?.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast должен использоваться внутри ToastProvider');
    }
    return ctx;
};