import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';

const roundBank = [
  {
    id: 'forward-four',
    category: 'repeat',
    tag: '循序 → 重複',
    title: '前進 1 格 × 4',
    visual: ['→', '→', '→', '→'],
    prompt: '怎麼寫更精簡？',
    options: [
      { id: 'repeat-four', icon: '↻', count: '×4', label: '前進 1 格' },
      { id: 'repeat-one', icon: '→', count: '×1', label: '前進 4 格' },
      { id: 'repeat-backward', icon: '↶', count: '×4', label: '後退 1 格' },
    ],
    answer: 'repeat-four',
    explanation: '相同動作 ×4 → 重複 4 次',
  },
  {
    id: 'sound-three',
    category: 'repeat',
    tag: '循序 → 重複',
    title: '播放音效 × 3',
    visual: ['♪', '♪', '♪'],
    prompt: '選出重複結構',
    options: [
      { id: 'sound-three', icon: '↻', count: '×3', label: '播放音效' },
      { id: 'sound-one', icon: '♪', count: '×1', label: '播放三種音效' },
      { id: 'sound-five', icon: '↻', count: '×5', label: '播放音效' },
    ],
    answer: 'sound-three',
    explanation: '同一個音效出現 3 次 → 重複 3 次',
  },
  {
    id: 'square',
    category: 'repeat',
    tag: '重複結構',
    title: '畫一個正方形',
    visual: ['→', '↻', '→', '↻'],
    prompt: '哪個流程最適合？',
    options: [
      { id: 'square-sequence', icon: '→', count: '4', label: '循序' },
      { id: 'square-repeat', icon: '↻', count: '4', label: '重複' },
      { id: 'square-selection', icon: '?', count: '？', label: '選擇' },
    ],
    answer: 'square-repeat',
    explanation: '前進＋右轉重複 4 次，就能畫出正方形',
  },
  {
    id: 'score-selection',
    category: 'selection',
    tag: '選擇結構',
    title: '分數 60 分？',
    visual: ['60', '?', '✓ / ✕'],
    prompt: '這是哪種流程？',
    options: [
      { id: 'score-sequence', icon: '→', count: '01', label: '循序' },
      { id: 'score-repeat', icon: '↻', count: '∞', label: '重複' },
      { id: 'score-selection', icon: '◇', count: 'if', label: '選擇' },
    ],
    answer: 'score-selection',
    explanation: '根據條件走不同路徑 → 選擇結構',
  },
  {
    id: 'write-sequence',
    category: 'sequence',
    tag: '循序結構',
    title: '拿筆 → 寫字 → 放下',
    visual: ['✎', 'Aa', '↓'],
    prompt: '這是哪種流程？',
    options: [
      { id: 'write-sequence', icon: '→', count: '01', label: '循序' },
      { id: 'write-repeat', icon: '↻', count: '∞', label: '重複' },
      { id: 'write-selection', icon: '◇', count: 'if', label: '選擇' },
    ],
    answer: 'write-sequence',
    explanation: '按照固定先後順序執行 → 循序結構',
  },
  {
    id: 'traffic-selection',
    category: 'selection',
    tag: '選擇結構',
    title: '遇到紅燈？',
    visual: ['🚦', '?', '停 / 走'],
    prompt: '這是哪種流程？',
    options: [
      { id: 'traffic-sequence', icon: '→', count: '01', label: '循序' },
      { id: 'traffic-repeat', icon: '↻', count: '∞', label: '重複' },
      { id: 'traffic-selection', icon: '◇', count: 'if', label: '選擇' },
    ],
    answer: 'traffic-selection',
    explanation: '根據紅燈或綠燈做不同選擇 → 選擇結構',
  },
  {
    id: 'morning-sequence',
    category: 'sequence',
    tag: '循序結構',
    title: '準備早餐',
    visual: ['拿杯子', '倒牛奶', '喝完'],
    prompt: '這是哪種流程？',
    options: [
      { id: 'morning-sequence', icon: '→', count: '01', label: '循序' },
      { id: 'morning-repeat', icon: '↻', count: '∞', label: '重複' },
      { id: 'morning-selection', icon: '◇', count: 'if', label: '選擇' },
    ],
    answer: 'morning-sequence',
    explanation: '按照固定先後順序完成 → 循序結構',
  },
  {
    id: 'clap-five',
    category: 'repeat',
    tag: '循序 → 重複',
    title: '拍手 × 5',
    visual: ['👏', '👏', '👏', '👏', '👏'],
    prompt: '怎麼寫更精簡？',
    options: [
      { id: 'clap-five', icon: '↻', count: '×5', label: '拍手' },
      { id: 'clap-one', icon: '👏', count: '×1', label: '拍五下' },
      { id: 'clap-two', icon: '↻', count: '×2', label: '拍手' },
    ],
    answer: 'clap-five',
    explanation: '相同動作 ×5 → 重複 5 次',
  },
  {
    id: 'input-three',
    category: 'repeat',
    tag: '重複結構',
    title: '輸入 3 次成績',
    visual: ['⌨', '⌨', '⌨'],
    prompt: '怎麼設計最適合？',
    options: [
      { id: 'input-sequence', icon: '→', count: '3', label: '寫三次指令' },
      { id: 'input-repeat', icon: '↻', count: '×3', label: '重複輸入' },
      { id: 'input-selection', icon: '◇', count: 'if', label: '判斷輸入' },
    ],
    answer: 'input-repeat',
    explanation: '相同的輸入動作重複 3 次 → 重複結構',
  },
  {
    id: 'challenge-repeat-distance',
    category: 'challenge',
    structure: 'repeat',
    tag: '挑戰題 / 重複結構',
    title: '算出總距離',
    visualType: 'text',
    visual: ['目前 1 格', '重複 5 次', '每次前進 2 格'],
    prompt: '最後走了幾格？',
    options: [
      { id: 'distance-9', icon: '=', count: '9', label: '格' },
      { id: 'distance-11', icon: '=', count: '11', label: '格' },
      { id: 'distance-13', icon: '=', count: '13', label: '格' },
    ],
    answer: 'distance-11',
    explanation: '起點 1 格，加上每次 2 格 × 重複 5 次，共 11 格',
  },
  {
    id: 'challenge-sequence-order',
    category: 'challenge',
    structure: 'sequence',
    tag: '挑戰題 / 循序結構',
    title: '順序不能錯',
    visualType: 'text',
    visual: ['目前數字 4', '先 ＋ 3', '再 × 2'],
    prompt: '最後是多少？',
    options: [
      { id: 'result-11', icon: '=', count: '11', label: '' },
      { id: 'result-14', icon: '=', count: '14', label: '' },
      { id: 'result-16', icon: '=', count: '16', label: '' },
    ],
    answer: 'result-14',
    explanation: '先做 4＋3＝7，再做 7×2＝14',
  },
  {
    id: 'challenge-selection-order',
    category: 'challenge',
    structure: 'selection',
    tag: '挑戰題 / 選擇結構',
    title: '看懂輸出結果',
    visualType: 'text',
    visual: ['分數：78 分', '如果 ≥ 90 → 輸出「優秀」', '否則如果 ≥ 60 → 輸出「及格」', '否則 → 輸出「不及格」'],
    prompt: '程式最後會輸出哪一個？',
    options: [
      { id: 'grade-excellent', icon: '◇', count: '優秀', label: '' },
      { id: 'grade-pass', icon: '◇', count: '及格', label: '' },
      { id: 'grade-fail', icon: '◇', count: '不及格', label: '' },
    ],
    answer: 'grade-pass',
    explanation: '78 未達 90，但達到 60 → 顯示「及格」',
  },
  {
    id: 'challenge-pre-post-test',
    category: 'challenge',
    structure: 'repeat',
    tag: '挑戰題 / 前後判斷式',
    title: '先檢查，還是先做？',
    visualType: 'text',
    visual: ['目前生命值：0', '前判斷：先檢查再攻擊', '後判斷：先攻擊再檢查'],
    prompt: '一開始沒有生命值，攻擊各執行幾次？',
    options: [
      { id: 'pre-zero-post-one', icon: '?', count: '前 0／後 1', label: '次' },
      { id: 'pre-one-post-one', icon: '?', count: '前 1／後 1', label: '次' },
      { id: 'pre-zero-post-zero', icon: '?', count: '前 0／後 0', label: '次' },
    ],
    answer: 'pre-zero-post-one',
    explanation: '前判斷先檢查生命值，0 不符合所以攻擊 0 次；後判斷會先攻擊一次，再檢查生命值',
  },
];

