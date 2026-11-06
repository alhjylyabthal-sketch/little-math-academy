
/* مدارك — أبواب مستقلة: شرح، تقويم، مفردات، أدوات معلمة.
   لا تغيّر بيانات المهارات ولا سجل نتائج الطالب. */
(function(){
"use strict";
const icons={
 lessons:'<path d="M12 6.6c-2.5-1.8-5.4-2.1-8.5-1.6v13c3.2-.5 6 .1 8.5 1.8m0-13.2c2.5-1.8 5.4-2.1 8.5-1.6v13c-3.2-.5-6 .1-8.5 1.8m0-13.2v13.2"/>',
 tests:'<path d="M9 4h6l1 2h3v15H5V6h3l1-2Z"/><path d="m8 12 2.1 2.1 4-4.1M8 18h8"/>',
 words:'<path d="M5 5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M8 9h8M8 13h6"/>',
 teacher:'<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 12h16M10 12v2h4v-2"/>'
};
const doors=[
 ['lessons','الدروس','أفهم الفكرة والأمثلة وخطوات الحل','goGradeSkills()'],
 ['tests','الاختبارات','أجيب عن أسئلة مستقلة وأرى نتيجتي','goTests()'],
 ['words','أفهم المسألة','أتعلم المفردات ومعانيها في سياقها','goWords()'],
 ['teacher','أدوات المعلمة','خطط التنفيذ والبطاقات القابلة للطباعة','goTeacherTools()']
];
function pic(k){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[k]+'</svg>';}
function pageRows(forTests){
 const options=SKILLS.map((s,i)=>({s,i})).filter(x=>x.s.g===selectedGrade+1);
 return options.map(({s,i},j)=>'<article class="mdp-skill"><div class="mdp-step">'+fmt(j+1)+'</div><div class="mdp-skill-body"><h3>'+esc(s.title)+'</h3>'+(!forTests?'<p>'+esc(s.idea)+'</p>':'<p>تقويم مستقل • ستة أسئلة • نتيجة بعد الإكمال</p>')+'</div><button class="btn '+(forTests?'gold':'')+'" type="button" onclick="'+(forTests?'startAssessment('+i+')':'openSkill('+i+')')+'">'+(forTests?'ابدأ الاختبار':'افتح الدرس')+'</button></article>').join('');
}
function gradeBar(callback){
 return '<div class="mdp-gradebar" aria-label="اختيار الصف">'+GRADES.map((g,i)=>'<button type="button" class="'+(selectedGrade===i?'chosen':'')+'" onclick="'+callback+'('+i+')">الصف '+g+'</button>').join('')+'</div>';
}
goHome=function(){
 activeId=null;
 const tiles=doors.map(([id,title,description,action])=>'<button type="button" class="mdp-door mdp-door--'+id+'" onclick="'+action+'" aria-label="'+title+'"><span class="mdp-door-symbol">'+pic(id)+'</span><strong>'+title+'</strong><span class="mdp-door-desc">'+description+'</span></button>').join('');
 mount('<div class="mdp-home"><div class="mdp-mast"><img class="mdp-person" src="./approved-girl.webp" width="340" height="400" alt="شخصية الطالبة المعتمدة"><img class="mdp-brand" src="./approved-center.webp" width="550" height="410" alt="مدارك: بعقولنا نفكر وبفضولنا نكتشف"><img class="mdp-person" src="./approved-boy.webp" width="340" height="400" alt="شخصية الطالب المعتمدة"></div><section class="mdp-hub" aria-label="أقسام مدارك"><h1>اختاري وجهتك في مدارك</h1><p>أربعة أقسام، ولكل قسم محتواه الخاص</p><div class="mdp-doorgrid">'+tiles+'</div></section></div>','home','home');
};
goGradeSkills=function(){
 activeId=null;
 mount('<div class="shell mdp-section">'+pageHeading('الدروس','دروس الصف '+GRADES[selectedGrade],'شرح الفكرة والأمثلة والخطوات، دون عرض أسئلة الاختبار')+'<section class="panel"><h2>اختاري الصف</h2>'+gradeBar('setGrade')+'</section><section class="panel"><h2>دروس الفصل الدراسي الأول</h2><div class="mdp-skilllist">'+pageRows(false)+'</div></section></div>','skills','grades');
};
openSkill=function(i){
 const s=SKILLS[i];if(!s)return; activeId=i; selectedGrade=s.g-1;
 const question=TEASER_QUESTIONS[i]||'ما الفكرة التي تساعدنا على فهم هذه المهارة؟';
 mount('<div class="shell mdp-section"><header class="lessonhead"><div><span class="bubble">الصف '+GRADES[s.g-1]+' • الفصل الأول</span><h1>'+esc(s.title)+'</h1><p>صفحة للفهم والشرح فقط</p></div><div class="lessonbadge">'+SKILL_ICONS[i%6]+'</div></header><section class="panel lesson-card"><h2>ألاحظ وأتساءل</h2><div class="teaser"><p>'+esc(question)+'</p></div></section><section class="panel lesson-card"><h2>أفهم الفكرة</h2><div class="lessonGoal">'+esc(s.idea)+'</div><div class="layout"><div class="mini cream"><h3>مثال من الدرس</h3><p>'+esc(s.example)+'</p></div><div class="mini"><h3>أين أستخدم هذه المهارة؟</h3><p>'+esc(s.intro||'أفهم المعطيات وأحدد المطلوب ثم أختار طريقة الحل المناسبة.')+'</p></div></div><div class="spaced">'+lessonSVG(s)+'</div><h3>خطوات الفهم</h3><div class="liststeps">'+(s.steps||[]).map((v,j)=>'<div class="steptile"><span class="numcircle">'+fmt(j+1)+'</span>'+esc(v)+'</div>').join('')+'</div></section></div>','skills','skill');
};
function goTests(){
 activeId=null;
 mount('<div class="shell mdp-section">'+pageHeading('الاختبارات','اختبارات الصف '+GRADES[selectedGrade],'تقويم المهارات بأسئلة مستقلة ونتيجة لكل محاولة')+'<section class="panel"><h2>حددي الصف</h2>'+gradeBar('mdpTestGrade')+'</section><section class="panel"><h2>اختاري الاختبار</h2><div class="mdp-skilllist">'+pageRows(true)+'</div></section><div class="mdp-recordlink"><button class="btn outline" onclick="goRecord()">عرض سجل النتائج المحفوظة على هذا الجهاز</button></div></div>','tests','tests');
};
window.mdpTestGrade=function(i){selectedGrade=i;goTests();};
window.startAssessment=function(i){if(!SKILLS[i])return;activeId=i;selectedGrade=SKILLS[i].g-1;startQuiz();};
function goTeacherTools(){
 mount('<div class="shell mdp-section">'+pageHeading('أدوات المعلمة','مركز المعلمة','مواد للتنفيذ داخل الفصل، وليست أنشطة الطالب الرقمية')+'<div class="mdp-toolgrid"><article class="mdp-tool"><div class="mdp-toolmark">١</div><h2>انتظار بلا شاشة</h2><p>خطة حصة بحسب الصف والمهارة والوقت، مع بطاقات الطلاب والإجابات للمعلمة قابلة للطباعة أو الحفظ بصيغة PDF.</p><button class="btn gold" onclick="sfHome()">فتح الحقيبة الورقية</button></article><article class="mdp-tool"><div class="mdp-toolmark">٢</div><h2>دليل التنفيذ الصفي</h2><p>إرشادات لتنظيم الحصة والتعامل مع تعثر الطلاب وتوظيف الوسائل المحسوسة.</p><button class="btn" onclick="goGuide()">فتح دليل المعلمة</button></article></div></div>','guide','teacher-tools');
};
finishQuiz=function(){
 const s=SKILLS[activeId];if(!s)return;
 const score=answers.filter(x=>x.good).length,hints=answers.filter(x=>x.hints>0).length;
 saveLocal({grade:s.g,skill:s.title,score,hints,date:new Date().toLocaleDateString('ar-SA-u-ca-gregory-nu-arab')});
 mount('<div class="shell"><section class="panel resultWrap"><div class="resultStar">'+(score>=5?'🏆':'🌟')+'</div><h1>نتيجة الاختبار</h1><p>'+esc(s.title)+'</p><div class="score">'+fmt(score)+' من '+fmt(s.questions.length)+'</div><p>أجبت عن '+fmt(score)+' أسئلة إجابة صحيحة. '+(hints?'استخدمت تلميحات في '+fmt(hints)+' من الأسئلة.':'')+'</p><p class="tagline">النتيجة محفوظة في هذا المتصفح فقط.</p><div class="toolbar" style="justify-content:center"><button class="btn gold" onclick="startAssessment('+activeId+')">إعادة الاختبار</button><button class="btn outline" onclick="goTests()">العودة للاختبارات</button><button class="btn soft" onclick="goRecord()">سجل النتائج</button></div></section></div>','tests','result');
};
goBackInside=function(){
 if(currentSection==='quiz'||currentSection==='result'||currentSection==='record'){goTests();return;}
 if(currentSection==='skill'){goGradeSkills();return;}
 if(currentSection==='screenfree-detail'){sfHome();return;}
 if(currentSection==='screenfree'){goTeacherTools();return;}
 if(currentSection==='guide'){goTeacherTools();return;}
 goHome();
};
returnButton=function(place,section){
 const label=section==='quiz'||section==='result'||section==='record'?'العودة للاختبارات':section==='skill'?'العودة للدروس':section==='screenfree-detail'?'العودة لمهارات الحقيبة':section==='screenfree'||section==='guide'?'العودة لأدوات المعلمة':'العودة للرئيسية';
 return '<nav class="return-nav return-nav--'+place+'"><button type="button" class="return-button" onclick="goBackInside()"><span class="return-symbol">↩</span>'+label+'</button></nav>';
};
window.goTests=goTests;
window.goTeacherTools=goTeacherTools;
goHome();
})();
