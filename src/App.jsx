import { useState, useEffect, useRef } from 'react'
import './App.css'
import TicTacToe3D from './TicTacToe3D'
import { motion } from 'framer-motion'

const emptyBoard = Array(9).fill(null);
const lines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function calculateWinner(board) {
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
}

function ClassicBoard({ board, onCellClick, winningLine }) {
  return (
    <motion.div
      className="classic-board responsive-board"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(48px, 1fr))',
        gap: 14,
        margin: '2.2rem auto',
        background: 'rgba(0,230,211,0.10)',
        borderRadius: 18,
        boxShadow: '0 4px 18px 0 rgba(0,230,211,0.10)',
        padding: 18,
        backdropFilter: 'blur(6px)',
        border: '2px solid #00e6d3',
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        maxWidth: 340,
        minWidth: 220,
        height: 'max-content',
        boxSizing: 'border-box',
      }}
    >
      {board.map((cell, idx) => {
        const isWin = winningLine && winningLine.includes(idx);
        return (
          <motion.button
            key={idx}
            onClick={() => onCellClick(idx)}
            whileHover={{ scale: cell ? 1 : 1.08, boxShadow: cell ? undefined : '0 0 10px #00e6d3' }}
            whileTap={{ scale: 0.96 }}
            style={{
              width: 'clamp(44px, 12vw, 72px)',
              height: 'clamp(44px, 12vw, 72px)',
              minWidth: 36,
              minHeight: 36,
              maxWidth: 90,
              maxHeight: 90,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(1.2rem, 4vw, 2.2rem)',
              fontWeight: 900,
              background: isWin
                ? 'radial-gradient(circle at 60% 40%, #00e6d3 60%, #fff 100%)'
                : 'linear-gradient(135deg, #232526 60%, #414345 100%)',
              color: isWin ? '#232526' : '#fff',
              border: isWin ? '2.5px solid #00e6d3' : '2px solid #00e6d3',
              borderRadius: 10,
              cursor: cell ? 'default' : 'pointer',
              transition: 'background 0.2s, box-shadow 0.2s',
              boxShadow: isWin
                ? '0 0 10px #00e6d3, 0 2px 6px #00e6d355'
                : '0 2px 6px #00e6d355',
              outline: 'none',
              letterSpacing: 1,
              position: 'relative',
              overflow: 'hidden',
              zIndex: 1,
              justifyItems: 'center',
              padding: 0,
              touchAction: 'manipulation',
            }}
            disabled={!!cell}
          >
            <span style={{
              zIndex: 2,
              userSelect: 'none',
              textShadow: isWin ? '0 2px 8px #fff8' : '0 2px 8px #00e6d388',
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}>{cell}</span>
            {/* Soft inner shadow for depth */}
            <span style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 10,
              boxShadow: 'inset 0 2px 8px 0 rgba(0,0,0,0.18)',
              pointerEvents: 'none',
              zIndex: 1,
            }} />
          </motion.button>
        );
      })}
    </motion.div>
  );
}

