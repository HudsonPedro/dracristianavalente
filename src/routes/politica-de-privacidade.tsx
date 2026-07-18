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

const WA = "https://wa.me/5541991599558?text=Ol%C3%A1%20Dra.%20Cristiana%2C%20gostaria%20de%20agendar%20minha%20avalia%C3%A7%C3%A3o.";

const CONTENT = `
<main class="wrap">
  <nav class="navwrap"><div class="container flex items-center justify-between h-[64px] px-5">
    <a href="/" class="flex items-center gap-3"><img src="https://assets.lovable.app/placeholder/placeholder-logo.png" alt="CV Estética" class="mark" onerror="this.style.display='none'"><span class="serif text-lg">Dra. Cristiana Valente</span></a>
    <a href="/" class="btn btn-ghost !py-2.5 !px-5 !text-sm">Voltar ao site</a>
  </div></nav>

  <div class="container flex-grow">
    <article class="legal">
      <h1 class="display">Política de Privacidade</h1>
      <p class="updated">Última atualização: 17 de julho de 2026</p>

      <p>A <strong>Dra. Cristiana Valente Estética</strong> (“nós”, “nosso” ou “clínica”) valoriza a privacidade e a segurança dos dados de todos os visitantes e pacientes. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>

      <h2>1. Dados que coletamos</h2>
      <p>Coletamos apenas os dados necessários para prestar um atendimento seguro, personalizado e eficiente:</p>
      <ul>
        <li><strong>Dados de identificação:</strong> nome completo, data de nascimento, sexo, CPF e RG (quando exigido para prontuário).</li>
        <li><strong>Dados de contato:</strong> telefone, WhatsApp, e-mail e endereço.</li>
        <li><strong>Dados de saúde e estética:</strong> histórico médico, queixas, alergias, medicamentos, fotos de acompanhamento (com seu consentimento), procedimentos realizados e evolução dos tratamentos.</li>
        <li><strong>Dados de navegação:</strong> endereço IP, tipo de dispositivo, páginas visitadas e cookies, utilizados para melhorar a experiência do site.</li>
      </ul>

      <h2>2. Como coletamos os dados</h2>
      <ul>
        <li>Pelo preenchimento do formulário de contato ou agendamento.</li>
        <li>Por conversas no WhatsApp, e-mail, telefone ou presencialmente durante a consulta.</li>
        <li>Através de cookies e ferramentas de análise anônima de navegação.</li>
      </ul>

      <h2>3. Finalidade do uso dos dados</h2>
      <p>Utilizamos seus dados para:</p>
      <ul>
        <li>Agendar, confirmar e lembrar consultas e procedimentos.</li>
        <li>Montar e manter o prontuário médico-estético de forma segura.</li>
        <li>Personalizar protocolos de tratamento de acordo com seu perfil.</li>
        <li>Responder dúvidas, enviar orçamentos e acompanhar resultados.</li>
        <li>Enviar comunicações sobre cuidados pós-procedimento, novidades e conteúdos educativos, desde que você autorize.</li>
        <li>Cumprir obrigações legais e regulatórias de saúde e enfermagem.</li>
      </ul>

      <h2>4. Compartilhamento de dados</h2>
      <p>Não vendemos dados pessoais. Podemos compartilhar informações apenas quando:</p>
      <ul>
        <li>Exigido por lei, ordem judicial ou regulador competente.</li>
        <li>Necessário para a continuidade do tratamento, com profissionais e fornecedores devidamente contratados e sob sigilo.</li>
        <li>Autorizado expressamente por você.</li>
      </ul>

      <h2>5. Cookies e tecnologias de navegação</h2>
      <p>Utilizamos cookies essenciais para o funcionamento do site e cookies de análise (Google Analytics) para entender como os visitantes interagem com as páginas. Você pode gerenciar os cookies pelo navegador a qualquer momento.</p>

      <h2>6. Segurança da informação</h2>
      <p>Adotamos medidas técnicas e administrativas para proteger seus dados: armazenamento seguro, criptografia, acesso restrito a profissionais autorizados, senhas fortes e monitoramento constante. Mesmo assim, nenhum sistema é 100% invulnerável. Em caso de incidente de segurança, comunicaremos os afetados e as autoridades conforme a lei.</p>

      <h2>7. Seus direitos (LGPD)</h2>
      <p>Você tem o direito de:</p>
      <ul>
        <li>Saber se temos dados seus e quais são (confirmação e acesso).</li>
        <li>Corrigir informações incompletas ou desatualizadas.</li>
        <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
        <li>Revogar o consentimento a qualquer momento.</li>
        <li>Solicitar portabilidade dos dados.</li>
        <li>Ser informado sobre o compartilhamento de dados.</li>
      </ul>
      <p>Para exercer seus direitos, entre em contato pelo e-mail <a href="mailto:contato@dracristianavalente.com.br">contato@dracristianavalente.com.br</a> ou pelo WhatsApp <a href="${WA}" target="_blank" rel="noreferrer">(41) 99159-9558</a>.</p>

      <h2>8. Retenção e eliminação</h2>
      <p>Mantemos seus dados pelo tempo necessário para atender às finalidades descritas e cumprir obrigações legais (prontuários médicos, por exemplo). Após esse período, os dados são excluídos ou anonimizados de forma segura.</p>

      <h2>9. Alterações nesta política</h2>
      <p>Podemos atualizar esta Política de Privacidade periodicamente. A data da última versão estará sempre no topo desta página. Recomendamos revisá-la ao usar o site.</p>

      <h2>10. Contato</h2>
      <p>Dra. Cristiana Valente Estética<br>
      E-mail: <a href="mailto:contato@dracristianavalente.com.br">contato@dracristianavalente.com.br</a><br>
      WhatsApp: <a href="${WA}" target="_blank" rel="noreferrer">(41) 99159-9558</a><br>
      COREN-PR 451.408</p>
    </article>
  </div>

  <footer class="bg-[#0f0f0f] text-white/80">
    <div class="container pb-8"><div class="hair mb-6"></div><div class="flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/60"><span>© 2026  Powered by ✠ Hptech Informática. Todos os direitos reservados.</span><span><a href="/politica-de-privacidade" class="hover:text-white">Política de Privacidade</a> · <a href="/termos" class="hover:text-white">Termos</a></span></div></div>
  </footer>
</main>
`;

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Dra. Cristiana Valente Estética" },
      { name: "description", content: "Política de Privacidade da Dra. Cristiana Valente Estética. Conheça como seus dados são coletados, protegidos e utilizados em conformidade com a LGPD." },
      { property: "og:title", content: "Política de Privacidade — Dra. Cristiana Valente Estética" },
      { property: "og:description", content: "Conheça como seus dados são coletados, protegidos e utilizados em conformidade com a LGPD." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (<><style dangerouslySetInnerHTML={{ __html: CSS }} /><div dangerouslySetInnerHTML={{ __html: CONTENT }} /></>);
}
