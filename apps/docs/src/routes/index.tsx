import type { RouteComponent } from '@emberkit/core';
import { navigate } from '@emberkit/core';
import { IconZap, IconPackage, IconTarget, IconType, IconArrowRight, IconCode } from './icons';

const HomePage: RouteComponent = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          v0.1.0 Now Available
        </div>
        <h1 className="hero-title">
          The <span className="gradient-text">minimalist</span> JSX framework
        </h1>
        <p className="hero-subtitle">
          Built for speed, minimal weight, and zero JavaScript by default.
          TypeScript-first with file-based routing.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/docs/introduction')}>
            Get Started
            <IconArrowRight size={18} />
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/docs/api')}>
            View API
          </button>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <div className="feature-icon">
            <IconZap size={32} />
          </div>
          <h3>Lightning Fast</h3>
          <p>Sub-50ms SSR with streaming support. Optimized for performance from the ground up.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <IconPackage size={32} />
          </div>
          <h3>Under 10KB</h3>
          <p>Minimal runtime that is fully tree-shakeable. Pay only for what you use.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <IconTarget size={32} />
          </div>
          <h3>Zero JS Default</h3>
          <p>Only interactive elements receive hydration. Static content stays static.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <IconType size={32} />
          </div>
          <h3>TypeScript First</h3>
          <p>Full type safety with excellent IDE support. Catch errors before they happen.</p>
        </div>
      </section>

      <section className="code-preview">
        <h2>
          <IconCode size={24} />
          Simple API
        </h2>
        <pre><code>{`import { createSignal, render } from '@emberkit/core';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count()}
    </button>
  );
}

render(<Counter />, document.body);`}</code></pre>
      </section>
    </div>
  );
};

export default HomePage;