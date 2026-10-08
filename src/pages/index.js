import React, { useEffect, useRef, useState } from 'react';
import { graphql } from 'gatsby';

const flows = [
  { name: 'SEQUENCE', translation: '循序結構' },
  { name: 'REPETITION', translation: '重複結構' },
  { name: 'SELECTION', translation: '選擇結構' },
];

const invitationDetails = [
  { label: '日期', english: 'DATE', value: '2026 / 11 / XX' },
  { label: '教學演示時間', english: 'DEMONSTRATION', value: '10:05–10:50（第三節）' },
  { label: '議課時間', english: 'DISCUSSION', value: '10:50' },
  { label: '活動地點', english: 'LOCATION', value: '綜合活動四樓 401 電腦教室' },
];

const teachingPresenter = { role: '資訊科技實習老師', name: '張芸楨' };

const guidanceTeam = [
  { role: '實習輔導老師', name: '卓進豐 老師' },
  { role: '實習指導教授', name: '孫培真 教授' },
];

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const cursorFollowDelay = 1000;

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
      time: window.performance.now(),
    };
    let pointerHistory = [initialPosition];

    const renderCat = (currentTime) => {
      let position = pointerHistory[pointerHistory.length - 1];

      if (!reducedMotion) {
        const delayedTime = currentTime - cursorFollowDelay;
        while (pointerHistory.length > 1 && pointerHistory[1].time <= delayedTime) {
          pointerHistory.shift();
        }

        const earlierPosition = pointerHistory[0];
        const laterPosition = pointerHistory[1];
        position = earlierPosition;

        if (laterPosition && laterPosition.time > earlierPosition.time) {
          const progress = Math.max(
            0,
            Math.min(
              1,
              (delayedTime - earlierPosition.time) /
                (laterPosition.time - earlierPosition.time),
            ),
          );
          position = {
            x: earlierPosition.x + (laterPosition.x - earlierPosition.x) * progress,
            y: earlierPosition.y + (laterPosition.y - earlierPosition.y) * progress,
          };
        }
      }

      cat.style.setProperty('--cat-x', `${position.x}px`);
      cat.style.setProperty('--cat-y', `${position.y}px`);

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame((time) => renderCat(time));
      }
    };

    const handlePointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      const position = {
        x: event.clientX,
        y: event.clientY,
        time: window.performance.now(),
      };

      if (reducedMotion) {
        pointerHistory = [position];
        renderCat(position.time);
        return;
      }

      pointerHistory.push(position);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    renderCat(initialPosition.time);

    return () => {
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
          <div className="card-content">
            <p className="academic-year">115TH ACADEMIC YEAR <span>・ 資訊科技科</span></p>
            <p className="school-name">臺中市立北新國民中學</p>
            <h1 className="main-title">115學年度教學演示</h1>
            <p className="invitation-text">
              誠摯邀請您蒞臨指導，給予教學建議，讓此次教學演示更加圓滿。
            </p>

            <section className="event-section" aria-labelledby="event-title">
              <h2 className="section-heading" id="event-title">活動資訊 <span>EVENT DETAILS</span></h2>
              <div className="info-grid">
                {invitationDetails.map((item) => (
                  <div className={`info-box${item.wide ? ' info-box--wide' : ''}`} key={item.label}>
                    <div className="info-heading">
                      <p className="info-kicker">{item.english}</p>
                      <p className="info-label">{item.label}</p>
                    </div>
                    <p className="info-value">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="people-sections" aria-label="教學與指導人員">
              <div className="teacher-section" aria-labelledby="teaching-title">
                <h2 className="section-heading" id="teaching-title">教學 <span>TEACHING</span></h2>
                <div className="teacher-grid teacher-grid--teaching">
                  <div className="teacher-item">
                    <p className="teacher-role">{teachingPresenter.role}</p>
                    <p className="teacher-name">{teachingPresenter.name}</p>
                  </div>
                </div>
              </div>

              <div className="teacher-section" aria-labelledby="guidance-title">
                <h2 className="section-heading" id="guidance-title">指導 <span>GUIDANCE</span></h2>
                <div className="teacher-grid teacher-grid--guidance">
                  {guidanceTeam.map((member) => (
                  <div className="teacher-item" key={member.role}>
                    <p className="teacher-role">{member.role}</p>
                    <p className="teacher-name">{member.name}</p>
                  </div>
                  ))}
                </div>
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
