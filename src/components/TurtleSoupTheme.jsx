// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { RotateCcw, Lightbulb } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { cn } from '@/lib/utils';

export function TurtleSoupTheme({
  currentTheme,
  isGameWon,
  usedHints,
  onResetGame,
  onHintRequest
}) {
  if (!currentTheme) return null;
  return <div className="bg-white border border-gray-100 rounded-xl p-4 mt-3 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{currentTheme.title}</h3>
          <p className="text-xs text-gray-600 leading-relaxed">{currentTheme.description}</p>
        </div>
        <span className={cn("text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-3", currentTheme.difficulty === '简单' && "bg-green-100 text-green-700", currentTheme.difficulty === '中等' && "bg-yellow-100 text-yellow-700", currentTheme.difficulty === '困难' && "bg-red-100 text-red-700")}>
          {currentTheme.difficulty}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={onResetGame} variant="outline" size="sm" className={cn("text-xs rounded-lg h-7 px-3", isGameWon ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100")}>
          <RotateCcw className="w-3 h-3 mr-1" />
          {isGameWon ? '新游戏' : '重置'}
        </Button>
        {!isGameWon && <Button onClick={onHintRequest} variant="outline" size="sm" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 rounded-lg h-7 px-3">
            <Lightbulb className="w-3 h-3 mr-1" />
            提示 ({usedHints.length}/3)
          </Button>}
      </div>
    </div>;
}