import { useEffect } from "react";
import { CSS } from "../../routes/index";

type SeoCard = {
  tag?: string;
  title: string;
  description: string;
};

type SeoStep = {
  number: string;
  title: string;
  description: string;
};

type SeoFaq = {
  question: string;
  answer: string;
};

type SeoTreatmentPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  primaryHref: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;

  introTitle: string;
  introParagraphs: string[];

  cardsTitle: string;
  cardsIntro?: string;
  cards: SeoCard[];

  evaluationEyebrow?: string;
  evaluationTitle?: string;
  evaluationParagraphs?: string[];

  stepsTitle?: string;
  steps?: SeoStep[];

  localEyebrow?: string;
  localTitle?: string;
  localParagraphs?: string[];

  faqTitle: string;
  faqItems: SeoFaq[];

  finalEyebrow: string;
  finalTitle: string;
  finalText: string;
  finalHref: string;
  finalLabel?: string;

  relatedHref?: string;
  relatedLabel?: string;
};

const SEO_MOTION_CSS = `
  .seo-page {
    position: relative;
    overflow: hidden;
  }

  .seo-page::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background:
      radial-gradient(560px circle at var(--seo-x, 20%) var(--seo-y, 18%), rgba(201,163,107,.10), transparent 60%),
      radial-gradient(520px circle at 82% 72%, rgba(138,106,59,.08), transparent 62%);
  }

  .seo-page > * {
    position: relative;
    z-index: 1;
  }

  .seo-reveal {
    opacity: 1;
    transform: none;
  }

  .seo-reveal.seo-ready {
    opacity: 0;
    transform: translateY(34px);
    filter: blur(4px);
    transition:
      opacity .82s cubic-bezier(.16,1,.3,1),
      transform .82s cubic-bezier(.16,1,.3,1),
      filter .72s cubic-bezier(.16,1,.3,1);
  }

  .seo-reveal.seo-ready.seo-in {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }

  .seo-grid > .seo-reveal:nth-child(1){transition-delay:.03s}
  .seo-grid > .seo-reveal:nth-child(2){transition-delay:.09s}
  .seo-grid > .seo-reveal:nth-child(3){transition-delay:.15s}
  .seo-grid > .seo-reveal:nth-child(4){transition-delay:.21s}
  .seo-grid > .seo-reveal:nth-child(5){transition-delay:.27s}
  .seo-grid > .seo-reveal:nth-child(6){transition-delay:.33s}

  .seo-card {
    position: relative;
    overflow: hidden;
    transition:
      transform .38s cubic-bezier(.16,1,.3,1),
      box-shadow .38s cubic-bezier(.16,1,.3,1),
      border-color .3s ease;
  }

  .seo-card::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    background:
      radial-gradient(360px circle at var(--card-x, 50%) var(--card-y, 50%), rgba(201,163,107,.15), transparent 55%);
    transition: opacity .3s ease;
  }

  .seo-card:hover {
    transform: translateY(-8px);
    border-color: rgba(201,163,107,.46);
    box-shadow: 0 26px 64px rgba(20,20,20,.10);
  }

  .seo-card:hover::before {
    opacity: 1;
  }

  .seo-hero {
    min-height: 66vh;
    display: flex;
    align-items: center;
  }

  .seo-hero-inner {
    transform: translate3d(0, calc(var(--seo-scroll, 0px) * -0.025), 0);
    transition: transform .08s linear;
  }

  .seo-accent-line {
    height: 1px;
    width: min(220px, 48vw);
    margin-top: 26px;
    background: linear-gradient(90deg, rgba(201,163,107,.75), transparent);
    transform-origin: left center;
    animation: seoLinePulse 3.8s ease-in-out infinite;
  }

  @keyframes seoLinePulse {
    0%,100% { transform: scaleX(.72); opacity: .65; }
    50% { transform: scaleX(1); opacity: 1; }
  }

  .seo-float {
    animation: seoFloat 6s ease-in-out infinite;
  }

  @keyframes seoFloat {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-7px); }
  }

  @media (max-width: 768px) {
    .seo-hero {
      min-height: auto;
    }

    .seo-hero-inner {
      transform: none;
    }

    .seo-card:hover {
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .seo-reveal,
    .seo-reveal.seo-ready,
    .seo-reveal.seo-ready.seo-in {
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
      transition: none !important;
    }

    .seo-accent-line,
    .seo-float {
      animation: none !important;
    }
  }
`;

