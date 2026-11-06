/* مدارك: طبقة تنسيق موحدة للأرقام والعمليات العربية.
   تحفظ نص السؤال والبيانات الأصلية ولا تغير الإجابة الصحيحة. */
(function () {
  'use strict';
  var arDigits = '٠١٢٣٤٥٦٧٨٩';
  function escapeText(x) {
    return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function normalize(value) {
    return String(value == null ? '' : value)
      .replace(/[0-9]/g,function(d){return arDigits[Number(d)];})
      .replace(/[۰-۹]/g,function(d){return arDigits[d.charCodeAt(0)-1776];})
      .replace(/[٠-٩]+(?:[٬,][٠-٩]{3})+/g,function(n){return n.replace(/[٬,]/g,'');})
      .replace(/([٠-٩])\.(?=\s*(?:$|[»”)\]؟،؛]))/g,'$1');
  }
  function numberValue(s) {
    var v=normalize(s).replace(/[٠-٩]/g,function(d){return String(arDigits.indexOf(d));})
      .replace(/٫/g,'.');
    return Number(v);
  }
  var numeric = '[٠-٩]+(?:[٫][٠-٩]+)?';
  var exprPattern = new RegExp(numeric+'(?:\\s*[+−\\-×÷=<>]\\s*'+numeric+')+','g');
  var fullExprPattern = new RegExp('^\\s*'+numeric+'(?:\\s*[+−\\-×÷=<>]\\s*'+numeric+')+\\s*$');
  function numberHTML(str) {
    return '<bdi class="md-math-number" dir="ltr">'+escapeText(str)+'</bdi>';
  }
  function textHTML(str) {
    return escapeText(str).replace(/[٠-٩]+(?:[٫][٠-٩]+)?/g,function(n){return numberHTML(n);});
  }
  function renderExpression(raw, decomposition) {
    var chunks = raw.trim().split(/\s*([+−\-×÷=<>])\s*/).filter(Boolean);
    var numbers = [],ops = [];
    chunks.forEach(function(v,i){if(i%2===0)numbers.push(v);else ops.push(v);});
    var onlyAddition=ops.every(function(op){return op==='+';});
    if(decomposition && onlyAddition && numbers.length>=3) {
      numbers=numbers.slice().sort(function(a,b){return numberValue(a)-numberValue(b);});
      ops=new Array(numbers.length-1).fill('+');
    }
    var html = '<span class="md-math-expression" dir="rtl" aria-label="'+
      escapeText(numbers.map(function(v,i){return (i?({'+':' زائد ','−':' ناقص ','-':' ناقص ','×':' ضرب ','÷':' قسمة ','=':' يساوي ','>':' أكبر من ','<':' أصغر من '}[ops[i-1]]||' '+ops[i-1]+' '):'')+v;}).join(''))+'">';
    html+='<span class="md-math-expression-piece">'+numberHTML(numbers[0])+'</span>';
    for(var i=1;i<numbers.length;i++) {
      html+='<span class="md-math-expression-piece"><span class="md-math-operator" aria-hidden="true">'+escapeText(ops[i-1])+'</span>'+numberHTML(numbers[i])+'</span>';
    }
    return html+'</span>';
  }
  function format(value, options) {
    var raw=normalize(value);
    var context=options&&options.context?String(options.context):'';
    var decomposition=Boolean(options&&options.decomposition)||/الصورة التحليلية|الصيغة التحليلية/.test(context);
    // في جملة العدد والصيغة التحليلية، يُعرض السؤال أعلى الحل وليس إلى جواره.
    if(decomposition) {
      var m=raw.match(/^([٠-٩]+)\s*=\s*(.+)$/);
      if(m&&fullExprPattern.test(m[2])&&m[2].indexOf('+')!==-1){
        var terms=m[2].split(/\s*\+\s*/);
        if(terms.length>=3&&terms.every(function(t){return Number.isFinite(numberValue(t));})) {
          return '<span class="md-math-decomposition"><span class="md-math-decomposition-head">'+
            numberHTML(m[1])+' <span>يساوي</span></span>'+renderExpression(m[2],true)+'</span>';
        }
      }
    }
    var html='', cursor=0;
    exprPattern.lastIndex=0;
    var m;
    while((m=exprPattern.exec(raw))!==null) {
      if(m.index>cursor)html+=textHTML(raw.slice(cursor,m.index));
      html+=renderExpression(m[0],decomposition);
      cursor=m.index+m[0].length;
    }
    html+=textHTML(raw.slice(cursor));
    return html;
  }
  window.mdMathHTML=format;
  window.mdMathText=normalize;
})();