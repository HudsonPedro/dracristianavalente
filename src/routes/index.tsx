import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Jost:wght@400;500;600;700&display=swap');

  :root{--bg:#fbf3f1;--bg2:#f6e7e4;--ink:#3a2330;--muted:#8a6c79;--rose:#c8607e;--rose2:#9c4865;--gold:#c9a36b;--line:#efdcd9}
  *{box-sizing:border-box}html{scroll-behavior:smooth}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:"Jost",sans-serif;overflow-x:hidden}
  .serif{font-family:"Fraunces",serif}
  .display{font-family:"Fraunces",serif;font-weight:500;line-height:1.02;letter-spacing:-.01em}
  .container{max-width:1180px;margin:0 auto;padding-left:26px;padding-right:26px}
  .cine{position:fixed;inset:0;z-index:0;overflow:hidden;background:var(--bg);transform:translateZ(0)}
  .cine .l{position:absolute;inset:-25%;filter:blur(72px);opacity:.55;will-change:transform}
  .l1{background:radial-gradient(38% 38% at 22% 20%,rgba(200,96,126,.22),transparent 70%);animation:d1 26s ease-in-out infinite}
  .l2{background:radial-gradient(42% 42% at 80% 30%,rgba(201,163,107,.2),transparent 70%);animation:d2 30s ease-in-out infinite}
  @keyframes d1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(6%,5%) scale(1.12)}}
  @keyframes d2{0%,100%{transform:translate(0,0) scale(1.1)}50%{transform:translate(-7%,4%) scale(1)}}
  .wrap{position:relative;z-index:2}
  .rosetext{color:var(--rose)}
  .kicker{display:inline-flex;align-items:center;gap:9px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--rose2);border:1px solid rgba(200,96,126,.3);background:rgba(200,96,126,.07);padding:8px 15px;border-radius:999px}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:600;border-radius:13px;padding:16px 28px;text-decoration:none;transition:transform .25s,box-shadow .25s;font-size:15px}
  .btn-wa{background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;box-shadow:0 16px 40px rgba(37,211,102,.3)}
  .btn-wa:hover{transform:translateY(-2px)}
  .btn-rose{background:linear-gradient(180deg,var(--rose),var(--rose2));color:#fff;box-shadow:0 16px 40px rgba(200,96,126,.3)}
  .btn-rose:hover{transform:translateY(-2px)}
  .btn-ghost{border:1px solid rgba(58,35,48,.18);color:var(--ink)}.btn-ghost:hover{background:rgba(58,35,48,.04)}
  .reveal{opacity:1}.reveal.in{animation:rin .7s cubic-bezier(.16,1,.3,1) both}@keyframes rin{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
  .card{background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 10px 34px rgba(58,35,48,.05)}
  .hair{height:1px;background:linear-gradient(90deg,transparent,rgba(200,96,126,.4),transparent)}
  .frame{border-radius:22px;overflow:hidden;position:relative;box-shadow:0 40px 90px rgba(120,60,80,.2)}
  .navwrap{position:fixed;top:14px;left:0;right:0;z-index:40;transition:.3s}
  .navwrap.s{top:9px}
  .navwrap>div{background:color-mix(in srgb,var(--bg) 62%,transparent);-webkit-backdrop-filter:saturate(1.6) blur(18px);backdrop-filter:saturate(1.6) blur(18px);border:1px solid color-mix(in srgb,var(--ink) 11%,transparent);border-radius:18px;box-shadow:0 10px 30px rgba(120,60,80,.08),inset 0 1px 0 rgba(255,255,255,.6);transition:.3s}
  .navwrap.s>div{background:color-mix(in srgb,var(--bg) 84%,transparent)}
  .mark{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--rose),var(--rose2));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-family:"Fraunces",serif}
  details.faq{border-bottom:1px solid var(--line)}
  details.faq summary{list-style:none;cursor:pointer;padding:20px 4px;display:flex;justify-content:space-between;gap:16px;align-items:center;font-weight:600;font-size:17px}
  details.faq summary::-webkit-details-marker{display:none}
  details.faq[open] .pl{transform:rotate(45deg)} .pl{transition:.3s;color:var(--rose);font-size:24px;font-weight:400;font-family:"Fraunces",serif}
  .field{width:100%;background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 16px;color:var(--ink);outline:none;font-size:15px}.field:focus{border-color:var(--rose)}
  .wa{position:fixed;right:20px;bottom:20px;z-index:45;display:flex;align-items:center;gap:10px;padding:13px 18px 13px 14px;border-radius:999px;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;font-weight:700;font-size:14px;text-decoration:none;box-shadow:0 16px 40px rgba(37,211,102,.45)}
  .wa .ic{width:24px;height:24px;display:flex;align-items:center;justify-content:center}
  .wa::before{content:"";position:absolute;left:14px;top:50%;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.5);animation:pr 2s infinite}
  @keyframes pr{0%{transform:translateY(-50%) scale(.6);opacity:.7}70%,100%{transform:translateY(-50%) scale(1.8);opacity:0}}
  @media (prefers-reduced-motion:reduce){.l1,.l2,.wa::before{animation:none}.reveal.in{animation:none}}
