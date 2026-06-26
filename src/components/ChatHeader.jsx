// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Bot, Trash2, ChevronDown, Check, MessageSquare, GamepadIcon, X } from 'lucide-react';
// @ts-ignore;
import { Button, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui';
// @ts-ignore;
import { cn } from '@/lib/utils';

const MODEL_CONFIGS = [{
  createModel: 'hunyuan-exp',
  streamModel: 'hunyuan-lite',
  displayName: '混元轻量版'
}, {
  createModel: 'hunyuan-exp',
  streamModel: 'hunyuan-t1-latest',
  displayName: '混元T1最新版'
}, {
  createModel: 'deepseek',
  streamModel: 'deepseek-r1-0528',
  displayName: 'DeepSeek R1'
}, {
  createModel: 'deepseek',
  streamModel: 'deepseek-v3-0324',
  displayName: 'DeepSeek V3'
}];
const MODE_CONFIGS = [{
  id: 'chat',
  name: '聊天模式',
  icon: MessageSquare,
  description: '与AI自由对话',
  color: 'text-gray-700'
}, {
  id: 'turtle-soup',
  name: '海龟汤游戏',
  icon: GamepadIcon,
  description: '推理猜谜游戏',
  color: 'text-gray-700'
}];
export function ChatHeader({
  gameMode,
  selectedModel,
  isModelDropdownOpen,
  isModeDropdownOpen,
  isClearDialogOpen,
  isClearing,
  showTurtleSoupNotification,
  onModelChange,
  onModeChange,
  onClearDialogOpen,
  onClearDialogClose,
  onClearChat,
  onCloseNotification,
  onToggleModelDropdown,
  onToggleModeDropdown
}) {
  const currentMode = MODE_CONFIGS.find(mode => mode.id === gameMode);
  return <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左上角模型选择器 */}
          <div className="relative">
            {gameMode === 'chat' && <div>
                <button onClick={onToggleModelDropdown} className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-150 text-sm font-medium">
                  <Bot className="w-4 h-4" />
                  <span className="hidden sm:inline">{selectedModel.displayName}</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform duration-150", isModelDropdownOpen && "rotate-180")} />
                </button>
                
                {isModelDropdownOpen && <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg z-50 min-w-[180px] overflow-hidden">
                    {MODEL_CONFIGS.map(model => <button key={`${model.createModel}-${model.streamModel}`} onClick={() => onModelChange(model)} className={cn("w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-all duration-150 flex items-center justify-between text-gray-700", selectedModel.streamModel === model.streamModel && "bg-blue-50 text-blue-600")}>
                        <span className="font-medium">{model.displayName}</span>
                        {selectedModel.streamModel === model.streamModel && <Check className="w-3 h-3 text-blue-600" />}
                      </button>)}
                  </div>}
              </div>}
          </div>
          
          {/* 居中标题 */}
          <h1 className="text-base font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
            智能助手
          </h1>
          
          {/* 右上角操作区域 */}
          <div className="flex items-center space-x-2">
            {/* 清除聊天记录按钮（仅在聊天模式下显示） */}
            {gameMode === 'chat' && <AlertDialog open={isClearDialogOpen} onOpenChange={onClearDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg p-2 border-0 transition-all duration-150">
                    <Trash2 className="w-3 h-3" />
                    <span className="hidden sm:inline text-sm font-medium ml-1">清除</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white border border-gray-100 rounded-lg shadow-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-semibold">确认清除聊天记录</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600">
                      此操作将永久删除您的所有聊天记录，无法恢复。确定要继续吗？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="space-x-2">
                    <AlertDialogCancel disabled={isClearing} className="rounded-lg border-gray-200 bg-white hover:bg-gray-50 transition-all duration-150 text-sm">
                      取消
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onClearChat} disabled={isClearing} className="bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-150 text-sm">
                      {isClearing ? '清除中...' : '确认'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>}
            
            {/* 模式切换器 */}
            <div className="relative">
              <button onClick={onToggleModeDropdown} className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-150">
                <currentMode.icon className={cn("w-4 h-4", currentMode.color)} />
                <span className="hidden sm:inline text-sm font-medium text-gray-700">{currentMode.name}</span>
                <ChevronDown className={cn("w-3 h-3 text-gray-600 transition-transform duration-150", isModeDropdownOpen && "rotate-180")} />
              </button>
              
              {/* 海龟汤游戏提示Bubble */}
              {showTurtleSoupNotification && gameMode === 'chat' && <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg p-3 w-64 z-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">🎮 新功能上线</p>
                      <p className="text-xs text-gray-600">海龟汤游戏已上线！点击模式切换器体验推理猜谜游戏</p>
                    </div>
                    <button onClick={onCloseNotification} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>}
              
              {isModeDropdownOpen && <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg z-50 min-w-[140px] overflow-hidden">
                  {MODE_CONFIGS.map(mode => {
                const IconComponent = mode.icon;
                return <button key={mode.id} onClick={() => onModeChange(mode.id)} className={cn("w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-all duration-150 flex items-center space-x-2", gameMode === mode.id && "bg-blue-50 text-blue-600")}>
                        <IconComponent className={cn("w-3 h-3", mode.color)} />
                        <span className="font-medium">{mode.name}</span>
                        {gameMode === mode.id && <Check className="w-3 h-3 text-blue-600 ml-auto" />}
                      </button>;
              })}
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
}