import Swal from "sweetalert2";

/**
 * Modern themed confirmation dialog for deletions and critical actions.
 * Automatically adapts to the active dark / light theme of SmartExpense.
 */
export const confirmDelete = async ({
  title = "Delete Transaction?",
  html = "Are you sure you want to delete this? This action cannot be undone.",
  confirmButtonText = "Yes, Delete It",
  cancelButtonText = "Cancel",
} = {}) => {
  const isDark = document.documentElement.classList.contains("dark");

  const result = await Swal.fire({
    title,
    html,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: true,
    background: isDark ? "#090d16" : "#ffffff",
    color: isDark ? "#f1f5f9" : "#0f172a",
    iconColor: "#ef4444",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: isDark ? "#1e293b" : "#e2e8f0",
    customClass: {
      popup: "smart-swal-popup",
      title: "smart-swal-title",
      htmlContainer: "smart-swal-html",
      confirmButton: "smart-swal-confirm-btn",
      cancelButton: "smart-swal-cancel-btn",
    },
    buttonsStyling: false,
  });

  return result.isConfirmed;
};

/**
 * General purpose modern confirm dialog (e.g. Logout, Discard, etc.)
 */
export const confirmAction = async ({
  title = "Are you sure?",
  text,
  html,
  icon = "question",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  isDestructive = false,
} = {}) => {
  const isDark = document.documentElement.classList.contains("dark");

  const result = await Swal.fire({
    title,
    text,
    html,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: true,
    background: isDark ? "#090d16" : "#ffffff",
    color: isDark ? "#f1f5f9" : "#0f172a",
    iconColor: isDestructive ? "#ef4444" : "#3b82f6",
    customClass: {
      popup: "smart-swal-popup",
      title: "smart-swal-title",
      htmlContainer: "smart-swal-html",
      confirmButton: isDestructive
        ? "smart-swal-confirm-btn"
        : "smart-swal-primary-btn",
      cancelButton: "smart-swal-cancel-btn",
    },
    buttonsStyling: false,
  });

  return result.isConfirmed;
};

/**
 * Themed Alert Modal for notifications & feedback
 */
export const showAlert = async ({
  title,
  text,
  html,
  icon = "info",
  confirmButtonText = "Okay",
} = {}) => {
  const isDark = document.documentElement.classList.contains("dark");

  return Swal.fire({
    title,
    text,
    html,
    icon,
    confirmButtonText,
    background: isDark ? "#090d16" : "#ffffff",
    color: isDark ? "#f1f5f9" : "#0f172a",
    iconColor:
      icon === "success"
        ? "#10b981"
        : icon === "error"
        ? "#ef4444"
        : icon === "warning"
        ? "#f59e0b"
        : "#3b82f6",
    customClass: {
      popup: "smart-swal-popup",
      title: "smart-swal-title",
      htmlContainer: "smart-swal-html",
      confirmButton: "smart-swal-primary-btn",
    },
    buttonsStyling: false,
  });
};

export default {
  confirmDelete,
  confirmAction,
  showAlert,
};
