// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functions
  initNavigation();
  initScrollEffects();
  initAnimations();
  initMenuOrderButtons();
  initGalleryEffects();
  initBackToTop();
  initSmoothScrolling();
});

// Navigation Functions
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Hamburger menu toggle
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    document.body.style.overflow = navMenu.classList.contains("active")
      ? "hidden"
      : "";
  });

  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Active link highlighting
  updateActiveNavLink();
  window.addEventListener("scroll", updateActiveNavLink);
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

// Scroll Effects
function initScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  // Observe all elements with fade-in class
  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });

  // Add fade-in class to elements that should animate
  const animateElements = document.querySelectorAll(
    ".menu-card, .gallery-item, .feature-item, .stat-item"
  );

  animateElements.forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });
}

// Animation Functions
function initAnimations() {
  // Counter animation for stats
  const statNumbers = document.querySelectorAll(".stat-number");
  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((stat) => {
    statsObserver.observe(stat);
  });
}

function animateCounter(element) {
  const target = parseInt(element.textContent.replace(/\D/g, ""));
  const increment = target / 50;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = element.textContent.replace(/\d+/, target);
      clearInterval(timer);
    } else {
      element.textContent = element.textContent.replace(
        /\d+/,
        Math.floor(current)
      );
    }
  }, 30);
}

// Menu Order Buttons
function initMenuOrderButtons() {
  const orderButtons = document.querySelectorAll(".menu-order-btn");

  orderButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const menuCard = this.closest(".menu-card");
      const menuTitle = menuCard.querySelector(".menu-title").textContent;
      const menuPrice = menuCard.querySelector(".menu-price").textContent;

      // Create WhatsApp message
      const message = `Halo Tetes Kopi! Saya ingin order ${menuTitle} (${menuPrice}). Bisa dibantu?`;
      const whatsappUrl = `https://wa.me/6282123710997?text=${encodeURIComponent(
        message
      )}`;

      // Add loading state
      const originalText = this.textContent;
      this.textContent = "Redirecting...";
      this.disabled = true;

      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
        this.textContent = originalText;
        this.disabled = false;
      }, 500);
    });
  });
}

// Gallery Effects
function initGalleryEffects() {
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const img = this.querySelector("img");
      const title = this.querySelector(".gallery-content h4").textContent;

      // Create modal for image preview
      showImageModal(img.src, title);
    });

    // Add hover sound effect (optional)
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.02)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
}

function showImageModal(src, title) {
  // Create modal overlay
  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <img src="${src}" alt="${title}">
                <h3>${title}</h3>
            </div>
        </div>
    `;

  // Add modal styles
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

  const modalContent = modal.querySelector(".modal-content");
  modalContent.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
    `;

  const modalImg = modal.querySelector("img");
  modalImg.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        border-radius: 10px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    `;

  const modalTitle = modal.querySelector("h3");
  modalTitle.style.cssText = `
        color: white;
        margin-top: 1rem;
        font-size: 1.5rem;
    `;

  const closeBtn = modal.querySelector(".modal-close");
  closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        width: 40px;
        height: 40px;
    `;

  document.body.appendChild(modal);

  // Animate in
  setTimeout(() => {
    modal.style.opacity = "1";
  }, 10);

  // Close modal events
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  function closeModal() {
    modal.style.opacity = "0";
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
  }
}

// Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Smooth Scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        const headerOffset = 80;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Utility Functions
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Performance optimized scroll handler
const optimizedScrollHandler = debounce(function () {
  updateScrollProgress();
}, 10);

function updateScrollProgress() {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
}

window.addEventListener("scroll", optimizedScrollHandler);

// Loading Animation
window.addEventListener("load", function () {
  document.body.classList.add("loaded");

  // Remove loading class from elements
  document.querySelectorAll(".loading").forEach((el) => {
    el.classList.remove("loading");
  });
});

// Error Handling
window.addEventListener("error", function (e) {
  console.warn("An error occurred:", e.error);
});

