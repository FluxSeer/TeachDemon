import React, { useEffect, useRef, useState } from 'react';
import { graphql } from 'gatsby';

const flows = [
  { name: 'SEQUENCE', translation: '循序結構' },
  { name: 'REPETITION', translation: '重複結構' },
  { name: 'SELECTION', translation: '選擇結構' },
];

const invitationDetails = [
  { label: '日期', english: 'DATE', value: '2026 / 11 / XX（　）' },
  { label: '演示時間', english: 'DEMONSTRATION', value: '10:05–10:50' },
  { label: '議課時間', english: 'DISCUSSION', value: '10:50' },
  { label: '活動地點', english: 'LOCATION', value: '綜合大樓 四樓\n401電腦教室' },
];

const teachingPresenter = { role: '資訊科技實習教師', name: '張芸楨' };

const guidanceTeam = [
  { role: '實習指導教授', name: '孫培真 教授' },
  { role: '實習輔導教師', name: '卓進豐 教師' },
];

const resources = [
  {
    type: 'PDF',
    label: '教案',
    english: 'LESSON PLAN',
    description: '課程設計、教學流程與教材內容',
    href: 'https://docs.google.com/document/d/1-NdooljIolQxqRun0kGqrWPdWeCFGuR_i3v0wMZW0XI/edit?usp=sharing',
  },
  {
    type: 'PPT',
    label: '我的簡報',
    english: 'PRESENTATION',
    description: '康軒第一冊第四章・四份投影片',
    links: [
      { label: '循序重複結構', href: 'https://canva.link/6fym4we46m99jor' },
      { label: '判斷式', href: 'https://canva.link/alh1obnyy9ms0lu' },
      { label: '條件組合', href: 'https://canva.link/djjitzj3boyncz3' },
      { label: '計算數量與金額', href: 'https://canva.link/d1426vg3xejnkwe' },
    ],
  },
  {
    type: 'FORM',
    label: '問卷回饋',
    english: 'FEEDBACK FORM',
    description: '留下本次教學演示的回饋與建議',
    href: 'https://forms.gle/DRKFLogWjhuYx7Ru6',
  },
];

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const cursorFollowSmoothing = 0.45;

