const resetPasswordBtn = document.getElementById("resetPasswordBtn");
const resetPasswordForm = document.getElementById("register-form");

async function updatePassword() {
  try {
    const newPassword = document.getElementById("newPassword").value;
    const res = await axios.post(
      "http://localhost:2222/password/resetPassword",
      {
        password: newPassword,
      }
    );
    alert(res.data.message);
    window.location.href = "/";
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
    window.location.reload();
  }
}

// resetPasswordBtn.addEventListener("click", updatePassword);
resetPasswordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updatePassword();
});