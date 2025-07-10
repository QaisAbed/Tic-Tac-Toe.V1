// 3D Tic Tac Toe Board Component using React Three Fiber and Framer Motion
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { motion } from 'framer-motion';

const cellPositions = [
  [-1, 1, 0], [0, 1, 0], [1, 1, 0],
  [-1, 0, 0], [0, 0, 0], [1, 0, 0],
  [-1, -1, 0], [0, -1, 0], [1, -1, 0],
];

function Cell({ value, onClick, position, isWinning }) {
  return (
    <motion.mesh
      position={position}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      animate={{ scale: isWinning ? 1.3 : 1 }}
    >
      <boxGeometry args={[0.9, 0.9, 0.2]} />
      <meshStandardMaterial color={isWinning ? '#FFD700' : '#61dafb'} />
      {value && (
        <Html center style={{ pointerEvents: 'none', fontSize: '2rem', fontWeight: 'bold', color: '#222' }}>
          {value}
        </Html>
      )}
    </motion.mesh>
  );
}

export default function TicTacToe3D({ board, onCellClick, winningLine }) {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 50 }} style={{ height: 400 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 5, 5]} intensity={0.7} />
      <OrbitControls enablePan={false} enableZoom={false} />
      {cellPositions.map((pos, idx) => (
        <Cell
          key={idx}
          value={board[idx]}
          onClick={() => onCellClick(idx)}
          position={pos}
          isWinning={winningLine && winningLine.includes(idx)}
        />
      ))}
    </Canvas>
  );
}
