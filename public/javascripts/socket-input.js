window.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("input");
  const btn = document.querySelector("button");

  const submitMessage = () => {
    const value = input.value;
    if (value) {
      activeNsSocket.emit("message", { text: value, roomId: activeRoom._id });
      input.value = "";
      input.focus();
    }
  };

  btn.addEventListener("click", submitMessage);

  input.addEventListener("keyup", (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      submitMessage();
    }
  });
});
