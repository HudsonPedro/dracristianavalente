import { useEffect, useRef, useState } from "react";

type ProtocoloPreviewProps = {
  imagem: string;
  titulo: string;
  texto: string;
  link: string;
  textoLink: string;
  children: React.ReactNode;
};

export function ProtocoloPreview({
  imagem,
  titulo,
  texto,
  link,
  textoLink,
  children,
}: ProtocoloPreviewProps) {
  const [hover, setHover] = useState(false);
  const [fixo, setFixo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const aberto = hover || fixo;

  useEffect(() => {
    function fecharAoClicarFora(event: MouseEvent) {
      if (
        fixo &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setFixo(false);
        setHover(false);
      }
    }

    document.addEventListener("mousedown", fecharAoClicarFora);

    return () => {
      document.removeEventListener("mousedown", fecharAoClicarFora);
    };
  }, [fixo]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        if (!fixo) setHover(false);
      }}
      onClick={(event) => {
        const alvo = event.target as HTMLElement;

        if (alvo.closest("a")) return;

        event.preventDefault();
        event.stopPropagation();

        setFixo(true);
        setHover(true);
      }}
    >
      {children}

      <div
        className={`
          absolute
          left-4 right-4
          bottom-4
          z-30
          overflow-hidden
          rounded-[20px]
          border
          border-white/30
          bg-[#171411]/95
          text-white
          shadow-2xl
          backdrop-blur-xl
          transition-all
          duration-500
          ease-out
          ${
            aberto
              ? "visible translate-y-0 scale-100 opacity-100"
              : "invisible translate-y-5 scale-[0.96] opacity-0 pointer-events-none"
          }
        `}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-[190px] overflow-hidden">
          <img
            src={imagem}
            alt={titulo}
            className={`
              h-full
              w-full
              object-cover
              transition-transform
              duration-[1200ms]
              ease-out
              ${aberto ? "scale-105" : "scale-100"}
            `}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#171411] via-[#171411]/20 to-transparent" />

          {fixo && (
            <div className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md">
              Fixado
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8b57c]">
            Dra. Cristiana Valente
          </div>

          <h3 className="font-serif text-[25px] leading-tight text-white">
            {titulo}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-white/70">
            {texto}
          </p>

          <a
            href={link}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#e0bd84] transition hover:gap-3 hover:text-white"
          >
            {textoLink}
            <span aria-hidden="true">→</span>
          </a>

          {fixo && (
            <p className="mt-4 border-t border-white/10 pt-4 text-[11px] text-white/45">
              Clique fora do card para fechar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