function App() {
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerHistory, setWinnerHistory] = useState([]); // Track winner history
  const [is3D, setIs3D] = useState(true); // Toggle for 3D/classic
  const winnerLine = calculateWinner(board);
  const winner = winnerLine ? board[winnerLine[0]] : null;
  const prevWinnerRef = useRef(null);

  // Automatically record winner or draw as soon as the game ends
  useEffect(() => {
    const isDraw = !winner && board.every(Boolean);
    if (winner && prevWinnerRef.current !== winner) {
      setWinnerHistory(prev => [...prev, winner]);
      prevWinnerRef.current = winner;
    } else if (isDraw && prevWinnerRef.current !== 'Draw') {
      setWinnerHistory(prev => [...prev, 'Draw']);
      prevWinnerRef.current = 'Draw';
    }
    if (!winner && !isDraw) {
      prevWinnerRef.current = null;
    }
  }, [winner, board]);

  function handleCellClick(idx) {
    if (board[idx] || winner) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setBoard(emptyBoard);
    setXIsNext(true);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 60% 20%, #232526 60%, #232526 100%)',
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      <motion.div
        initial={{ scale: 0.98, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: 'spring' }}
        style={{
          background: 'rgba(30,40,50,0.82)',
          borderRadius: 32,
          boxShadow: '0 8px 40px 0 #00e6d355, 0 1.5px 0 #00e6d3',
          padding: 'clamp(1.2rem, 6vw, 2.8rem) clamp(1.2rem, 8vw, 3.2rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1.5px solid #00e6d3',
          width: '100%',
          maxWidth: 410,
          minWidth: 0,
          position: 'relative',
          overflow: 'visible',
          backdropFilter: 'blur(12px) saturate(1.2)',
        }}
      >
        <h1 style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(1.7rem, 7vw, 2.7rem)',
          letterSpacing: 2,
          color: '#fff',
          marginBottom: 18,
          textShadow: '0 2px 16px #00e6d3, 0 2px 12px #00e6d355',
          textAlign: 'center',
        }}>
          Tic Tac Toe <span style={{ color: '#00e6d3', textShadow: '0 2px 8px #00e6d388, 0 0 16px #00e6d3' }}>3D</span>
        </h1>
        <div style={{ margin: '2rem 0 0 0', textAlign: 'center', width: '100%' }}>
          {/* 3D/classic toggle */}
          <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, flexWrap: 'wrap' }}>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem', letterSpacing: 1 }}>3D Mode</span>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
              <input
                type="checkbox"
                checked={is3D}
                onChange={e => setIs3D(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
              />
              <span style={{
                width: 44,
                height: 24,
                background: is3D ? 'linear-gradient(90deg, #00e6d3 60%, #232526 100%)' : '#232526',
                borderRadius: 14,
                display: 'inline-block',
                position: 'relative',
                transition: 'background 0.2s',
                boxShadow: is3D ? '0 0 12px #00e6d3, 0 0 2px #00e6d3' : '0 1px 4px #0006',
                marginRight: 10,
                border: is3D ? '2px solid #00e6d3' : '2px solid #444',
              }}>
                <span style={{
                  position: 'absolute',
                  left: is3D ? 22 : 4,
                  top: 3,
                  width: 18,
                  height: 18,
                  background: '#fff',
                  borderRadius: '50%',
                  boxShadow: is3D ? '0 2px 12px #00e6d3' : '0 2px 8px #00e6d355',
                  transition: 'left 0.2s',
                  border: '2px solid #00e6d3',
                }} />
              </span>
              <span style={{ color: is3D ? '#00e6d3' : '#fff', fontWeight: 700, fontSize: '1.1rem', letterSpacing: 1 }}>{is3D ? 'On' : 'Off'}</span>
            </label>
          </div>
          {/* Board */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', overflowX: 'auto', minHeight: 120, margin: '0 auto' }}>
            {is3D ? (
              <TicTacToe3D board={board} onCellClick={handleCellClick} winningLine={winnerLine} className="tictactoe-3d-board responsive-board" />
            ) : (
              <ClassicBoard board={board} onCellClick={handleCellClick} winningLine={winnerLine} />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 28, flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: '#00e6d3', color: '#232526', boxShadow: '0 0 24px #00e6d3' }}
              whileTap={{ scale: 0.96 }}
              onClick={handleReset}
              style={{
                padding: 'clamp(0.7rem, 2vw, 1.1rem) clamp(1.3rem, 6vw, 2.6rem)',
                fontSize: 'clamp(1.1rem, 3vw, 1.2rem)',
                fontWeight: 800,
                borderRadius: 16,
                border: '2.5px solid #00e6d3',
                background: 'linear-gradient(90deg, #232526 0%, #00e6d3 100%)',
                color: '#fff',
                boxShadow: '0 2px 16px #00e6d355',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: 1,
                outline: 'none',
                minWidth: 120,
                marginBottom: 6,
              }}
            >
              Restart
            </motion.button>
            {/* Reset history icon button */}
            <motion.button
              whileHover={{ scale: 1.18, backgroundColor: '#fff' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWinnerHistory([])}
              style={{
                background: 'rgba(0,230,211,0.08)',
                border: '2.5px solid #00e6d3',
                borderRadius: '50%',
                cursor: 'pointer',
                padding: 7,
                marginLeft: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 12px #00e6d355',
                transition: 'all 0.2s',
                minWidth: 44,
                minHeight: 44,
                color: '#00e6d3',
              }}
              title="Reset Winner History"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00e6d3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            </motion.button>
          </div>
          {/* Winner History */}
          {winnerHistory.length > 0 && (
            <motion.div style={{ marginTop: 36 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 10, letterSpacing: 1.2, fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', textShadow: '0 2px 8px #00e6d3' }}>Winner History</h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                color: '#00e6d3',
                fontWeight: 700,
                fontSize: 'clamp(1rem, 2.5vw, 1.13rem)',
                letterSpacing: 1,
                textAlign: 'center',
                textShadow: '0 2px 8px #00e6d3',
              }}>
                {winnerHistory.map((w, i) => (
                  <li key={i} style={{ marginBottom: 2 }}>
                    Game {i + 1}: {w === 'Draw' ? (
                      <span style={{ color: '#ffb347' }}>Draw</span>
                    ) : (
                      <span style={{ color: w === 'X' ? '#00e6d3' : '#ff5e62' }}>{w}</span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>
      {/* Responsive styles for board and buttons */}
      <style>{`
        @media (max-width: 700px) {
          .responsive-board {
            max-width: 98vw !important;
            min-width: 0 !important;
            padding: 8px !important;
            gap: 7px !important;
          }
        }
        @media (max-width: 500px) {
          .responsive-board {
            grid-template-columns: repeat(3, minmax(28px, 1fr)) !important;
            gap: 4px !important;
            padding: 4px !important;
          }
          .responsive-board button {
            width: clamp(22px, 12vw, 38px) !important;
            height: clamp(22px, 12vw, 38px) !important;
            font-size: clamp(0.8rem, 4vw, 1.1rem) !important;
          }
        }
        @media (max-width: 400px) {
          .responsive-board {
            grid-template-columns: repeat(3, minmax(18px, 1fr)) !important;
            gap: 2px !important;
            padding: 2px !important;
          }
          .responsive-board button {
            width: clamp(16px, 10vw, 28px) !important;
            height: clamp(16px, 10vw, 28px) !important;
            font-size: clamp(0.7rem, 3vw, 0.9rem) !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App
