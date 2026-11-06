/* مدارك | وضع العرض الصفي - مستقل عن صفحات الدروس والاختبارات */
(function () {
  "use strict";
  var session = null;
  var slideNames = ["نبدأ الدرس", "ألاحظ وأتساءل", "أكتشف الفكرة", "أتعلم بالمثال", "خطوات الحل", "نتعاون ونطبق", "أتحقق من فهمي", "نختتم الدرس"];
  var gradeNames = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس"];
  var numeral = "٠١٢٣٤٥٦٧٨٩";

  function digits(value) {
    return String(value).replace(/[0-9]/g, function (n) { return numeral[Number(n)]; });
  }
  function safe(value) {
    return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function taskFor(i, n) {
    var all = window.MADAREK_PAPER_TASKS;
    return Array.isArray(all) && Array.isArray(all[i]) && Array.isArray(all[i][n]) ? all[i][n] : null;
  }
  function classroomText(value) {
    return String(value == null ? "" : value)
      .replace(/([٠-٩0-9])[٬,](?=[٠-٩0-9])/g, "$1")
      .replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (ch) { return ch; })
      .replace(/\s*[.。]\s*$/g, "")
      .trim();
  }
  function expressionParts(values) {
    var parts = values.split(/\s*\+\s*/).map(function (term) { return classroomText(term); });
    return '<div class="mdc-math-terms" dir="rtl" aria-label="' + safe(parts.join(" زائد ")) + '">' +
      parts.map(function (part, i) {
        return '<span class="mdc-math-group">' +
          (i ? '<span class="mdc-math-plus" aria-hidden="true">+</span>' : '') +
          '<bdi class="mdc-math-term" dir="ltr">' + safe(part) + '</bdi></span>';
      }).join("") + '</div>';
  }
  function preparedExample(s) {
    var raw = window.mdMathText(s.example);
    var m = raw.match(/^([٠-٩0-9٬,]+)\s*=\s*([٠-٩0-9٬,\s+]+)$/);
    if (m && m[2].indexOf("+") >= 0) {
      var n = classroomText(m[1]);
      var addends = m[2].split(/\s*\+\s*/).map(classroomText);
      // الصيغة التحليلية: أظهر الآحاد في أقصى اليمين، ثم العشرات فالمئات.
      var number = function (t) { return Number(t.replace(/[٠-٩]/g, function (x) {return "٠١٢٣٤٥٦٧٨٩".indexOf(x)})); };
      var total = addends.reduce(function (a,b) { return a + number(b); }, 0);
      if (total === number(n)) {
        addends.sort(function(a,b){return number(a)-number(b)});
        return { question: 'اكتب العدد ' + n + ' بالصيغة التحليلية',
          answer: '<div class="mdc-math-block"><div class="mdc-equals-heading" dir="rtl"><bdi dir="ltr">' +
            safe(n) + '</bdi><span>يساوي</span></div>' +
            expressionParts(addends.join(" + ")) + '</div>' };
      }
    }
    return {question:"كيف نصل إلى الحل؟",
      answer:'<div class="mdc-ordinary-answer" dir="rtl">' + window.mdMathHTML(raw) + '</div>'};
  }
  function revealCard(content, trustedAnswerHtml) {
    return '<div class="mdc-reveal">' +
      '<button type="button" class="mdc-reveal-button" data-mdc="reveal" aria-expanded="false">إظهار الإجابة</button>' +
      '<div class="mdc-answer" data-mdc-answer hidden><span>الإجابة النموذجية</span>' +
      (trustedAnswerHtml || '<strong class="mdc-ordinary-answer">' + window.mdMathHTML(content) + '</strong>') +
      '</div></div>';
  }
  function slideHtml() {
    var s = SKILLS[session.skillId];
    var index = session.slide;
    var steps = Array.isArray(s.steps) ? s.steps : [];
    if (index === 0) {
      return '<div class="mdc-cover"><span class="mdc-sup">الفصل الدراسي الأول · الصف ' + safe(gradeNames[s.g-1]) +
        ' الابتدائي</span><h1>' + safe(s.title) + '</h1><div class="mdc-cover-line"></div>' +
        '<p>بعقولنا نفكّر، وبفضولنا نكتشف</p><div class="mdc-path">ألاحظ <span>●</span> أفهم <span>●</span> أطبق <span>●</span> أتحقق</div></div>';
    }
    if (index === 1) {
      var teaser = typeof TEASER_QUESTIONS !== "undefined" ? TEASER_QUESTIONS[session.skillId] : "";
      return '<div class="mdc-center"><div class="mdc-kicker">فكّر قبل أن تجيب</div>' +
        '<h2 class="mdc-prompt">' + window.mdMathHTML(teaser || s.q || "ما الذي تعرفه عن هذه المهارة؟") + '</h2>' +
        '<p class="mdc-small-note">استمع إلى أفكار زملائك، ثم ناقشوا الإجابات مع المعلمة.</p></div>';
    }
    if (index === 2) {
      return '<div class="mdc-center"><div class="mdc-kicker">الفكرة الأساسية</div>' +
        '<div class="mdc-big-card"><h2>' + window.mdMathHTML(s.idea) + '</h2></div>' +
        '<p class="mdc-small-note">عبّر عن الفكرة بطريقتك.</p></div>';
    }
    if (index === 3) {
      var example = preparedExample(s);
      return '<div class="mdc-center"><div class="mdc-kicker">مثال من الدرس</div>' +
        '<h2 class="mdc-work-question">' + safe(example.question) + '</h2>' +
        '<p class="mdc-small-note">فكّر في الحل وناقشه، ثم أظهر الإجابة أسفل السؤال.</p>' +
        revealCard(s.example, example.answer) + '</div>';
    }
    if (index === 4) {
      return '<div class="mdc-center"><div class="mdc-kicker">خطوات الفهم</div>' +
        '<ol class="mdc-steps">' + steps.map(function (st,j) {
          return '<li><span>' + digits(j+1) + '</span><strong>' + window.mdMathHTML(st) + '</strong></li>';
        }).join("") + '</ol></div>';
    }
    if (index === 5 || index === 6) {
      var pair = taskFor(session.skillId, index === 5 ? 0 : 1);
      var question = pair ? pair[0] : (s.q || "اشرح كيف توصلت إلى الحل.");
      var answer = pair ? pair[1] : (s.why || s.example);
      return '<div class="mdc-center mdc-practice"><div class="mdc-kicker">' +
        (index === 5 ? 'نشاط جماعي' : 'تقويم سريع') + '</div>' +
        '<h2 class="mdc-prompt">' + window.mdMathHTML(question) + '</h2>' +
        '<p class="mdc-small-note">' + (index === 5 ? 'فكّر، وناقش، ثم شارك حلك.' : 'أجب بنفسك قبل إظهار الإجابة.') +
        '</p>' + revealCard(answer) + '</div>';
    }
    return '<div class="mdc-center mdc-finish"><span class="mdc-finish-star" aria-hidden="true">✦</span>' +
      '<h2>أحسنتم!</h2><p class="mdc-finish-learn">' + window.mdMathHTML(s.idea) + '</p>' +
      '<button type="button" class="mdc-start-test" data-mdc="assessment">الانتقال إلى اختبار المهارة</button></div>';
  }
  function render() {
    if (!session || !document.getElementById("madarek-classroom")) return;
    var root = document.getElementById("madarek-classroom");
    root.querySelector("#mdc-slide-body").innerHTML = slideHtml();
    root.querySelector("#mdc-phase").textContent = slideNames[session.slide];
    root.querySelector("#mdc-number").textContent = 'الشريحة ' + digits(session.slide + 1) + ' من ' + digits(slideNames.length);
    root.querySelector("#mdc-progress-fill").style.width = ((session.slide+1) / slideNames.length * 100) + "%";
    root.querySelector('[data-mdc="previous"]').disabled = session.slide === 0;
    var next = root.querySelector('[data-mdc="next"]');
    next.disabled = session.slide === slideNames.length - 1;
    next.textContent = session.slide === slideNames.length-2 ? "إلى الختام" : "التالي ←";
    root.querySelector("#mdc-slide-body").scrollTop = 0;
  }
  function changeSlide(value) {
    if (!session) return;
    var next = Math.max(0, Math.min(slideNames.length - 1, session.slide + value));
    if (session.slide !== next) { session.slide = next; render(); }
  }
  function closeClassroom() {
    if (!session) return;
    var state = session;
    session = null;
    if (document.fullscreenElement === state.overlay && document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    }
    state.overlay.remove();
    document.body.style.overflow = state.bodyOverflow;
    document.documentElement.style.overflow = state.htmlOverflow;
    if (state.previousFocus && state.previousFocus.isConnected) state.previousFocus.focus();
  }
  function keyHandler(event) {
    if (!session || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "Escape") { event.preventDefault(); closeClassroom(); }
    else if (event.key === "ArrowLeft" || event.key === "PageDown") { event.preventDefault(); changeSlide(1); }
    else if (event.key === "ArrowRight" || event.key === "PageUp") { event.preventDefault(); changeSlide(-1); }
    else if (event.key === "Home") { event.preventDefault(); session.slide=0; render(); }
    else if (event.key === "End") { event.preventDefault(); session.slide=slideNames.length-1; render(); }
  }
  function openClassroom(id) {
    if (typeof SKILLS === "undefined" || !SKILLS[id] || !Number.isInteger(Number(id))) return;
    closeClassroom();
    var overlay = document.createElement("section");
    overlay.id = "madarek-classroom";
    overlay.className = "mdc-shell";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "العرض الصفي لدرس " + SKILLS[id].title);
    overlay.setAttribute("dir", "rtl");
    overlay.innerHTML =
      '<header class="mdc-top"><div class="mdc-brand"><span class="mdc-mark">م</span><div><strong>مدارك</strong><small>عرض الدرس على الشاشة</small></div></div>' +
      '<div class="mdc-top-mid" id="mdc-phase"></div>' +
      '<div class="mdc-top-buttons"><button type="button" data-mdc="fullscreen" title="ملء الشاشة">⛶ <span>تكبير</span></button>' +
      '<button type="button" data-mdc="close" title="العودة إلى مدارك">✕ <span>إنهاء العرض</span></button></div></header>' +
      '<main class="mdc-main" id="mdc-slide-body" aria-live="polite"></main>' +
      '<footer class="mdc-bottom"><div class="mdc-nav">' +
      '<button type="button" class="mdc-prev" data-mdc="previous">→ السابق</button>' +
      '<div class="mdc-position"><span id="mdc-number"></span><div class="mdc-progress"><div id="mdc-progress-fill"></div></div></div>' +
      '<button type="button" class="mdc-next" data-mdc="next">التالي ←</button>' +
      '</div><div class="mdc-credit">إعداد وتنفيذ: أ. ابتهال الحجيلي</div></footer>';
    session = {skillId:Number(id),slide:0,overlay:overlay,bodyOverflow:document.body.style.overflow,
      htmlOverflow:document.documentElement.style.overflow,previousFocus:document.activeElement};
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    overlay.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-mdc]");
      if (!button) return;
      var action = button.getAttribute("data-mdc");
      if (action === "close") closeClassroom();
      if (action === "previous") changeSlide(-1);
      if (action === "next") changeSlide(1);
      if (action === "reveal") {
        var container = button.closest(".mdc-reveal");
        var answer = container && container.querySelector("[data-mdc-answer]");
        if (answer) {
          answer.hidden = !answer.hidden;
          var open = !answer.hidden;
          button.textContent = open ? "إخفاء الإجابة" : "إظهار الإجابة";
          button.setAttribute("aria-expanded", String(open));
        }
      }
      if (action === "assessment") {
        var index = session ? session.skillId : null;
        closeClassroom();
        if (index !== null && typeof window.startAssessment === "function") window.startAssessment(index);
      }
      if (action === "fullscreen") {
        if (document.fullscreenElement === overlay && document.exitFullscreen) {
          document.exitFullscreen().catch(function(){});
        } else if (overlay.requestFullscreen) overlay.requestFullscreen().catch(function(){});
      }
    });
    render();
    overlay.querySelector('[data-mdc="close"]').focus();
  }
  document.addEventListener("keydown", keyHandler);
  window.openClassroom = openClassroom;
  window.closeClassroom = closeClassroom;
})();