"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback((): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on the snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood({ x: 5, y: 5 }); // or call generateFood() but need to be careful with dependencies
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling when playing
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 120);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 rounded-xl p-8 text-white shadow-2xl max-w-2xl w-full">
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-corporate-red-500 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-300">But don't worry, here's a game to kill some time!</p>
        <p className="text-xl font-mono mt-2">Score: <span className="text-green-400">{score}</span></p>
      </div>

      <div 
        className="relative bg-gray-800 border-4 border-gray-700 rounded-md overflow-hidden shadow-inner"
        style={{ width: 400, height: 400 }}
      >
        {/* Render Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute ${index === 0 ? 'bg-corporate-blue-400' : 'bg-corporate-blue-500'} border border-gray-800 rounded-sm`}
            style={{
              width: 20,
              height: 20,
              left: segment.x * 20,
              top: segment.y * 20,
              zIndex: index === 0 ? 10 : 1
            }}
          />
        ))}

        {/* Render Food */}
        <div
          className="absolute bg-corporate-red-500 rounded-full shadow-[0_0_10px_#e63946]"
          style={{
            width: 20,
            height: 20,
            left: food.x * 20,
            top: food.y * 20,
          }}
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20">
            <h3 className="text-3xl font-bold text-white mb-4">Game Over</h3>
            <p className="text-xl text-gray-300 mb-6">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-corporate-red-500 text-white rounded-md font-bold hover:bg-corporate-red-600 transition-colors mb-4"
            >
              Play Again
            </button>
            <Link href="/" className="text-corporate-blue-300 hover:text-white underline">
              Back to Home
            </Link>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <h3 className="text-3xl font-bold text-white tracking-widest">PAUSED</h3>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-sm text-gray-400 text-center flex gap-6">
        <p>Use <kbd className="bg-gray-700 text-white px-2 py-1 rounded">Arrow Keys</kbd> to move</p>
        <p>Use <kbd className="bg-gray-700 text-white px-2 py-1 rounded">Spacebar</kbd> to pause</p>
      </div>
    </div>
  );
}
