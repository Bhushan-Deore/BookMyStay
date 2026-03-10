(() => {
  const STORAGE_KEY = "bookMyStayTourCompleted";

  const steps = [
    {
      id: "navbar",
      selector: '[data-tour="navbar"]',
      title: "Welcome",
      message:
        "Welcome to BookMyStay! Here you can explore unique places to stay around the world.",
    },
    {
      id: "search",
      selector: '[data-tour="search"]',
      title: "Search stays",
      message: "Use the search bar to quickly find stays by name.",
    },
    {
      id: "filters",
      selector: '[data-tour="filters"]',
      title: "Browse categories",
      message:
        "Use these filters to browse stays by category like mountains, camping, pools, or iconic places.",
    },
    {
      id: "listing",
      selector: '[data-tour="listing-card"]',
      title: "Open a listing",
      message:
        "Each listing shows a place you can explore. Click any card to see full details.",
    },
    {
      id: "reserve",
      selector: '[data-tour="reserve"]',
      title: "Reserve quickly",
      message: "Found a place you like? Click Reserve to confirm your stay.",
    },
    {
      id: "auth",
      selector: '[data-tour="auth"]',
      title: "Create an account",
      message:
        "You can create an account to manage your listings and reservations.",
      condition: () => !document.body.dataset.tourLoggedIn,
    },
    {
      id: "done",
      selector: null,
      title: "You're all set!",
      message: "You're all set! Enjoy exploring BookMyStay.",
    },
  ];

  const state = {
    currentStepIndex: 0,
    active: false,
    filteredSteps: [],
    overlay: null,
    highlight: null,
    tooltip: null,
    onResize: null,
    onKeyDown: null,
  };

  function buildUI() {
    state.overlay = document.createElement("div");
    state.overlay.className = "tour-overlay tour-hidden";

    state.highlight = document.createElement("div");
    state.highlight.className = "tour-highlight tour-hidden";

    state.tooltip = document.createElement("div");
    state.tooltip.className = "tour-tooltip tour-hidden";

    document.body.append(state.overlay, state.highlight, state.tooltip);

    state.overlay.addEventListener("click", skipTour);
  }

  function getVisibleSteps() {
    return steps.filter((step) => {
      if (typeof step.condition === "function" && !step.condition()) return false;
      if (!step.selector) return true;
      return Boolean(document.querySelector(step.selector));
    });
  }

  function startTour(force = false) {
    if (!force && localStorage.getItem(STORAGE_KEY) === "true") return;

    state.filteredSteps = getVisibleSteps();
    if (!state.filteredSteps.length) return;

    state.currentStepIndex = 0;
    state.active = true;

    state.overlay.classList.remove("tour-hidden");
    state.highlight.classList.remove("tour-hidden");
    state.tooltip.classList.remove("tour-hidden");
    requestAnimationFrame(() => state.overlay.classList.add("active"));

    state.onResize = () => renderStep();
    state.onKeyDown = (event) => {
      if (event.key === "Escape") {
        skipTour();
      }
    };

    window.addEventListener("resize", state.onResize);
    window.addEventListener("scroll", state.onResize, true);
    document.addEventListener("keydown", state.onKeyDown);

    renderStep();
  }

  function stopTour(markCompleted = true) {
    state.active = false;
    state.overlay.classList.remove("active");
    state.overlay.classList.add("tour-hidden");
    state.highlight.classList.add("tour-hidden");
    state.tooltip.classList.add("tour-hidden");

    if (markCompleted) {
      localStorage.setItem(STORAGE_KEY, "true");
    }

    if (state.onResize) {
      window.removeEventListener("resize", state.onResize);
      window.removeEventListener("scroll", state.onResize, true);
    }
    if (state.onKeyDown) {
      document.removeEventListener("keydown", state.onKeyDown);
    }
  }

  function skipTour() {
    stopTour(true);
  }

  function nextStep() {
    if (state.currentStepIndex >= state.filteredSteps.length - 1) {
      stopTour(true);
      return;
    }
    state.currentStepIndex += 1;
    renderStep();
  }

  function previousStep() {
    if (state.currentStepIndex <= 0) return;
    state.currentStepIndex -= 1;
    renderStep();
  }

  function renderStep() {
    if (!state.active) return;

    const step = state.filteredSteps[state.currentStepIndex];
    const isLast = state.currentStepIndex === state.filteredSteps.length - 1;
    const target = step.selector ? document.querySelector(step.selector) : null;

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }

    requestAnimationFrame(() => {
      placeHighlight(target);
      renderTooltip(step, isLast, Boolean(target));
    });
  }

  function placeHighlight(target) {
    if (!target) {
      state.highlight.classList.add("tour-hidden");
      return;
    }

    const rect = target.getBoundingClientRect();
    const padding = 8;

    state.highlight.classList.remove("tour-hidden");
    state.highlight.style.top = `${Math.max(rect.top - padding, 6)}px`;
    state.highlight.style.left = `${Math.max(rect.left - padding, 6)}px`;
    state.highlight.style.width = `${Math.min(rect.width + padding * 2, window.innerWidth - 12)}px`;
    state.highlight.style.height = `${Math.min(rect.height + padding * 2, window.innerHeight - 12)}px`;
  }

  function renderTooltip(step, isLast, hasTarget) {
    state.tooltip.innerHTML = `
      <h5>${step.title}</h5>
      <p>${step.message}</p>
      <div class="tour-actions">
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-outline-secondary btn-sm" data-tour-prev ${state.currentStepIndex === 0 ? "disabled" : ""}>Previous</button>
          <button type="button" class="btn btn-dark btn-sm" data-tour-next>${isLast ? "Finish" : "Next"}</button>
        </div>
        <button type="button" class="btn btn-link btn-sm text-decoration-none" data-tour-skip>Skip</button>
      </div>
      <div class="tour-progress mt-2">Step ${state.currentStepIndex + 1} of ${state.filteredSteps.length}</div>
    `;

    positionTooltip(hasTarget ? document.querySelector(step.selector) : null);

    state.tooltip.querySelector("[data-tour-next]").addEventListener("click", nextStep);
    state.tooltip.querySelector("[data-tour-prev]").addEventListener("click", previousStep);
    state.tooltip.querySelector("[data-tour-skip]").addEventListener("click", skipTour);
  }

  function positionTooltip(target) {
    const margin = 12;
    const tooltipRect = state.tooltip.getBoundingClientRect();

    let top = window.innerHeight / 2 - tooltipRect.height / 2;
    let left = window.innerWidth / 2 - tooltipRect.width / 2;

    if (target) {
      const rect = target.getBoundingClientRect();
      const roomBelow = window.innerHeight - rect.bottom;
      const roomAbove = rect.top;

      if (roomBelow > tooltipRect.height + margin) {
        top = rect.bottom + margin;
      } else if (roomAbove > tooltipRect.height + margin) {
        top = rect.top - tooltipRect.height - margin;
      } else {
        top = Math.max(margin, window.innerHeight - tooltipRect.height - margin);
      }

      left = rect.left;
    }

    state.tooltip.style.top = `${Math.max(margin, Math.min(top, window.innerHeight - tooltipRect.height - margin))}px`;
    state.tooltip.style.left = `${Math.max(margin, Math.min(left, window.innerWidth - tooltipRect.width - margin))}px`;
  }

  function bindTriggerButton() {
    const trigger = document.querySelector("[data-tour-trigger]");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      if (state.active) stopTour(false);
      startTour(true);
    });
  }

  function init() {
    document.body.dataset.tourLoggedIn = document.querySelector('[data-tour="auth"]') ? "" : "1";
    buildUI();
    bindTriggerButton();
    startTour(false);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
