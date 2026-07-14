(() => {
  const copy = {
    tr: {
      htmlLang: 'tr',
      pageTitle: 'Soner CIRIT',
      description:
        'gencturkler.co ve hurriyetpartisi.org BT Lideri | Kıdemli Yazılım Mühendisi ve Sistem Mimarı',
      switcherLabel: 'Dil değiştirici',
      bioPrefix: '',
      bioMiddle: ' ve ',
      bioSuffix: ' BT Lideri',
      roleLine: 'Kıdemli Yazılım Mühendisi ve Sistem Mimarı',
      social: 'SOSYAL',
      professional: 'PROFESYONEL',
      project: 'PROJE',
      contact: 'İLETİŞİM',
      filterAll: 'Tümü',
      socialFiltersLabel: 'Sosyal filtreleri',
      tagLive: 'Canlı',
      tagShorts: 'Kısa',
      tagThoughts: 'Düşünceler',
      href: '/',
    },
    en: {
      htmlLang: 'en',
      pageTitle: 'Soner CIRIT',
      description:
        'IT Lead at gencturkler.co and hurriyetpartisi.org | Senior Software Engineer and Systems Architect',
      switcherLabel: 'Language switcher',
      bioPrefix: 'IT Lead at ',
      bioMiddle: ' and ',
      bioSuffix: '',
      roleLine: 'Senior Software Engineer and Systems Architect',
      social: 'SOCIAL',
      professional: 'PROFESSIONAL',
      project: 'PROJECT',
      contact: 'CONTACT',
      filterAll: 'All',
      socialFiltersLabel: 'Social filters',
      tagLive: 'Live',
      tagShorts: 'Shorts',
      tagThoughts: 'Thoughts',
      href: 'en.html',
    },
  };

  const root = document.documentElement;
  const body = document.body;
  const switcher = document.querySelector('.lang-switch');
  const languageLinks = [...document.querySelectorAll('[data-lang-link]')];
  const translatables = [...document.querySelectorAll('[data-i18n]')];
  const metaDescription = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  const titleElement = document.querySelector('title');
  const reducedMotionQuery =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false };
  const SCRAMBLE_CHARS =
    'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZabcçdefgğhıijklmnoöprsştuüvyz0123456789<>/\\[]{}=+-_*';
  const DEFAULT_LANGUAGE = 'en';
  const LANGUAGE_PREFERENCE_KEY = 'sonercirit-language';

  let currentLanguage = getInitialLanguage();
  let switchingTimer = null;

  function getLanguageFromLocation() {
    const fileName = (window.location.pathname.split('/').pop() || '').toLowerCase();
    return fileName === 'en.html' ? 'en' : 'tr';
  }

  function getStoredLanguage() {
    try {
      const storedLanguage = window.localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
      return copy[storedLanguage] ? storedLanguage : null;
    } catch (error) {
      return null;
    }
  }

  function getBrowserLanguage() {
    const browserLanguages = Array.from(
      window.navigator.languages?.length
        ? window.navigator.languages
        : [window.navigator.language],
    );

    for (const locale of browserLanguages) {
      const language = String(locale || '')
        .toLowerCase()
        .split(/[-_]/)[0];

      if (copy[language]) {
        return language;
      }
    }

    return DEFAULT_LANGUAGE;
  }

  function getInitialLanguage() {
    const locationLanguage = getLanguageFromLocation();

    // en.html is an explicit language URL. The root is localized from the
    // visitor's saved choice or browser preferences.
    if (locationLanguage === 'en') {
      return locationLanguage;
    }

    return getStoredLanguage() || getBrowserLanguage();
  }

  function rememberLanguage(lang) {
    try {
      window.localStorage.setItem(LANGUAGE_PREFERENCE_KEY, lang);
    } catch (error) {
      // Language switching still works when storage is unavailable.
    }
  }

  function shouldHandleClick(event) {
    return !(
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    );
  }

  function randomChar(reference = '') {
    if (!reference || reference === ' ') {
      return reference;
    }

    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  }

  function scrambleText(element, targetText) {
    const sourceText = element.textContent || '';
    const token = (element._scrambleToken || 0) + 1;
    element._scrambleToken = token;

    if (element._scrambleFrame) {
      window.cancelAnimationFrame(element._scrambleFrame);
    }

    if (reducedMotionQuery.matches || sourceText === targetText) {
      element.textContent = targetText;
      element.classList.remove('scrambling');
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const length = Math.max(sourceText.length, targetText.length);
      const queue = Array.from({ length }, (_, index) => ({
        from: sourceText[index] || '',
        to: targetText[index] || '',
        start: Math.floor(Math.random() * 10),
        end: 28 + Math.floor(Math.random() * 18) + index * 1.1,
      }));

      let frame = 0;
      element.classList.add('scrambling');

      const update = () => {
        if (element._scrambleToken !== token) {
          element.classList.remove('scrambling');
          resolve();
          return;
        }

        let output = '';
        let complete = 0;

        for (const item of queue) {
          if (frame >= item.end) {
            complete += 1;
            output += item.to;
          } else if (frame >= item.start) {
            output += item.to === ' ' ? ' ' : randomChar(item.to || item.from);
          } else {
            output += item.from;
          }
        }

        element.textContent = output;

        if (complete === queue.length) {
          element.textContent = targetText;
          element.classList.remove('scrambling');
          resolve();
          return;
        }

        frame += 1;
        element._scrambleFrame = window.requestAnimationFrame(update);
      };

      update();
    });
  }

  function updateUiState(lang) {
    const nextCopy = copy[lang];

    root.dataset.currentLang = lang;
    root.lang = nextCopy.htmlLang;

    if (switcher) {
      switcher.setAttribute('aria-label', nextCopy.switcherLabel);
    }

    languageLinks.forEach((link) => {
      const isActive = link.dataset.langLink === lang;
      link.classList.toggle('active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (titleElement) {
      titleElement.textContent = nextCopy.pageTitle;
    }

    if (metaDescription) {
      metaDescription.setAttribute('content', nextCopy.description);
    }

    if (ogTitle) {
      ogTitle.setAttribute('content', nextCopy.pageTitle);
    }

    if (ogDescription) {
      ogDescription.setAttribute('content', nextCopy.description);
    }

    if (ogUrl) {
      ogUrl.setAttribute('content', window.location.href);
    }

    if (twitterTitle) {
      twitterTitle.setAttribute('content', nextCopy.pageTitle);
    }

    if (twitterDescription) {
      twitterDescription.setAttribute('content', nextCopy.description);
    }
  }

  function applyLanguage(lang, { animate = false } = {}) {
    if (!copy[lang]) {
      return;
    }

    const shouldAnimate = animate && currentLanguage !== lang && !reducedMotionQuery.matches;
    currentLanguage = lang;

    updateUiState(lang);

    if (switchingTimer) {
      window.clearTimeout(switchingTimer);
    }

    const tasks = translatables.map((element) => {
      const key = element.dataset.i18n;
      const nextText = copy[lang][key] ?? '';

      if (!shouldAnimate) {
        element.textContent = nextText;
        element.classList.remove('scrambling');
        return Promise.resolve();
      }

      return scrambleText(element, nextText);
    });

    body.classList.toggle('is-switching', shouldAnimate);

    if (!shouldAnimate) {
      return;
    }

    Promise.all(tasks).finally(() => {
      body.classList.remove('is-switching');
    });

    switchingTimer = window.setTimeout(() => {
      body.classList.remove('is-switching');
    }, 1400);
  }

  function replaceLanguageUrl(lang) {
    if (
      getLanguageFromLocation() === lang ||
      !window.history ||
      typeof window.history.replaceState !== 'function'
    ) {
      return;
    }

    try {
      window.history.replaceState({ lang }, '', copy[lang].href);
    } catch (error) {
      // Keep the current URL when the History API is restricted (for example, file://).
    }
  }

  function pushLanguageUrl(lang, href) {
    if (!window.history || typeof window.history.pushState !== 'function') {
      window.location.href = href;
      return false;
    }

    try {
      window.history.pushState({ lang }, '', href);
      return true;
    } catch (error) {
      window.location.href = href;
      return false;
    }
  }

  languageLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetLang = link.dataset.langLink;

      if (!copy[targetLang] || !shouldHandleClick(event)) {
        return;
      }

      rememberLanguage(targetLang);

      if (targetLang === currentLanguage) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      if (!pushLanguageUrl(targetLang, link.getAttribute('href') || copy[targetLang].href)) {
        return;
      }

      applyLanguage(targetLang, { animate: true });
    });
  });

  window.addEventListener('popstate', () => {
    applyLanguage(getLanguageFromLocation(), { animate: false });
  });

  replaceLanguageUrl(currentLanguage);
  applyLanguage(currentLanguage, { animate: false });
})();
