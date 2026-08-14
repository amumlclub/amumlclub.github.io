function OpenSidebar() {
  const sidebar = document.querySelector("#header-side");
  const overlay = document.querySelector("#overlay");
  if (!sidebar || !overlay) return;

  sidebar.classList.add("show");
  overlay.classList.add("show");
  document.body.classList.add("nav-open");
}

function CloseSidebar() {
  const sidebar = document.querySelector("#header-side");
  const overlay = document.querySelector("#overlay");
  if (!sidebar || !overlay) return;

  sidebar.classList.remove("show");
  overlay.classList.remove("show");
  document.body.classList.remove("nav-open");
}
