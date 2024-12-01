import Swal from "sweetalert2";

export const showAlert = (title, text, icon) => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor: "var(--primary-color)",
  });
};