`;
const BODY = `
<!--
  ╔══════════════════════════════════════════════════════════════╗
  ║  CONFIG — EDITE AQUI. [colchetes], fotos, WhatsApp, cores      ║
  ║  no :root (--rose, --bg). Nicho: CLÍNICA DE ESTÉTICA.         ║
  ╚══════════════════════════════════════════════════════════════╝
-->
<div class="cine"><div class="l l1"></div><div class="l l2"></div></div>

<div class="wrap">
  <nav class="navwrap" id="nav"><div class="container flex items-center justify-between h-[64px] px-5">
    <a href="#topo" class="flex items-center gap-3"><span class="mark">E</span><span class="serif text-xl">[Seu Espaço]</span></a>
    <div class="hidden md:flex items-center gap-7 text-sm text-[color:var(--muted)]">
      <a href="#procedimentos" class="hover:text-[color:var(--ink)] transition">Procedimentos</a>
      <a href="#sobre" class="hover:text-[color:var(--ink)] transition">Sobre</a>
      <a href="#resultados" class="hover:text-[color:var(--ink)] transition">Resultados</a>
      <a href="#avaliacoes" class="hover:text-[color:var(--ink)] transition">Avaliações</a>
      <a href="#faq" class="hover:text-[color:var(--ink)] transition">FAQ</a>
    </div>
    <a href="https://wa.me/5511900000000" class="btn btn-wa !py-2.5 !px-5 !text-sm">Agendar avaliação</a>
  </div></nav>

  <header id="topo" class="container pt-36 pb-20 md:pt-44 md:pb-28 grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center">
    <div>
      <div class="reveal kicker">★ Avaliação personalizada · resultados naturais</div>
      <h1 class="reveal display text-6xl md:text-7xl mt-7">Realce a sua<br>beleza <span class="rosetext italic">natural</span>.</h1>
      <p class="reveal text-lg md:text-xl text-[color:var(--muted)] max-w-xl mt-7 leading-relaxed">[Diga o que seu espaço oferece e pra quem.] Protocolos de estética facial e corporal pensados pra valorizar quem você é — com segurança, sofisticação e um resultado que parece (e é) seu.</p>
      <div class="reveal flex flex-col sm:flex-row gap-4 mt-10"><a href="https://wa.me/5511900000000" class="btn btn-wa">Agendar minha avaliação →</a><a href="#procedimentos" class="btn btn-ghost">Ver procedimentos</a></div>
      <div class="reveal flex items-center gap-4 mt-10">
        <div class="flex -space-x-3">
          <img src="https://i.pravatar.cc/80?img=44" class="w-10 h-10 rounded-full border-2 object-cover" style="border-color:var(--bg)">
          <img src="https://i.pravatar.cc/80?img=25" class="w-10 h-10 rounded-full border-2 object-cover" style="border-color:var(--bg)">
          <img src="https://i.pravatar.cc/80?img=20" class="w-10 h-10 rounded-full border-2 object-cover" style="border-color:var(--bg)">
        </div>
        <div><div class="text-[color:var(--gold)] text-sm">★★★★★</div><div class="text-xs text-[color:var(--muted)]">+2.000 clientes · nota 4,9 no Google</div></div>
      </div>
    </div>
    <div class="reveal frame"><img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80" alt="" class="w-full h-[540px] object-cover"></div>
  </header>

  <section class="border-y border-[color:var(--line)]" style="background:#fff"><div class="container py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
    <div class="reveal"><div class="display rosetext text-4xl">+2 mil</div><div class="text-[color:var(--muted)] mt-1">clientes atendidas</div></div>
    <div class="reveal"><div class="display rosetext text-4xl">4,9 ⭐</div><div class="text-[color:var(--muted)] mt-1">no Google</div></div>
    <div class="reveal"><div class="display rosetext text-4xl">98%</div><div class="text-[color:var(--muted)] mt-1">recomendam</div></div>
    <div class="reveal"><div class="display rosetext text-4xl">12x</div><div class="text-[color:var(--muted)] mt-1">sem juros</div></div>
  </div></section>

  <section class="container py-24">
    <div class="reveal max-w-2xl"><div class="kicker mb-6">A gente entende</div><h2 class="display text-5xl md:text-6xl">Quer cuidar de você sem exagero.</h2></div>
    <div class="grid md:grid-cols-3 gap-5 mt-14">
      <div class="reveal card p-8"><div class="text-3xl mb-3">😟</div><h3 class="text-xl font-bold serif">Medo de ficar artificial</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Aqui o foco é o natural. A gente valoriza seus traços, sem exagero.</p></div>
      <div class="reveal card p-8"><div class="text-3xl mb-3">🤷</div><h3 class="text-xl font-bold serif">Não sabe por onde começar</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Na avaliação a gente monta um plano sob medida pra sua pele e seu objetivo.</p></div>
      <div class="reveal card p-8"><div class="text-3xl mb-3">😕</div><h3 class="text-xl font-bold serif">Já se decepcionou antes</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Profissionais qualificados, produtos de marca e ambiente seguro e acolhedor.</p></div>
    </div>
  </section>

  <section id="procedimentos" class="container py-24">
    <div class="reveal max-w-2xl"><div class="kicker mb-6">O que oferecemos</div><h2 class="display text-5xl md:text-6xl">Protocolos pra pele e corpo.</h2></div>
    <div class="grid md:grid-cols-3 gap-5 mt-14">
      <div class="reveal card p-8"><h3 class="serif text-2xl">Harmonização facial</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Botox, preenchimento e bioestimuladores pra um rosto equilibrado e natural.</p></div>
      <div class="reveal card p-8"><h3 class="serif text-2xl">Limpeza de pele</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Pele limpa, viçosa e renovada com protocolos profundos e suaves.</p></div>
      <div class="reveal card p-8"><h3 class="serif text-2xl">Skinbooster & peeling</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Hidratação profunda e renovação celular pra um glow de dentro pra fora.</p></div>
      <div class="reveal card p-8"><h3 class="serif text-2xl">Estética corporal</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Tratamentos pra gordura localizada, flacidez e celulite com tecnologia.</p></div>
      <div class="reveal card p-8"><h3 class="serif text-2xl">Massagens</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Drenagem e relaxamento pra cuidar do corpo e da mente.</p></div>
      <div class="reveal card p-8"><h3 class="serif text-2xl">Protocolos personalizados</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Combinamos os tratamentos certos pro seu objetivo e sua pele.</p></div>
    </div>
  </section>

  <section id="resultados" class="container py-24">
    <div class="reveal max-w-2xl"><div class="kicker mb-6">Resultados reais</div><h2 class="display text-5xl md:text-6xl">Beleza que se nota.</h2></div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
      <div class="reveal frame"><img src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&q=80" class="w-full h-56 object-cover" alt=""></div>
      <div class="reveal frame"><img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&q=80" class="w-full h-56 object-cover" alt=""></div>
      <div class="reveal frame"><img src="https://images.unsplash.com/photo-1498842812179-c81beecf902c?w=500&q=80" class="w-full h-56 object-cover" alt=""></div>
      <div class="reveal frame"><img src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500&q=80" class="w-full h-56 object-cover" alt=""></div>
    </div>
  </section>

  <section id="sobre" class="container py-24 grid lg:grid-cols-2 gap-16 items-center">
    <div class="reveal frame"><img src="https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80" alt="" class="w-full h-[520px] object-cover"></div>
    <div class="reveal">
      <div class="kicker mb-6">Quem cuida de você</div>
      <h2 class="display text-5xl md:text-6xl">Mãos experientes,<br>olhar pro natural.</h2>
      <p class="text-[color:var(--muted)] text-lg mt-6 leading-relaxed">[Apresente o(a) profissional: formação, especializações e filosofia de trabalho.] Cada protocolo é seguro, com produtos de marca e foco em realçar — nunca mascarar — a sua beleza.</p>
      <div class="hair my-8"></div>
      <div class="grid grid-cols-3 gap-6">
        <div><div class="display rosetext text-4xl">+10</div><div class="text-xs text-[color:var(--muted)] mt-1">anos de experiência</div></div>
        <div><div class="display rosetext text-4xl">+2 mil</div><div class="text-xs text-[color:var(--muted)] mt-1">clientes felizes</div></div>
        <div><div class="display rosetext text-4xl">100%</div><div class="text-xs text-[color:var(--muted)] mt-1">higienização</div></div>
      </div>
    </div>
  </section>

  <section class="container py-24">
    <div class="reveal max-w-2xl mx-auto text-center"><div class="kicker mb-6 mx-auto">Fácil assim</div><h2 class="display text-5xl md:text-6xl">Seu cuidado em 3 passos.</h2></div>
    <div class="grid md:grid-cols-3 gap-5 mt-14">
      <div class="reveal card p-8"><div class="serif rosetext text-5xl">01</div><h3 class="serif text-2xl mt-3">Avaliação</h3><p class="text-[color:var(--muted)] mt-2 leading-relaxed">Conversamos sobre seus objetivos e avaliamos sua pele, sem compromisso.</p></div>
      <div class="reveal card p-8"><div class="serif rosetext text-5xl">02</div><h3 class="serif text-2xl mt-3">Plano sob medida</h3><p class="text-[color:var(--muted)] mt-2 leading-relaxed">Montamos o protocolo ideal, com etapas e valores claros.</p></div>
      <div class="reveal card p-8"><div class="serif rosetext text-5xl">03</div><h3 class="serif text-2xl mt-3">Resultado natural</h3><p class="text-[color:var(--muted)] mt-2 leading-relaxed">Acompanhamos cada sessão até você se ver no espelho e sorrir.</p></div>
    </div>
  </section>

  <section id="avaliacoes" class="container py-24">
    <div class="reveal max-w-2xl"><div class="kicker mb-6">Quem já se cuidou aqui</div><h2 class="display text-5xl md:text-6xl">Clientes que voltam sempre.</h2></div>
    <div class="grid md:grid-cols-3 gap-5 mt-14">
      <div class="reveal card p-7"><div class="text-[color:var(--gold)] text-sm mb-3">★★★★★</div><p class="leading-relaxed">"Fiz harmonização com medo de ficar artificial e ficou perfeito, super natural. Todo mundo elogia."</p><div class="flex items-center gap-3 mt-6"><img src="https://i.pravatar.cc/80?img=31" class="w-11 h-11 rounded-full object-cover"><div><div class="font-semibold">Camila R.</div><div class="text-xs text-[color:var(--muted)]">Cliente · Google ✓</div></div></div></div>
      <div class="reveal card p-7"><div class="text-[color:var(--gold)] text-sm mb-3">★★★★★</div><p class="leading-relaxed">"Ambiente lindo, atendimento impecável e minha pele nunca esteve tão boa. Recomendo demais."</p><div class="flex items-center gap-3 mt-6"><img src="https://i.pravatar.cc/80?img=23" class="w-11 h-11 rounded-full object-cover"><div><div class="font-semibold">Aline S.</div><div class="text-xs text-[color:var(--muted)]">Cliente · Google ✓</div></div></div></div>
      <div class="reveal card p-7"><div class="text-[color:var(--gold)] text-sm mb-3">★★★★★</div><p class="leading-relaxed">"Profissional super atenciosa, explicou tudo e respeitou meu tempo. Saí renovada e confiante."</p><div class="flex items-center gap-3 mt-6"><img src="https://i.pravatar.cc/80?img=45" class="w-11 h-11 rounded-full object-cover"><div><div class="font-semibold">Beatriz M.</div><div class="text-xs text-[color:var(--muted)]">Cliente · Google ✓</div></div></div></div>
    </div>
  </section>

  <section class="container py-24">
    <div class="reveal card p-10 md:p-16 max-w-3xl mx-auto text-center relative overflow-hidden">
      <div class="kicker mb-6 mx-auto">Condição especial</div>
      <h2 class="display text-4xl md:text-5xl">Avaliação de pele <span class="rosetext">gratuita</span>.</h2>
      <p class="text-[color:var(--muted)] mt-5 max-w-md mx-auto">Agende esta semana e ganhe uma avaliação completa + plano personalizado, sem compromisso.</p>
      <a href="https://wa.me/5511900000000" class="btn btn-wa mt-8 text-lg">Quero minha avaliação grátis →</a>
    </div>
  </section>

  <section class="container py-12"><div class="reveal card p-8 flex flex-col sm:flex-row items-center gap-6 max-w-3xl mx-auto" style="border:1px dashed var(--rose)">
    <div class="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-3xl" style="background:rgba(200,96,126,.12)">🌸</div>
    <div><h3 class="serif text-2xl">Seu bem-estar em primeiro lugar</h3><p class="text-[color:var(--muted)] mt-1 leading-relaxed">Trabalhamos só com produtos e técnicas seguras, e respeitamos o seu tempo e o seu limite. Aqui você se cuida do seu jeito.</p></div>
  </div></section>

  <section id="faq" class="container py-24 max-w-3xl">
    <h2 class="reveal display text-5xl md:text-6xl mb-10 text-center">Perguntas frequentes</h2>
    <div class="reveal">
      <details class="faq"><summary>A avaliação é gratuita? <span class="pl">+</span></summary><p class="pb-5 text-[color:var(--muted)] leading-relaxed">Sim, a primeira avaliação é gratuita e sem compromisso. Você decide depois de conhecer o plano.</p></details>
      <details class="faq"><summary>Os resultados são naturais? <span class="pl">+</span></summary><p class="pb-5 text-[color:var(--muted)] leading-relaxed">Nosso foco é realçar sua beleza com naturalidade. Nada de exageros — respeitamos seus traços.</p></details>
      <details class="faq"><summary>Dá pra parcelar? <span class="pl">+</span></summary><p class="pb-5 text-[color:var(--muted)] leading-relaxed">Sim, parcelamos em até 12x no cartão, além de Pix e dinheiro com condição especial.</p></details>
      <details class="faq"><summary>É seguro? <span class="pl">+</span></summary><p class="pb-5 text-[color:var(--muted)] leading-relaxed">Sim. Profissionais qualificados, produtos de marca registrados e ambiente totalmente higienizado.</p></details>
      <details class="faq"><summary>Quantas sessões preciso? <span class="pl">+</span></summary><p class="pb-5 text-[color:var(--muted)] leading-relaxed">Depende do protocolo e do seu objetivo — explicamos tudo na avaliação.</p></details>
      <details class="faq"><summary>Onde fica o espaço? <span class="pl">+</span></summary><p class="pb-5 text-[color:var(--muted)] leading-relaxed">[Endereço e bairro.] Ambiente acolhedor e de fácil acesso.</p></details>
    </div>
  </section>

  <section class="container py-20">
    <div class="reveal max-w-xl mx-auto text-center"><div class="kicker mb-6 mx-auto">Agende sua avaliação</div><h2 class="display text-5xl md:text-6xl">Cuide-se hoje.</h2><p class="text-[color:var(--muted)] mt-5">Preencha abaixo ou chame no WhatsApp. A gente retorna pra marcar seu melhor horário.</p></div>
    <form class="reveal card p-7 md:p-9 max-w-xl mx-auto mt-10 space-y-4" onsubmit="return false">
      <input class="field" placeholder="Seu nome">
      <input class="field" placeholder="WhatsApp (com DDD)">
      <textarea class="field" rows="3" placeholder="O que você gostaria de tratar?"></textarea>
      <a href="https://wa.me/5511900000000" class="btn btn-wa w-full text-lg">Agendar pelo WhatsApp →</a>
    </form>
  </section>

  <footer class="border-t border-[color:var(--line)]" style="background:#fff">
    <div class="container py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
      <div class="lg:col-span-2">
        <div class="flex items-center gap-3"><span class="mark">E</span><span class="serif text-xl">[Seu Espaço]</span></div>
        <p class="text-sm text-[color:var(--muted)] mt-4 max-w-sm leading-relaxed">Estética facial e corporal com foco no natural, em [sua cidade]. Cuidado, segurança e sofisticação.</p>
      </div>
      <div>
        <p class="text-xs font-bold uppercase tracking-wider mb-4">Navegação</p>
        <ul class="space-y-2 text-sm text-[color:var(--muted)]">
          <li><a href="#procedimentos" class="hover:text-[color:var(--ink)]">Procedimentos</a></li>
          <li><a href="#resultados" class="hover:text-[color:var(--ink)]">Resultados</a></li>
          <li><a href="#avaliacoes" class="hover:text-[color:var(--ink)]">Avaliações</a></li>
          <li><a href="#faq" class="hover:text-[color:var(--ink)]">FAQ</a></li>
        </ul>
      </div>
      <div>
        <p class="text-xs font-bold uppercase tracking-wider mb-4">Contato</p>
        <ul class="space-y-2 text-sm text-[color:var(--muted)]">
          <li>📍 [Endereço, bairro — cidade]</li>
          <li>📱 (11) 90000-0000</li>
          <li>📷 @seuespaco</li>
        </ul>
      </div>
    </div>
    <div class="container pb-8"><div class="hair mb-6"></div><div class="flex flex-col sm:flex-row justify-between gap-3 text-xs text-[color:var(--muted)]"><span>© 2026 [Seu Espaço]. Todos os direitos reservados.</span><span>Política de Privacidade · Termos</span></div></div>
  </footer>
</div>

<a href="https://wa.me/5511900000000" class="wa" target="_blank" rel="noreferrer"><span class="ic">●</span><span>Falar no WhatsApp</span></a>


`;
export const Route = createFileRoute("/")({ head: () => ({ meta: [ { title: "[Seu Espaço] — Estética que realça sua beleza" } ] }), component: Index });
function Index(){
  useEffect(() => {
    const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:0.12});
    document.querySelectorAll(".reveal").forEach((el)=>io.observe(el));
    const onScroll=()=>{const n=document.getElementById("nav"); if(n) n.classList.toggle("s", window.scrollY>20);};
    addEventListener("scroll", onScroll, {passive:true});
    return () => { io.disconnect(); removeEventListener("scroll", onScroll); };
  }, []);
  return (<><style dangerouslySetInnerHTML={{ __html: CSS }} /><div dangerouslySetInnerHTML={{ __html: BODY }} /></>);
}
