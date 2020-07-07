import React, { useState, useRef, useEffect, useCallback } from "react";
import classNames from "classnames";
import "./style";
import Tooltip from "../tooltip";
const prefixCls = "hi-slider";
const Slider = ({
  defaultValue,
  max = 100,
  min = 0,
  range,
  step = 1,
  vertical,
  onChange,
  value: initValue,
  disabled = false,
}) => {
  const getInitValue = () => {

    const value = initValue || defaultValue;
    // 双滑块模式
    if (range) {
      if (!(Array.isArray(value) && value.length == 2)) {
        throw new Error("Double slider mode value must be an array");
      }
    }
    return value;
  };
  const [value, setValue] = useState(getInitValue());
  // 是否可拖动
  const [canMove, setCanMove] = useState(false);

  const [startX, setStartX] = useState();
  const [startY, setStartY] = useState();
  const [currentX, setCurrentX] = useState();
  const [currentY, setCurrentY] = useState();
  // const [showTooltip,setShowTooltip] = useState(false)

  const [newPosition, setNewPosition] = useState();
  const [startPosition, setStartPosition] = useState();
  const sliderRef = useRef();
  const tooltipLeftRef = useRef();
  const tooltipRightRef = useRef();
  // 抬起
  const onMouseUp = useCallback(
    (e) => {
      setCanMove(false);
      setStartPosition(newPosition);
    },
    [newPosition]
  );

  // 移动
  const onMouseMove = (e) => {
    const parent = sliderRef.current;
    const { width: sliderSize } = parent.getBoundingClientRect();
    let diff = 0;

    const { left, to, right } = parent.getBoundingClientRect();
    if (canMove) {
      if (vertical) {
        setCurrentY(e.clientY);

        diff = ((startY - e.clientY) / sliderSize) * 100;
      } else {
        setCurrentX(e.clientX);

        diff = ((e.clientX - startX) / sliderSize) * 100;
      }

      let position = startPosition +diff;
      if (position <= 0) {
        position = 0;
      } else if (position >= 100) {
        position = 100;
      }
      setNewPosition(position);
      console.log(max-min)
      setValue(Math.ceil(((max - min) * newPosition) / 100));
      onChange(Math.ceil(((max - min) * newPosition) / 100));
      Tooltip.close("slider-tooltip");
      Tooltip.open(tooltipLeftRef.current, {
        title:value,
        placement: "top",
        key: "slider-tooltip",
      });
    }
  };
  // 初始化设置宽度和left
  useEffect(() => {
    setStartPosition(currentPosition());
    setNewPosition(currentPosition());
  }, []);

  // useEffect(()=>{
  //   showTooltip? Tooltip.open(tooltipLeftRef.current, { title: 'Click again to hide me.',  placement: 'top', key:'slider-tooltip'}) :
  //   Tooltip.close('slider-tooltip')

  // },[showTooltip])

  // 位置改变重新计算value 值
  useEffect(() => {
    if (newPosition) {
      setValue(Math.ceil(((max - min) * newPosition) / 100));
    }
  }, [newPosition]);

  useEffect(() => {
    if (!disabled) {
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("mousemove", onMouseMove);
    }

    return () => {
      if (!disabled) {
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("mousemove", onMouseMove);
      }
    };
  });

  const currentPosition = useCallback(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value]);

  // 落下
  const onMouseDown = useCallback(
    (e) => {
      const { clientX, clientY } = e;
      setCanMove(true);
      if (vertical) {
        setStartY(clientY);
      } else {
        setStartX(clientX);
      }
      // Tooltip.close('slider-tooltip')
      if (!range) {
      }
    },
    [canMove]
  );

  const onMouseEnter = useCallback(
    (e) => {
      Tooltip.close("slider-tooltip");
      Tooltip.open(tooltipLeftRef.current, {
        title:value,
        placement: "top",
        key: "slider-tooltip",
      });
    },
    [newPosition]
  );

  const onMouseLeave = useCallback((e) => {
    // setShowTooltip(false)
    Tooltip.close("slider-tooltip");
  });

  const onHandleClick = useCallback((e) => {
    Tooltip.close("slider-tooltip");
    Tooltip.open(tooltipLeftRef.current, {
      title:value,
      placement: "top",
      key: "slider-tooltip",
    });
  });

  const sliderClasses = classNames(prefixCls, {
    [`${prefixCls}--disabled`]: disabled,
  });
  return (
    <div className={sliderClasses} ref={sliderRef} onMouseLeave={onMouseLeave}>
      <div className={`${prefixCls}__rail`} />
      <div
        className={`${prefixCls}__track`}
        style={{ width: `${newPosition}%` }}
      />
      <div className={`${prefixCls}__step`} />

      <div
        className={`${prefixCls}__handle ${prefixCls}__handle-1`}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        ref={tooltipLeftRef}
        onMouseLeave={onMouseLeave}
        onClick={onHandleClick}
        // onMouseMove={onMouseMove}
        // onMouseUp={onMouseUp}
        style={{ left: `${newPosition}%` }}
        tabIndex="0"
      />
    {
      range &&<div className={`${prefixCls}__handle ${prefixCls}__handle-2`} tabIndex="1"  ref={tooltipRightRef}></div>
    }
    
    </div>
  );
};

export default Slider;
