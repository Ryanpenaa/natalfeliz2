/* First-party Meta Pixel for the Natal sales page.
 * Events are sent for actual outbound checkout navigation, not modal opening.
 * No one-event-per-session lock: different plan choices remain independent.
 */
(function () {
  "use strict";
  var PIXEL_ID = "1894651341979721";
  var PRODUCT_ID = "d6dbd071-7dc8-4d9e-a236-a57f075831db";
  var plans = {
    VCCL1O8SCQ5T: 27.90,
    VCCL1O8SCQ5S: 18.90,
    VCCL1O8SCQ5U: 12.90
  };
  if (window.__natalMetaPixelLoaded) return;
  window.__natalMetaPixelLoaded = true;
  !function(f,b,e,v,n,t,s){
    if(f.fbq)return;
    n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments);};
    if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=true;n.version="2.0";n.queue=[];
    t=b.createElement(e);t.async=true;t.src=v;
    s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
  }(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init",PIXEL_ID);
  window.fbq("trackSingle",PIXEL_ID,"PageView");
  window.fbq("trackSingle",PIXEL_ID,"ViewContent",{
    content_ids:[PRODUCT_ID],content_type:"product"
  });
  // Capture phase also works for React-hydrated links and clicks on nested icons.
  document.addEventListener("click",function(event){
    var node=event.target;
    if(!node || typeof node.closest!=="function")return;
    var a=node.closest("a[href]");
    if(!a || event.defaultPrevented)return;
    var url;
    try{url=new URL(a.href,location.href);}catch(e){return;}
    if(url.hostname!=="checkout.evangelhokids.cloud")return;
    var code=url.pathname.slice(1);
    if(!Object.prototype.hasOwnProperty.call(plans,code))return;
    window.fbq("trackSingle",PIXEL_ID,"InitiateCheckout",{
      value:plans[code],currency:"BRL",content_type:"product",
      content_ids:[PRODUCT_ID]
    });
    // Give the browser a brief chance to dispatch the pixel request before
    // same-tab checkout navigation; never disable either plan or popup choice.
    if(event.button===0 && !event.ctrlKey && !event.metaKey &&
       !event.shiftKey && !event.altKey && !a.hasAttribute("download") &&
       (!a.target || a.target==="_self")){
      event.preventDefault();
      setTimeout(function(){location.assign(a.href);},200);
    }
  },true);
})();
