/* مدارك: اختبارات رجعية للتنسيق الرياضي.
   لا تُحمّل في الموقع. تُشغّل عند تحديث بنك الأسئلة أو أسلوب العرض. */
(function(){
 'use strict';
 function audit(skills, format, normalize) {
   var issues=[],checked=0;
   function must(ok,what){if(!ok)issues.push(what);}
   must(Array.isArray(skills)&&skills.length>=1,'بيانات المهارات غير موجودة');
   if(!Array.isArray(skills))return {issues:issues,checked:0};
   skills.forEach(function(skill,i){
     must(Array.isArray(skill.questions)&&skill.questions.length===6,'عدد أسئلة المهارة '+i);
     (skill.questions||[]).forEach(function(q,j){
       checked++;
       var name=i+'/'+j;
       must(Array.isArray(q.opts)&&q.opts.length===3,'عدد خيارات '+name);
       must(Number.isInteger(q.right)&&q.right>=0&&q.right<q.opts.length,'مفتاح الإجابة '+name);
       must(new Set(q.opts).size===q.opts.length,'خيارات مكررة '+name);
       [q.q].concat(q.opts,q.hint,q.why).forEach(function(s,k){
         var rendered=format(s,{context:q.q});
         must(!rendered.includes('٬')&&!rendered.includes('>٬'), 'فاصلة الألوف '+name+'/'+k);
         must(!/[0-9]/.test(rendered),'أرقام غير عربية '+name+'/'+k);
         if(/[٠-٩]/.test(s))must(rendered.includes('md-math-number'),'رقم غير معزول '+name+'/'+k);
       });
     });
   });
   var q=skills.find(function(s){return s.questions.some(function(x){return x.q.indexOf('الصورة التحليلية للعدد')>=0;});});
   must(!!q,'سؤال الصيغة التحليلية مفقود');
   if(q){
     var x=q.questions.find(function(y){return y.q.indexOf('الصورة التحليلية للعدد')>=0;});
     var rendered=format(x.opts[x.right],{context:x.q});
     var tokens=Array.from(rendered.matchAll(/md-math-number" dir="ltr">([^<]+)<\/bdi>/g)).map(function(m){return m[1];});
     must(tokens.join('|')==='٦|٣٠٠|٢٠٠٠|٤٠٠٠٠','ترتيب الآحاد والمنازل في سؤال التحليل');
   }
   var eg=format('٢٣٬٤١٥ = ٢٠٬٠٠٠ + ٣٬٠٠٠ + ٤٠٠ + ١٠ + ٥.',{decomposition:true});
   must(eg.includes('md-math-decomposition-head')&&eg.includes('يساوي'),'عرض العدد وكلمة يساوي');
   var egParts=Array.from(eg.matchAll(/md-math-number" dir="ltr">([^<]+)<\/bdi>/g)).map(function(m){return m[1];});
   must(egParts.join('|')==='٢٣٤١٥|٥|١٠|٤٠٠|٣٠٠٠|٢٠٠٠٠','عرض المثال كما اعتمدته المعلمة');
   must(normalize('٤٢٬٣٠٦.')==='٤٢٣٠٦','حذف فاصلة الآلاف والنقطة بعد الرقم');
   must(format('١٫٢٥').includes('١٫٢٥'),'عدم حذف الفاصلة العشرية الصحيحة');
   return {passed:issues.length===0,checked:checked,issues:issues};
 }
 if(typeof window!=='undefined')window.runMadarekMathRegression=audit;
})();