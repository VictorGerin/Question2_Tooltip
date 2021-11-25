import React, { useEffect, useState, useRef } from 'react';
import './tooltip.css';
import PropTypes from 'prop-types';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

//small change to commit

/**
 * This callback is called when the tooltip is closed
 *
 * @callback onClose
 */

/**
 * This callback is called when the tooltip is opened
 *
 * @callback onOpen
 */

/**
 *
 * @param {Object} props - React Properties
 * @param {boolean} props.open - Shows tooltip
 * @param {boolean} props.arrow - Shows tooltip arrow
 * @param {boolean} props.dissableAutoChangeDirection - Disabble auto change direction
 * @param {boolean} props.dissableAutoShow - Shows tooltip arrow
 * @param {boolean} props.disableInteractive - Disable the user interactive with the tooltip
 * @param {number} props.delay - Delay to show the tip
 * @param {number} props.width - ToolTip width
 * @param {string} props.direction - Direction of the tooltip 'top', 'bottom', 'right' or 'left'
 * @param {string|element} props.content - The content of tooltip
 * @param {onClose} props.onClose  - The callback that handles on closed.
 * @param {onOpen} props.onOpen  - The callback that handles on open.
 *
 */
function Tooltip(props) {
  let triagleSize = 12; //px
  let timeoutShow;
  let timeoutHide;

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });
  const [active, setActive] = useState(props.open);
  const [direction, setdirection] = useState(props.direction);
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  ); //holds current hight and widht of the screen

  const divTooltip = useRef(null);
  const divTopTooltip = useRef(null);

  if (props.arrow) triagleSize = 12;
  else triagleSize = 0;

  useEffect(() => setActive(props.open), [props.open]);

  //set listener for windows resize and compute the dimentions
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * This effect handle the possition of the tooltip based on direction
   */
  useEffect(() => {
    let timer = 0;

    //Ignore when not active and while ref has no reference
    if (!divTooltip.current || !divTopTooltip.current) {
      //Set default direction
      setPosition({
        top: 0,
        left: 0,
      });
      return;
    }
    const boundingTip = divTooltip.current.getBoundingClientRect();
    const boundingTopTip = divTopTooltip.current.getBoundingClientRect();

    //wait for the windows load properly and rerun
    //There is a possible bug for the webbrowser return zero width
    //tested on Opera
    // if(boundingTopTip.width === 0)
    // {
    //   timer = setTimeout(() => {
    //     setActive(active);
    //   }, 1)
    //   return;
    // }

    //Change direction if the tooltip go over the scrren
    switch (direction) {
      default:
      case 'top':
        setPosition({
          top: -boundingTip.height - triagleSize / 2,
          left: -boundingTip.width / 2 + boundingTopTip.width / 2,
        });
        break;
      case 'bottom':
        setPosition({
          top: boundingTopTip.height + triagleSize / 2,
          left: -boundingTip.width / 2 + boundingTopTip.width / 2,
        });
        break;
      case 'right':
        setPosition({
          top: -boundingTip.height / 2 + boundingTopTip.height / 2,
          left: boundingTopTip.width + triagleSize / 2,
        });
        break;
      case 'left':
        setPosition({
          top: -boundingTip.height / 2 + boundingTopTip.height / 2,
          left: -boundingTip.width - triagleSize / 2,
        });
        break;
    }
    return () => {
      if (timer !== 0) clearTimeout(timer);
    };
  }, [active, windowDimensions, direction, props.width]);

  /**
   * This effect handle the auto change direction to prevent the screen overlap the tooltip
   */
  useEffect(() => {
    //Ignore when not active and while ref has no reference
    if (!active || !divTooltip.current || props.dissableAutoChangeDirection) {
      //Set default direction
      // setdirection(props.direction);
      return;
    }

    const boundingTip = divTooltip.current.getBoundingClientRect();
    const boundingTopTip = divTopTooltip.current.getBoundingClientRect();

    // console.log('posssss ', direction, windowDimensions, boundingTip, boundingTopTip);

    //Change direction if the tooltip go over the scrren
    switch (props.direction) {
      default:
      case 'top':
        if (boundingTopTip.top - boundingTip.height < 0) setdirection('bottom');
        else setdirection('top');
        break;
      case 'bottom':
        if (
          boundingTopTip.bottom + boundingTip.height >
          windowDimensions.height
        )
          setdirection('top');
        else setdirection('bottom');
        break;
      case 'right':
        if (boundingTopTip.right + boundingTip.width > windowDimensions.width)
          setdirection('left');
        else setdirection('right');
        break;
      case 'left':
        if (boundingTopTip.left - boundingTip.width < 0) setdirection('right');
        else setdirection('left');
        break;
    }
  }, [
    active,
    windowDimensions,
    props.direction,
    props.dissableAutoChangeDirection,
    props.width,
  ]);

  /**
   * Start timer to show the tooltip
   */
  const startShowTimer = () => {
    if (props.dissableAutoShow) return;

    clearInterval(timeoutHide);
    timeoutShow = setTimeout(() => {
      setActive(true);
      props.onOpen();
    }, props.delay);
  };

  /**
   * Start timer to hide the tooltip
   */
  const startHideTimer = () => {
    if (props.dissableAutoShow) return;

    clearInterval(timeoutShow);
    timeoutHide = setTimeout(() => {
      const oldActive = active;
      setActive(false);
      if (oldActive) props.onClose();
    }, props.delay);
  };

  const tipMouseEnter = () => {
    if (props.disableInteractive) return;
    clearInterval(timeoutHide);
  };

  const tipMouseLeave = () => {
    if (props.disableInteractive) return;
    startHideTimer();
  };

  return (
    <div
      data-testid="Tooltip-Wrapper"
      ref={divTopTooltip}
      className="Tooltip-Wrapper"
    >
      <div
        data-testid="children"
        onMouseEnter={startShowTimer}
        onMouseLeave={startHideTimer}
      >
        {props.children}
      </div>
      {active && (
        <div
          data-testid="content"
          onMouseEnter={tipMouseEnter}
          onMouseLeave={tipMouseLeave}
          style={{ top: position.top, left: position.left, width: props.width }}
          ref={divTooltip}
          className={`Tooltip-Tip ${direction} ${props.arrow && 'arrow'}`}
        >
          {props.content}
        </div>
      )}
    </div>
  );
}

Tooltip.propTypes = {
  open: PropTypes.bool,
  arrow: PropTypes.bool,
  dissableAutoChangeDirection: PropTypes.bool,
  dissableAutoShow: PropTypes.bool,
  disableInteractive: PropTypes.bool,
  number: PropTypes.number,
  width: PropTypes.number,
  direction: PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

// Specifies the default values for props:
Tooltip.defaultProps = {
  direction: 'top',
  onOpen: () => {},
  onClose: () => {},
  width: 400,
  delay: 400,
};

export default Tooltip;
