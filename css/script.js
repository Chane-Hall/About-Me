/*
var emailValue = document.getElementByName("email").value;
var cardValue = document.getElementByName("cardn").value;
var expValue = document.getElementByName("experationdate").value;
var secureValue = document.getElementByName("security").value;
var button = document.getInputsByValue("Submit");
var emailField = document.getElementByName("email");
var cardField = document.getElementByName("cardn");
var expField = document.getElementByName("experationdate");
var secureField = document.getElementByName("security");


//Test if the email field is empty and validate:
emailField.onblur = function () 
{
if (emailValue.include("@")) 
	{ emailM.innerHTML } 
else 
	{ emailMessage.innerHTML = "Email must include \"@\""; 
	return false;}
if (emailValue === "") 
		{ emailM.innerHTML = "Email field is empty!"; //id inside <p>
}
};

//Test if the card number field is empty:
cardField.onblur = function () 
{
if (cardValue === "") 
		{ cardM.innerHTML = "Card number field is empty!"; //id inside <p>
}
};

//Test if the Experation date field is empty and if card has expired:
expField.onblur = function () 
{
	var year = expValue.substring(0, 4);
	var year = expValue.substring(5, 6);
	if (year < getFullYear() && month < getMonth())
	{
		expM.innerHTML = "Your card has expired!";
	}
if (expValue === "") 
		{ expM.innerHTML = "The Experation date field is empty!"; //id inside <p>
}
};

//Test if the Security code field is empty:
secureField.onblur = function () 
{
if (secureValue === "") 
		{ secM.innerHTML = "Security code is empty"; //id inside <p>
}
};

// submit if:
button.onclick = function () { 
	if (secureValue === "" || expValue === "" || cardValue === "" || emailValue === "")
		return false;
	else
		document.getElementByValue("Submit").submit();
};

*/


// js/slider-init.js
// Automatically initialize every element with [data-carousel] on DOM ready.

document.addEventListener('DOMContentLoaded', function () {
  // Returns an array of instance APIs in case you need them
  window._carousels = window.autoInit();
});


///////-----------------slider------------------//////////////
// slider.js (ES module)

// js/slider.js
// Global, reusable carousel (no modules). Works with multiple instances.

(function () {
  function createCarousel(root, opts) {
    const options = Object.assign({ interval: 2000, animMs: 500 }, opts || {});
    const viewport = root.querySelector('.viewport');
    const track = root.querySelector('.track');

    if (!viewport || !track) {
      console.warn('[Carousel] Missing .viewport or .track inside', root);
      return null;
    }

    let timer = null;
    let isAnimating = false;
    let stepPx = 0;

    function getGapPx() {
      const styles = getComputedStyle(track);
      return parseFloat(styles.gap || styles.columnGap || '0') || 0;
    }

    function computeStep() {
      const first = track.children[0];
      if (!first) return 0;
      const rect = first.getBoundingClientRect();
      return rect.width + getGapPx();
    }

    function setTransform(px, withTransition) {
      track.style.transition = withTransition ? `transform ${options.animMs}ms ease` : 'none';
      track.style.transform = `translateX(${-px}px)`;
    }

    function next() {
      if (isAnimating || !track.children.length) return;
      isAnimating = true;
      setTransform(stepPx, true);
    }

    function onTransitionEnd() {
      if (!track.children.length) return;
      track.appendChild(track.children[0]); // move first -> end
      setTransform(0, false);
      requestAnimationFrame(() => { isAnimating = false; });
    }

    function start() {
      stop();
      timer = setInterval(next, options.interval);
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function recalc() {
      const prevTransition = track.style.transition;
      const prevTransform = track.style.transform;
      track.style.transition = 'none';
      track.style.transform = 'translateX(0)';
      stepPx = computeStep();
      track.style.transition = prevTransition;
      track.style.transform = prevTransform || 'translateX(0)';
    }

    // Pause on hover
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    // Recalculate on resize
    const onResize = () => recalc();
    window.addEventListener('resize', onResize);

    // Optional: pause when off-screen for performance
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) start(); else stop();
      });
    }, { threshold: 0.1 });
    io.observe(root);

    // Events
    track.addEventListener('transitionend', onTransitionEnd);

    // Init
    recalc();
    start();

    // Public instance API
    return {
      root,
      start,
      stop,
      recalc,
      next,
      destroy() {
        stop();
        io.disconnect();
        window.removeEventListener('resize', onResize);
        root.removeEventListener('mouseenter', stop);
        root.removeEventListener('mouseleave', start);
        track.removeEventListener('transitionend', onTransitionEnd);
        track.style.transition = '';
        track.style.transform = '';
      }
    };
  }

  function autoInit(selector) {
    const sel = selector || '[data-carousel]';
    const nodes = Array.from(document.querySelectorAll(sel));
    return nodes.map(node => {
      const interval = parseInt(node.getAttribute('data-interval') || '2000', 10);
      const animMs  = parseInt(node.getAttribute('data-anim') || '500', 10);
      return createCarousel(node, { interval, animMs });
    });
  }

  // Expose globals
  window.createCarousel = createCarousel;
  window.autoInit = autoInit;
})();
