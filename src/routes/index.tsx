import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import draCristiana from "../assets/DraCristianaValente.jpeg";
import suaPele from "../assets/SuaPele.jpeg";
import mulherImg from "../assets/mulher.jpeg";
import homemImg from "../assets/homem.jpeg";
import faceImg from "../assets/face.jpeg";
import mitosImg from "../assets/mitos.jpeg";
import ambienteImg from "../assets/ambiente.png";

export const CSS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Jost:wght@400;500;600;700&display=swap');

  :root{
    --bg:#faf7f3;
    --bg2:#f2ece4;
    --ink:#141414;
    --muted:#7a6f66;
    --rose:#c9a36b;
    --rose2:#8a6a3b;
    --gold:#c9a36b;
    --nude:#e6d5c2;
    --line:#ece4d8;
    --mx:50vw;
    --my:35vh;
    --sy:0px;
  }

  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{
    margin:0;
    background:var(--bg);
    color:var(--ink);
    font-family:"Jost",sans-serif;
    overflow-x:hidden;
  }

  body::before{
    content:"";
    position:fixed;
    inset:0;
    z-index:0;
    pointer-events:none;
    background:
      radial-gradient(650px circle at var(--mx) var(--my),rgba(201,163,107,.11),transparent 55%),
      linear-gradient(180deg,rgba(255,255,255,.22),transparent 32%);
    transition:background .12s linear;
  }

  .serif{font-family:"Fraunces",serif}
  .display{font-family:"Fraunces",serif;font-weight:500;line-height:1.02;letter-spacing:-.01em}
  .container{max-width:1180px;margin:0 auto;padding-left:26px;padding-right:26px}
  .wrap{position:relative;z-index:2}
  .rosetext{color:var(--rose2)}

  /* BACKGROUND CINEMATOGRÁFICO */
  .cine{
    position:fixed;
    inset:0;
    z-index:0;
    overflow:hidden;
    background:var(--bg);
    transform:translateZ(0);
  }
  .cine::after{
    content:"";
    position:absolute;
    inset:-15%;
    background:
      linear-gradient(115deg,transparent 25%,rgba(255,255,255,.40) 44%,transparent 57%);
    transform:translateX(-80%) rotate(4deg);
    animation:cinematicSweep 10s ease-in-out infinite;
    opacity:.36;
  }
  .cine .l{
    position:absolute;
    inset:-25%;
    filter:blur(78px);
    opacity:.68;
    will-change:transform;
  }
  .l1{
    background:radial-gradient(38% 38% at 22% 20%,rgba(201,163,107,.30),transparent 70%);
    animation:d1 16s ease-in-out infinite;
  }
  .l2{
    background:radial-gradient(42% 42% at 80% 30%,rgba(138,106,59,.22),transparent 70%);
    animation:d2 19s ease-in-out infinite;
  }

  @keyframes d1{
    0%,100%{transform:translate(-2%,-1%) scale(1)}
    50%{transform:translate(10%,7%) scale(1.18)}
  }
  @keyframes d2{
    0%,100%{transform:translate(3%,0) scale(1.12)}
    50%{transform:translate(-10%,8%) scale(.98)}
  }
  @keyframes cinematicSweep{
    0%,15%{transform:translateX(-85%) rotate(4deg);opacity:0}
    35%{opacity:.36}
    60%,100%{transform:translateX(85%) rotate(4deg);opacity:0}
  }

  /* KICKER */
  .kicker{
    display:inline-flex;
    align-items:center;
    gap:9px;
    font-size:11px;
    letter-spacing:.2em;
    text-transform:uppercase;
    color:var(--rose2);
    border:1px solid rgba(138,106,59,.35);
    background:rgba(201,163,107,.09);
    padding:8px 15px;
    border-radius:999px;
    transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s ease,background .35s ease;
  }
  .kicker:hover{
    transform:translateY(-3px);
    box-shadow:0 12px 30px rgba(138,106,59,.12);
    background:rgba(201,163,107,.16);
  }

  /* BOTÕES */
  .btn{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:10px;
    font-weight:600;
    border-radius:13px;
    padding:16px 28px;
    text-decoration:none;
    font-size:15px;
    border:0;
    cursor:pointer;
    position:relative;
    overflow:hidden;
    isolation:isolate;
    transition:
      transform .35s cubic-bezier(.16,1,.3,1),
      box-shadow .35s cubic-bezier(.16,1,.3,1);
  }
  .btn::before{
    content:"";
    position:absolute;
    inset:-2px;
    z-index:-1;
    border-radius:inherit;
    opacity:0;
    background:radial-gradient(180px circle at var(--bx,50%) var(--by,50%),rgba(255,255,255,.34),transparent 60%);
    transition:opacity .25s ease;
  }
  .btn::after{
    content:"";
    position:absolute;
    top:-50%;
    left:-90%;
    width:45%;
    height:200%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.42),transparent);
    transform:rotate(18deg);
    transition:left .75s cubic-bezier(.16,1,.3,1);
    pointer-events:none;
  }
  .btn:hover{transform:translateY(-4px) scale(1.015)}
  .btn:hover::before{opacity:1}
  .btn:hover::after{left:150%}
  .btn:active{transform:translateY(-1px) scale(.985)}

  .btn-wa{
    background:linear-gradient(135deg,#25D366,#128C7E);
    color:#fff;
    box-shadow:0 16px 40px rgba(37,211,102,.30);
  }
  .btn-wa:hover{box-shadow:0 22px 52px rgba(37,211,102,.40)}
  .btn-rose{
    background:linear-gradient(180deg,var(--ink),#000);
    color:#fff;
    box-shadow:0 16px 40px rgba(0,0,0,.28);
  }
  .btn-ghost{
    border:1px solid rgba(20,20,20,.2);
    color:var(--ink);
    background:rgba(255,255,255,.18);
    backdrop-filter:blur(8px);
  }
  .btn-ghost:hover{background:rgba(255,255,255,.62)}

  /* REVEAL SEGURO:
     páginas internas continuam visíveis porque só .fx-ready fica escondido */
  .reveal{
    opacity:1;
    transform:none;
    filter:none;
  }
  .reveal.fx-ready{
    opacity:0;
    transform:translateY(62px) scale(.965);
    filter:blur(9px);
    transition:
      opacity 1.05s cubic-bezier(.16,1,.3,1),
      transform 1.05s cubic-bezier(.16,1,.3,1),
      filter .9s cubic-bezier(.16,1,.3,1);
    will-change:opacity,transform,filter;
  }
  .reveal.fx-ready.in{
    opacity:1;
    transform:translateY(0) scale(1);
    filter:blur(0);
  }

  .grid > .reveal.fx-ready:nth-child(1){transition-delay:.02s}
  .grid > .reveal.fx-ready:nth-child(2){transition-delay:.10s}
  .grid > .reveal.fx-ready:nth-child(3){transition-delay:.18s}
  .grid > .reveal.fx-ready:nth-child(4){transition-delay:.26s}
  .grid > .reveal.fx-ready:nth-child(5){transition-delay:.34s}
  .grid > .reveal.fx-ready:nth-child(6){transition-delay:.42s}
  .grid > .reveal.fx-ready:nth-child(7){transition-delay:.50s}
  .grid > .reveal.fx-ready:nth-child(8){transition-delay:.58s}
  .grid > .reveal.fx-ready:nth-child(9){transition-delay:.66s}
  .grid > .reveal.fx-ready:nth-child(10){transition-delay:.74s}
  .grid > .reveal.fx-ready:nth-child(11){transition-delay:.82s}
  .grid > .reveal.fx-ready:nth-child(12){transition-delay:.90s}

  /* CARDS COM PROFUNDIDADE + SPOTLIGHT */
  .card{
    background:#fff;
    border:1px solid var(--line);
    border-radius:18px;
    box-shadow:0 10px 34px rgba(20,20,20,.05);
    position:relative;
    overflow:hidden;
    transform-style:preserve-3d;
    transition:
      transform .42s cubic-bezier(.16,1,.3,1),
      box-shadow .42s cubic-bezier(.16,1,.3,1),
      border-color .35s ease;
  }
  .card::before{
    content:"";
    position:absolute;
    inset:0;
    opacity:0;
    pointer-events:none;
    background:
      radial-gradient(360px circle at var(--cx,50%) var(--cy,50%),rgba(201,163,107,.18),transparent 46%);
    transition:opacity .3s ease;
  }
  .card::after{
    content:"";
    position:absolute;
    inset:1px;
    border-radius:17px;
    pointer-events:none;
    background:linear-gradient(135deg,rgba(255,255,255,.50),transparent 35%);
    opacity:.45;
  }
  .card:hover{
    transform:translateY(-12px) scale(1.015);
    box-shadow:
      0 34px 80px rgba(20,20,20,.13),
      0 10px 30px rgba(138,106,59,.08);
    border-color:rgba(201,163,107,.55);
  }
  .card:hover::before{opacity:1}

  .hair{height:1px;background:linear-gradient(90deg,transparent,rgba(201,163,107,.5),transparent)}

  /* IMAGENS / FRAME */
  .frame{
    border-radius:22px;
    overflow:hidden;
    position:relative;
    box-shadow:0 40px 90px rgba(20,20,20,.18);
    transform:translateZ(0);
    transition:
      transform .55s cubic-bezier(.16,1,.3,1),
      box-shadow .55s cubic-bezier(.16,1,.3,1);
  }
  .frame::after{
    content:"";
    position:absolute;
    inset:0;
    pointer-events:none;
    background:linear-gradient(120deg,transparent 35%,rgba(255,255,255,.18) 50%,transparent 65%);
    transform:translateX(-120%);
    transition:transform 1s cubic-bezier(.16,1,.3,1);
  }
  .frame img{
    transition:
      transform 1.25s cubic-bezier(.16,1,.3,1),
      filter .65s ease;
    will-change:transform;
  }
  .frame:hover{
    transform:translateY(-8px) rotateX(.8deg) rotateY(-.8deg);
    box-shadow:0 52px 110px rgba(20,20,20,.24);
  }
  .frame:hover::after{transform:translateX(120%)}
  .frame:hover img{transform:scale(1.075);filter:brightness(1.035) saturate(1.035)}

  /* HERO MAIS FORTE */
  #topo{
    perspective:1200px;
  }
  #topo > div:first-child{
    transform:translate3d(0,calc(var(--sy) * -.025),0);
    transition:transform .12s linear;
  }
  #topo .frame{
    transform:
      translate3d(0,calc(var(--sy) * .035),0)
      rotateY(-2deg)
      rotateX(1deg);
  }
  #topo .frame:hover{
    transform:
      translate3d(0,calc(var(--sy) * .035 - 8px),0)
      rotateY(0deg)
      rotateX(0deg)
      scale(1.01);
  }

  /* NAV GLASS */
  .navwrap{
    position:fixed;
    top:14px;
    left:0;
    right:0;
    z-index:40;
    transition:.35s cubic-bezier(.16,1,.3,1);
  }
  .navwrap.s{top:8px;transform:scale(.985)}
  .navwrap>div{
    background:color-mix(in srgb,var(--bg) 62%,transparent);
    -webkit-backdrop-filter:saturate(1.6) blur(18px);
    backdrop-filter:saturate(1.6) blur(18px);
    border:1px solid color-mix(in srgb,var(--ink) 11%,transparent);
    border-radius:18px;
    box-shadow:0 10px 30px rgba(20,20,20,.08),inset 0 1px 0 rgba(255,255,255,.6);
    transition:.35s cubic-bezier(.16,1,.3,1);
  }
  .navwrap.s>div{
    background:color-mix(in srgb,var(--bg) 91%,transparent);
    box-shadow:0 16px 38px rgba(20,20,20,.11),inset 0 1px 0 rgba(255,255,255,.7);
  }
  .mark{height:40px;width:auto;display:block}

  nav a,footer a{
    transition:color .28s ease,transform .28s cubic-bezier(.16,1,.3,1),opacity .28s ease;
  }
  nav a:hover,footer a:hover{transform:translateY(-2px)}

  /* FAQ */
  details.faq{border-bottom:1px solid var(--line)}
  details.faq summary{
    list-style:none;
    cursor:pointer;
    padding:20px 4px;
    display:flex;
    justify-content:space-between;
    gap:16px;
    align-items:center;
    font-weight:600;
    font-size:17px;
    transition:padding-left .28s ease,color .28s ease;
  }
  details.faq summary:hover{padding-left:10px;color:var(--rose2)}
  details.faq summary::-webkit-details-marker{display:none}
  details.faq[open] .pl{transform:rotate(45deg)}
  .pl{transition:.3s;color:var(--rose2);font-size:24px;font-weight:400;font-family:"Fraunces",serif}

  .field{
    width:100%;
    background:#fff;
    border:1px solid var(--line);
    border-radius:12px;
    padding:14px 16px;
    color:var(--ink);
    outline:none;
    font-size:15px;
    transition:border-color .25s ease,box-shadow .25s ease,transform .25s ease;
  }
  .field:focus{
    border-color:var(--rose2);
    box-shadow:0 0 0 4px rgba(201,163,107,.10);
    transform:translateY(-1px);
  }

  /* WHATSAPP */
  .wa{
    position:fixed;
    right:20px;
    bottom:20px;
    z-index:45;
    display:flex;
    align-items:center;
    gap:10px;
    padding:13px 18px 13px 14px;
    border-radius:999px;
    background:linear-gradient(135deg,#25D366,#128C7E);
    color:#fff;
    font-weight:700;
    font-size:14px;
    text-decoration:none;
    box-shadow:0 16px 40px rgba(37,211,102,.45);
    transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s ease;
  }
  .wa:hover{transform:translateY(-6px) scale(1.04);box-shadow:0 24px 58px rgba(37,211,102,.55)}
  .wa .ic{width:24px;height:24px;display:flex;align-items:center;justify-content:center}
  .wa::before{
    content:"";
    position:absolute;
    left:14px;
    top:50%;
    transform:translateY(-50%);
    width:24px;
    height:24px;
    border-radius:50%;
    background:rgba(255,255,255,.5);
    animation:pr 2s infinite;
  }
  @keyframes pr{
    0%{transform:translateY(-50%) scale(.6);opacity:.7}
    70%,100%{transform:translateY(-50%) scale(1.8);opacity:0}
  }

  .protocol h3{font-family:"Fraunces",serif;font-size:1.35rem;color:var(--ink)}
  .protocol li{color:var(--muted);font-size:.92rem;padding:4px 0}
  .protocol .tag{display:inline-block;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--rose2);margin-bottom:10px}

  #resultados img,#exclusivos img{
    cursor:pointer;
    transition:transform 1s cubic-bezier(.16,1,.3,1),filter .45s ease;
  }
  #resultados img:hover,#exclusivos img:hover{
    transform:scale(1.09);
    filter:brightness(.97) saturate(1.06);
  }

  /* MOBILE */
  @media (max-width:768px){
    body::before{opacity:.55}
    .cine::after{display:none}
    .reveal.fx-ready{
      transform:translateY(28px);
      filter:blur(2px);
    }
    .grid > .reveal.fx-ready{transition-delay:.03s}
    .card:hover,.frame:hover{transform:none}
    .frame:hover img{transform:none}
    #topo > div:first-child,#topo .frame{transform:none}
  }

  /* ACESSIBILIDADE */
  @media (prefers-reduced-motion:reduce){
    .l1,.l2,.wa::before,.cine::after{animation:none !important}
    .reveal,.reveal.fx-ready,.reveal.fx-ready.in{
      opacity:1 !important;
      transform:none !important;
      filter:none !important;
      transition:none !important;
    }
    .card,.frame,.frame img,.btn,.btn::before,.btn::after,.kicker,.wa{
      transition:none !important;
    }
  }