const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
};

const createGameRounds = (excludedRoundIds = []) => {
  const excludedIds = new Set(excludedRoundIds);
  const freshRoundsForCategory = (category) => {
    const categoryRounds = roundBank.filter((round) => round.category === category);
    const freshRounds = categoryRounds.filter((round) => !excludedIds.has(round.id));
    return shuffle(freshRounds.length > 0 ? freshRounds : categoryRounds);
  };
  const requiredCategories = ['repeat', 'sequence', 'selection'];
  const requiredRounds = requiredCategories.map((category) => freshRoundsForCategory(category)[0]);
  const challengeRound = freshRoundsForCategory('challenge')[0];
  const selectedIds = new Set([...requiredRounds, challengeRound].map((round) => round.id));
  const freshRemainingRounds = shuffle(roundBank.filter((round) => (
    !selectedIds.has(round.id) && !excludedIds.has(round.id)
  )));
  const fallbackRemainingRounds = shuffle(roundBank.filter((round) => !selectedIds.has(round.id)));
  const remainingRounds = (freshRemainingRounds.length > 0 ? freshRemainingRounds : fallbackRemainingRounds).slice(0, 1);

  const normalRounds = shuffle([...requiredRounds, ...remainingRounds]);
  return [...normalRounds, challengeRound].map((round) => ({
    ...round,
    options: shuffle(round.options),
  }));
};

