// ===========================
// 🌐 Smooth Scroll for Anchor Links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===========================
// �� Contact Form Submission
// ===========================
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const status = document.getElementById("formStatus");

    if (!name || !email || !message) {
      status.textContent = "Please fill in all fields.";
      status.style.color = "red";
      return;
    }

    // Placeholder for future email integration
    status.textContent = "Message sent successfully!";
    status.style.color = "green";

    contactForm.reset();
  });
}

// ===========================
// 🔹 Hero Section Animation on Load
// ===========================
window.addEventListener("DOMContentLoaded", () => {
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    heroContent.style.opacity = 0;
    heroContent.style.transform = "translateY(20px)";
    setTimeout(() => {
      heroContent.style.transition = "all 0.8s ease";
      heroContent.style.opacity = 1;
      heroContent.style.transform = "translateY(0)";
    }, 200);
  }
});

// ===========================
// 🔹 Scroll-Triggered Animations for Project Cards
// ===========================
const scrollElements = document.querySelectorAll(".project-card, .projects-grid .project-card");

const isElementInView = (el, offset = 0) => {
  const elementTop = el.getBoundingClientRect().top;
  return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
};

const showScrollElement = (el) => el.classList.add("in-view");
const hideScrollElement = (el) => el.classList.remove("in-view");

const handleScrollAnimation = () => {
  scrollElements.forEach(el => {
    if (isElementInView(el, 100)) {
      showScrollElement(el);
    } else {
      hideScrollElement(el);
    }
  });
};

window.addEventListener("scroll", handleScrollAnimation);

