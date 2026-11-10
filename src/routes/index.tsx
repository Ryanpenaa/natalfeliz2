import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Gift, Heart, LockKeyhole, PackageCheck, Printer, Scissors, Sparkles, Star } from "lucide-react";

import { DisplayImage } from "@/components/display-image";

export const Route = createFileRoute("/")({
 component: Home,
 head: () => ({ meta: [
  { title: "Mini Lembranças de Natal | 50 Moldes para Imprimir" },
  { name: "description", content: "50 moldes de mini lembranças natalinas para imprimir, montar, presentear ou vender." },
  { property: "og:title", content: "Mini Lembranças de Natal | 50 Moldes para Imprimir" },
  { property: "og:description", content: "50 moldes de mini lembranças natalinas para imprimir, montar, presentear ou vender." },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
 ] }),
});

const occasions = [
  { icon: "🎓", title: "Escolas e professores", text: "Para alunos, colegas e equipes escolares." },
  { icon: "🛍️", title: "Comércios e clientes", text: "Um gesto especial de agradecimento." },
  { icon: "🏢", title: "Empresas e trabalho", text: "Para colaboradores e confraternizações." },
  { icon: "❤️", title: "Família e amigos", text: "Pequenos presentes com muito significado." },
  { icon: "⛪", title: "Igrejas e eventos", text: "Para encontros e celebrações natalinas." },
  { icon: "✨", title: "Para produzir e vender", text: "Ideias criativas para oferecer por encomenda." },
];
function formatRemaining(secondsRemaining: number) {
  const seconds = Math.max(0,Math.floor(secondsRemaining));
  return [Math.floor(seconds/60),seconds%60].map(n=>String(n).padStart(2,"0")).join(":");
}
function Button({children, onClick, outline=false, className=""}:{children:React.ReactNode;onClick:()=>void;outline?:boolean;className?:string}) {
 return <button type="button" onClick={onClick} className={`inline-flex min-h-13 items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold tracking-wide transition duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2c5943] ${outline?"border border-[#315740] text-[#315740] hover:bg-[#f1f5ee]":"bg-[#28533d] text-white shadow-[0_7px_18px_rgba(40,83,61,.18)] hover:bg-[#1d4330]"} ${className}`}>{children}<ArrowRight size={17}/></button>;
}
function Tag({children}:{children:React.ReactNode}) {return <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#edf1e9] px-4 py-2 text-xs font-bold tracking-[.15em] uppercase text-[#3b614b]">{children}</span>}
const carouselImages = {
 c: [1,2,3,4,5,6,7,8].map(i=>`/images/modelos/c${i}.webp`),
 m: [1,2,3,4,5,6,7,8,9].map(i=>`/images/modelos/m${i}.webp`),
};

function CarouselStrip({prefix,direction,label}:{prefix:"c"|"m";direction:"forward"|"backward";label:string}) {
 const images=carouselImages[prefix];
 const viewport=useRef<HTMLDivElement>(null);
 const position=useRef(images.length);
 const [nearViewport,setNearViewport]=useState(false);
 useEffect(()=>{
  const node=viewport.current;
  if(!node)return;
  if(!("IntersectionObserver" in window)){setNearViewport(true);return;}
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){setNearViewport(true);observer.disconnect();}
  },{rootMargin:"300px 0px"});
  observer.observe(node);
  return()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  const node=viewport.current;
  if(!node || images.length<2) return;
  const count=images.length;
  let timeout:number|undefined;
  const scrollToItem=(index:number,behavior:ScrollBehavior)=>{
   const el=node.children.item(index) as HTMLElement|null;
   if(!el)return;
   node.scrollTo({left:el.offsetLeft+el.offsetWidth/2-node.clientWidth/2,behavior});
  };
  const start=window.requestAnimationFrame(()=>{
   position.current=count;
   scrollToItem(count,"auto");
  });
  const interval=window.setInterval(()=>{
   const next=position.current+(direction==="forward"?1:-1);
   position.current=next;
   scrollToItem(next,"smooth");
   timeout=window.setTimeout(()=>{
    if(next>=2*count){position.current=count;scrollToItem(count,"auto");}
    else if(next<count){position.current=2*count-1;scrollToItem(2*count-1,"auto");}
   },750);
  },2000);
  return()=>{window.cancelAnimationFrame(start);window.clearInterval(interval);if(timeout!==undefined)window.clearTimeout(timeout);};
 },[direction,images.length]);
 return <div className="w-full">
  <p className="mb-3 px-5 text-center text-sm font-bold tracking-wide text-[#47634d]">{label}</p>
  <div ref={viewport} aria-label={label} className="relative flex items-center gap-3 overflow-x-hidden px-0" style={{scrollbarWidth:"none"}}>
   {[...images,...images,...images].map((src,i)=><div key={prefix+"-"+i} className="w-[44%] shrink-0 overflow-hidden rounded-2xl border border-[#e5e7df] bg-white shadow-sm">
    <DisplayImage src={src} deferred enabled={nearViewport} scrollRoot={viewport} sizes="(min-width: 1152px) 507px, 44vw" alt={`Modelo de lembrancinha de Natal ${i%images.length+1}`} loading="lazy" draggable={false} className="block h-auto w-full object-contain" />
   </div>)}
  </div>
 </div>;
}
function Home() {
 const [now,setNow]=useState<Date | null>(null);
 const [countdown,setCountdown]=useState(900);
 const [showUpgrade,setShowUpgrade]=useState(false);
 const [reviewText,setReviewText]=useState("");
 const [reviewName,setReviewName]=useState("");
 const [reviewStars,setReviewStars]=useState(5);
 const [localReview,setLocalReview]=useState<{name:string;text:string;stars:number}|null>(null);
 useEffect(()=>{
  const key="natal-15min-inicio";
  let start=Date.now();
  try {
   const saved=window.sessionStorage.getItem(key);
   if(saved && Number.isFinite(Number(saved))) start=Number(saved);
   else window.sessionStorage.setItem(key,String(start));
  } catch { /* o contador funciona mesmo sem sessionStorage */ }
  const tick=()=>{setNow(new Date());setCountdown(Math.max(0,900-Math.floor((Date.now()-start)/1000)));};
  tick();
  const t=window.setInterval(tick,1000);
  return()=>window.clearInterval(t);
 },[]);
 useEffect(()=>{if(!showUpgrade)return;const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setShowUpgrade(false)};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[showUpgrade]);
 function goTo(id:string){document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});}
 function submitReview(e:React.FormEvent){e.preventDefault();const name=reviewName.trim();const text=reviewText.trim();if(!name || !text)return;setLocalReview({name:name.slice(0,55),text:text.slice(0,500),stars:reviewStars});setReviewText("");setReviewName("");}
 const date=now?.toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"});
 return <main className="min-h-screen bg-[#fcfbf8] text-[#2e382f] selection:bg-[#e6eddf]" style={{fontFamily:'"Inter", ui-sans-serif, system-ui, sans-serif'}}>
  <div className="bg-[#a52e35] text-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-center text-xs font-semibold sm:text-sm"><span>🔥 Oferta só hoje <span className="hidden sm:inline">· {date ?? "Hoje"}</span></span><span className="opacity-50">|</span><span className="rounded-md bg-white/20 px-2 py-1 font-mono text-sm tabular-nums">{now?formatRemaining(countdown):"15:00"}</span></div></div>
  
  <section id="inicio" className="relative overflow-hidden"><div className="pointer-events-none absolute -right-28 top-0 h-100 w-100 rounded-full bg-[#f0efe4] blur-3xl"/><div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-12 pt-9 text-center sm:px-6 sm:pt-14 md:pb-18"><Tag><Sparkles size={13}/> Coleção especial de Natal</Tag><h1 className="max-w-3xl text-[clamp(2.05rem,6vw,4.25rem)] font-extrabold leading-[1.1] tracking-[-.045em] text-[#2c4636]">Pequenos presentes. <span className="text-[#b45b4e]">Grandes lembranças.</span></h1><DisplayImage src="/images/modelos/mk.webp" sizes="(min-width: 672px) 640px, calc(100vw - 32px)" loading="eager" alt="Mockup da coleção de 50 Mini Lembranças de Natal" fetchPriority="high" width={900} height={900} className="relative my-5 block h-auto w-full max-w-[640px] object-contain sm:my-7" /><p className="mx-auto max-w-2xl text-base leading-relaxed text-[#626c62] sm:text-lg">Transforme pequenos gestos em lindas lembrancinhas de Natal! São <strong className="text-[#2c4636]">50 modelos prontos para imprimir</strong> e montar, perfeitos para presentear, agradecer, surpreender ou até produzir para vender.</p><div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[#4e5d51] sm:text-sm">{["Formato A4","Fácil de montar","Acesso digital"].map(t=><span key={t} className="inline-flex items-center gap-1.5"><Check size={17} className="text-[#2b7950]"/>{t}</span>)}</div><div className="mt-8 w-full sm:w-auto"><Button onClick={()=>goTo("precos")} className="w-full sm:min-w-[310px]">QUERO MINHAS LEMBRANCINHAS</Button><p className="mt-3 text-xs text-[#7e887d]">Acesso imediato após a confirmação da compra</p></div></div></section>
  <section id="como-funciona" className="scroll-mt-22 border-y border-[#eeece5] bg-white py-20"><div className="mx-auto max-w-6xl px-5 text-center"><Tag>Simples e especial</Tag><h2 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#2c4636] md:text-4xl">Um mimo simples pode se transformar em uma lembrança inesquecível.</h2><DisplayImage src="/images/modelos/geral.webp" deferred sizes="(min-width: 936px) 896px, calc(100vw - 40px)" alt="Visão geral das mini lembrancinhas natalinas da coleção" loading="lazy" className="mx-auto mt-9 block h-auto w-full max-w-4xl rounded-2xl object-contain" /><h3 className="mt-12 text-xl font-bold text-[#2c4636]">Uma coleção, muitas ocasiões 🎄</h3><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{occasions.map(x=><div key={x.title} className="flex items-center gap-4 rounded-xl border border-[#eeece5] p-4 text-left"><span className="text-3xl">{x.icon}</span><div><h4 className="font-bold text-[#34493b]">{x.title}</h4><p className="mt-1 text-xs leading-relaxed text-[#747e75]">{x.text}</p></div></div>)}</div></div></section>
  <section id="modelos" className="scroll-mt-22 overflow-hidden py-20"><div className="mx-auto max-w-6xl px-5 text-center"><Tag>Conheça a coleção</Tag><h2 className="text-3xl font-extrabold tracking-tight text-[#2c4636] md:text-4xl">50 ideias para encantar neste Natal</h2><p className="mx-auto mt-4 max-w-2xl text-[#6f796f]">Veja algumas das mini lembrancinhas e moldes da coleção.</p></div><div className="mx-auto mt-10 max-w-6xl space-y-8"><CarouselStrip prefix="c" direction="forward" label="Mini lembranças de Natal"/><CarouselStrip prefix="m" direction="backward" label="Mais modelos para se inspirar"/></div><div className="mt-10 text-center"><Button onClick={()=>goTo("precos")}>QUERO ACESSAR OS 50 MODELOS</Button></div></section>
  <section id="bonus" className="border-y border-[#eee9df] bg-white py-20"><div className="mx-auto max-w-6xl px-5 text-center"><Tag>Uma surpresa a mais</Tag><h2 className="text-3xl font-extrabold text-[#2c4636] md:text-4xl">Mais ideias para deixar seu Natal completo 🎁</h2><p className="mx-auto mt-4 max-w-xl text-[#6e796e]">O Plano Completo foi pensado para incluir quatro materiais complementares: artesanato natalino, caixinhas para colorir e dois painéis decorativos.</p><div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[
 {image:"/images/bonus/bonus1_artenasant.webp",title:"Artesanato Natalino",text:"Ideias criativas para montar e decorar.",value:"R$ 19,90"},
 {image:"/images/bonus/bonus2_caixinha.webp",title:"Caixinhas para Colorir",text:"Atividades natalinas para personalizar.",value:"R$ 14,90"},
 {image:"/images/bonus/bonus3_painel.webp",title:"Painel Natalino",text:"Mais encanto para escolas e eventos.",value:"R$ 24,90"},
 {image:"/images/bonus/bonus4_painel2.webp",title:"Painel com Trenzinho",text:"Uma decoração temática cheia de alegria.",value:"R$ 29,90"}
].map((bonus,i)=><article key={bonus.image} className="overflow-hidden rounded-2xl border border-[#e7e9df] bg-[#fcfbf8] text-left shadow-sm"><DisplayImage src={bonus.image} deferred sizes="(min-width: 1024px) 263px, (min-width: 640px) calc((100vw - 60px) / 2), calc(100vw - 42px)" alt={`Imagem ilustrativa do bônus ${i+1}: ${bonus.title}`} loading="lazy" className="aspect-square w-full object-cover"/><div className="p-5"><span className="text-xs font-extrabold tracking-wide text-[#38704e]">BÔNUS {i+1}</span><h3 className="mt-2 font-bold text-[#2c4636]">{bonus.title}</h3><p className="mt-2 text-sm leading-relaxed text-[#778276]">{bonus.text}</p><p className="mt-4 text-sm font-bold text-[#8e978c]"><span className="line-through">{bonus.value}</span></p><p className="mt-1 font-extrabold text-[#a52e35]">GRÁTIS no Plano Completo</p></div></article>)}</div><div className="mt-8 rounded-2xl border border-[#d9e4d5] bg-[#f5f8f1] px-5 py-6"><p className="text-sm font-semibold text-[#566553]"><span className="line-through">R$ 89,60</span></p><p className="mt-1 text-3xl font-black text-[#a52e35]">GRÁTIS</p></div></div></section>
  <section id="precos" className="scroll-mt-22 py-21"><div className="mx-auto max-w-5xl px-5 text-center"><Tag>Escolha sua opção</Tag><h2 className="text-3xl font-extrabold text-[#2c4636] md:text-4xl">Comece a criar suas lembrancinhas</h2><p className="mt-4 text-[#737d73]">Escolha o acesso que combina com você.</p><div className="mx-auto mt-10 grid max-w-4xl items-stretch gap-5 md:grid-cols-2"><article className="flex flex-col rounded-3xl border border-[#dee4dc] bg-white p-8 text-left shadow-[0_12px_36px_rgba(34,63,41,.04)]"><div className="mb-5 flex h-13 w-13 items-center justify-center rounded-xl bg-[#eaf0e8] text-[#325b42]"><Gift/></div><h3 className="text-xl font-extrabold">Plano Essencial</h3><p className="mt-2 text-sm text-[#7a857a]">Para criar lindas lembranças neste Natal.</p><div className="my-7"><p className="text-sm text-[#879184]"><span className="line-through">R$ 67,90</span></p><p className="mt-2 text-5xl font-extrabold tracking-tight text-[#2c4636]"><span className="mr-1 align-top text-base">R$</span>12,90</p><p className="mt-1 text-xs font-semibold text-[#8a9389]">Taxas já incluídas</p></div><div className="mb-8 space-y-4">{["50 moldes de Mini Lembranças Natalinas","Arquivos digitais em A4","Modelos prontos para imprimir","Acesso digital após a compra"].map(t=><p key={t} className="flex gap-3 text-sm"><Check size={19} className="shrink-0 text-[#3d8655]"/>{t}</p>)}</div><div className="mt-auto"><button type="button" onClick={()=>setShowUpgrade(true)} className="w-full rounded-xl bg-[#28533d] px-5 py-4 font-bold text-white transition hover:bg-[#1d4330]">QUERO O PLANO ESSENCIAL — R$ 12,90</button><p className="mt-3 text-center text-xs text-[#8a9389]">Você poderá conferir uma condição especial antes de pagar.</p></div></article><article className="relative flex flex-col rounded-3xl border-2 border-[#315940] bg-white p-8 text-left shadow-[0_17px_46px_rgba(40,83,61,.09)]"><div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#315940] px-5 py-2 text-xs font-extrabold tracking-wider text-white">OPÇÃO MAIS COMPLETA</div><div className="mb-5 flex h-13 w-13 items-center justify-center rounded-xl bg-[#eaf0e8] text-[#325b42]"><Sparkles/></div><h3 className="text-xl font-extrabold">Plano Completo</h3><p className="mt-2 text-sm text-[#7a857a]">A coleção principal completa + quatro bônus natalinos planejados.</p><div className="my-7"><p className="text-sm text-[#879184]"><span className="line-through">R$ 127,90</span></p><p className="mt-2 text-5xl font-extrabold tracking-tight text-[#2c4636]"><span className="mr-1 align-top text-base">R$</span>27,90</p><p className="mt-1 text-xs font-semibold text-[#8a9389]">Taxas já incluídas</p></div><div className="mb-8 space-y-4">{["50 moldes de Mini Lembranças Natalinas","Arquivos digitais em formato A4","Modelos prontos para imprimir, recortar e montar","Acesso digital após a compra","🎁 Bônus 1 — Artesanato Natalino: ideias extras de atividades e decorações","🎁 Bônus 2 — Caixinhas Natalinas para Colorir: modelos para personalizar","🎁 Bônus 3 — Painel Natalino: decoração para escolas e eventos","🎁 Bônus 4 — Painel de Natal com Trenzinho: decoração temática com espaço para fotos"].map(t=><p key={t} className="flex gap-3 text-sm"><Check size={19} className="shrink-0 text-[#3d8655]"/>{t}</p>)}</div><div className="mt-auto"><a href="https://pay.cakto.com.br/bh3m8we" className="flex w-full items-center justify-center rounded-xl bg-[#28533d] px-5 py-4 text-center font-bold text-white transition hover:bg-[#1d4330]">QUERO O PLANO COMPLETO — R$ 27,90 <ArrowRight size={17} className="ml-2"/></a><p className="mt-3 text-center text-xs text-[#8a9389]">Compra segura pela Cakto</p></div></article></div><div className="mt-7 flex flex-wrap justify-center gap-5 text-xs text-[#79857a]"><span className="flex items-center gap-2"><LockKeyhole size={16}/> Pagamento seguro pela Cakto</span><span className="flex items-center gap-2"><PackageCheck size={16}/> Produto digital</span></div></div></section>
  <section id="depoimentos" className="border-y border-[#eaece5] bg-white py-20"><div className="mx-auto max-w-5xl px-5 text-center"><Tag>Opiniões e experiências</Tag><h2 className="text-3xl font-extrabold text-[#2c4636] md:text-4xl">Pequenos detalhes, grandes sorrisos ❤️</h2><p className="mx-auto mt-4 max-w-xl text-[#727e72]">Veja o que nossos clientes estão contando sobre as lembrancinhas natalinas.</p><div className="mt-9 grid gap-4 sm:grid-cols-2">{[
 {name:"Prof. Monica Alves",initials:"MA",photo:"/images/prof.png",text:"Adorei o mural, vou usar na minha sala de aula, inclusive as lembrancinhas são sensacionais!"},
 {name:"Angelica Lope",initials:"AL",photo:"/images/angelica.jfif",text:"Comecei a vender essas lembranças aqui na minha cidade e comecei a faturar 500 reais semanais."},
 {name:"Robero Gomes",initials:"RG",photo:"/images/roberto.jfif",text:"Coloquei no meu portfólio aqui da loja. Todo dia estou vendendo 15 lembrancinhas, na média."},
 {name:"Joao Guilherme",initials:"JG",photo:"/images/joao.jfif",text:"Gostei, vou dar de lembrancinha no meu trabalho na semana do Natal."},
 {name:"Lurdes",initials:"L",photo:"/images/lurdes.jfif",text:"Gostei, vou usar na catequese esse domingo."}
].map(review=><article key={review.name} className="flex flex-col justify-between rounded-2xl border border-[#e2e6df] bg-[#fcfbf8] p-6 text-left"><div><div aria-label="5 estrelas" className="mb-4 flex gap-1 text-[#d6a34f]">{Array.from({length:5},(_,i)=><Star key={i} size={17} fill="currentColor"/>)}</div><p className="text-sm leading-relaxed text-[#495b4b]">“{review.text}”</p></div><div className="mt-6 flex items-center gap-3"><DisplayImage src={review.photo} deferred sizes="44px" alt={`Foto de ${review.name}`} loading="lazy" className="h-11 w-11 shrink-0 rounded-full border border-[#e4ece1] object-cover" /><div><p className="text-sm font-bold text-[#3b5341]">{review.name}</p></div></div></article>)}</div><div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-[#e4e9df] bg-[#fcfbf8] p-6 text-left sm:p-8"><h3 className="text-xl font-extrabold text-[#304b37]">Quer deixar sua opinião também?</h3><p className="mt-2 text-sm leading-relaxed text-[#727d73]">Escolha de 1 a 5 estrelas e conte sua experiência com as lembrancinhas.</p><form onSubmit={submitReview} className="mt-5 space-y-4"><div><label htmlFor="review-name" className="mb-1.5 block text-sm font-semibold">Seu nome</label><input id="review-name" value={reviewName} onChange={e=>setReviewName(e.target.value)} maxLength={55} required placeholder="Como podemos chamar você?" className="w-full rounded-xl border border-[#dce3da] bg-white px-4 py-3 text-sm outline-[#62876c]"/></div><div><label className="mb-2 block text-sm font-semibold">Escolha quantas estrelas deseja dar</label><div className="flex gap-1">{[1,2,3,4,5].map(n=><button type="button" key={n} onClick={()=>setReviewStars(n)} aria-label={`${n} estrelas`} aria-pressed={reviewStars===n} className="p-1 text-[#d0a254]"><Star size={29} fill={n<=reviewStars?"currentColor":"none"}/></button>)}</div></div><div><label htmlFor="review-text" className="mb-1.5 block text-sm font-semibold">Seu depoimento</label><textarea id="review-text" value={reviewText} onChange={e=>setReviewText(e.target.value)} required maxLength={500} rows={4} placeholder="Conte o que você achou..." className="w-full resize-y rounded-xl border border-[#dce3da] bg-white px-4 py-3 text-sm outline-[#62876c]"/></div><button type="submit" className="w-full rounded-xl bg-[#2a543e] px-5 py-3.5 font-bold text-white hover:bg-[#1e4330]">Concluir avaliação</button></form>{localReview&&<div aria-live="polite" role="status" className="mt-6 rounded-xl border border-[#dae7d6] bg-white p-5 text-center"><Check size={27} className="mx-auto text-[#39734e]"/><p className="mt-3 font-bold text-[#315940]">Obrigado por deixar sua avaliação!</p></div>}</div></div></section>
  <section id="garantia" className="py-18"><div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 text-center md:flex-row md:text-left"><div className="flex h-28 w-28 shrink-0 items-center justify-center"><DisplayImage src="/images/garantia-7-dias.webp?v=2" deferred sizes="112px" alt="Selo Garantia de 7 dias" loading="lazy" className="block h-auto w-full object-contain" /></div><div><h2 className="text-2xl font-extrabold text-[#304936] md:text-3xl">Sua compra protegida por 7 dias</h2><p className="mt-3 leading-relaxed text-[#717d71]">Conheça nossa coleção com tranquilidade. Se não ficar satisfeito, você poderá solicitar o reembolso em até 7 dias após a compra, conforme as condições aplicáveis.</p></div></div></section>
  <footer className="bg-[#284a37] px-5 py-14 text-center text-white"><div className="mx-auto max-w-xl"><Gift size={34} className="mx-auto mb-5 text-[#d7caa4]"/><h2 className="text-3xl font-extrabold tracking-tight">Neste Natal, encante mais gastando pouco.</h2><p className="mt-4 text-sm leading-relaxed text-[#d6e1d4]">50 modelos para criar mini lembranças especiais, presentear, agradecer ou produzir para vender.</p><div className="mt-7"><Button onClick={()=>goTo("precos")} className="w-full !bg-white !text-[#28533d] sm:w-auto">CONHECER OS PLANOS</Button></div><div className="mt-12 border-t border-white/20 pt-6 text-xs text-[#c8d5c8]"><p>© {now?.getFullYear()??2026} Mini Lembranças de Natal</p><p className="mt-2">Termos de uso · Política de privacidade · Contato</p></div></div></footer>

  {showUpgrade&&<div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#122719]/75 px-4 py-6 backdrop-blur-[3px]" onMouseDown={e=>{if(e.target===e.currentTarget)setShowUpgrade(false)}}><section role="dialog" aria-modal="true" aria-labelledby="upgrade-title" className="relative mx-auto w-full max-w-md rounded-3xl bg-[#fffdf8] p-5 text-center shadow-2xl sm:p-8"><button type="button" onClick={()=>setShowUpgrade(false)} aria-label="Fechar oferta" className="absolute right-3 top-3 rounded-full p-2 text-[#738071] hover:bg-[#edf0e9]">✕</button><span className="inline-block rounded-full bg-[#e5f1e4] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#2e6241]">🎁 Oferta especial para você</span><h2 id="upgrade-title" className="mt-5 text-2xl font-extrabold leading-tight text-[#284e39] sm:text-3xl">Leve o Plano Completo por apenas <span className="text-[#b34537]">R$ 18,90</span>!</h2><p className="mt-3 text-sm leading-relaxed text-[#657166]">Em vez do Plano Essencial, aproveite todos os 50 moldes e mais os <strong>4 bônus natalinos</strong> com desconto.</p><div className="mt-5 rounded-2xl border border-[#d8e6d5] bg-[#f3f8f0] p-4"><p className="text-sm text-[#7b887a]">Preço normal do Completo: <span className="line-through">R$ 27,90</span></p><p className="mt-1 text-4xl font-black text-[#29573c]">R$ 18,90</p><p className="mt-1 text-xs font-semibold text-[#7b887a]">Taxas já incluídas</p><p className="mt-1 text-sm font-bold text-[#3d8051]">Economize R$ 9,00 no Plano Completo</p></div><ul className="mx-auto mt-5 space-y-2 text-left text-sm text-[#48594b]">{["50 modelos de lembrancinhas natalinas","4 bônus extras incluídos","Arquivos digitais para imprimir em A4","Acesso digital após a compra"].map(t=><li key={t} className="flex items-start gap-2"><Check size={18} className="mt-0.5 shrink-0 text-[#398454]"/>{t}</li>)}</ul><a href="https://pay.cakto.com.br/gcbdett" className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#28533d] px-4 py-3 text-base font-extrabold text-white shadow-lg transition hover:bg-[#1d4330]">SIM! QUERO O COMPLETO POR R$ 18,90 <ArrowRight size={18}/></a><a href="https://pay.cakto.com.br/ic4vyth_1299493" className="mt-4 block py-2 text-sm font-semibold text-[#637265] underline underline-offset-4">Não, quero apenas o Essencial por R$ 12,90</a><p className="mt-3 text-xs text-[#8b978a]">Você escolhe o plano antes de finalizar o pagamento.</p></section></div>}
 </main>;
}