export function SeoTreatmentPage(props: SeoTreatmentPageProps) {
  useEffect(() => {
    const reveal = Array.from(
      document.querySelectorAll<HTMLElement>(".seo-reveal")
    );

    reveal.forEach((el) => el.classList.add("seo-ready"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("seo-in");
            io.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    reveal.forEach((el) => io.observe(el));

    const onScroll = () => {
      document.documentElement.style.setProperty(
        "--seo-scroll",
        `${Math.min(window.scrollY, 900)}px`
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--seo-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--seo-y", `${event.clientY}px`);

      const card = (event.target as HTMLElement).closest(
        ".seo-card"
      ) as HTMLElement | null;

      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS + SEO_MOTION_CSS }} />

      <main className="seo-page">
        <section className="seo-hero container pt-24 pb-20 md:pt-36 md:pb-28">
          <div className="seo-hero-inner max-w-4xl">
            <div className="seo-reveal kicker mb-7">{props.eyebrow}</div>

            <h1 className="seo-reveal display text-5xl md:text-7xl leading-tight">
              {props.title}
            </h1>

            <p className="seo-reveal text-lg md:text-xl text-[color:var(--muted)] mt-7 max-w-3xl leading-relaxed">
              {props.intro}
            </p>

            <div className="seo-reveal seo-accent-line" />

            <div className="seo-reveal flex flex-col sm:flex-row gap-4 mt-10">
              <a href={props.primaryHref} className="btn btn-wa">
                {props.primaryLabel ?? "Agendar avaliação"}
              </a>

              {props.secondaryHref && (
                <a href={props.secondaryHref} className="btn btn-ghost">
                  {props.secondaryLabel ?? "Conhecer tratamentos"}
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="container py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="seo-reveal display text-4xl md:text-5xl">
              {props.introTitle}
            </h2>

            {props.introParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="seo-reveal text-lg text-[color:var(--muted)] mt-5 first:mt-7 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="container py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="seo-reveal display text-4xl md:text-5xl text-center">
              {props.cardsTitle}
            </h2>

            {props.cardsIntro && (
              <p className="seo-reveal text-lg text-[color:var(--muted)] mt-6 max-w-4xl mx-auto text-center leading-relaxed">
                {props.cardsIntro}
              </p>
            )}

            <div className="seo-grid grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
              {props.cards.map((card) => (
                <div
                  key={card.title}
                  className="seo-reveal seo-card card p-7"
                >
                  {card.tag && <span className="tag">{card.tag}</span>}
                  <h3 className="text-xl font-semibold mt-2">{card.title}</h3>
                  <p className="text-[color:var(--muted)] mt-3 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {props.evaluationTitle && (
          <section className="container py-20">
            <div className="max-w-4xl mx-auto">
              {props.evaluationEyebrow && (
                <div className="seo-reveal kicker mb-6">
                  {props.evaluationEyebrow}
                </div>
              )}

              <h2 className="seo-reveal display text-4xl md:text-5xl">
                {props.evaluationTitle}
              </h2>

              {props.evaluationParagraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="seo-reveal text-lg text-[color:var(--muted)] mt-5 first:mt-7 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {props.steps && props.steps.length > 0 && (
          <section className="container py-20">
            <div className="max-w-5xl mx-auto">
              <h2 className="seo-reveal display text-4xl md:text-5xl text-center">
                {props.stepsTitle}
              </h2>

              <div className="seo-grid grid md:grid-cols-3 gap-5 mt-12">
                {props.steps.map((step) => (
                  <div
                    key={step.number}
                    className="seo-reveal seo-card seo-float card p-8"
                  >
                    <div className="serif rosetext text-5xl">{step.number}</div>
                    <h3 className="serif text-2xl mt-3">{step.title}</h3>
                    <p className="text-[color:var(--muted)] mt-3 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {props.localTitle && (
          <section className="container py-20">
            <div className="max-w-4xl mx-auto">
              {props.localEyebrow && (
                <div className="seo-reveal kicker mb-6">
                  {props.localEyebrow}
                </div>
              )}

              <h2 className="seo-reveal display text-4xl md:text-5xl">
                {props.localTitle}
              </h2>

              {props.localParagraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="seo-reveal text-lg text-[color:var(--muted)] mt-5 first:mt-7 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}

              <a href={props.primaryHref} className="seo-reveal btn btn-wa mt-9">
                {props.primaryLabel ?? "Agendar avaliação"}
              </a>
            </div>
          </section>
        )}

        <section className="container py-24 max-w-3xl">
          <h2 className="seo-reveal display text-4xl md:text-5xl mb-10 text-center">
            {props.faqTitle}
          </h2>

          <div>
            {props.faqItems.map((item) => (
              <details key={item.question} className="seo-reveal faq">
                <summary>
                  {item.question}
                  <span className="pl">+</span>
                </summary>
                <p className="pb-5 text-[color:var(--muted)] leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="container py-24">
          <div className="seo-reveal seo-card card p-8 md:p-12 max-w-4xl mx-auto text-center">
            <div className="kicker mx-auto mb-6">{props.finalEyebrow}</div>

            <h2 className="display text-4xl md:text-5xl">{props.finalTitle}</h2>

            <p className="text-lg text-[color:var(--muted)] mt-6 max-w-2xl mx-auto leading-relaxed">
              {props.finalText}
            </p>

            <a href={props.finalHref} className="btn btn-wa mt-9">
              {props.finalLabel ?? "Agendar avaliação"}
            </a>
          </div>
        </section>

        {props.relatedHref && props.relatedLabel && (
          <section className="container pb-24">
            <div className="seo-reveal text-center">
              <a
                href={props.relatedHref}
                className="underline underline-offset-4 text-[color:var(--muted)] hover:text-[color:var(--ink)] transition"
              >
                {props.relatedLabel}
              </a>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
