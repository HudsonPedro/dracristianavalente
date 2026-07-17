import { createFileRoute } from "@tanstack/react-router";

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Jost:wght@400;500;600;700&display=swap');

  :root{--bg:#faf7f3;--bg2:#f2ece4;--ink:#141414;--muted:#7a6f66;--rose:#c9a36b;--rose2:#8a6a3b;--gold:#c9a36b;--nude:#e6d5c2;--line:#ece4d8}
  *{box-sizing:border-box}html{scroll-behavior:smooth}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:"Jost",sans-serif;overflow-x:hidden}
  .serif{font-family:"Fraunces",serif}
  .display{font-family:"Fraunces",serif;font-weight:500;line-height:1.02;letter-spacing:-.01em}
  .container{max-width:1180px;margin:0 auto;padding-left:26px;padding-right:26px}
  .wrap{position:relative;z-index:2;min-height:100vh;display:flex;flex-direction:column}
  .rosetext{color:var(--rose2)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:600;border-radius:13px;padding:16px 28px;text-decoration:none;transition:transform .25s,box-shadow .25s;font-size:15px}
  .btn-wa{background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;box-shadow:0 16px 40px rgba(37,211,102,.3)}
  .btn-wa:hover{transform:translateY(-2px)}
  .btn-ghost{border:1px solid rgba(20,20,20,.2);color:var(--ink)}.btn-ghost:hover{background:rgba(20,20,20,.04)}
  .navwrap{background:color-mix(in srgb,var(--bg) 92%,transparent);-webkit-backdrop-filter:saturate(1.6) blur(18px);backdrop-filter:saturate(1.6) blur(18px);border-bottom:1px solid var(--line)}
  .mark{height:40px;width:auto;display:block}
  .legal{max-width:820px;margin:0 auto;padding:60px 0 80px}
  .legal h1{font-family:"Fraunces",serif;font-size:2.8rem;margin-bottom:14px;color:var(--ink)}
  .legal .updated{color:var(--muted);font-size:14px;margin-bottom:42px}
  .legal h2{font-family:"Fraunces",serif;font-size:1.5rem;margin-top:38px;margin-bottom:14px;color:var(--ink)}
  .legal h3{font-size:1.1rem;margin-top:26px;margin-bottom:10px;font-weight:600;color:var(--ink)}
  .legal p, .legal li{color:var(--muted);line-height:1.75;font-size:16px}
  .legal p{margin-bottom:14px}
  .legal ul{padding-left:22px;margin-bottom:18px}
  .legal li{padding:4px 0}
  .legal a{color:var(--rose2);text-decoration:underline}
  .hair{height:1px;background:linear-gradient(90deg,transparent,rgba(201,163,107,.5),transparent)}
  @media (max-width:640px){.legal h1{font-size:2.1rem}.legal{padding:40px 0 60px}}
