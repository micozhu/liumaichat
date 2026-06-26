// @ts-ignore;
import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore;
import { ScrollArea, useToast } from '@/components/ui';

// @ts-ignore;
import { ChatHeader } from '@/components/ChatHeader';
// @ts-ignore;
import { TurtleSoupTheme } from '@/components/TurtleSoupTheme';
// @ts-ignore;
import { MessageList } from '@/components/MessageList';
// @ts-ignore;
import { InputArea } from '@/components/InputArea';
// @ts-ignore;
import { ThemeWheel } from '@/components/ThemeWheel';
// @ts-ignore;
import { ConfettiAnimation } from '@/components/ConfettiAnimation';
// @ts-ignore;

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
const GAME_PROMPT = `你是一个海龟汤游戏的裁判。用户会给你一个谜题主题和正确答案。用户提问时，你只能回答以下三种之一：
1. "是" - 如果用户的猜测正确或接近正确答案
2. "否" - 如果用户的猜测错误
3. "无关" - 如果用户的猜测与谜题无关

重要规则：
- 当用户输入的内容与正确答案高度相似（包含关键词或语义相近）时，回答"是"
- 不要解释原因，不要提供额外信息，不要直接说出答案
- 始终保持简短回答，只使用"是"、"否"、"无关"三种回答

当前谜题主题: {theme}
正确答案: {answer}`;
export default function ChatPage(props) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODEL_CONFIGS[0]);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [gameMode, setGameMode] = useState('chat');
  const [currentTheme, setCurrentTheme] = useState(null);
  const [themes, setThemes] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showTurtleSoupNotification, setShowTurtleSoupNotification] = useState(false);
  const [hasLoadedMessages, setHasLoadedMessages] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [usedHints, setUsedHints] = useState([]);
  const scrollAreaRef = useRef(null);
  const {
    toast
  } = useToast();

  // 加载主题数据
  useEffect(() => {
    loadThemes();
  }, []);

  // 加载历史聊天记录
  useEffect(() => {
    if (gameMode === 'chat') {
      loadChatHistory();
    } else {
      setMessages([]);
      setHasLoadedMessages(true);
      setIsGameWon(false);
      setUsedHints([]);
    }
  }, [gameMode]);

  // 检查并显示海龟汤游戏提示
  useEffect(() => {
    const notificationClosed = localStorage.getItem('turtleSoupNotificationClosed');
    if (!notificationClosed && gameMode === 'chat') {
      setShowTurtleSoupNotification(true);
    }
  }, [gameMode]);

  // 关闭提示并持久化
  const closeTurtleSoupNotification = () => {
    setShowTurtleSoupNotification(false);
    localStorage.setItem('turtleSoupNotificationClosed', 'true');
  };

  // 滚动到底部
  const scrollToBottom = (smooth = true) => {
    if (!shouldAutoScroll || !scrollAreaRef.current) return;
    setTimeout(() => {
      const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    }, 100);
  };

  // 消息变化时自动滚动
  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  // 初次加载或模式切换时滚动到底部
  useEffect(() => {
    scrollToBottom(false);
    setShouldAutoScroll(true);
  }, [gameMode]);
  const loadThemes = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'turtle_soup_themes',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          pageSize: 50,
          pageNumber: 1
        }
      });
      if (result.records) {
        setThemes(result.records);
      }
    } catch (error) {
      console.error('加载主题失败:', error);
      toast({
        title: "错误",
        description: "加载游戏主题失败",
        variant: "destructive"
      });
    }
  };
  const loadChatHistory = async () => {
    try {
      const currentUser = props.$w.auth.currentUser;
      if (!currentUser) {
        setHasLoadedMessages(true);
        return;
      }
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'chat_messages',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                userId: {
                  $eq: currentUser.userId
                }
              }]
            }
          },
          select: {
            $master: true
          },
          orderBy: [{
            timestamp: 'asc'
          }],
          pageSize: 100,
          pageNumber: 1
        }
      });
      setHasLoadedMessages(true);
      if (result.records && result.records.length > 0) {
        const formattedMessages = result.records.map(record => ({
          id: record._id,
          role: record.role,
          content: record.content,
          timestamp: new Date(record.timestamp).toLocaleTimeString()
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('加载聊天记录失败', error);
      setHasLoadedMessages(true);
    }
  };
  const saveMessageToDatabase = async messageData => {
    try {
      const currentUser = props.$w.auth.currentUser;
      if (!currentUser) return null;
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'chat_messages',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            userId: currentUser.userId,
            content: messageData.content,
            role: messageData.role,
            timestamp: Date.now(),
            modelName: messageData.modelName || selectedModel.displayName
          }
        }
      });
      return result.id;
    } catch (error) {
      console.error('保存消息失败', error);
      return null;
    }
  };
  const clearChatHistory = async () => {
    setIsClearing(true);
    try {
      const currentUser = props.$w.auth.currentUser;
      if (!currentUser) {
        toast({
          title: "错误",
          description: "用户未登录",
          variant: "destructive"
        });
        return;
      }
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'chat_messages',
        methodName: 'wedaBatchDeleteV2',
        params: {
          filter: {
            where: {
              $and: [{
                userId: {
                  $eq: currentUser.userId
                }
              }]
            }
          }
        }
      });
      setMessages([]);
      setHasLoadedMessages(true);
      toast({
        title: "成功",
        description: "聊天记录已清除",
        duration: 3000
      });
    } catch (error) {
      console.error('清除聊天记录失败', error);
      toast({
        title: "错误",
        description: "清除聊天记录失败",
        variant: "destructive"
      });
    } finally {
      setIsClearing(false);
      setIsClearDialogOpen(false);
    }
  };
  const startGame = theme => {
    setCurrentTheme(theme);
    setIsGameWon(false);
    setUsedHints([]);
    setMessages([{
      role: 'assistant',
      content: `🎮 海龟汤游戏开始！\n\n主题: ${theme.title}\n描述: ${theme.description}\n\n你可以开始提问了，我会用"是"、"否"或"无关"来回答。\n\n💡 提示：输入"提示"可以获取线索帮助！`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };
  const resetGame = () => {
    setCurrentTheme(null);
    setMessages([]);
    setShowConfetti(false);
    setIsGameWon(false);
    setUsedHints([]);
  };
  const checkAnswer = userInput => {
    if (!currentTheme) return false;
    const normalizedInput = userInput.toLowerCase().trim();
    const normalizedAnswer = currentTheme.answer.toLowerCase();
    const containsAnswer = normalizedAnswer.includes(normalizedInput) || normalizedInput.includes(normalizedAnswer);
    const answerKeywords = normalizedAnswer.split(/\s+/).filter(word => word.length > 1);
    const inputKeywords = normalizedInput.split(/\s+/).filter(word => word.length > 1);
    const matchedKeywords = answerKeywords.filter(keyword => inputKeywords.some(inputWord => inputWord.includes(keyword) || keyword.includes(inputWord)));
    const keywordMatchRate = matchedKeywords.length / answerKeywords.length;
    const semanticSimilarity = calculateSemanticSimilarity(normalizedInput, normalizedAnswer);
    return containsAnswer || keywordMatchRate > 0.6 || semanticSimilarity > 0.7;
  };
  const calculateSemanticSimilarity = (input, answer) => {
    const inputWords = input.split(/\s+/);
    const answerWords = answer.split(/\s+/);
    let matches = 0;
    inputWords.forEach(word => {
      if (answerWords.some(answerWord => word.includes(answerWord) || answerWord.includes(word) || isSynonym(word, answerWord))) {
        matches++;
      }
    });
    return matches / Math.max(inputWords.length, answerWords.length);
  };
  const isSynonym = (word1, word2) => {
    const synonyms = {
      '死': ['去世', '死亡', '丧生', '遇难'],
      '杀': ['杀害', '谋杀', '杀死'],
      '跳': ['跳楼', '跳跃', '跳下'],
      '楼': ['建筑', '大楼', '楼房'],
      '水': ['溺水', '水池', '河流'],
      '车': ['汽车', '车辆', '车祸']
    };
    for (let [key, values] of Object.entries(synonyms)) {
      if (word1 === key && values.includes(word2) || word2 === key && values.includes(word1)) {
        return true;
      }
    }
    return false;
  };
  const handleHintRequest = async () => {
    if (!currentTheme || !currentTheme.hints || currentTheme.hints.length === 0) {
      const noHintMessage = {
        role: 'assistant',
        content: '抱歉，这个主题没有可用的提示。',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, noHintMessage]);
      return;
    }
    const availableHints = currentTheme.hints.filter((hint, index) => !usedHints.includes(index));
    if (availableHints.length === 0) {
      const noMoreHintsMessage = {
        role: 'assistant',
        content: '没有更多提示了',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, noMoreHintsMessage]);
      return;
    }
    const nextHintIndex = currentTheme.hints.findIndex((hint, index) => !usedHints.includes(index));
    const hint = currentTheme.hints[nextHintIndex];
    const newUsedHints = [...usedHints, nextHintIndex];
    setUsedHints(newUsedHints);
    const hintNumber = newUsedHints.length;
    const hintMessage = {
      role: 'assistant',
      content: `💡 提示 ${hintNumber}/3：${hint}`,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, hintMessage]);
    await saveMessageToDatabase({
      ...hintMessage,
      modelName: '海龟汤游戏'
    });
  };
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || isGameWon) return;

    // 检查是否是提示请求
    if (gameMode === 'turtle-soup' && currentTheme && inputValue.trim() === '提示') {
      const userHintMsg = {
        role: 'user',
        content: '提示',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, userHintMsg]);
      await saveMessageToDatabase({
        ...userHintMsg,
        modelName: '海龟汤游戏'
      });
      await handleHintRequest();
      setInputValue('');
      return;
    }
    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 保存用户消息到数据库（无论是否猜中都需保存）
    await saveMessageToDatabase({
      ...userMessage,
      modelName: gameMode === 'turtle-soup' ? '海龟汤游戏' : selectedModel.displayName
    });

    // 检查是否猜中答案
    if (gameMode === 'turtle-soup' && currentTheme && checkAnswer(inputValue)) {
      setTimeout(() => {
        const victoryMessage = {
          role: 'assistant',
          content: `🎉 恭喜你猜对了！\n\n正确答案: ${currentTheme.answer}\n\n你可以继续提问其他主题，或者点击重置开始新的游戏。`,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, victoryMessage]);
        setShowConfetti(true);
        setIsGameWon(true);
        setIsLoading(false);
        saveMessageToDatabase({
          ...victoryMessage,
          modelName: '海龟汤游戏'
        });

        // 5秒后自动隐藏礼花
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }, 1000);
      return;
    }
    try {
      const app = await props.$w.cloud.getCloudInstance();
      const ai = app.ai();
      const model = ai.createModel(selectedModel.createModel);
      let messagesToSend = [...messages, userMessage];
      if (gameMode === 'turtle-soup' && currentTheme) {
        messagesToSend = [{
          role: 'system',
          content: GAME_PROMPT.replace('{theme}', currentTheme.title).replace('{answer}', currentTheme.answer)
        }, {
          role: 'user',
          content: '好的，继续'
        }, ...messagesToSend];
      }
      const res = await model.streamText({
        model: selectedModel.streamModel,
        messages: messagesToSend.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });
      let assistantMessage = {
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, assistantMessage]);
      let fullContent = '';
      for await (let str of res.textStream) {
        fullContent += str;
        setMessages(prev => prev.map((msg, index) => index === prev.length - 1 ? {
          ...msg,
          content: fullContent
        } : msg));
      }
      await saveMessageToDatabase({
        role: 'assistant',
        content: fullContent,
        modelName: gameMode === 'turtle-soup' ? '海龟汤游戏' : selectedModel.displayName
      });
    } catch (error) {
      console.error('AI调用失败', error);
      const errorMessage = {
        role: 'assistant',
        content: '抱歉，服务暂时不可用，请稍后再试。',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
      await saveMessageToDatabase({
        ...errorMessage,
        modelName: gameMode === 'turtle-soup' ? '海龟汤游戏' : selectedModel.displayName
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const switchMode = newMode => {
    setGameMode(newMode);
    setMessages([]);
    setCurrentTheme(null);
    setShowConfetti(false);
    setIsGameWon(false);
    setUsedHints([]);
    setIsModeDropdownOpen(false);
  };
  return <div className="flex flex-col h-screen bg-white text-gray-900">
      {showConfetti && <ConfettiAnimation />}
      
      <ChatHeader gameMode={gameMode} selectedModel={selectedModel} isModelDropdownOpen={isModelDropdownOpen} isModeDropdownOpen={isModeDropdownOpen} isClearDialogOpen={isClearDialogOpen} isClearing={isClearing} showTurtleSoupNotification={showTurtleSoupNotification} onModelChange={setSelectedModel} onModeChange={switchMode} onClearDialogOpen={setIsClearDialogOpen} onClearDialogClose={() => setIsClearDialogOpen(false)} onClearChat={clearChatHistory} onCloseNotification={closeTurtleSoupNotification} onToggleModelDropdown={() => setIsModelDropdownOpen(!isModelDropdownOpen)} onToggleModeDropdown={() => setIsModeDropdownOpen(!isModeDropdownOpen)} />
      
      {gameMode === 'turtle-soup' && !currentTheme && <div className="px-4 py-4">
          <h2 className="text-base font-semibold mb-3 text-gray-900">选择游戏主题</h2>
          <ThemeWheel themes={themes} onThemeSelect={startGame} isLoading={gameLoading} />
        </div>}
      
      {gameMode === 'turtle-soup' && currentTheme && <TurtleSoupTheme currentTheme={currentTheme} isGameWon={isGameWon} usedHints={usedHints} onResetGame={resetGame} onHintRequest={handleHintRequest} />}
      
      {!(gameMode === 'turtle-soup' && !currentTheme) && <ScrollArea className="flex-1 bg-white" ref={scrollAreaRef}>
          <MessageList messages={messages} isLoading={isLoading} hasLoadedMessages={hasLoadedMessages} gameMode={gameMode} />
        </ScrollArea>}
      
      {!(gameMode === 'turtle-soup' && !currentTheme) && <InputArea inputValue={inputValue} isLoading={isLoading} isGameWon={isGameWon} gameMode={gameMode} currentTheme={currentTheme} onInputChange={e => setInputValue(e.target.value)} onSendMessage={handleSendMessage} onKeyPress={handleKeyPress} />}
    </div>;
}