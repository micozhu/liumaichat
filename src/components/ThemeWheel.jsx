// @ts-ignore;
import React, { useState, useRef } from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { RotateCw, Sparkles } from 'lucide-react';

export function ThemeWheel({
  themes,
  onThemeSelect,
  isLoading
}) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef(null);
  const spinWheel = () => {
    if (isLoading || themes.length === 0 || isSpinning) return;
    setIsSpinning(true);

    // 随机旋转角度（至少5圈 + 随机角度）
    const spinDegrees = 1800 + Math.floor(Math.random() * 360);
    const finalRotation = rotation + spinDegrees;

    // 设置旋转动画
    setRotation(finalRotation);

    // 计算选中主题 - 修正逻辑
    const segmentAngle = 360 / themes.length;
    const normalizedRotation = (finalRotation % 360 + 360) % 360; // 确保在0-360度之间

    // 修正选中段计算：指针在右侧（0度），顺时针旋转
    // 需要计算指针指向的扇形区域
    const pointerAngle = 0; // 指针固定在右侧（0度）
    const effectiveAngle = (360 - normalizedRotation) % 360; // 转盘旋转角度转换为指针指向角度
    const selectedSegment = Math.floor(effectiveAngle / segmentAngle);
    const selectedTheme = themes[selectedSegment];

    // 3秒后显示结果
    setTimeout(() => {
      setIsSpinning(false);

      // 延迟1秒后再调用onThemeSelect，让用户有时间看清结果
      setTimeout(() => {
        onThemeSelect(selectedTheme);
      }, 1000);
    }, 3000);
  };

  // 转盘颜色数组
  const wheelColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500', 'bg-indigo-500', 'bg-amber-500'];
  return <div className="flex flex-col items-center space-y-6 p-6">
      {/* 转盘容器 */}
      <div className="relative w-80 h-80">
        {/* 转盘 - 使用内联样式设置动画持续时间 */}
        <div ref={wheelRef} className="w-full h-full rounded-full border-4 border-gray-300 relative overflow-hidden ease-out" style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center',
        transition: 'transform 3s ease-out'
      }}>
          {themes.map((theme, index) => {
          const segmentAngle = 360 / themes.length;
          const startAngle = segmentAngle * index;
          const colorIndex = index % wheelColors.length;
          return <div key={theme._id} className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left" style={{
            transform: `rotate(${startAngle}deg)`,
            transformOrigin: 'bottom left'
          }}>
                <div className={`w-full h-full ${wheelColors[colorIndex]} relative`} style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            }}>
                  {/* 使用绝对定位固定文字位置 */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="text-center" style={{
                  transform: `rotate(${segmentAngle / 2}deg)`
                }}>
                      <span className="text-xs font-medium text-white whitespace-nowrap bg-black bg-opacity-50 px-2 py-1 rounded">
                        {theme.title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>;
        })}
        </div>
        
        {/* 中心指针 - 修改为向上 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-1 h-8 bg-red-600"></div>
        </div>
        
        {/* 转盘外框 */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-400 pointer-events-none"></div>
      </div>

      {/* 旋转按钮 */}
      <Button onClick={spinWheel} disabled={isLoading || themes.length === 0 || isSpinning} className="bg-gray-800 text-white hover:bg-gray-700 rounded-sm px-6 py-3 text-base font-medium">
        <Sparkles className="w-5 h-5 mr-2" />
        {isSpinning ? '旋转中...' : '旋转选择主题'}
      </Button>

      {/* 旋转状态指示 */}
      {isSpinning && <div className="text-sm text-gray-500">
          转盘旋转中，请稍候...
        </div>}
    </div>;
}