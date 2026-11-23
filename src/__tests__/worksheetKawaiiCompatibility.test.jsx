import React from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import App from '../App.jsx';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

it('かわいいシール帳の既存データを保ったまま、100問けいさんの報酬を同じ残高に保存する', () => {
  // Vitest evaluates some existing JSX modules with the classic JSX transform.
  vi.stubGlobal('React', React);
  const saveKey = 'sticker-book-v2';
  const olderSave = {
    level: 68,
    coins: 725,
    stickerCounts: { 'ss-ame-chan': 3 },
    squeezeCounts: { 'sq-n01': 2 },
    levelStars: { 68: 3 },
    totalStars: 3,
    totalPlayed: 42,
    buddyId: 'room-kitten',
    abacusRecords: {
      sessions: [{
        id: 'previous-minute-session', date: '2026-09-29', mode: 'minute', reached: 28,
        attempts: 1, mistakes: 0, correct: 1, verified: true, completed: true,
        remainingSeconds: 0, reward: 5, dailyBonus: 100, newBest: true,
      }],
    },
  };
  localStorage.setItem(saveKey, JSON.stringify(olderSave));

  const { unmount } = render(<App />);
  expect(screen.getByRole('heading', { name: 'かわいいシール帳' })).toBeTruthy();
  expect(screen.getByText('68/68')).toBeTruthy();
  expect(JSON.parse(localStorage.getItem(saveKey))).toMatchObject(olderSave);

  fireEvent.click(screen.getByRole('button', { name: /100問けいさん.*5分テスト/ }));
  fireEvent.click(screen.getByRole('button', { name: '100問をはじめる' }));
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '9999' } });
  fireEvent.click(screen.getByRole('button', { name: '提出して採点' }));
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: '採点する' }));
  expect(screen.getByText(/ごほうび ＋500コイン/)).toBeTruthy();
  expect(JSON.parse(localStorage.getItem(saveKey))).toMatchObject({ ...olderSave, coins: 1225 });

  unmount();
  render(<App />);
  expect(screen.getByText('68/68')).toBeTruthy();
  expect(screen.getByText('1225')).toBeTruthy();
  expect(JSON.parse(localStorage.getItem(saveKey))).toMatchObject({ ...olderSave, coins: 1225 });
});
