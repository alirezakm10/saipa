import { useEffect } from 'react';
import Swal from 'sweetalert2';

interface ToastOptions {
  position?: 'top-start' | 'top-end' | 'top' | 'center' | 'center-start' | 'center-end' | 'bottom-start' | 'bottom-end' | 'bottom';
  timer?: number;
  timerProgressBar?: boolean;
}

const useToast = (options: ToastOptions = {}) => {
  // Define toastConfig outside of useEffect
  const toastConfig = {
    toast: true,
    position: options.position || 'top-end',
    showConfirmButton: false,
    timer: options.timer || 3000,
    showCancelButton: true,
    cancelButtonText: "X",
    timerProgressBar: options.timerProgressBar || true,
    didOpen: (toast: HTMLElement) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  };

  useEffect(() => {
    const toast = Swal.mixin(toastConfig);

    return () => {
      // Clear any existing toasts when the component unmounts
      toast.close();
    };
  }, [options.position, options.timer, options.timerProgressBar]);

  // Define and return the showToast function
  const showToast = (message: string, icon: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    Swal.fire({
      ...toastConfig, // Spread the toastConfig here
      icon,
      text: message,
    });
  };

  return showToast;
};

export default useToast;