// Handle images loading
function handleImageLoading() {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", function () {
        this.classList.add("loaded");
      });

      img.addEventListener("error", function () {
        this.style.display = "none";
        console.warn("Failed to load image:", this.src);
      });
    }
  });
}

// Initialize image loading
handleImageLoading();

function initInteractiveFeatures() {
  const buttons = document.querySelectorAll(
    ".btn, .menu-order-btn, .whatsapp-btn"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                background-color: rgba(255, 255, 255, 0.7);
                left: ${x}px;
                top: ${y}px;
                width: 20px;
                height: 20px;
                margin-left: -10px;
                margin-top: -10px;
                pointer-events: none;
            `;

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    });
  });
}

const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

initInteractiveFeatures();

function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const name = formData.get("name");
      const message = formData.get("message");

      const whatsappMessage = `Halo Tetes Kopi! Saya ${name}. ${message}`;
      const whatsappUrl = `https://wa.me/6282123710997?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      window.open(whatsappUrl, "_blank");
    });
  }
}

// Initialize contact form
initContactForm();

function initBeanSlider() {
  const slider = document.getElementById("bean-slider");
  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");

  if (!slider || !nextBtn || !prevBtn) {
    console.warn("Bean slider elements not found");
    return;
  }

  // Calculate scroll amount based on card width + gap
  const getScrollAmount = () => {
    const cardWidth = 280;
    const gap = 32;
    return cardWidth + gap;
  };

  // Update button states based on scroll position
  const updateButtonStates = () => {
    const scrollLeft = slider.scrollLeft;
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    // Disable/enable buttons based on scroll position
    prevBtn.style.opacity = scrollLeft <= 0 ? "0.5" : "1";
    prevBtn.style.cursor = scrollLeft <= 0 ? "not-allowed" : "pointer";

    nextBtn.style.opacity = scrollLeft >= maxScroll - 1 ? "0.5" : "1";
    nextBtn.style.cursor =
      scrollLeft >= maxScroll - 1 ? "not-allowed" : "pointer";
  };

  // Instant scroll function (no delay)
  const instantScroll = (element, target) => {
    element.scrollLeft = target;
    updateButtonStates();
  };

  // Next button functionality
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const scrollAmount = getScrollAmount();
    const currentScroll = slider.scrollLeft;
    const targetScroll = currentScroll + scrollAmount;
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    if (currentScroll < maxScroll - 1) {
      instantScroll(slider, Math.min(targetScroll, maxScroll));
    }
  });

  // Previous button functionality
  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const scrollAmount = getScrollAmount();
    const currentScroll = slider.scrollLeft;
    const targetScroll = Math.max(currentScroll - scrollAmount, 0);

    if (currentScroll > 0) {
      instantScroll(slider, targetScroll);
    }
  });

  // Update button states on scroll
  slider.addEventListener("scroll", updateButtonStates);

  // Initialize button states
  updateButtonStates();

  // Handle keyboard navigation
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevBtn.click();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextBtn.click();
    }
  });

  // Touch/swipe support for mobile
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.style.cursor = "grabbing";
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.style.cursor = "grab";
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.style.cursor = "grab";
    updateButtonStates();
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });

  // Auto-scroll functionality (optional)
  let autoScrollInterval;
  const startAutoScroll = () => {
    autoScrollInterval = setInterval(() => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      if (slider.scrollLeft >= maxScroll - 1) {
        // Reset to beginning
        instantScroll(slider, 0);
      } else {
        nextBtn.click();
      }
    }, 4000); // Auto scroll every 4 seconds
  };

  const stopAutoScroll = () => {
    clearInterval(autoScrollInterval);
  };

  // Start auto-scroll when not hovering
  slider.addEventListener("mouseenter", stopAutoScroll);
  slider.addEventListener("mouseleave", startAutoScroll);

  // Pause auto-scroll when tab is not visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  });

  startAutoScroll();

  // Handle window resize
  window.addEventListener("resize", () => {
    updateButtonStates();
  });

  console.log("Bean slider initialized successfully");
}

document.addEventListener("DOMContentLoaded", initBeanSlider);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBeanSlider);
} else {
  initBeanSlider();
}
