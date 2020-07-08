import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import classNames from "classnames";
import "./style";
import Tooltip from "../tooltip";
const prefixCls = "hi-slider";
const noop = () => {};
const Slider = memo(
  ({
    defaultValue,
    max,
    min,
    range,
    step = 1,
    vertical,
    onChange = noop,
    value: initValue,
    disabled = false,
    tipFormatter,
    type = "primary",
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

    const [newRightPosition, setNewRightPosition] = useState(0);
    const [startRightPosition, setStartRightPosition] = useState(0);
    const [startLeftPosition, setStartLeftPosition] = useState(0);
    const [newLeftPosition, setNewLeftPosition] = useState(0);
    const [number,setNumber] = useState(Math.round((max-min)/step))
    console.log(number)
    const [dragNode, setDragNode] = useState();
    const sliderRef = useRef();
    const tooltipLeftRef = useRef();
    const tooltipRightRef = useRef();
    const valueRef = useRef();
    // 抬起
    const onMouseUp = useCallback(
      (e) => {
        setCanMove(false);
        setStartRightPosition(newRightPosition);
        setStartLeftPosition(newLeftPosition);
        setDragNode(null);
      },
      [newRightPosition, newLeftPosition]
    );

    useEffect(() => {
      max = max || 100;
      min = min || 0;
      if (initValue > max) {
        setValue(max);
      } else if (initValue < min) {
        setValue(min);
      } else {
        setValue(initValue);
      }
    }, [initValue]);
    // 移动
    const onMouseMove = (e) => {
      if (canMove) {
        const parent = sliderRef.current;

        max = max || 100;
        min = min || 0;
        let positionStep = (step / (max - min)) * 100;

        const {
          width: sliderSize,
          height: sliderHeight,
        } = parent.getBoundingClientRect();

        let diff = 0;
        let changeValue;
        const target = dragNode;
        // (max-min)/step
        if (!range) {
          if (vertical) {
            setCurrentY(e.clientY);
            diff =
              Math.round(
                (((e.clientY - startY) / sliderHeight) * 100) / positionStep
              ) * positionStep;
          } else {
            setCurrentX(e.clientX);
            diff =
              Math.round(
                (((e.clientX - startX) / sliderSize) * 100) / positionStep
              ) * positionStep;
          }

          let position = startRightPosition + diff;
          if (position <= 0) {
            position = 0;
          } else if (position >= 100) {
            position = 100;
          }

          setNewRightPosition(position);
          changeValue =  min +Math.round(Math.round(((max - min) * position) / 100 / step)) *step;
          if (changeValue < min) {
            changeValue = min;
          } else if (changeValue > max) {
            changeValue = max;
          }
        } else {
          // if (vertical) {
          // } else {
          //   setCurrentX(e.clientX);
          //   diff = ((e.clientX - startX) / sliderSize) * 100;
          //   if (target.classList.contains("hi-slider__handle-2")) {
          //     let position = startLeftPosition + diff;
          //     if (position <= 0) {
          //       position = 0;
          //     } else if (position >= 100) {
          //       position = 100;
          //     }
          //     setNewLeftPosition(position);
          //     changeValue = [
          //       min + Math.round(((max - min) * position) / 100),
          //       value[1],
          //     ];
          //   } else {
          //     let position = startRightPosition + diff;
          //     if (position <= 0) {
          //       position = 0;
          //     } else if (position >= 100) {
          //       position = 100;
          //     }
          //     setNewRightPosition(position);
          //     changeValue = [
          //       value[0],
          //       min + Math.round(((max - min) * position) / 100),
          //     ];
          //   }
          // }
        }
        setValue(changeValue);
        valueRef.current = changeValue;
        onChange(changeValue);
        optTooltip(target);
      }
    };

    // 获取 track left
    const getstartLeftPosition = useCallback(() => {
      min = min || 0;
      max = max || 100;
      return range ? Math.round(((value[0] - min) / (max - min)) * 100) : 0;
    }, [range, value]);

    // 初始化设置宽度和left
    useEffect(() => {
      if (valueRef.current !== value) {
        // 记录左侧上一次位置
        if (range) {
          setStartLeftPosition(getstartLeftPosition());
          setNewLeftPosition(getstartLeftPosition());
        }
        setStartRightPosition(getTrackWidth());
        setNewRightPosition(getTrackWidth());
      }
    }, [value]);

    useEffect(() => {
      if (!disabled) {
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mousemove", onMouseMove);
      }

      return () => {
        Tooltip.close("slider-tooltip");
        if (!disabled) {
          window.removeEventListener("mouseup", onMouseUp);
          window.removeEventListener("mousemove", onMouseMove);
        }
      };
    });

    // 获取 track 宽度
    const getTrackWidth = useCallback(() => {
      min = min || 0;
      max = max || 100;
      if (range) {
        return Math.round(((value[1] - min) / (max - min)) * 100);
      }
      return Math.round(((value - min) / (max - min)) * 100);
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
        setDragNode(e.target);
      },
      [canMove]
    );

    const optTooltip = useCallback(
      (target) => {
        Tooltip.close("slider-tooltip");

        let title = "";
        if (range) {
          title = target.classList.contains("hi-slider__handle-2")
            ? value[0]
            : value[1];
        } else {
          title = value;
        }
        title = tipFormatter ? tipFormatter(title) : title;
        if (title !== "") {
          Tooltip.open(target, {
            title,
            placement: vertical ? "right" : "top",
            key: "slider-tooltip",
          });
        }
      },
      [value]
    );

    const onMouseEnter = useCallback(
      (e) => {
        const target = e.target;
        optTooltip(target);
      },
      [value]
    );

    const onMouseLeave = useCallback((e) => {
      // setShowTooltip(false)
      Tooltip.close("slider-tooltip");
    });

    const onHandleClick = useCallback(
      (e) => {
        const target = e.target;
        optTooltip(target);
      },
      [value]
    );

    const railClick = useCallback((e) => {
      const clientX = e.clientX;
    }, []);

    const sliderClasses = classNames(prefixCls, {
      [`${prefixCls}--disabled`]: disabled,
      [`${prefixCls}--vertical`]: vertical,
      [`${prefixCls}--${type}`]: true,
    });

    return (
      <div className={sliderClasses} ref={sliderRef}>
        <div className={`${prefixCls}__rail`} onClick={railClick} />
        <div
          className={`${prefixCls}__track`}
          style={{
            [!vertical ? "width" : "height"]: `${
              newRightPosition - newLeftPosition > 0
                ? Math.round(newRightPosition - newLeftPosition)
                : Math.round(newLeftPosition - newRightPosition)
            }%`,
            [!vertical ? "left" : "top"]: `${
              newRightPosition - newLeftPosition > 0
                ? Math.round(newLeftPosition)
                : Math.round(newRightPosition)
            }%`,
          }}
        />

        <div
          className={`${prefixCls}__handle ${prefixCls}__handle-1`}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          ref={tooltipLeftRef}
          onClick={onHandleClick}
          style={{
            [!vertical ? "left" : "top"]: `${Math.round(newRightPosition)}%`,
          }}
          tabIndex="0"
        />
        {range && (
          <div
            className={`${prefixCls}__handle ${prefixCls}__handle-2`}
            tabIndex="1"
            ref={tooltipRightRef}
            onMouseDown={(e) => onMouseDown(e)}
            onMouseEnter={(e) => onMouseEnter(e)}
            style={{
              [!vertical ? "left" : "top"]: `${Math.round(newLeftPosition)}%`,
            }}
          />
        )}
        <div className={`${prefixCls}__step`}>
          <span className={`${prefixCls}__min`}>{min}</span>
          <span className={`${prefixCls}__max`}>{max}</span>
        </div>
      </div>
    );
  }
);

export default Slider;
