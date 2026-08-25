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
//contact api
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("form-status");
const submitBtn = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 1. Gather input values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // Basic client-side validation
  if (!name || !email || !message) {
    displayStatus("Please fill out all fields.", "error");
    return;
  }

  // 2. Set UI loading state
  submitBtn.disabled = true;
  displayStatus("Sending message...", "loading");

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "3136fd48-0ebf-47c3-b358-68c44b51d1a2",
        name: name,
        email: email,
        message: message,
        subject: `New submission from ${name}`,
        from_name: "Portfolio Notification",
      }),
    });

    const data = await response.json();

    // 3. Handle Web3Forms response status
    if (response.status === 200 && data.success) {
      displayStatus("Message sent successfully! ✅", "success");
      contactForm.reset();
    } else {
      // API-level errors (invalid key, rate limit, missing fields)
      displayStatus(data.message || "Failed to send message. ❌", "error");
    }
  } catch (error) {
    // Network-level errors (offline, blocked request, DNS failure)
    console.error("Submission Error:", error);
    displayStatus("Network error. Check connection and try again.", "error");
  } finally {
    // 4. Restore submit button state
    submitBtn.disabled = false;
  }
});

function displayStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = `status-msg ${type}`;
}
/* =====================================
   PARALLAX EFFECT
===================================== */

const hero = document.querySelector(".hero");
const character = document.querySelector(".hero-character");

if (hero && character) {
  hero.addEventListener("mousemove", (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 50;
    const y = (window.innerHeight / 2 - e.clientY) / 50;

    character.style.transform = `translate(${x}px, ${y}px)`;
  });

  hero.addEventListener("mouseleave", () => {
    character.style.transform = "translate(0,0)";
  });
}

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

  if (!solvedElement) {
    console.error("leetcode-solved element not found");
    return;
  }

  try {
    const response = await fetch(
      "https://my-portfolio-api-xx9c.onrender.com/api/leetcode/stats",
    );

    console.log("Response status:", response.status);

    const data = await response.json();

    console.log("LeetCode Data:", data);

    if (!data.success) {
      throw new Error(data.message || "LeetCode API failed");
    }

    solvedElement.textContent = `${data.solved}+`;
  } catch (error) {
    console.error("LeetCode Error:", error);
    solvedElement.textContent = "N/A";
  }
}

loadLeetCodeStats();
