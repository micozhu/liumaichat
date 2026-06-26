// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Send } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { cn } from '@/lib/utils';

export function InputArea({
  inputValue,
  isLoading,
  isGameWon,
  gameMode,
  currentTheme,
  onInputChange,
  onSendMessage,
  onKeyPress
}) {
  const placeholder = isGameWon ? "🎉 游戏已结束，点击重置开始新游戏" : gameMode === 'turtle-soup' && currentTheme ? "输入你的猜测或提问..." : "输入消息...";
  return <div className="bg-white border-t border-gray-100">
      <div className="px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 shadow-sm border border-gray-100">
            <input type="text" value={inputValue} onChange={onInputChange} onKeyPress={onKeyPress} placeholder={placeholder} className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm" disabled={isLoading || isGameWon || gameMode === 'turtle-soup' && !currentTheme} />
            <button onClick={onSendMessage} disabled={!inputValue.trim() || isLoading || isGameWon || gameMode === 'turtle-soup' && !currentTheme} className="ml-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-150 shadow-sm hover:shadow">
              <Send className="w-4 h-4" />
            </button>
          </div>
          {gameMode === 'turtle-soup' && currentTheme && !isGameWon && <p className="text-xs text-gray-500 mt-2 text-center">
              💡 输入"提示"可以获取线索帮助！我会用"是"、"否"或"无关"来回答你的提问
            </p>}
          {isGameWon && <p className="text-xs text-green-600 mt-2 text-center font-medium">
              🎉 恭喜你猜对了！点击上方"开始新游戏"按钮继续挑战
            </p>}
        </div>
      </div>
    </div>;
}