`;

const WA = "https://wa.me/5541987837610?text=Ol%C3%A1%20Dra.%20Cristiana%2C%20gostaria%20de%20agendar%20minha%20avalia%C3%A7%C3%A3o.";

const CONTENT = `
<main class="wrap">
  <nav class="navwrap"><div class="container flex items-center justify-between h-[64px] px-5">
    <a href="/" class="flex items-center gap-3"><img src="https://assets.lovable.app/placeholder/placeholder-logo.png" alt="CV Estética" class="mark" onerror="this.style.display='none'"><span class="serif text-lg">Dra. Cristiana Valente</span></a>
    <a href="/" class="btn btn-ghost !py-2.5 !px-5 !text-sm">Voltar ao site</a>
  </div></nav>

  <div class="container flex-grow">
    <article class="legal">
      <h1 class="display">Termos de Uso</h1>
      <p class="updated">Última atualização: 17 de julho de 2026</p>

      <p>Estes Termos de Uso regem o acesso e a utilização do site e dos serviços oferecidos pela <strong>Dra. Cristiana Valente Estética</strong>. Ao navegar, agendar ou solicitar informações, você declara que leu, compreendeu e concorda com as condições abaixo.</p>

      <h2>1. Natureza dos serviços</h2>
      <p>A clínica oferece serviços de estética facial, corporal e capilar conduzidos por profissional qualificado, sob responsabilidade técnica da Dra. Cristiana Valente, enfermeira esteta e tricoterapeuta, inscrita no COREN-PR 451.408.</p>
      <p>Os protocolos são personalizados e realizados mediante avaliação prévia. Resultados podem variar de pessoa para pessoa, conforme fisiologia, idade, hábitos e adesão ao tratamento.</p>

      <h2>2. Agendamento e cancelamento</h2>
      <ul>
        <li>Os atendimentos são realizados <strong>mediante agendamento</strong> nas unidades LA BEAUTÉ (Batel) ou MAGMA CONSULTÓRIOS (Centro Cívico), em Curitiba – PR.</li>
        <li>O agendamento pode ser feito pelo WhatsApp <a href="${WA}" target="_blank" rel="noreferrer">(41) 98783-7610</a> ou por e-mail.</li>
        <li>Cancelamentos ou remarcações devem ser comunicados com pelo menos 24 horas de antecedência.</li>
        <li>A clínica se reserva o direito de cobrar uma taxa ou não reservar novos horários para pacientes com histórico de faltas sem aviso prévio.</li>
      </ul>

      <h2>3. Obrigações do paciente</h2>
      <p>Para sua segurança, o paciente deve:</p>
      <ul>
        <li>Informar corretamente seu histórico de saúde, alergias, uso de medicamentos, cirurgias e procedimentos estéticos anteriores.</li>
        <li>Seguir as orientações pré e pós-procedimento fornecidas pela clínica.</li>
        <li>Informar imediatamente qualquer reação adversa ou sintoma incomum após o procedimento.</li>
        <li>Comparecer no horário agendado e com a documentação necessária, quando solicitada.</li>
      </ul>

      <h2>4. Contraindicações e avaliação</h2>
      <p>Alguns procedimentos possuem contraindicações (gravidez, amamentação, certas patologias, medicamentos específicos, entre outros). A realização de qualquer protocolo depende da aprovação durante a avaliação presencial e da análise criteriosa do histórico clínico.</p>

      <h2>5. Propriedade intelectual</h2>
      <p>Todo o conteúdo deste site — textos, imagens, logo, vídeos, design, marca e nome comercial — é de propriedade exclusiva da Dra. Cristiana Valente Estética ou de seus licenciadores. É proibida a reprodução, distribuição ou uso comercial sem autorização prévia por escrito.</p>

      <h2>6. Limitação de responsabilidade</h2>
      <p>A clínica se esforça para manter as informações do site precisas e atualizadas, mas não se responsabiliza por:</p>
      <ul>
        <li>Erros de digitação ou desatualizações pontuais.</li>
        <li>Interpretações incorretas do conteúdo publicado.</li>
        <li>Resultados individuais de tratamentos, que dependem de múltiplos fatores biológicos e comportamentais.</li>
        <li>Interrupções temporárias de acesso ao site por motivos técnicos.</li>
      </ul>

      <h2>7. Privacidade e dados</h2>
      <p>O uso do site e o agendamento estão sujeitos à nossa <a href="/politica-de-privacidade">Política de Privacidade</a>, que explica como tratamos seus dados pessoais em conformidade com a LGPD.</p>

      <h2>8. Links externos</h2>
      <p>O site pode conter links para redes sociais ou plataformas de terceiros. Não nos responsabilizamos pelo conteúdo, políticas ou práticas de privacidade desses sites.</p>

      <h2>9. Alterações nos termos</h2>
      <p>Estes Termos podem ser atualizados a qualquer momento. A versão mais recente estará sempre disponível nesta página, com a data da última atualização no topo. O uso continuado do site após alterações implica na aceitação dos novos termos.</p>

      <h2>10. Legislação e foro</h2>
      <p>Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de Curitiba, Paraná, para dirimir quaisquer questões relacionadas a este documento.</p>

      <h2>11. Contato</h2>
      <p>Dra. Cristiana Valente Estética<br>
      E-mail: <a href="mailto:contato@dracristianavalente.com.br">contato@dracristianavalente.com.br</a><br>
      WhatsApp: <a href="${WA}" target="_blank" rel="noreferrer">(41) 98783-7610</a><br>
      COREN-PR 451.408</p>
    </article>
  </div>

  <footer class="bg-[#0f0f0f] text-white/80">
    <div class="container pb-8"><div class="hair mb-6"></div><div class="flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/60"><span>© 2026 Dra. Cristiana Valente Estética. Todos os direitos reservados.</span><span><a href="/politica-de-privacidade" class="hover:text-white">Política de Privacidade</a> · <a href="/termos" class="hover:text-white">Termos</a></span></div></div>
  </footer>
</main>
`;

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Dra. Cristiana Valente Estética" },
      { name: "description", content: "Termos de Uso da Dra. Cristiana Valente Estética. Conheça as regras para uso do site, agendamento e prestação dos serviços." },
      { property: "og:title", content: "Termos de Uso — Dra. Cristiana Valente Estética" },
      { property: "og:description", content: "Conheça as regras para uso do site, agendamento e prestação dos serviços." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (<><style dangerouslySetInnerHTML={{ __html: CSS }} /><div dangerouslySetInnerHTML={{ __html: CONTENT }} /></>);
}