const initialGameRounds = [
  'forward-four',
  'write-sequence',
  'score-selection',
  'input-three',
  'challenge-repeat-distance',
].map((roundId) => roundBank.find((round) => round.id === roundId));

const confettiColors = ['#2878a4', '#f2b84b', '#e77c6e', '#66b6a3', '#8c78c8'];
const confettiPieces = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  style: {
    '--confetti-left': `${(index * 37) % 100}%`,
    '--confetti-delay': `${(index % 8) * 0.08}s`,
    '--confetti-duration': `${1.8 + (index % 4) * 0.2}s`,
    '--confetti-drift': `${-80 + ((index * 53) % 161)}px`,
    '--confetti-color': confettiColors[index % confettiColors.length],
  },
}));

export default function StructureGame() {
  const [gameRounds, setGameRounds] = useState(initialGameRounds);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const round = gameRounds[roundIndex];
  const isCorrect = selectedAnswer === round?.answer;

  useEffect(() => {
    setGameRounds(createGameRounds());
  }, []);

  const chooseAnswer = (answer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === round.answer) setScore((currentScore) => currentScore + 1);
  };

  const nextRound = () => {
    if (roundIndex === gameRounds.length - 1) {
      setIsFinished(true);
      return;
    }
    setRoundIndex((currentRound) => currentRound + 1);
    setSelectedAnswer('');
  };

  const restartGame = () => {
    setGameRounds(createGameRounds(gameRounds.map((round) => round.id)));
    setRoundIndex(0);
    setSelectedAnswer('');
    setScore(0);
    setIsFinished(false);
  };

  return (
    <main className="game-page">
      <section className="game-shell" aria-labelledby="game-title">
        <Link className="game-back" to="/">← 回到邀請卡</Link>

        {!isFinished ? (
          <>
            <header className="game-header">
              <div className="game-status-row">
                <p className="game-kicker">FLOW STRUCTURE QUEST</p>
                <span className="game-score">得分 {score} · 題組隨機</span>
              </div>
              <h1 className="game-title" id="game-title">流程結構闖關</h1>
              <div className="game-progress" aria-label={`第 ${roundIndex + 1} 題，共 ${gameRounds.length} 題`}>
                <span style={{ width: `${((roundIndex + 1) / gameRounds.length) * 100}%` }} />
              </div>
              <p className="game-round-label">第 {roundIndex + 1} 題 · {round.tag}</p>
            </header>

            <div className={`game-panel${round.category === 'challenge' ? ' game-panel--challenge' : ''}`}>
              <h2 className="game-round-title">
                {round.title}
                {round.category === 'challenge' && <span className="game-challenge-badge">挑戰題</span>}
              </h2>
              <div className={`game-visual game-visual--${round.visual.length}${round.visualType ? ` game-visual--${round.visualType}` : ''}`} aria-label={round.title}>
                {round.visual.map((icon, index) => (
                  <React.Fragment key={`${round.tag}-${index}`}>
                    <span className="game-visual-block">{icon}</span>
                    {index < round.visual.length - 1 && (
                      <span className="game-visual-arrow" aria-hidden="true">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="game-prompt">
                {round.prompt}
                {(round.category === 'repeat' || round.structure === 'repeat') && (
                  <span className="game-prompt-hint"><span aria-hidden="true">↻</span> 代表重複執行</span>
                )}
              </p>

              <div className="game-answers" role="group" aria-label="答案選項">
                {round.options.map((option) => {
                  const isSelected = selectedAnswer === option.id;
                  const stateClass = isSelected
                    ? option.id === round.answer
                      ? ' game-answer--correct'
                      : ' game-answer--incorrect'
                    : '';

                  return (
                    <button
                      className={`game-answer${stateClass}`}
                      type="button"
                      key={option.id}
                      aria-label={`${option.label} ${option.count}`}
                      aria-pressed={isSelected}
                      onClick={() => chooseAnswer(option.id)}
                    >
                      <span className={`game-answer-icon${option.icon.length > 1 ? ' game-answer-icon--wide' : ''}`} aria-hidden="true">{option.icon}</span>
                      <span className="game-answer-count" aria-hidden="true">{option.count}</span>
                      <span className="game-answer-label">{option.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedAnswer && (
                <div className={`game-feedback${isCorrect ? ' game-feedback--success' : ''}`} aria-live="polite">
                  <p>{isCorrect ? '✓ 答對了！' : '✕ 再想想'}</p>
                  <small>{round.explanation}</small>
                  <button className="game-next" type="button" onClick={nextRound}>
                    {roundIndex === gameRounds.length - 1 ? '看結果' : '下一題 →'}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <section className="game-complete" aria-labelledby="game-complete-title">
            {score >= 3 && (
              <div className="game-confetti" aria-hidden="true">
                {confettiPieces.map((piece) => (
                  <span className="game-confetti-piece" key={piece.id} style={piece.style} />
                ))}
              </div>
            )}
            {score < 3 && (
              <div className="game-encourage-animation" aria-hidden="true">
                <span className="game-encourage-ring" />
                <span className="game-encourage-icon">↻</span>
              </div>
            )}
            <p className="game-kicker">QUEST COMPLETE</p>
            <h1 className="game-title" id="game-complete-title">闖關完成！</h1>
            <div className="game-final-score"><strong>{score}</strong><span>/ {gameRounds.length}</span></div>
            <p className="game-complete-text">
              {score >= 3
                ? '恭喜老師了解程式三大結構的基本了！'
                : '請老師再玩一次，更加了解程式的三大結構！'}
            </p>
            <p className="game-complete-explanation">
              依照答對題數顯示不同提示詞，也是根據條件做選擇的結構喔！
            </p>
            <div className="game-complete-actions">
              <button className="game-next" type="button" onClick={restartGame}>再玩一次</button>
              <Link className="game-home-link" to="/">回到邀請卡</Link>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export const Head = () => (
  <>
    <html lang="zh-Hant" />
    <title>流程結構闖關</title>
    <meta name="description" content="用循序、重複、選擇三大流程結構進行闖關。" />
    <meta name="theme-color" content="#0b1118" />
  </>
);
