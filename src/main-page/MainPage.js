import React, { useRef, useState, useEffect } from 'react';
import CanvasDraw from 'react-canvas-draw';
import PersistentDrawerLeft from './PersistentDrawerLeft';
import ControlledOpenSpeedDial from './ControlledOpenSpeedDial';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

function MainPage() {
  const canvasRef = useRef(null);

  const [brushColor, setBrushColor] = useState("#000000");  // 黑色画笔
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [brushRadius, setBrushRadius] = useState(2);
  const [lazyRadius, setLazyRadius] = useState(4);

  // 框选状态
  const [isSelecting, setIsSelecting] = useState(false); // 是否正在框选
  const [selectionStart, setSelectionStart] = useState(null); // 框选的起始点
  const [selectionEnd, setSelectionEnd] = useState(null); // 框选的结束点
  const [showConfirm, setShowConfirm] = useState(false); // 是否显示确认弹窗

  // 禁用绘图
  const [isDrawingDisabled, setIsDrawingDisabled] = useState(false); // 控制绘图是否禁用
  const [win, setWin] = useState(false);

  // 更新窗口大小
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 鼠标按下事件，开始框选
  const handleMouseDown = (e) => {
    if (isSelecting) {
      setSelectionStart({ x: e.clientX, y: e.clientY });
    }
  };

  // 鼠标移动事件，更新框选区域
  const handleMouseMove = (e) => {
    if (isSelecting && selectionStart) {
      setSelectionEnd({ x: e.clientX, y: e.clientY });
    }
  };

  // 鼠标松开事件，完成框选
  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
      setIsDrawingDisabled(false); // 恢复绘制功能
      // 弹出确认框询问用户是否保存
      setShowConfirm(true);
    }
  };

  // 绘制框选区域
  const renderSelectionBox = () => {
    if (!selectionStart || !selectionEnd) return null;

    const startX = Math.min(selectionStart.x, selectionEnd.x);
    const startY = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);

    return (
      <div
        style={{
          position: 'absolute',
          left: startX,
          top: startY,
          width,
          height,
          border: '2px dashed #000',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          pointerEvents: 'none', // 使框选框不干扰其他交互
        }}
      ></div>
    );
  };

  // 保存截图
  const saveSelection = () => {
    if (!selectionStart || !selectionEnd) return;

    const startX = Math.min(selectionStart.x, selectionEnd.x);
    const startY = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);

    // 创建临时 Canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    const img = new Image();
    img.src = canvasRef.current.getDataURL();
    img.onload = () => {
      // 将框选区域绘制到临时 Canvas 上
      context.drawImage(img, startX, startY, width, height, 0, 0, width, height);

      // 导出图像
      const imageData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageData;
      link.download = 'selection.png';
      link.click();
    };
  };

  // 取消框选
  const cancelSelection = () => {
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null); // 清空坐标
  };

  // 动作处理函数
  const handleAction = (action) => {
    switch (action) {
      case "Pencil":
        setBrushRadius(2);
        setBrushColor("#000000");
        break;
      case "Eraser":
        setBrushRadius(10);
        setBrushColor("#FFFFFF");
        break;
      case "Undo":
        canvasRef.current?.undo();
        break;
      case "Clear":
        canvasRef.current?.clear();
        break;
      case "Save":
        setWin(true);
        setIsSelecting(true); // 点击 Save 后开启框选模式
        setIsDrawingDisabled(true); // 开始框选时禁用绘图
        break;
      default:
        break;
    }
  };

  // 确认框选并保存
  const handleConfirmSave = () => {
    saveSelection();
    setSelectionStart(null);  // 清空坐标
    setSelectionEnd(null);    // 清空坐标
    setShowConfirm(false);
    setWin(false);
  };

  // 取消保存
  const handleCancelSave = () => {
    cancelSelection();
    setShowConfirm(false);
    setWin(false);
  };

  return (
    <div
      style={{ height: "100vh", width: "100vw", position: "relative" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* 侧边栏 */}
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <PersistentDrawerLeft />
      </div>

      {/* 主绘图区域 */}
      <CanvasDraw
        ref={canvasRef}
        brushColor={brushColor}
        brushRadius={brushRadius}
        lazyRadius={lazyRadius}
        canvasWidth={dimensions.width}
        canvasHeight={dimensions.height}
        hideGrid={true}
        gridColor='#FFFFFF'
        disabled={isDrawingDisabled}  // 控制是否禁用绘图
      />

      {/* 只有在框选状态下才显示框选区域 */}
      {win && renderSelectionBox()}

      {/* 控制按钮 */}
      <div style={{ position: "absolute", bottom: 20, right: 20 }}>
        <ControlledOpenSpeedDial OnAction={handleAction} />
      </div>

      {/* 显示确认框 */}
      {showConfirm && selectionStart && selectionEnd && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(selectionStart.x, selectionEnd.x) + Math.abs(selectionEnd.x - selectionStart.x) + 10,
            top: Math.min(selectionStart.y, selectionEnd.y) + Math.abs(selectionEnd.y - selectionStart.y) + 10,
            transform: 'translate(-50%, -50%)',
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled button group"
          >
            <Button onClick={handleConfirmSave}>保存</Button>
            <Button onClick={handleCancelSave}>取消</Button>
          </ButtonGroup>
        </div>
      )}
    </div>
  );
}

export default MainPage;
