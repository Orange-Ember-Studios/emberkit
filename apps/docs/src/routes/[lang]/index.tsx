import type { RouteComponent } from '@emberkit/core';
import { LazyInView, useNavigate } from '@emberkit/core';
import { IconZap, IconPackage, IconTarget, IconType, IconArrowRight } from '@emberkit/icons';
import { Icon } from '@emberkit/ui';
import { CodeBlock } from '@emberkit/ui/molecules';
import { renderRichText } from '../../lib/rich-text.js';
import { docsNavPath } from '../../lib/i18n.js';
import { useI18n, type DocsLocale } from '../../lib/i18n.js';

const sectionFallback = (minHeight: string) => (
  <div
    className={`rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse ${minHeight}`}
    aria-hidden="true"
  />
);

const HomePage: RouteComponent<{ params?: Record<string, string> }> = ({ params }) => {
  const navigate = useNavigate();
  const { t, locale: ctxLocale } = useI18n();
  const locale = (params?.lang ?? ctxLocale) as DocsLocale;

  const features = [
    {
      icon: <IconZap size={28} />,
      title: t('home.featureSpeedTitle'),
      desc: t('home.featureSpeedDesc'),
    },
    {
      icon: <IconPackage size={28} />,
      title: t('home.featureWeightTitle'),
      desc: t('home.featureWeightDesc'),
    },
    {
      icon: <IconTarget size={28} />,
      title: t('home.featureZeroTitle'),
      desc: t('home.featureZeroDesc'),
    },
    {
      icon: <IconType size={28} />,
      title: t('home.featureTsTitle'),
      desc: t('home.featureTsDesc'),
    },
  ];

  const stats = [
    { label: t('home.statTtfb'), value: t('home.statTtfbValue'), color: 'text-emerald-400' },
    { label: t('home.statRuntime'), value: t('home.statRuntimeValue'), color: 'text-orange-400' },
    { label: t('home.statClient'), value: t('home.statClientValue'), color: 'text-amber-400' },
  ];

  return (
    <div className="relative -mx-4 max-lg:-mt-6 sm:-mx-6 lg:-mx-16 lg:-mt-12 min-h-0 overflow-x-hidden text-gray-100">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[150px] animate-pulse" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-amber-500/15 blur-[120px] animate-pulse [animation-delay:700ms]" />

      <section className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-10 h-28 w-28 animate-bounce md:h-32 md:w-32" style={{ animationDuration: '3s' }}>
          <span className="relative z-10 flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/30 via-fuchsia-500/20 to-cyan-500/15 ring-2 ring-orange-400/35 shadow-[0_0_40px_rgba(249,115,22,0.35)]">
            <Icon name="emberkit" size={76} className="text-orange-100 drop-shadow-[0_0_24px_rgba(251,113,133,0.65)]" />
          </span>
        </div>

        <span className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-fuchsia-400 to-cyan-300 md:text-base">
          {t('home.tagline')}
        </span>

        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          <span className="bg-gradient-to-br from-orange-300 via-orange-500 to-fuchsia-500 bg-clip-text text-transparent">EmberKit</span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-2xl">
          {renderRichText(t('home.hero'))}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:from-orange-400 hover:to-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95"
            onClick={() => navigate(docsNavPath('introduction', locale))}
          >
            {t('home.getStarted')}
            <IconArrowRight size={18} />
          </button>
          <button
            className="min-w-[200px] rounded-full border border-white/10 bg-transparent px-8 py-4 font-semibold text-gray-300 transition-all duration-300 hover:border-orange-400 hover:bg-white/5 hover:text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] active:scale-95"
            onClick={() => navigate(docsNavPath('api', locale))}
          >
            {t('home.viewApi')}
          </button>
        </div>
      </section>

      <LazyInView className="relative z-10" minHeight="24rem" ssr="eager" fallback={sectionFallback('min-h-96')}>
        <section className="relative z-10 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              {renderRichText(t('home.whyTitle'))}
            </h2>
            <p className="max-w-2xl text-lg text-gray-400">{t('home.whySubtitle')}</p>

            <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:border-orange-500/40 hover:bg-white/[0.04] hover:-translate-y-1"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/15 to-orange-700/10 text-orange-400 group-hover:text-orange-300">
                    {f.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white group-hover:text-orange-300">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-300">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazyInView>

      <LazyInView className="relative z-10" minHeight="30rem" fallback={sectionFallback('min-h-[30rem]')}>
        <section className="relative z-10 py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0d1117] shadow-2xl">
              <CodeBlock
                code={`import { createSignal } from '@emberkit/core';

function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <div>
      <span data-ek-bind={count}>{count()}</span>
      <button type="button" onClick={() => setCount((n) => n + 1)}>+</button>
    </div>
  );
}`}
                language="tsx"
              />
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center hover:border-orange-500/30"
                >
                  <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="mt-1 text-sm text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazyInView>

      <LazyInView className="relative z-10" minHeight="18rem" fallback={sectionFallback('min-h-72')}>
        <section className="relative z-10 py-24 text-center">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{t('home.ctaTitle')}</h2>
            <p className="mb-8 text-lg text-gray-400">{t('home.ctaSubtitle')}</p>
            <button
              className="rounded-full bg-gradient-to-r from-orange-500 to-orange-700 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all hover:scale-[1.03] active:scale-95"
              onClick={() => navigate(docsNavPath('quick-start', locale))}
            >
              {t('home.ctaButton')}
            </button>
          </div>
        </section>
      </LazyInView>
    </div>
  );
};

export default HomePage;
