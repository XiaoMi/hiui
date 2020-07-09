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
    step = 1,
    vertical,
    onChange = noop,
    value: initValue,
    disabled = false,
    tipFormatter,
    type = "primary",
    marks = {},
  }) => {
    const [value, setValue] = useState(initValue || defaultValue);

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
    const [positionStep, setPositionStep] = useState(1);
    const [number, setNumber] = useState(Math.round((max - min) / step));
    // console.log(number)
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
      setPositionStep((step / (max - min)) * 100);
    }, [step, max, min]);
    // useEffect(()=>{
    //   if(step!==1){
    //     console.log(1)
    //     optTooltip();
    //   }

    // },[newRightPosition,step])
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
        // let positionStep = (step / (max - min)) * 100;

        const {
          width: sliderWidth,
          height: sliderHeight,
        } = parent.getBoundingClientRect();

        let diff = 0;
        let changeValue = 0;

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
              (((e.clientX - startX) / sliderWidth) * 100) / positionStep
            ) * positionStep;
        }

        let position = startRightPosition + diff;
        if (position <= 0) {
          position = 0;
        } else if (position >= 100) {
          position = 100;
        }
        setNewRightPosition(position);
        changeValue = min + Math.round(((max - min) * position) / 100);
        if (changeValue < min) {
          changeValue = min;
        } else if (changeValue > max) {
          changeValue = max;
        }
        setValue(changeValue);
        valueRef.current = changeValue;
        onChange(changeValue);
        optTooltip();
      }
    };

    // 初始化设置宽度和left
    useEffect(() => {
      if (valueRef.current !== value) {
        setStartRightPosition(getTrackWidth());
        setNewRightPosition(getTrackWidth());
        optTooltip();
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
        setDragNode(e.target);
      },
      [canMove]
    );

    const optTooltip = useCallback(() => {
      Tooltip.close("slider-tooltip");
      let title = tipFormatter ? tipFormatter(value) : value;
      if (title !== "") {
        Tooltip.open(tooltipLeftRef.current, {
          title,
          placement: vertical ? "right" : "top",
          key: "slider-tooltip",
        });
      }
    }, [value, step]);

    const onMouseEnter = useCallback(
      (e) => {
        optTooltip();
      },
      [value]
    );

    const onMouseLeave = useCallback((e) => {
      Tooltip.close("slider-tooltip");
    });

    const onHandleClick = useCallback(
      (e) => {
        e.stopPropagation();
        optTooltip();
      },
      [value]
    );

    const railClick = useCallback(
      (e) => {
        min = min || 0;
        max = max || 100;

        const parent = sliderRef.current;
        let diff = 0;
        let position;
        const {
          width: sliderWidth,
          height: sliderHeight,
        } = parent.getBoundingClientRect();
        const { x, y } = tooltipLeftRef.current.getBoundingClientRect();

        if (vertical) {
          diff =
            Math.round(
              (((e.clientY - y) / sliderHeight) * 100) / positionStep
            ) * positionStep;
        } else {
          diff =
            Math.round((((e.clientX - x) / sliderWidth) * 100) / positionStep) *
            positionStep;
        }
        position = newRightPosition + diff;
        if (position <= 0) {
          position = 0;
        } else if (position >= 100) {
          position = 100;
        }
        setNewRightPosition(position);
        setStartRightPosition(position);
        setValue(min + Math.round(((max - min) * position) / 100));
        // optTooltip()
      },
      [positionStep, newRightPosition, vertical]
    );

    const sliderClasses = classNames(prefixCls, {
      [`${prefixCls}--disabled`]: disabled,
      [`${prefixCls}--vertical`]: vertical,
      [`${prefixCls}--${type}`]: true,
    });

    return (
      <div
        className={sliderClasses}
        ref={sliderRef}
        onClick={railClick}
        onMouseLeave={onMouseLeave}
      >
        <div className={`${prefixCls}__rail`} />
        <div
          className={`${prefixCls}__track`}
          style={{
            [!vertical ? "width" : "height"]: `${
              newRightPosition - newLeftPosition > 0
                ? newRightPosition - newLeftPosition
                : (newLeftPosition - newRightPosition).toFixed(4)
            }%`,
            [!vertical ? "left" : "top"]: `${
              newRightPosition - newLeftPosition > 0
                ? newLeftPosition.toFixed(4)
                : newRightPosition.toFixed(4)
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
            [!vertical ? "left" : "top"]: `${newRightPosition.toFixed(4)}%`,
          }}
          tabIndex="0"
        />
        <div className={`${prefixCls}__step`}>
          {Object.keys(marks).map((item, index) => (
            <span
              className={`${prefixCls}__step-dot`}
              // style={{ left: ((item - min) / (max - min)) * 100 }}
            >
              {(item, min, max)}
            </span>
          ))}
        </div>
        <div className={`${prefixCls}__stepText`}>
          {min && <span className={`${prefixCls}__min`}>{min}</span>}
          {max && <span className={`${prefixCls}__max`}>{max}</span>}
        </div>
      </div>
    );
  }
);

export default Slider;
