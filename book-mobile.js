(function () {
    if (window.matchMedia("(min-width: 769px)").matches) return;

    const cards = Array.from(document.querySelectorAll(".card"));
    if (!cards.length) return;

    let index = 0;
    let startX = 0;
    let currentX = 0;
    let dragging = false;
    let isAnimating = false;

    const SWIPE_THRESHOLD = 80;

    function setActive(i) {
        cards.forEach(c => {
            c.classList.remove("active");
            c.style.display = "none";
            c.style.transform = "translateX(0)";
            c.style.opacity = "1";
        });

        const card = cards[i];
        card.classList.add("active");
        card.style.display = "flex";
    }

    function onStart(e) {
        if (isAnimating) return;
        dragging = true;
        startX = e.touches[0].clientX;
        currentX = startX;
    }

    function onMove(e) {
        if (!dragging || isAnimating) return;

        currentX = e.touches[0].clientX;
        const delta = currentX - startX;

        const card = cards[index];
        card.style.transition = "none";
        applyDragStyle(card, delta);
    }


    function onEnd() {
        if (!dragging || isAnimating) return;
        dragging = false;

        const delta = currentX - startX;
        const card = cards[index];

        card.style.transition = "transform 0.35s ease, opacity 0.35s ease";

        if (delta < -SWIPE_THRESHOLD && index < cards.length - 1) {
            swipeNext();
        } else if (delta > SWIPE_THRESHOLD && index > 0) {
            swipePrev();
        } else {
            // Retour au centre
            card.style.transform = "translateX(0)";
            card.style.opacity = "1";
        }
    }

    function swipeNext() {
        isAnimating = true;
        const current = cards[index];
        const next = cards[index + 1];

        next.style.display = "flex";
        next.style.transform = "translateX(100%)";
        next.style.opacity = "0";
        next.classList.add("active");

        next.offsetHeight;

        current.style.transform = "translateX(-100%)";
        current.style.opacity = "0";

        next.style.transition = "transform 0.35s ease, opacity 0.35s ease";
        next.style.transform = "translateX(0)";
        next.style.height = "90%";
        next.style.opacity = "1";

        setTimeout(() => {
            current.style.display = "none";
            current.classList.remove("active");
            index++;
            isAnimating = false;
        }, 350);
    }

    function swipePrev() {
        isAnimating = true;
        const current = cards[index];
        const prev = cards[index - 1];

        prev.style.display = "flex";
        prev.style.transform = "translateX(-100%)";
        prev.style.opacity = "0";
        prev.classList.add("active");

        prev.offsetHeight;

        current.style.transform = "translateX(100%)";
        current.style.opacity = "0";

        prev.style.transition = "transform 0.35s ease, opacity 0.35s ease";
        prev.style.transform = "translateX(0)";
        prev.style.height = "90%";
        prev.style.opacity = "1";

        setTimeout(() => {
            current.style.display = "none";
            current.classList.remove("active");
            index--;
            isAnimating = false;
        }, 350);
    }

    function applyDragStyle(card, deltaX) {
        const rotate = deltaX / 20;
        card.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
        card.style.opacity = `${1 - Math.abs(deltaX) / 300}`;
    }


    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onEnd);

    // Init
    setActive(0);
})();


