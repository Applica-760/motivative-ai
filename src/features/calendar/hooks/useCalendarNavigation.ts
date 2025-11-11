import { useState, useCallback } from 'react';

/**
 * カレンダーの月間ナビゲーションを管理するカスタムフック
 * 
 * ビジネスロジックをUI層から分離し、再利用可能にする
 */
export function useCalendarNavigation(initialDate: Date = new Date()) {
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);

  /**
   * 前月へ移動
   */
  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  }, []);

  /**
   * 次月へ移動
   */
  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  }, []);

  /**
   * 特定の月へ移動
   */
  const goToMonth = useCallback((date: Date) => {
    setCurrentMonth(date);
  }, []);

  return {
    currentMonth,
    goToPrevMonth,
    goToNextMonth,
    goToMonth,
  };
}