export default function HomePage({ data }) {
  const [activeFlow, setActiveFlow] = useState(-1);
  const [typedCommand, setTypedCommand] = useState('');
  const [typedBootText, setTypedBootText] = useState('');
  const [typedNotice, setTypedNotice] = useState('');
  const [status, setStatus] = useState('INITIALIZING INVITATION SYSTEM');
  const [isReady, setIsReady] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showInvitation, setShowInvitation] = useState(false);
  const catRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      setTypedCommand('invitation.exe');
      setTypedBootText('Initializing invitation system...\nLoading teaching demonstration data...');
      setTypedNotice('[ SYSTEM ] Invitation file is currently locked.');
      setStatus('WAITING FOR USER INPUT');
      setIsReady(true);
      return () => {
        cancelled = true;
      };
    }

    async function typeText(text, setText, speed) {
      for (let index = 0; index < text.length; index += 1) {
        if (cancelled) return;
        setText(text.slice(0, index + 1));
        await delay(speed);
      }
    }

    async function typeIntroduction() {
      await typeText('invitation.exe', setTypedCommand, 75);
      await delay(350);
      await typeText(
        'Initializing invitation system...\nLoading teaching demonstration data...',
        setTypedBootText,
        28,
      );
      await delay(350);
      await typeText(
        '[ SYSTEM ] Invitation file is currently locked.',
        setTypedNotice,
        32,
      );

      if (!cancelled) {
        setStatus('WAITING FOR USER INPUT');
        setIsReady(true);
      }
    }

    typeIntroduction();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isStarted) return undefined;

    let cancelled = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    async function startSystem() {
      await delay(reducedMotion ? 0 : 1000);
      if (cancelled) return;

      for (let index = 0; index < flows.length; index += 1) {
        setActiveFlow(index);
        setStatus(`${flows[index].name} STRUCTURE : LOADED`);
        await delay(reducedMotion ? 0 : 1000);
        if (cancelled) return;
      }

      setIsComplete(true);
      setStatus('SYSTEM RESTORED · INVITATION UNLOCKED');
      await delay(reducedMotion ? 0 : 1000);
      if (cancelled) return;

      setIsLeaving(true);
      await delay(reducedMotion ? 0 : 1000);
      if (cancelled) return;

      setShowTerminal(false);
      setShowInvitation(true);
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    }

    startSystem();
    return () => {
      cancelled = true;
    };
  }, [isStarted]);

  useEffect(() => {
    if (!showInvitation || !catRef.current) return undefined;

    const cat = catRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrame;
    const initialPosition = {
      x: window.innerWidth * 0.78,
      y: window.innerHeight * 0.78,
    };
    let targetPosition = { ...initialPosition };
    let catPosition = { ...initialPosition };
    let lastFrameTime = window.performance.now();

    const renderCat = (currentTime) => {
      if (!reducedMotion) {
        const elapsedSeconds = Math.max(0, (currentTime - lastFrameTime) / 1000);
        const progress = 1 - Math.exp(-elapsedSeconds / cursorFollowSmoothing);
        catPosition.x += (targetPosition.x - catPosition.x) * progress;
        catPosition.y += (targetPosition.y - catPosition.y) * progress;
      } else {
        catPosition = { ...targetPosition };
      }
      lastFrameTime = currentTime;

      cat.style.setProperty('--cat-x', `${catPosition.x}px`);
      cat.style.setProperty('--cat-y', `${catPosition.y}px`);

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame((time) => renderCat(time));
      }
    };

    const handlePointerActivity = (event) => {
      const catBounds = cat.getBoundingClientRect();
      targetPosition = {
        x: Math.max(12, Math.min(event.clientX, window.innerWidth - catBounds.width - 12)),
        y: Math.max(12, Math.min(event.clientY, window.innerHeight - catBounds.height - 12)),
      };

      if (reducedMotion) {
        renderCat(window.performance.now());
      }
    };

    const handlePointerDown = (event) => {
      handlePointerActivity(event);
    };

    const handlePointerMove = (event) => {
      handlePointerActivity(event);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    renderCat(lastFrameTime);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [showInvitation]);

  return (
    <main>
      {showTerminal && (
        <section
          className={`terminal-screen${isLeaving ? ' terminal-screen--leaving' : ''}`}
          aria-label="教學演示系統啟動畫面"
        >
          <div className="terminal-window">
            <header className="terminal-header">
              <div className="terminal-buttons" aria-hidden="true">
                <span className="terminal-button" />
                <span className="terminal-button" />
                <span className="terminal-button" />
              </div>
              <div className="terminal-title">Teaching Demonstration System</div>
            </header>

            <div className="terminal-content">
              <p className="command-line">
                <span className="terminal-path">C:\\TeachingDemo&gt;</span> {typedCommand}
              </p>
              <p className="system-text">{typedBootText}</p>
              {typedNotice && <p className="warning">{typedNotice}</p>}

              <div className="flow-container" aria-label="程式流程結構載入進度">
                {flows.map((flow, index) => {
                  const isActive = index <= activeFlow;
                  return (
                    <div
                      className={`flow-item${isActive ? ' flow-item--active' : ''}`}
                      key={flow.name}
                    >
                      <span className="flow-icon">0{index + 1}</span>
                      <span className="flow-name">
                        {flow.name}
                        <span className="flow-translation">/ {flow.translation}</span>
                      </span>
                      <span className="flow-check" aria-label={isActive ? '已載入' : '等待載入'}>
                        {isActive ? '✓' : '·'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className={`terminal-status${isComplete ? ' terminal-status--success' : ''}`} aria-live="polite">
                {status}
                {!isStarted && <span className="cursor" aria-hidden="true" />}
              </p>
              {!isStarted && isReady && (
                <button
                  className="terminal-start"
                  type="button"
                  onClick={() => setIsStarted(true)}
                >
                  START INVITATION SYSTEM <span aria-hidden="true">↵</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <section
        className={`invitation-screen${showInvitation ? ' invitation-screen--visible' : ''}`}
        aria-label="115 學年度教學演示邀請函"
        aria-hidden={!showInvitation}
        style={{ display: showInvitation ? 'block' : 'none' }}
      >
        <article className="invitation-card">
          <div className="card-frame" aria-hidden="true" />
          <div className="card-content">
            <div className="card-meta" aria-hidden="true">
              <span>IT / 115</span>
              <span>INVITATION No. 01</span>
            </div>
            <p className="academic-year">115TH ACADEMIC YEAR <span>・ 資訊科技科</span></p>
            <p className="school-name">臺中市立北新國民中學</p>
            <h1 className="main-title">115學年度教學演示</h1>
            <p className="invitation-text">
              誠摯邀請您蒞臨指導，給予教學建議，讓此次教學演示更加圓滿。
            </p>

            <section className="event-section" aria-labelledby="event-title">
              <h2 className="section-heading" id="event-title">活動資訊 <span>EVENT DETAILS</span></h2>
              <div className="info-grid">
                {invitationDetails.map((item, index) => (
                  <div
                    className={`info-box info-box--item-${index + 1}${index === 0 ? ' info-box--featured' : ''}`}
                    key={item.label}
                  >
                    <span className="info-number" aria-hidden="true">0{index + 1}</span>
                    <div className="info-box-inner">
                      <div className="info-heading">
                        <p className="info-kicker">{item.english}</p>
                        <p className="info-label">{item.label}</p>
                      </div>
                      <p className="info-value">{item.value}</p>
                    </div>
                    <span className="info-arrow" aria-hidden="true">↗</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="topic" aria-labelledby="topic-title">
              <h2 className="topic-label" id="topic-title">教學主題 <span>TEACHING TOPIC</span></h2>
              <p className="topic-main">程式的三大流程結構</p>
              <ol className="topic-steps">
                <li><span>01</span>循序</li>
                <li><span>02</span>重複</li>
                <li><span>03</span>選擇</li>
              </ol>
            </section>

            <section className="people-sections" aria-label="教學與指導人員">
              {guidanceTeam.map((member, index) => (
                <div className="teacher-item" key={member.role}>
                  <span className="teacher-index" aria-hidden="true">0{index + 1}</span>
                  <div className="teacher-copy">
                    <p className="teacher-role">{member.role}</p>
                    <p className="teacher-name">{member.name}</p>
                  </div>
                </div>
              ))}

              <div className="teacher-item teacher-item--presenter">
                <span className="teacher-index" aria-hidden="true">03</span>
                <div className="teacher-copy">
                  <p className="teacher-role">{teachingPresenter.role}</p>
                  <p className="teacher-name">{teachingPresenter.name}</p>
                </div>
              </div>
            </section>

            <section className="resources-section" aria-labelledby="resources-title">
              <h2 className="section-heading" id="resources-title">教學資源 <span>RESOURCES</span></h2>
              <div className="resource-grid">
                {resources.map((resource) => {
                  if (resource.links) {
                    return (
                      <details className="resource-card resource-card--presentation" key={resource.english}>
                        <summary className="resource-summary">
                          <span className="resource-type" aria-hidden="true">{resource.type}</span>
                          <span className="resource-copy">
                            <span className="resource-kicker">{resource.english}</span>
                            <span className="resource-title">{resource.label}</span>
                            <span className="resource-description">{resource.description}</span>
                          </span>
                          <span className="resource-arrow" aria-hidden="true">⌄</span>
                        </summary>
                        <div className="presentation-links">
                          {resource.links.map((link, index) => (
                            <a
                              className="presentation-link"
                              href={link.href}
                              key={link.href}
                              rel="noreferrer"
                              target="_blank"
                            >
                              <span className="presentation-number" aria-hidden="true">0{index + 1}</span>
                              <span>{link.label}</span>
                              <span aria-hidden="true">↗</span>
                            </a>
                          ))}
                        </div>
                      </details>
                    );
                  }

                  const ResourceCard = resource.href ? 'a' : 'div';
                  const resourceProps = resource.href
                    ? { href: resource.href, target: '_blank', rel: 'noreferrer' }
                    : {};

                  return (
                    <ResourceCard
                      className={`resource-card${resource.href ? ' resource-card--linked' : ''}`}
                      key={resource.english}
                      {...resourceProps}
                    >
                      <span className="resource-type" aria-hidden="true">{resource.type}</span>
                      <span className="resource-copy">
                        <span className="resource-kicker">{resource.english}</span>
                        <span className="resource-title">{resource.label}</span>
                        <span className="resource-description">{resource.description}</span>
                      </span>
                      <span className="resource-arrow" aria-hidden="true">↗</span>
                      {!resource.href && <span className="resource-status">待補上連結</span>}
                    </ResourceCard>
                  );
                })}
              </div>
            </section>

            <footer className="footer">
              INFORMATION TECHNOLOGY · TEACHING DEMONSTRATION
            </footer>
          </div>
        </article>
      </section>

      <img
        ref={catRef}
        className={`cursor-cat${showInvitation ? ' cursor-cat--visible' : ''}`}
        src="/cat-cursor.png"
        alt=""
        aria-hidden="true"
      />
    </main>
  );
}

export const Head = ({ data }) => (
  <>
    <html lang="zh-Hant" />
    <title>{data.site.siteMetadata.title}</title>
    <meta name="description" content={data.site.siteMetadata.description} />
    <meta name="theme-color" content="#0b1118" />
  </>
);

export const query = graphql`
  query InvitationPageQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;
