import React, { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import './tooltip.css'

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

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
  let arrowSize

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  })
  const [active, setActive] = useState(() => props.open)
  const [direction, setdirection] = useState(() => props.direction)
  //holds current hight and widht of the screen
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions)

  //Reference to get the tooltip and wrapper Doms
  const tooltipRef = useRef(null)
  const wrapperRef = useRef(null)

  //References used by the timers
  const timerRef = useRef({
    timers: {},
  })

  useEffect(() => {
    let timers = timerRef.current.timers
    return () => {
      clearTimeout(timers.timeoutHide)
      clearTimeout(timers.timeoutShow)
    }
  }, [])

  //Arrow size in pixels
  if (props.arrow) arrowSize = 12
  else arrowSize = 0

  useEffect(() => setActive(props.open), [props.open])

  //set listener for windows resize and compute the dimentions
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /**
   * This effect handle the possition of the tooltip based on direction
   */
  useEffect(() => {
    //Ignore when ref has no reference
    if (!tooltipRef.current || !wrapperRef.current) {
      return
    }
    const boundingTip = tooltipRef.current.getBoundingClientRect()
    const boundingWrapper = wrapperRef.current.getBoundingClientRect()

    let directions = {
      top: {
        top: -boundingTip.height - arrowSize / 2,
        left: -boundingTip.width / 2 + boundingWrapper.width / 2,
      },
      bottom: {
        top: boundingWrapper.height + arrowSize / 2,
        left: -boundingTip.width / 2 + boundingWrapper.width / 2,
      },
      right: {
        top: -boundingTip.height / 2 + boundingWrapper.height / 2,
        left: boundingWrapper.width + arrowSize / 2,
      },
      left: {
        top: -boundingTip.height / 2 + boundingWrapper.height / 2,
        left: -boundingTip.width - arrowSize / 2,
      },
    }

    //Change direction if the tooltip go over the scrren
    setPosition(directions[direction])
  }, [active, direction, props.width, arrowSize])

  /**
   * This effect handle the auto change direction to prevent the screen overlap the tooltip
   */
  useEffect(() => {
    //Ignore when not active and while ref has no reference
    if (!active || !tooltipRef.current || props.dissableAutoChangeDirection) {
      return
    }

    const boundingTip = tooltipRef.current.getBoundingClientRect()
    const boundingWrapper = wrapperRef.current.getBoundingClientRect()

    //Change direction if the tooltip go over the scrren
    switch (props.direction) {
      default:
      case 'top':
        if (boundingWrapper.top - boundingTip.height < 0) setdirection('bottom')
        else setdirection('top')
        break
      case 'bottom':
        if (
          boundingWrapper.bottom + boundingTip.height >
          windowDimensions.height
        )
          setdirection('top')
        else setdirection('bottom')
        break
      case 'right':
        if (boundingWrapper.right + boundingTip.width > windowDimensions.width)
          setdirection('left')
        else setdirection('right')
        break
      case 'left':
        if (boundingWrapper.left - boundingTip.width < 0) setdirection('right')
        else setdirection('left')
        break
    }
  }, [
    active,
    windowDimensions,
    props.direction,
    props.dissableAutoChangeDirection,
    props.width,
  ])

  /**
   * Start timer to show the tooltip
   */
  const startShowTimer = useCallback(() => {
    if (props.dissableAutoShow) return

    let timers = timerRef.current.timers

    clearTimeout(timers.timeoutHide)
    timers.timeoutShow = setTimeout(() => {
      setActive(true)
      props.onOpen()
    }, props.delay)
  }, [props])

  /**
   * Start timer to hide the tooltip
   */
  const startHideTimer = useCallback(() => {
    if (props.dissableAutoShow) return

    let timers = timerRef.current.timers

    clearTimeout(timers.timeoutShow)
    timers.timeoutHide = setTimeout(() => {
      setActive(false)
      if (active) props.onClose()
    }, props.delay)
  }, [props, active])

  const tipMouseEnter = useCallback(() => {
    if (props.disableInteractive) return
    clearTimeout(timerRef.current.timers.timeoutHide)
  }, [props])

  const tipMouseLeave = useCallback(() => {
    if (props.disableInteractive) return
    startHideTimer()
  }, [props, startHideTimer])

  let style = { top: position.top, left: position.left }
  if (props.width !== 0) style['width'] = props.width

  return (
    <div
      data-testid="Tooltip-Wrapper"
      ref={wrapperRef}
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
          style={style}
          ref={tooltipRef}
          className={`Tooltip-Tip ${direction} ${props.arrow && 'arrow'}`}
        >
          {props.content}
        </div>
      )}
    </div>
  )
}

Tooltip.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  open: PropTypes.bool,
  arrow: PropTypes.bool,
  dissableAutoChangeDirection: PropTypes.bool,
  dissableAutoShow: PropTypes.bool,
  disableInteractive: PropTypes.bool,
  delay: PropTypes.number,
  width: PropTypes.number,
  direction: PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
}

// Specifies the default values for props:
Tooltip.defaultProps = {
  direction: 'top',
  onOpen: () => {},
  onClose: () => {},
  width: 150,
  delay: 400,
}

export default Tooltip
