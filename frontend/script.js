/* =====================================
   LOADER
===================================== */

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.classList.add("hide");
  }, 1800);
});

/* =====================================
   CUSTOM CURSOR
===================================== */

const cursor = document.querySelector(".cursor");

const cursorDot = document.querySelector(".cursor-dot");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.clientX}px`;

  cursor.style.top = `${e.clientY}px`;

  cursorDot.style.left = `${e.clientX}px`;

  cursorDot.style.top = `${e.clientY}px`;
});

/* =====================================
   CURSOR HOVER
===================================== */

const clickable = document.querySelectorAll(
  "a, button, .skill-card, .project-card",
);

clickable.forEach((element) => {
  element.addEventListener("mouseenter", () => {
    cursor.style.width = "50px";

    cursor.style.height = "50px";
  });

  element.addEventListener("mouseleave", () => {
    cursor.style.width = "30px";

    cursor.style.height = "30px";
  });
});

/* =====================================
   MOBILE MENU
===================================== */

const menuButton = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

/* =====================================
   SCROLL REVEAL
===================================== */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },

  {
    threshold: 0.12,
  },
);

document
  .querySelectorAll(".section, .skill-card, .project-card")
  .forEach((element) => {
    observer.observe(element);
  });

/* =====================================
   STAGGER SKILLS
===================================== */

const skillCards = document.querySelectorAll(".skill-card");

skillCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.08}s`;
});

/* =====================================
   STAGGER PROJECTS
===================================== */

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.15}s`;
});

/* =====================================
   CONTACT FORM
===================================== */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    formStatus.textContent = "Sending...";

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        formStatus.textContent = "Message sent successfully! ✅";
        contactForm.reset();
      } else {
        formStatus.textContent = data.message || "Something went wrong ❌";
      }
    } catch (error) {
      console.error("Contact Error:", error);
      formStatus.textContent =
        "Unable to send message. Please try again later.";
    }
  });
}
/* =====================================
   PARALLAX EFFECT
===================================== */

const hero = document.querySelector(".hero");

const character = document.querySelector(".hero-character");

hero.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth / 2 - e.clientX) / 50;

  const y = (window.innerHeight / 2 - e.clientY) / 50;

  character.style.transform = `translate(${x}px, ${y}px)`;
});

hero.addEventListener("mouseleave", () => {
  character.style.transform = "translate(0,0)";
});

/* =====================================
   NAVBAR BACKGROUND
===================================== */

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");

  if (window.scrollY > 80) {
    navbar.style.background = "rgba(3,3,4,0.95)";

    navbar.style.backdropFilter = "blur(15px)";
  } else {
    navbar.style.background =
      "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)";
  }
});

async function loadLeetCodeStats() {
  const solvedElement = document.getElementById("leetcode-solved");

  try {
    const response = await fetch("http://localhost:5000/api/leetcode/stats");

    if (!response.ok) {
      throw new Error("Failed to fetch LeetCode stats");
    }

    const data = await response.json();

    console.log("LeetCode Data:", data);

    solvedElement.textContent = `${data.solved}+`;
  } catch (error) {
    console.error("Error fetching LeetCode stats:", error);

    solvedElement.textContent = "N/A";
  }
}

// Page load hote hi function chalega
loadLeetCodeStats();
