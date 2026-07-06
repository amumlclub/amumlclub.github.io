function OpenSidebar() {
    const sidebar =document.querySelector('#header-side');
    sidebar.style.display='flex';
}

function CloseSidebar() {
    const sidebar =document.querySelector('#header-side');
    sidebar.style.display='none';
}
 
// ================= FAQ =================

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const button = item.querySelector(".faq-question");

    button.addEventListener("click", () => {

        const isOpen = item.classList.contains("active");

        faqItems.forEach(i => {
            i.classList.remove("active");
            i.querySelector(".faq-icon").textContent = "+";
        });

        if (!isOpen) {
            item.classList.add("active");
            item.querySelector(".faq-icon").textContent = "−";
        }

    });

});