`;

const WA = "https://wa.me/5541991599558?text=Ol%C3%A1%20Dra.%20Cristiana%2C%20gostaria%20de%20agendar%20minha%20avalia%C3%A7%C3%A3o.";
const LOGO = logo;
const IMG_DRA = draCristiana;
const IMG_SUAPELE = suaPele;
const IMG_MULHER = mulherImg;
const IMG_HOMEM = homemImg;
const IMG_FACE = faceImg;
const IMG_MITOS = mitosImg;
const IMG_AMBIENTE = ambienteImg;

const BODY = `
<div class="cine"><div class="l l1"></div><div class="l l2"></div></div>

<div class="wrap">
  <nav class="navwrap" id="nav"><div class="container flex items-center justify-between h-[64px] px-5">
    <a href="#topo" class="flex items-center gap-3"><img src="${LOGO}" alt="Dra. Cristiana Valente Estética" class="mark"><span class="serif text-lg hidden sm:inline">Dra. Cristiana Valente</span></a>
    <div class="hidden md:flex items-center gap-7 text-sm text-[color:var(--muted)]">
      <a href="#protocolos" class="hover:text-[color:var(--ink)] transition">Protocolos</a>
      <a href="#sobre" class="hover:text-[color:var(--ink)] transition">Sobre</a>
      <a href="#exclusivos" class="hover:text-[color:var(--ink)] transition">Exclusivos Dra. Cristiana Valente</a>
      <a href="#avaliacoes" class="hover:text-[color:var(--ink)] transition">Depoimentos</a>
      <a href="#faq" class="hover:text-[color:var(--ink)] transition">FAQ</a>
    </div>
    <a href="${WA}" class="btn btn-wa !py-2.5 !px-5 !text-sm">Agendar avaliação</a>
  </div></nav>

  <header id="topo" class="container pt-36 pb-20 md:pt-44 md:pb-28 grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center">
    <div>
      <div class="reveal kicker">★ Estética facial, corporal e capilar · resultados naturais</div>
      <h1 class="reveal display text-6xl md:text-7xl mt-7">
        Dra. Cristiana Valente <br />
        Tratamento Capilar
        <span class="rosetext italic"><br />em Curitiba</span>.
      </h1>
      <p class="reveal text-lg md:text-xl text-[color:var(--muted)] max-w-xl mt-7 leading-relaxed">
        Tratamento para queda de cabelo, calvície e saúde do couro cabeludo em Curitiba, com avaliação individualizada e protocolos capilares personalizados pela Dra. Cristiana Valente.
      </p>
      <div class="reveal flex flex-col sm:flex-row gap-4 mt-10"><a href="${WA}" class="btn btn-wa">Agendar minha avaliação →</a><a href="#protocolos" class="btn btn-ghost">Ver protocolos</a></div>
      <div class="reveal flex items-center gap-4 mt-10">
        <div class="flex -space-x-3">
          <img
            src="/avaliacoes/fabiana.webp"
            alt="Fabiana - avaliação no Google"
            class="w-10 h-10 rounded-full border-2 object-cover"
            style="border-color:var(--bg)"
          >
      
          <img
            src="/avaliacoes/elizangela.webp"
            alt="Elizangela - avaliação no Google"
            class="w-10 h-10 rounded-full border-2 object-cover"
            style="border-color:var(--bg)"
          >
      
          <img
            src="/avaliacoes/marina.webp"
            alt="Marina - avaliação no Google"
            class="w-10 h-10 rounded-full border-2 object-cover"
            style="border-color:var(--bg)"
          >
        </div>
      
        <div>
          <div class="text-[color:var(--gold)] text-sm">
            ★★★★★
          </div>
      
          <a
            href="https://www.google.com/search?q=Dra.+Cristiana+Valente+Tratamento+Capilar+Curitiba"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-[color:var(--muted)] hover:text-[color:var(--ink)] transition"
          >
            5,0 no Google · 8 avaliações →
          </a>
        </div>
      </div>
    </div>
    <div class="reveal frame"><img src="${IMG_SUAPELE}" alt="Tratamento estético facial na Dra. Cristiana Valente Estética" class="w-full h-[540px] object-cover"></div>
  </header>

  <section class="border-y border-[color:var(--line)]" style="background:#fff"><div class="container py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
    <div class="reveal"><div class="display rosetext text-4xl">100%</div><div class="text-[color:var(--muted)] mt-1">personalizado</div></div>
    <div class="reveal"><div class="display rosetext text-4xl">+12</div><div class="text-[color:var(--muted)] mt-1">protocolos exclusivos</div></div>
    <div class="reveal"><div class="display rosetext text-4xl">Facial · Corporal · Capilar</div><div class="text-[color:var(--muted)] mt-1">todas as frentes</div></div>
    <div class="reveal"><div class="display rosetext text-4xl">Ciência + Arte</div><div class="text-[color:var(--muted)] mt-1">resultados naturais</div></div>
  </div></section>

  <section class="container py-24">
    <div class="reveal max-w-2xl"><div class="kicker mb-6">A gente entende</div><h2 class="display text-5xl md:text-6xl">Você quer se cuidar - sem abrir mão do natural.</h2></div>
    <div class="grid md:grid-cols-3 gap-5 mt-14">
      <div class="reveal card p-8"><div class="text-3xl mb-3">🪞</div><h3 class="text-xl font-bold serif">Medo de ficar artificial</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Nossos protocolos são pensados para realçar seus traços, nunca mascará-los. Resultado que parece você - só que renovada.</p></div>
      <div class="reveal card p-8"><div class="text-3xl mb-3">🤍</div><h3 class="text-xl font-bold serif">Receio de dor ou desconforto</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Procedimentos seguros, técnicas modernas e um cuidado humanizado do primeiro contato até o acompanhamento pós-tratamento.</p></div>
      <div class="reveal card p-8"><div class="text-3xl mb-3">✨</div><h3 class="text-xl font-bold serif">Insegurança com o resultado</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Antes de qualquer protocolo, avaliação individual completa. Você entende cada etapa, cada indicação, cada expectativa.</p></div>
    </div>
  </section>

  <section id="protocolos" class="container py-24">
    <div class="reveal max-w-2xl"><div class="kicker mb-6">Protocolos em destaque</div><h2 class="display text-5xl md:text-6xl">Tratamentos para Queda de Cabelo, Alopecia e Saúde Capilar</h2><p class="text-[color:var(--muted)] mt-6 text-lg leading-relaxed">Os tratamentos capilares são indicados após avaliação individualizada, considerando queda de cabelo, alopecia, calvície e alterações do couro cabeludo. Conheça os principais protocolos realizados pela Dra. Cristiana Valente em Curitiba.</p></div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">

      <div class="reveal card p-8 protocol"><span class="tag">Capilar</span><h3>Tratamento Capilar para Queda de Cabelo e Alopecia</h3><ul class="mt-3 list-none p-0">
        <li>· Regenera Hair</li><li>· PRP Capilar</li><li>· Regenera Hair + PRP</li><li>· Alopecia androgenética</li><li>· Alopecia areata</li><li>· Eflúvio telógeno</li><li>· Fortalecimento pós-transplante</li>
      </ul>
      <a
        href="/tratamento-queda-de-cabelo-curitiba"
        class="inline-flex mt-5 text-sm font-semibold underline underline-offset-4"
      >
        Saiba mais sobre tratamento para queda de cabelo em Curitiba
      </a>
      </div>

      <div class="reveal card p-8 protocol"><span class="tag">Capilar</span><h3>Mesoterapia Capilar</h3><ul class="mt-3 list-none p-0">
        <li>· Avaliação e Planejamento</li><li>· Higienização e Preparo do Couro Cabeludo</li><li>· Preparo da Mescla de Ativos</li><li>· Vitaminas</li><li>· Fatores de crescimento</li><li>· Intradermoterapia</li><li>· Associação com microagulhamento</li><li>· Cuidados Pós-Procedimento</li>
      </ul><br>
      <a
        href="/tratamento-capilar-curitiba"
        class="inline-flex text-sm font-semibold underline underline-offset-4"
      >
        Conheça o tratamento capilar em Curitiba
      </a>
      </div>
      
      <div class="reveal card p-8 protocol"><span class="tag">Avaliação Capilar</span><h3>Avaliação Capilar Personalizada</h3><ul class="mt-3 list-none p-0">
        <li>· Anamnese completa</li><li>· Tricoscopia</li><li>· Planejamento individualizado</li><li>· Acompanhamento fotográfico</li><li>· Diagnóstico clínico</li><li>· Protocolo sob medida</li><li>· Cronograma de manutenção</li>
      </ul></div>

      <div class="reveal card p-8 protocol"><span class="tag">Facial</span><h3>Dermaplaning</h3><ul class="mt-3 list-none p-0">
        <li>· Esfoliação com bisturi</li><li>· Remoção de pelos finos</li><li>· Uniformização da pele</li><li>· Luminosidade imediata</li>
      </ul></div>

      <div class="reveal card p-8 protocol"><span class="tag">Facial</span><h3>PRP Facial</h3><ul class="mt-3 list-none p-0">
        <li>· Bioestimulação de colágeno</li><li>· Rejuvenescimento natural</li><li>· Melhora da textura</li><li>· Qualidade da pele</li>
      </ul></div>

      <div class="reveal card p-8 protocol"><span class="tag">Facial</span><h3>Toxina Botulínica</h3><ul class="mt-3 list-none p-0">
        <li>· Terço superior</li><li>· Testa · Glabela</li><li>· Pés de galinha · Bunny lines</li><li>· Sorriso gengival (quando indicado)</li><li>· Mento (quando indicado)</li>
      </ul></div>

      <div class="reveal card p-8 protocol"><span class="tag">Facial · Corporal</span><h3>Skinbooster</h3><ul class="mt-3 list-none p-0">
        <li>· Hidratação profunda</li><li>· Linhas finas · Luminosidade</li><li>· Face · Pescoço</li><li>· Colo · Mãos</li>
      </ul></div>

      <div class="reveal card p-8 protocol"><span class="tag">Facial · Corporal</span><h3>Bioestimulador de Colágeno</h3><ul class="mt-3 list-none p-0">
        <li>· Face · Pescoço · Colo · Mãos</li><li>· Flacidez facial</li><li>· Contorno facial</li>
      </ul></div>
      
      <div class="reveal card p-8 protocol"><span class="tag">Facial</span><h3>Microagulhamento Facial</h3><ul class="mt-3 list-none p-0">
        <li>· Rejuvenescimento</li><li>· Cicatrizes de acne</li><li>· Linhas finas</li><li>· Poros dilatados</li><li>· Melasma (quando indicado)</li><li>· Drug Delivery</li>
      </ul></div>

      <div class="reveal card p-8 protocol"><span class="tag">Facial</span><h3>Reconstrução e Revitalização das Sobrancelhas</h3><ul class="mt-3 list-none p-0">
        <li>· PRP + Ativos</li><li>· Fatores de Crescimento</li><li>· Intradermoterapia</li><li>· Fortalecimento</li>
      </ul></div>

      <div class="reveal card p-8 protocol"><span class="tag">Facial</span><h3>Limpeza de Pele Premium</h3><ul class="mt-3 list-none p-0">
        <li>· Higienização e esfoliação</li><li>· Vapor de Ozônio</li><li>· Extração cuidadosa</li><li>· Alta Frequência</li><li>· Máscara calmante</li><li>· LED terapêutico</li>
      </ul></div>
      
      <div class="reveal card p-8 protocol" style="background:#141414;color:#fff;border-color:#141414"><span class="tag" style="color:var(--gold)">Exclusivos Dra. Cristiana Valente</span><h3 style="color:#fff">Protocolos autorais</h3><ul class="mt-3 list-none p-0" style="color:#c9c2b8">
        <li>· Recuperação Pós-Mounjaro</li><li>· Recuperação Pós-Transplante Capilar</li><li>· Programa Anual de Recuperação Capilar</li><li>· Regenera Barba</li><li>· Regenera Sobrancelhas</li>
      </ul></div>

    </div>
  </section>

  <section id="exclusivos" class="container py-24">
    <div class="reveal card p-10 md:p-14" style="background:linear-gradient(135deg,#141414,#2a2320);color:#fff;border-color:#141414">
      <div class="grid lg:grid-cols-[1.1fr_.9fr] gap-12 items-center">
        <div>
          <div class="kicker mb-6" style="color:var(--gold);border-color:rgba(201,163,107,.4);background:rgba(201,163,107,.08)">🖤 Protocolos exclusivos Dra. Cristiana Valente Estética</div>
          <h2 class="display text-4xl md:text-5xl" style="color:#fff">Tratamentos que só existem aqui.</h2>
          <p class="mt-6 leading-relaxed" style="color:#c9c2b8">Desenvolvidos pela Dra. Cristiana Valente para necessidades específicas dos nossos pacientes - combinando ciência, tecnologia de ponta e um olhar apurado para o que cada corpo, pele e cabelo pede.</p>
          <div class="grid sm:grid-cols-2 gap-4 mt-8">
            <div class="p-5 rounded-xl" style="background:rgba(201,163,107,.08);border:1px solid rgba(201,163,107,.25)"><div class="serif text-xl" style="color:var(--gold)">Pós-Mounjaro</div><p class="text-sm mt-2" style="color:#c9c2b8">Recuperação da firmeza, viço e densidade da pele após perda de peso.</p></div>
            <div class="p-5 rounded-xl" style="background:rgba(201,163,107,.08);border:1px solid rgba(201,163,107,.25)"><div class="serif text-xl" style="color:var(--gold)">Pós-Transplante Capilar</div><p class="text-sm mt-2" style="color:#c9c2b8">Fortalecimento e cuidado dos fios recém-implantados para máximo resultado.</p></div>
            <div class="p-5 rounded-xl" style="background:rgba(201,163,107,.08);border:1px solid rgba(201,163,107,.25)"><div class="serif text-xl" style="color:var(--gold)">Programa Anual Capilar</div><p class="text-sm mt-2" style="color:#c9c2b8">Acompanhamento contínuo com evolução mensurada em tricoscopia.</p></div>
            <div class="p-5 rounded-xl" style="background:rgba(201,163,107,.08);border:1px solid rgba(201,163,107,.25)"><div class="serif text-xl" style="color:var(--gold)">Regenera Barba e Sobrancelhas</div><p class="text-sm mt-2" style="color:#c9c2b8">Estímulo do crescimento e preenchimento de falhas na barba masculina e Sobrancelhas.</p></div>
          </div>
          <a href="${WA}" class="btn btn-wa mt-10">Quero saber se sou indicada(o) →</a>
        </div>
        <div class="reveal frame"><img src="${IMG_AMBIENTE}" class="w-full h-[520px] object-cover" alt="Dra. Cristiana Valente no ambiente da clínica Dra. Cristiana Valente Estética"></div>
      </div>
    </div>
  </section>

  <section id="resultados" class="container py-24">
    <div class="reveal max-w-2xl"><div class="kicker mb-6">Ambiente e cuidado</div><h2 class="display text-5xl md:text-6xl">Cada detalhe pensado para você.</h2></div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
      <div class="reveal frame"><img src="${IMG_MULHER}" class="w-full h-56 object-cover" alt="Tratamento capilar feminino"></div>
      <div class="reveal frame"><img src="${IMG_HOMEM}" class="w-full h-56 object-cover" alt="Tratamento capilar masculino"></div>
      <div class="reveal frame"><img src="${IMG_FACE}" class="w-full h-56 object-cover" alt="Cuidado com a pele"></div>
      <div class="reveal frame"><img src="${IMG_MITOS}" class="w-full h-56 object-cover" alt="Terapia capilar"></div>
    </div>
  </section>

  <section id="sobre" class="container py-24 grid lg:grid-cols-2 gap-16 items-center">
    <div class="reveal frame"><img src="${IMG_DRA}" alt="Dra. Cristiana Valente" class="w-full h-[560px] object-cover"></div>
    <div class="reveal">
      <div class="kicker mb-6">Dra. Cristiana Valente</div>
      <h2 class="display text-5xl md:text-6xl">Enfermeira Esteta com<br>olhar para o <span class="italic rosetext">natural</span>.</h2>
      <p class="text-[color:var(--muted)] text-lg mt-6 leading-relaxed">Especialista em Saúde Pública e Estética Avançada, Terapeuta Capilar e Tricoscopista. Une conhecimento científico, tecnologia e um cuidado profundamente humano para transformar não só a aparência - mas a relação de cada paciente com o próprio espelho.</p>
      <p class="text-[color:var(--muted)] text-lg mt-4 leading-relaxed italic">"Cuidar de você é transformar vidas."</p>
      <div class="hair my-8"></div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div><div class="display rosetext text-2xl">Saúde</div><div class="text-xs text-[color:var(--muted)] mt-1">integral</div></div>
        <div><div class="display rosetext text-2xl">Autoestima</div><div class="text-xs text-[color:var(--muted)] mt-1">e confiança</div></div>
        <div><div class="display rosetext text-2xl">Tratamentos</div><div class="text-xs text-[color:var(--muted)] mt-1">personalizados</div></div>
        <div><div class="display rosetext text-2xl">Avaliação</div><div class="text-xs text-[color:var(--muted)] mt-1">detalhada</div></div>
      </div>
    </div>
  </section>

  <section class="container py-24">
    <div class="reveal max-w-2xl mx-auto text-center"><div class="kicker mb-6 mx-auto">Como funciona</div><h2 class="display text-5xl md:text-6xl">Seu tratamento em 3 passos.</h2></div>
    <div class="grid md:grid-cols-3 gap-5 mt-14">
      <div class="reveal card p-8"><div class="serif rosetext text-5xl">01</div><h3 class="serif text-2xl mt-3">Avaliação personalizada</h3><p class="text-[color:var(--muted)] mt-2 leading-relaxed">Anamnese completa, tricoscopia quando indicado, e escuta atenta dos seus objetivos.</p></div>
      <div class="reveal card p-8"><div class="serif rosetext text-5xl">02</div><h3 class="serif text-2xl mt-3">Protocolo sob medida</h3><p class="text-[color:var(--muted)] mt-2 leading-relaxed">Plano de tratamento elaborado exclusivamente para você, com etapas e expectativas claras.</p></div>
      <div class="reveal card p-8"><div class="serif rosetext text-5xl">03</div><h3 class="serif text-2xl mt-3">Acompanhamento contínuo</h3><p class="text-[color:var(--muted)] mt-2 leading-relaxed">Registro fotográfico e ajustes ao longo de toda a jornada - resultados que evoluem com você.</p></div>
    </div>
  </section>

  <section id="avaliacoes" class="container py-24">
    <div class="reveal max-w-2xl">
      <div class="kicker mb-6">Avaliações reais no Google</div>
  
      <h2 class="display text-5xl md:text-6xl">
        Quem conhece, recomenda.
      </h2>
  
      <p class="text-[color:var(--muted)] mt-5 text-lg leading-relaxed">
        Experiências compartilhadas por pacientes que avaliaram o atendimento
        da Dra. Cristiana Valente no Google.
      </p>
    </div>
  
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
  
      <!-- FABIANA -->
      <div class="reveal card p-7 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div class="text-[color:var(--gold)] text-base tracking-wide">
            ★★★★★
          </div>
  
          <div class="text-xs font-semibold text-[color:var(--muted)]">
            Google
          </div>
        </div>
  
        <p class="leading-relaxed flex-1">
          "Excelente profissional, atenciosa e qualificada."
        </p>
  
        <div class="flex items-center gap-3 mt-6">
          <img
            src="/avaliacoes/fabiana.webp"
            alt="Fabiana De Sousa Braga - avaliação no Google"
            class="w-11 h-11 rounded-full object-cover shrink-0"
            loading="lazy"
          />
  
          <div>
            <div class="font-semibold">Fabiana De Sousa Braga</div>
            <div class="text-xs text-[color:var(--muted)]">
              ★★★★★ · Avaliação no Google
            </div>
          </div>
        </div>
      </div>
  
  
      <!--ELIZANGELA-->
      <div class="reveal card p-7 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div class="text-[color:var(--gold)] text-base tracking-wide">
            ★★★★★
          </div>
  
          <div class="text-xs font-semibold text-[color:var(--muted)]">
            Google
          </div>
        </div>
  
        <p class="leading-relaxed flex-1">
          "Maravilhosa! 💗"
        </p>
  
        <div class="flex items-center gap-3 mt-6">
          <img
            src="/avaliacoes/elizangela.webp"
            alt="Elizangela Costa - avaliação no Google"
            class="w-11 h-11 rounded-full object-cover shrink-0"
            loading="lazy"
          />
  
          <div>
            <div class="font-semibold">Elizangela Costa</div>
            <div class="text-xs text-[color:var(--muted)]">
              ★★★★★ · Avaliação no Google
            </div>
          </div>
        </div>
      </div>
  
  
      <!--MARINA-->
      <div class="reveal card p-7 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div class="text-[color:var(--gold)] text-base tracking-wide">
            ★★★★★
          </div>
  
          <div class="text-xs font-semibold text-[color:var(--muted)]">
            Google
          </div>
        </div>
  
        <p class="leading-relaxed flex-1">
          "Adorei o atendimento da Cris! Ela é muito atenciosa, explica cada
          detalhe do procedimento com paciência e usa produtos de excelente
          qualidade. Recomendo muito o trabalho dela para quem busca cuidado
          e profissionalismo."
        </p>
  
        <div class="flex items-center gap-3 mt-6">
          <img
            src="/avaliacoes/marina.webp"
            alt="Marina Pellanda - avaliação no Google"
            class="w-11 h-11 rounded-full object-cover shrink-0"
            loading="lazy"
          />
  
          <div>
            <div class="font-semibold">Marina Pellanda</div>
            <div class="text-xs text-[color:var(--muted)]">
              ★★★★★ · Avaliação no Google
            </div>
          </div>
        </div>
      </div>
  
  
      <!--FABRICIO-->
      <div class="reveal card p-7 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div class="text-[color:var(--gold)] text-base tracking-wide">
            ★★★★★
          </div>
  
          <div class="text-xs font-semibold text-[color:var(--muted)]">
            Google
          </div>
        </div>
  
        <p class="leading-relaxed flex-1">
          "Excelente atendimento. Profissionalismo e Competência."
        </p>
  
        <div class="flex items-center gap-3 mt-6">
          <img
            src="/avaliacoes/fabricio.webp"
            alt="Fabeicio Ramires Pinto - avaliação no Google"
            class="w-11 h-11 rounded-full object-cover shrink-0"
            loading="lazy"
          />
  
          <div>
            <div class="font-semibold">Fabricio Ramires Pinto</div>
            <div class="text-xs text-[color:var(--muted)]">
              ★★★★★ · Avaliação no Google
            </div>
          </div>
        </div>
      </div>
  
  
      <!--MARCELLA-->
      <div class="reveal card p-7 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div class="text-[color:var(--gold)] text-base tracking-wide">
            ★★★★★
          </div>
  
          <div class="text-xs font-semibold text-[color:var(--muted)]">
            Google
          </div>
        </div>
  
        <p class="leading-relaxed flex-1">
          "Ótima profissional! Muito atenciosa, cuidadosa e competente.
          Durante todo o procedimento, explicou tudo direitinho e me passou
          muita segurança. Dá pra perceber o carinho e o profissionalismo em
          cada detalhe. Amei o resultado e com certeza vou voltar! 💗"
        </p>
  
        <div class="flex items-center gap-3 mt-6">
          <img
            src="/avaliacoes/marcella.webp"
            alt="Marcella Cardoso - avaliação no Google"
            class="w-11 h-11 rounded-full object-cover shrink-0"
            loading="lazy"
          />
  
          <div>
            <div class="font-semibold">Marcella Cardoso</div>
            <div class="text-xs text-[color:var(--muted)]">
              ★★★★★ · Avaliação no Google
            </div>
          </div>
        </div>
      </div>
  
  
      <!--NEUSA-->
      <div class="reveal card p-7 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div class="text-[color:var(--gold)] text-base tracking-wide">
            ★★★★★
          </div>
  
          <div class="text-xs font-semibold text-[color:var(--muted)]">
            Google
          </div>
        </div>
  
        <p class="leading-relaxed flex-1">
          "Uma querida, tratamento maravilhoso, já sinto a diferença com
          3 sessões."
        </p>
  
        <div class="flex items-center gap-3 mt-6">
          <img
            src="/avaliacoes/neusa.webp"
            alt="Neusa Rendaki - avaliação no Google"
            class="w-11 h-11 rounded-full object-cover shrink-0"
            loading="lazy"
          />
  
          <div>
            <div class="font-semibold">Neusa Rendaki</div>
            <div class="text-xs text-[color:var(--muted)]">
              ★★★★★ · Avaliação no Google
            </div>
          </div>
        </div>
      </div>
  
  
      <!--AMAZON NATUS-->
      <div class="reveal card p-7 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div class="text-[color:var(--gold)] text-base tracking-wide">
            ★★★★★
          </div>
  
          <div class="text-xs font-semibold text-[color:var(--muted)]">
            Google
          </div>
        </div>
  
        <p class="leading-relaxed flex-1">
          "Totalmente satisfeito com a avaliação individual com tricoscopia
          para análise do meu couro cabeludo e o protocolo personalizado que
          a Dra. Cristiana Valente definiu para o meu tratamento, estou na
          terceira sessão e já estou vendo resultados. Eu indico! 😍"
        </p>
  
        <div class="flex items-center gap-3 mt-6">
          <img
            src="/avaliacoes/amazonnatus.webp"
            alt="Amazon Natus - avaliação no Google"
            class="w-11 h-11 rounded-full object-cover shrink-0"
            loading="lazy"
          />
  
          <div>
            <div class="font-semibold">Amazon Natus</div>
            <div class="text-xs text-[color:var(--muted)]">
              ★★★★★ · Avaliação no Google
            </div>
          </div>
        </div>
      </div>
  
  
      <!--WAGNER-->
      <div class="reveal card p-7 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div class="text-[color:var(--gold)] text-base tracking-wide">
            ★★★★★
          </div>
  
          <div class="text-xs font-semibold text-[color:var(--muted)]">
            Google
          </div>
        </div>
  
        <p class="leading-relaxed flex-1">
          "Avaliação de 5 estrelas no Google."
        </p>
  
        <div class="flex items-center gap-3 mt-6">
          <img
            src="/avaliacoes/wagner.webp"
            alt="Wagner Leucz - avaliação no Google"
            class="w-11 h-11 rounded-full object-cover shrink-0"
            loading="lazy"
          />
  
          <div>
            <div class="font-semibold">Wagner Leucz</div>
            <div class="text-xs text-[color:var(--muted)]">
              ★★★★★ · Avaliação no Google
            </div>
          </div>
        </div>
      </div>
  
    </div>
  
    <div class="reveal mt-10 text-center">
    <a
      href="https://www.google.com/search?q=Dra.+Cristiana+Valente+Tratamento+Capilar+Curitiba"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-3 text-sm text-[color:var(--muted)] hover:text-[color:var(--ink)] transition underline underline-offset-4"
      aria-label="Ver avaliações da Dra. Cristiana Valente no Google"
    >
      <span style="font-weight:700;color:#4285F4">G</span>
      Ver todas as avaliações no Google →
    </a>
  </div>
  </section>

  <section class="container py-24">
    <div class="reveal card p-10 md:p-16 max-w-3xl mx-auto text-center relative overflow-hidden" style="background:linear-gradient(180deg,#fff,#faf5ee)">
      <div class="kicker mb-6 mx-auto">Vagas limitadas</div>
      <h2 class="display text-4xl md:text-5xl">Sua <span class="rosetext">avaliação personalizada</span> começa aqui.</h2>
      <p class="text-[color:var(--muted)] mt-5 max-w-md mx-auto">Anamnese completa, tricoscopia (quando indicado) e um plano de tratamento único para o seu caso - com toda a segurança e ética que você merece.</p>
      <a href="${WA}" class="btn btn-wa mt-8 text-lg">Agendar minha avaliação →</a>
    </div>
  </section>

  <section class="container py-12"><div class="reveal card p-8 flex flex-col sm:flex-row items-center gap-6 max-w-3xl mx-auto" style="border:1px solid var(--nude);background:#fff">
    <div class="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-3xl" style="background:rgba(201,163,107,.14);color:var(--rose2)">🤍</div>
    <div><h3 class="serif text-2xl">Cada tratamento só após avaliação profissional</h3><p class="text-[color:var(--muted)] mt-1 leading-relaxed">Somos éticos e transparentes: nenhum protocolo é iniciado sem uma análise individual criteriosa. Sua segurança e o seu resultado vêm em primeiro lugar.</p></div>
  </div></section>

  <section id="faq" class="container py-24 max-w-3xl">
    <h2 class="reveal display text-5xl md:text-6xl mb-10 text-center">
      Dúvidas sobre Tratamento Capilar
    </h2>
  
    <div class="reveal">
  
      <details class="faq">
        <summary>
          Qual é o melhor tratamento para queda de cabelo?
          <span class="pl">+</span>
        </summary>
        <p class="pb-5 text-[color:var(--muted)] leading-relaxed">
          O tratamento depende da causa e das características da queda. Por isso, a Dra. Cristiana Valente realiza uma avaliação individualizada antes de indicar o protocolo capilar mais adequado.
        </p>
      </details>
  
      <details class="faq">
        <summary>
          Quando devo procurar tratamento para queda de cabelo?
          <span class="pl">+</span>
        </summary>
        <p class="pb-5 text-[color:var(--muted)] leading-relaxed">
          Quando a queda se torna persistente, aumenta de intensidade, surgem falhas, redução de volume ou alterações no couro cabeludo, é importante realizar uma avaliação profissional.
        </p>
      </details>
  
      <details class="faq">
        <summary>
          Alopecia e calvície têm tratamento?
          <span class="pl">+</span>
        </summary>
        <p class="pb-5 text-[color:var(--muted)] leading-relaxed">
          Existem diferentes possibilidades de tratamento para alopecia e calvície. A indicação depende do tipo de perda capilar, do histórico e da avaliação individual de cada paciente.
        </p>
      </details>
  
      <details class="faq">
        <summary>
          Como funciona uma avaliação capilar?
          <span class="pl">+</span>
        </summary>
        <p class="pb-5 text-[color:var(--muted)] leading-relaxed">
          A avaliação inclui análise do histórico, características da queda, fios e couro cabeludo, podendo incluir tricoscopia capilar para auxiliar na definição do tratamento.
        </p>
      </details>
  
      <details class="faq">
        <summary>
          Onde fazer tratamento capilar em Curitiba?
          <span class="pl">+</span>
        </summary>
        <p class="pb-5 text-[color:var(--muted)] leading-relaxed">
          A Dra. Cristiana Valente realiza avaliações e tratamentos capilares em Curitiba, com atendimento personalizado para queda de cabelo, alopecia, calvície e saúde do couro cabeludo.
        </p>
      </details>
  
    </div>
  </section>
  
  <section class="container py-20">
    <div class="reveal max-w-xl mx-auto text-center"><div class="kicker mb-6 mx-auto">Agende sua avaliação</div><h2 class="display text-5xl md:text-6xl">Comece agora.</h2><p class="text-[color:var(--muted)] mt-5">Preencha abaixo ou fale direto no WhatsApp - retornamos para marcar o melhor horário para você.</p></div>
    <form
      id="lead-form"
      class="reveal card p-7 md:p-9 max-w-xl mx-auto mt-10 space-y-4"
    >
      <input
        id="lead-nome"
        name="nome"
        class="field"
        type="text"
        placeholder="Seu nome"
        required
      >
    
      <input
        id="lead-whatsapp"
        name="whatsapp"
        class="field"
        type="tel"
        placeholder="WhatsApp (com DDD)"
        required
      >
    
      <input
        id="lead-email"
        name="email"
        class="field"
        type="email"
        placeholder="E-mail"
      >
    
      <select
        id="lead-origem"
        name="origem"
        class="field"
        required
      >
        <option value="">Como você conheceu a Dra. Cristiana?</option>
        <option value="Google">Google</option>
        <option value="Instagram">Instagram</option>
        <option value="Facebook">Facebook</option>
        <option value="Indicação">Indicação</option>
        <option value="Site">Site</option>
        <option value="Outros">Outros</option>
      </select>
    
      <input
        id="lead-indicacao"
        name="indicacao"
        class="field"
        type="text"
        placeholder="Nome de quem indicou (se houver)"
      >
    
      <textarea
        id="lead-interesse"
        name="interesse"
        class="field"
        rows="3"
        placeholder="Conte-nos o que você gostaria de tratar (facial, corporal ou capilar)"
        required
      ></textarea>
    
      <button
        id="lead-submit"
        type="submit"
        class="btn btn-wa w-full text-lg"
      >
        Agendar pelo WhatsApp →
      </button>
    </form>
  </section>

  <footer class="border-t border-[color:var(--line)]" style="background:#fff">
    <div class="container py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
      <div class="lg:col-span-2">
        <div class="flex items-center gap-3"><img src="${LOGO}" alt="Dra. Cristiana Valente Estética" class="mark"><span class="serif text-lg">Dra. Cristiana Valente</span></div>
        <p class="text-sm text-[color:var(--muted)] mt-4 max-w-sm leading-relaxed">Estética facial, corporal e capilar com protocolos personalizados, tecnologia avançada e foco em resultados naturais. Saúde e autoestima começam pelo cuidado.</p>
        <p class="text-xs text-[color:var(--muted)] mt-4"><strong class="text-[color:var(--ink)]">COREN-PR 451.408</strong> · Enfermeira Esteta · Especialista em Saúde Pública e Estética Avançada</p>
        <p class="text-xs text-[color:var(--muted)] mt-2"><strong class="text-[color:var(--ink)]">Atendimento:</strong> mediante agendamento - Curitiba/PR (Batel · Centro Cívico)</p>
      </div>
      <div>
        <p class="text-xs font-bold uppercase tracking-wider mb-4">Navegação</p>
        <ul class="space-y-2 text-sm text-[color:var(--muted)]">
          <li><a href="#protocolos" class="hover:text-[color:var(--ink)]">Protocolos</a></li>
          <li><a href="#exclusivos" class="hover:text-[color:var(--ink)]">Exclusivos Dra. Cristiana Valente</a></li>
          <li><a href="#sobre" class="hover:text-[color:var(--ink)]">Sobre a Dra.</a></li>
          <li><a href="#avaliacoes" class="hover:text-[color:var(--ink)]">Depoimentos</a></li>
          <li><a href="#faq" class="hover:text-[color:var(--ink)]">FAQ</a></li>
        </ul>
      </div>
      <div>
        <p class="text-xs font-bold uppercase tracking-wider mb-4">Contato</p>
        <ul class="space-y-2 text-sm text-[color:var(--muted)]">
          <li>📱 <a href="${WA}" class="hover:text-[color:var(--ink)]">(41) 99159-9558</a></li>
          <li>📧 <a href="mailto:contato@dracristianavalente.com.br" class="hover:text-[color:var(--ink)]">contato@dracristianavalente.com.br</a></li>
          <li>📷 <a href="https://instagram.com/cristianavalente.estetica" target="_blank" rel="noreferrer" class="hover:text-[color:var(--ink)]">@dra.cristianavalente.estetica</a></li>
          <li>🌐 <a href="https://www.dracristianavalente.com.br" target="_blank" rel="noreferrer" class="hover:text-[color:var(--ink)]">dracristianavalente.com.br</a></li>
        </ul>
      </div>
    </div>
    <div class="container pb-8"><div class="hair mb-6"></div><div class="flex flex-col sm:flex-row justify-between gap-3 text-xs text-[color:var(--muted)]"><span>© 2026 Powered by ✠ HPtech PlatForm. Todos os direitos reservados.</span><span><a href="/politica-de-privacidade" class="hover:text-[color:var(--ink)]">Política de Privacidade</a> · <a href="/termos" class="hover:text-[color:var(--ink)]">Termos</a></span></div></div>
  </footer>
