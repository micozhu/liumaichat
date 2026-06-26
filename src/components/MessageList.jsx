// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { User, Bot } from 'lucide-react';
// @ts-ignore;
import { cn } from '@/lib/utils';

export function MessageList({
  messages,
  isLoading,
  hasLoadedMessages,
  gameMode
}) {
  if (gameMode === 'turtle-soup' && !messages.length) return null;
  return <div className="px-4 py-4 max-w-4xl mx-auto space-y-3">
      {hasLoadedMessages && messages.length === 0 && gameMode === 'chat' && <div className="flex flex-col items-center justify-center h-80 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">欢迎使用智能助手</h3>
            <p className="text-xs text-gray-600">开始一段愉快的对话吧</p>
          </div>
        </div>}
      
      {messages.map((message, index) => <div key={index} className={cn("flex gap-3", message.role === 'user' ? 'justify-end' : 'justify-start')}>
          <div className={cn("flex gap-2 max-w-[80%]", message.role === 'user' && 'flex-row-reverse')}>
            <div className={cn("w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-xl shadow-sm", message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 border border-gray-100')}>
              {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={cn("px-3 py-2 rounded-xl shadow-sm", message.role === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-gray-50 text-gray-900 border border-gray-100 rounded-bl-lg')}>
              <p className="text-sm leading-normal whitespace-pre-wrap">{message.content}</p>
              <p className={cn("text-xs mt-1 opacity-70", message.role === 'user' ? 'text-blue-100' : 'text-gray-500')}>{message.timestamp}</p>
            </div>
          </div>
        </div>)}
      
      {isLoading && <div className="flex gap-3">
          <div className="w-8 h-8 bg-gray-50 border border-gray-100 flex items-center justify-center rounded-xl">
            <Bot className="w-4 h-4 text-gray-700" />
          </div>
          <div className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl rounded-bl-lg">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{
            animationDelay: '0ms'
          }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{
            animationDelay: '150ms'
          }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{
            animationDelay: '300ms'
          }}></div>
            </div>
          </div>
        </div>}
    </div>;
}