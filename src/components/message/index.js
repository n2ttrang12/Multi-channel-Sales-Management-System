import { t } from "i18next";

const Component = {
  success: (message) => import('sweetalert2').then(({default: Swal}) => Swal.fire({
    icon: "success",
    title: t("components.message.Success"),
    text: message,
    showConfirmButton: false,
    timer: 1500,
  })),
  warning: (message) => import('sweetalert2').then(({default: Swal}) => Swal.fire({
    icon: 'warning',
    title: message,
  })),
  error: (message) => import('sweetalert2').then(({default: Swal}) => Swal.fire({
    icon: "error",
    title: t("components.message.Fail"),
    text: message,
    padding: 0,
    showCloseButton: true,
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: t("components.message.Close"),
    focusCancel: true,
  })),
  confirm: (message, onConfirm, onDenied = () => null) => import('sweetalert2').then(({default: Swal}) => Swal.fire({
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Ok',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    } else if (result.isDenied) {
      onDenied();
    }
  }))
}
export default Component