</div>

<a href="${WA}" class="wa" target="_blank" rel="noreferrer"><span class="ic">●</span><span>Falar no WhatsApp</span></a>
`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tratamento Capilar em Curitiba | Dra. Cristiana Valente" },

      {
        name: "description",
        content: "Tratamento capilar em Curitiba para queda de cabelo, calvície e saúde do couro cabeludo. Conheça a Dra. Cristiana Valente e agende sua avaliação."
      },
      
      { property: "og:title", content: "Dra. Cristiana Valente Estética - Capilar e Facial" },
      { property: "og:description", content: "Estética facial, corporal e capilar com protocolos personalizados, tecnologia avançada e resultados naturais. Agende sua avaliação com a Dra. Cristiana Valente." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "msapplication-TileImage", content: "/assets/logo.png" }
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/logo.png" }
    ],
  }),
  component: Index,
});

function Index() {
  const [activeImage, setActiveImage] = useState<string | null>(null);


    useEffect(() => {
    const handleWhatsAppClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest(
        'a[href*="wa.me"]'
      ) as HTMLAnchorElement | null;

      if (!link) return;

      const gtag = (window as any).gtag;

      if (typeof gtag === "function") {
        gtag("event", "whatsapp_agendamento", {
          event_category: "lead",
          event_label: link.textContent?.trim() || "WhatsApp",
        });
      }
    };

    document.addEventListener("click", handleWhatsAppClick);

    return () => {
      document.removeEventListener("click", handleWhatsAppClick);
    };
  }, []);


  // Integração do formulário: site -> API Render -> Neon/CRM -> GA4 -> WhatsApp
  useEffect(() => {
    const form = document.getElementById("lead-form") as HTMLFormElement | null;
    const nomeInput = document.getElementById("lead-nome") as HTMLInputElement | null;
    const whatsappInput = document.getElementById("lead-whatsapp") as HTMLInputElement | null;
    const emailInput = document.getElementById("lead-email") as HTMLInputElement | null;
    const origemInput = document.getElementById("lead-origem") as HTMLSelectElement | null;
    const indicacaoInput = document.getElementById("lead-indicacao") as HTMLInputElement | null;
    const interesseInput = document.getElementById("lead-interesse") as HTMLTextAreaElement | null;
    const submitButton = document.getElementById("lead-submit") as HTMLButtonElement | null;

    if (
      !form ||
      !nomeInput ||
      !whatsappInput ||
      !origemInput ||
      !interesseInput ||
      !submitButton
    ) {
      return;
    }

    const handleSubmit = async (event: Event) => {
      event.preventDefault();

      const nome = nomeInput.value.trim();
      const whatsapp = whatsappInput.value.replace(/\D/g, "");
      const email = emailInput?.value.trim() || "";
      const origem = origemInput.value;
      const indicacao = indicacaoInput?.value.trim() || "";
      const interesse = interesseInput.value.trim();

      if (!nome || !whatsapp || !origem || !interesse) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }

      if (whatsapp.length < 10 || whatsapp.length > 13) {
        alert("Informe um WhatsApp válido com DDD.");
        whatsappInput.focus();
        return;
      }

      if (origem === "Indicação" && !indicacao) {
        alert("Informe o nome de quem fez a indicação.");
        indicacaoInput?.focus();
        return;
      }

      const textoOriginal =
        submitButton.textContent || "Agendar pelo WhatsApp →";

      submitButton.disabled = true;
      submitButton.textContent = "Salvando seus dados...";

      const dados = {
        nome,
        telefone: whatsapp,
        whatsapp,
        email: email || null,
        origem_lead: origem,
        interesse,
        observacoes:
          origem === "Indicação"
            ? `Lead enviado pelo formulário do site. Indicado por: ${indicacao}`
            : "Lead enviado pelo formulário do site.",
        status_funil: "Novo Lead",
      };

      try {
        const response = await fetch(
          "https://clinica-estetica-api-6hg7.onrender.com/leads/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
          }
        );

        if (!response.ok) {
          const detalhe = await response.text();
          console.error(
            "Erro da API ao criar lead:",
            response.status,
            detalhe
          );
          throw new Error(`Erro HTTP ${response.status}`);
        }

        const leadCriado = await response.json();
        console.log("Lead criado no CRM:", leadCriado);

        const mensagem =
          `Olá Dra. Cristiana, meu nome é ${nome}. ` +
          `Gostaria de agendar uma avaliação. ` +
          `Tenho interesse em: ${interesse}.`;

        const whatsappUrl =
          `https://wa.me/5541991599558?text=${encodeURIComponent(mensagem)}`;

        const gtag = (window as any).gtag;

        if (typeof gtag === "function") {
          let redirecionado = false;

          const abrirWhatsApp = () => {
            if (redirecionado) return;
            redirecionado = true;
            window.location.href = whatsappUrl;
          };

          // Mantém o evento personalizado já adotado no projeto.
          gtag("event", "lead_form_submit", {
            send_to: "G-XW6KJ22X76",
            event_category: "lead",
            event_label: origem,
            lead_source: origem,
          });

          // Evento recomendado pelo GA4 para geração real de lead.
          // O callback segura o redirecionamento até o comando ser processado.
          gtag("event", "generate_lead", {
            send_to: "G-XW6KJ22X76",
            lead_source: origem,
            event_callback: abrirWhatsApp,
            event_timeout: 2000,
          });

          // Mantém o evento de WhatsApp que já está funcionando no GA4.
          gtag("event", "whatsapp_agendamento", {
            send_to: "G-XW6KJ22X76",
            event_category: "lead",
            event_label: "formulario_site",
          });

          // Fallback caso o callback não seja chamado pelo navegador.
          window.setTimeout(abrirWhatsApp, 2300);
        } else {
          // O lead já foi salvo no CRM; não bloqueia o paciente se a tag falhar.
          window.location.href = whatsappUrl;
        }
      } catch (error) {
        console.error("Erro ao enviar lead:", error);
        alert(
          "Não foi possível salvar seus dados neste momento. " +
          "Tente novamente em alguns instantes."
        );

        submitButton.disabled = false;
        submitButton.textContent = textoOriginal;
      }
    };

    form.addEventListener("submit", handleSubmit);

    return () => {
      form.removeEventListener("submit", handleSubmit);
    };
  }, []);
  
  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal")
    );

    // Só a Home recebe o estado inicial escondido.
    // Isso evita deixar páginas internas em branco quando elas reutilizam o CSS.
    revealElements.forEach((el) => el.classList.add("fx-ready"));

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }),
      {
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px",
      }
    );

    revealElements.forEach((el) => io.observe(el));

    const onScroll = () => {
      const n = document.getElementById("nav");
      if (n) n.classList.toggle("s", window.scrollY > 20);

      document.documentElement.style.setProperty(
        "--sy",
        `${Math.min(window.scrollY, 900)}px`
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
      document.documentElement.style.setProperty("--my", `${event.clientY}px`);

      const card = (event.target as HTMLElement).closest(
        ".card"
      ) as HTMLElement | null;

      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--cx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--cy", `${event.clientY - rect.top}px`);
      }

      const button = (event.target as HTMLElement).closest(
        ".btn"
      ) as HTMLElement | null;

      if (button) {
        const rect = button.getBoundingClientRect();
        button.style.setProperty("--bx", `${event.clientX - rect.left}px`);
        button.style.setProperty("--by", `${event.clientY - rect.top}px`);
      }
    };

    onScroll();

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  // Escuta global de cliques corrigida: funciona sempre, independente de atualizações de estado
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLImageElement;
      // Verifica se é uma imagem clicada especificamente dentro da seção de fotos
      if (target && target.tagName === "IMG" && target.closest("#resultados")) {
        setActiveImage(target.src);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Qual é o melhor tratamento para queda de cabelo?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "O tratamento depende da causa e das características da queda. Por isso, a Dra. Cristiana Valente realiza uma avaliação individualizada antes de indicar o protocolo capilar mais adequado."
                }
              },
              {
                "@type": "Question",
                name: "Quando devo procurar tratamento para queda de cabelo?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Quando a queda se torna persistente, aumenta de intensidade, surgem falhas, redução de volume ou alterações no couro cabeludo, é importante realizar uma avaliação profissional."
                }
              },
              {
                "@type": "Question",
                name: "Alopecia e calvície têm tratamento?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Existem diferentes possibilidades de tratamento para alopecia e calvície. A indicação depende do tipo de perda capilar, do histórico e da avaliação individual de cada paciente."
                }
              },
              {
                "@type": "Question",
                name: "Como funciona uma avaliação capilar?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A avaliação inclui análise do histórico, características da queda, fios e couro cabeludo, podendo incluir tricoscopia capilar para auxiliar na definição do tratamento."
                }
              },
              {
                "@type": "Question",
                name: "Onde fazer tratamento capilar em Curitiba?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A Dra. Cristiana Valente realiza avaliações e tratamentos capilares em Curitiba, com atendimento personalizado para queda de cabelo, alopecia, calvície e saúde do couro cabeludo."
                }
              }
            ]
          })
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dangerouslySetInnerHTML={{ __html: BODY }} />
            
      {/* Estrutura do Popup Inteligente e Fluido */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 transition-opacity duration-300"
          onClick={() => setActiveImage(null)}
          style={{ cursor: "zoom-out" }}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-transparent rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
            <button 
              className="fixed top-6 right-6 z-[110] bg-black/60 text-white rounded-full w-12 h-12 flex items-center justify-center text-3xl font-light hover:bg-black/95 transition shadow-lg border border-white/10"
              onClick={() => setActiveImage(null)}
              style={{ cursor: "pointer" }}
            >
              ×
            </button>
            <img 
              src={activeImage} 
              alt="Visualização expandida" 
              className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-lg border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()} // impede fechar ao clicar no meio da imagem
              style={{ cursor: "default" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
