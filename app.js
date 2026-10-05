/* Outlier USA — Help Center behaviour (same behaviour as the Backdraft page)
   Search that answers, animated FAQ, deep links, section nav, back to top.
   Everything works without it: answers are plain <details>. */
(function () {
  'use strict';

  var root = document.querySelector('.hc-root');
  if (!root) return;

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $  = function (s, c) { return (c || root).querySelector(s); };
  var $$ = function (s, c) {
    return Array.prototype.slice.call((c || root).querySelectorAll(s));
  };

  root.classList.add('hc-js');
  if (!reduced) {
    root.classList.add('hc-motion');
    $$('.hc-tiles .hc-tile').forEach(function (el, i) { el.style.setProperty('--i', i); });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { root.classList.add('is-loaded'); });
    });
    /* After the entrance, tile hover goes back to its quick transition. */
    setTimeout(function () { root.classList.add('is-settled'); }, 1200);
  }

  /* ==================================================================
     Search — shows the answers, not just a count
     ================================================================== */
  var input       = $('#hc-q');
  var clearBtn    = $('#hc-search-clear');
  var status      = $('#hc-search-status');
  var results     = $('#hc-results');
  var resultsList = $('#hc-results-list');
  var tiles       = $('.hc-tiles');
  var heroCta     = $('.hc-hero-cta');

  /* Query and text are folded the same way, so punctuation, quotes,
     apostrophes and hyphens never decide a match: “twist rate”, isn't,
     16", bolt-action and Savage, all find their answers. */
  function fold(s) {
    return ' ' + s.toLowerCase()
      .replace(/['’‘`"“”″]/g, '')
      .replace(/[^a-z0-9.]+/g, ' ')
      .replace(/(^|\s)\.+|\.+(?=\s|$)/g, ' ')
      .replace(/\s+/g, ' ').trim() + ' ';
  }

  /* Words a question is made of, not what it is about. Dropped unless
     they are all there is. */
  var STOP = ' a an and are can could do does for from how i if in is it its me my of on or should the to was what when where which who why will with you your ';

  var answers = $$('.hc-faq-item').map(function (d) {
    var q = $('summary', d).textContent.trim();
    var cat = d.closest('.hc-faq-cat');
    var catTitle = cat ? $('.hc-faq-cat-title', cat).textContent.trim() : '';
    return {
      id: d.id, title: q, cat: catTitle, html: $('.hc-faq-a', d).innerHTML,
      t: fold(q), hay: fold(catTitle + ' ' + d.textContent)
    };
  });

  /* Every key word must be there (strict), or — when nothing has them
     all — as many as possible (loose). A word in the question beats one
     buried in the answer; the small words only break ties. */
  function score(rec, keys, all, loose) {
    var total = 0, found = 0;
    for (var i = 0; i < keys.length; i++) {
      if (rec.hay.indexOf(keys[i]) === -1) { if (!loose) return 0; continue; }
      found++;
      total += rec.t.indexOf(keys[i]) !== -1 ? 10 : 1;
    }
    if (!found) return 0;
    for (var j = 0; j < all.length; j++) {
      if (rec.t.indexOf(' ' + all[j] + ' ') !== -1) total += 0.5;
    }
    return total + found * 20;
  }

  function clearSearch() {
    results.hidden = true;
    resultsList.innerHTML = '';
    status.textContent = '';
    tiles.hidden = false;
    heroCta.hidden = false;
  }

  function answerBlock(rec, open) {
    var d = document.createElement('details');
    d.className = 'hc-result';
    if (open) d.open = true;
    var sum = document.createElement('summary');
    sum.textContent = rec.title;
    var body = document.createElement('div');
    body.className = 'hc-result-body';
    body.innerHTML = rec.html;
    var more = document.createElement('p');
    more.className = 'hc-result-more';
    var a = document.createElement('a');
    a.className = 'hc-link';
    a.href = '#' + rec.id;
    a.textContent = 'See this in ' + (rec.cat || 'the FAQ');
    more.appendChild(a);
    body.appendChild(more);
    d.appendChild(sum);
    d.appendChild(body);
    return d;
  }

  function rank(keys, all, loose) {
    return answers
      .map(function (r) { return { r: r, s: score(r, keys, all, loose) }; })
      .filter(function (h) { return h.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 6)
      .map(function (h) { return h.r; });
  }

  function runSearch(raw) {
    var all = fold(raw).split(' ').filter(Boolean);
    if (!all.length) { clearSearch(); return; }
    var keys = all.filter(function (w) { return STOP.indexOf(' ' + w + ' ') === -1; });
    if (!keys.length) keys = all;

    tiles.hidden = true;
    heroCta.hidden = true;
    var hits = rank(keys, all, false);
    if (!hits.length && keys.length > 1) hits = rank(keys, all, true);

    resultsList.innerHTML = '';
    hits.forEach(function (rec, i) { resultsList.appendChild(answerBlock(rec, i === 0)); });

    if (!hits.length) {
      var none = document.createElement('p');
      none.className = 'hc-result-none';
      none.textContent = 'Nothing matches that. Try a different word, or browse the questions below.';
      resultsList.appendChild(none);
      status.textContent = 'No matches for “' + raw + '”.';
    } else {
      status.textContent = hits.length + (hits.length === 1 ? ' answer' : ' answers');
    }
    results.hidden = false;
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  if (input) {
    input.addEventListener('input', debounce(function () {
      var v = input.value.trim();
      clearBtn.hidden = v === '';
      runSearch(v);
    }, 140));
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { input.value = ''; clearBtn.hidden = true; clearSearch(); }
    });
    clearBtn.addEventListener('click', function () {
      input.value = '';
      clearBtn.hidden = true;
      clearSearch();
      input.focus();
    });
  }

  /* ==================================================================
     FAQ — animated open and close
     ================================================================== */
  if (!reduced) {
    $$('.hc-faq-item').forEach(function (d) {
      var summary = $('summary', d);
      var inner = $('.hc-faq-a', d);

      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (d.classList.contains('is-animating')) return;

        var opening = !d.open;
        d.classList.add('is-animating');
        if (opening) d.open = true;

        var target = opening ? inner.scrollHeight : 0;
        inner.style.height = (opening ? 0 : inner.scrollHeight) + 'px';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { inner.style.height = target + 'px'; });
        });

        var fallback;
        var done = function (ev) {
          if (ev && ev.propertyName !== 'height') return;
          inner.removeEventListener('transitionend', done);
          clearTimeout(fallback);
          inner.style.height = '';
          d.classList.remove('is-animating');
          if (!opening) d.open = false;
        };
        fallback = setTimeout(done, 450);
        inner.addEventListener('transitionend', done);
      });
    });
  }

  $$('[data-expand], [data-collapse]').forEach(function (btn) {
    var open = btn.hasAttribute('data-expand');
    var scope = $(btn.getAttribute(open ? 'data-expand' : 'data-collapse'));
    btn.addEventListener('click', function () {
      $$('.hc-faq-item', scope).forEach(function (d) { d.open = open; });
    });
  });

  /* ==================================================================
     Deep links — a linked answer opens itself
     ================================================================== */
  function showAll(scope) {
    $$('.hc-reveal', scope).forEach(function (r) { r.classList.add('is-in'); });
  }

  function openFromHash() {
    var id = window.location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el || !root.contains(el)) return;
    showAll(el.closest('.hc-section') || root);
    if (el.tagName === 'DETAILS') {
      el.open = true;
      el.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    }
  }
  window.addEventListener('hashchange', openFromHash);

  /* ==================================================================
     Reload keeps your place — scroll position and open answers.
     Browsers restore the scroll on their own, but not the open answers,
     so the page came back shorter and the place drifted. On a reload or
     Back the saved place wins; a fresh visit still starts at the top or
     at its #link.
     ================================================================== */
  var placeKey = 'hc-place:' + window.location.pathname;
  var store = null;
  try { store = window.sessionStorage; } catch { store = null; }

  var navEntry = window.performance && performance.getEntriesByType ?
    performance.getEntriesByType('navigation')[0] : null;
  var returning = !!navEntry && (navEntry.type === 'reload' || navEntry.type === 'back_forward');

  var place = null;
  if (store && returning) {
    try { place = JSON.parse(store.getItem(placeKey)); } catch { place = null; }
  }

  if (store) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.addEventListener('pagehide', function () {
      try {
        store.setItem(placeKey, JSON.stringify({
          y: Math.round(window.scrollY),
          open: $$('.hc-faq-item[open]').map(function (d) { return d.id; }).filter(Boolean)
        }));
      } catch { /* storage full or blocked — the browser's own restore still applies */ }
    });
  }

  if (place) {
    (place.open || []).forEach(function (id) {
      var d = document.getElementById(id);
      if (d && d.tagName === 'DETAILS' && root.contains(d)) d.open = true;
    });
    var goBack = function () { window.scrollTo(0, place.y || 0); };
    goBack();
    /* Web fonts can still shift the layout; settle once more after load
       unless the reader has already moved. */
    window.addEventListener('load', function () {
      if (Math.abs(window.scrollY - (place.y || 0)) < 80) goBack();
    });
  } else {
    openFromHash();
  }

  /* ==================================================================
     Scroll reveal — only for what starts below the fold
     ================================================================== */
  if (!reduced && 'IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    ['.hc-section-head', '.hc-order-card', '.hc-cat-jump', '.hc-faq-cat-title', '.hc-contact-title', '.hc-contact-list']
      .forEach(function (sel) {
        var i = 0, prev = null;
        $$(sel).forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
          i = (prev && el.previousElementSibling === prev) ? Math.min(i + 1, 5) : 0;
          prev = el;
          el.style.setProperty('--i', i);
          el.classList.add('hc-reveal');
          revealObs.observe(el);
        });
      });
  }

  /* ==================================================================
     Section nav — shadow once stuck, underline what you're reading
     ================================================================== */
  var pageNav = $('.hc-page-nav');
  if (pageNav) {
    window.addEventListener('scroll', function () {
      pageNav.classList.toggle('is-stuck', pageNav.getBoundingClientRect().top <= 0);
    }, { passive: true });

    var links = $$('a', pageNav);
    if ('IntersectionObserver' in window) {
      var linkFor = {};
      links.forEach(function (a) {
        var sec = document.getElementById(a.getAttribute('href').slice(1));
        if (sec) linkFor[sec.id] = a;
      });
      var secObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) { a.classList.remove('is-active'); });
          linkFor[en.target.id].classList.add('is-active');
        });
      }, { rootMargin: '-56px 0px -72% 0px' });
      Object.keys(linkFor).forEach(function (id) {
        secObs.observe(document.getElementById(id));
      });
    }
  }

  /* ==================================================================
     Back to top
     ================================================================== */
  var toTop = $('#hc-to-top');
  if (toTop) {
    toTop.hidden = false;
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('is-shown', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      root.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  }
})();
