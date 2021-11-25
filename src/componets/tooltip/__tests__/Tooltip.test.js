import React from 'react'
import ReactDOM from 'react-dom'
import Tooltip from '../tooltip'

import { render, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'

afterEach(cleanup)
beforeEach(jest.useFakeTimers)

it('renders', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <Tooltip>
      <span>teste</span>
    </Tooltip>,
    div,
  )
  ReactDOM.unmountComponentAtNode(div)
})

it('renders span', () => {
  const { getByTestId } = render(
    <Tooltip>
      <span data-testid="teste">teste</span>
    </Tooltip>,
  )
  expect(getByTestId('teste')).toHaveTextContent('teste')
})

it('renders element in content', () => {
  const elementContent = (
    <div>
      <span>Teste</span>
    </div>
  )

  const div = document.createElement('div')
  ReactDOM.render(
    <Tooltip content={elementContent}>
      <span>teste</span>
    </Tooltip>,
    div,
  )
  ReactDOM.unmountComponentAtNode(div)
})

it('renders tooltip opended', () => {
  const { getByTestId } = render(
    <Tooltip content="this is the tooltip">
      <span>teste</span>
    </Tooltip>,
  )

  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )

  //Testing default time to open
  fireEvent.mouseEnter(getByTestId('children'))

  act(() => jest.advanceTimersByTime(200))
  //200 ms should not be enought to open
  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )

  act(() => jest.advanceTimersByTime(200))
  //400 ms shoud be default timer
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
})

it('renders tootip closed', () => {
  const { getByTestId } = render(
    <Tooltip content="this is the tooltip">
      <span>teste</span>
    </Tooltip>,
  )

  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )
  //Testing default time to open
  fireEvent.mouseEnter(getByTestId('children'))

  //wait opend the tooltip
  act(() => jest.advanceTimersByTime(400))
  //should be opened after 400 ms
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')

  fireEvent.mouseLeave(getByTestId('children'))

  act(() => jest.advanceTimersByTime(200))
  //should continue opend 200 ms after mouse leave
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')

  act(() => jest.advanceTimersByTime(200))
  //should be closed after 400 ms mouse leaved
  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )
})

it('renders default opened', () => {
  const { getByTestId } = render(
    <Tooltip content="this is the tooltip" open>
      <span>teste</span>
    </Tooltip>,
  )

  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
})

it('renders arrow', () => {
  const { getByTestId } = render(
    <Tooltip content="this is the tooltip" arrow open>
      <span>teste</span>
    </Tooltip>,
  )

  expect(getByTestId('content')).toHaveClass('arrow')
})

it('not renders arrow', () => {
  const { getByTestId } = render(
    <Tooltip content="this is the tooltip" open>
      <span>teste</span>
    </Tooltip>,
  )

  expect(getByTestId('content')).not.toHaveClass('arrow')
})

it('dissable render on mouseonver', () => {
  const { getByTestId } = render(
    <Tooltip content="this is the tooltip" dissableAutoShow>
      <span>teste</span>
    </Tooltip>,
  )

  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )

  //Testing default time to open
  fireEvent.mouseEnter(getByTestId('children'))

  act(() => jest.advanceTimersByTime(400))
  //after timer should not be show
  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )
})

it('Change direction on screen overlap (left to right)', () => {
  const { getByTestId } = render(
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: 1024,
        height: 768,
      }}
    >
      <Tooltip content="Ola mundo" direction="left" width={70} open>
        <div
          style={{
            backgroundColor: '#ccc',
            width: 100,
            height: 100,
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'white' }}>Teste</span>
        </div>
      </Tooltip>
    </div>,
  )

  //Data geted from Opera tested on same senario with screen width and hight 1024x768
  getByTestId('content').getBoundingClientRect = () => {
    return {
      bottom: 434,
      height: 100,
      left: 0,
      right: 100,
      top: 334,
      width: 100,
      x: 0,
      y: 334,
    }
  }

  getByTestId('Tooltip-Wrapper').getBoundingClientRect = () => {
    return {
      bottom: 434,
      height: 100,
      left: 0,
      right: 100,
      top: 334,
      width: 100,
      x: 0,
      y: 334,
    }
  }

  act(() => {
    fireEvent.resize(window)
  })

  expect(getByTestId('content')).toHaveClass('right')
})

it('Change direction on screen overlap (right to left)', () => {
  const { getByTestId } = render(
    <div
      style={{
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        width: 1024,
        height: 768,
      }}
    >
      <Tooltip content="Ola mundo" direction="right" width={70} open>
        <div style={{ backgroundColor: '#ccc', width: 100, height: 100 }}>
          <span style={{ color: 'white' }}>Teste</span>
        </div>
      </Tooltip>
    </div>,
  )

  //Data geted from Opera tested on same senario with screen width and hight 1024x768
  getByTestId('content').getBoundingClientRect = () => {
    return {
      x: 842,
      y: 371,
      width: 82,
      height: 26,
      top: 371,
      right: 924,
      bottom: 397,
      left: 842,
    }
  }

  getByTestId('Tooltip-Wrapper').getBoundingClientRect = () => {
    return {
      x: 924,
      y: 334,
      width: 100,
      height: 100,
      top: 334,
      right: 1024,
      bottom: 434,
      left: 924,
    }
  }

  act(() => {
    fireEvent.resize(window)
  })

  expect(getByTestId('content')).toHaveClass('left')
})

it('Change direction on screen overlap (top to bottom)', () => {
  const { getByTestId } = render(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 1024,
        height: 768,
      }}
    >
      <Tooltip content="Ola mundo" direction="top" width={70} open>
        <div style={{ backgroundColor: '#ccc', width: 100, height: 100 }}>
          <span style={{ color: 'white' }}>Teste</span>
        </div>
      </Tooltip>
    </div>,
  )

  //Data geted from Opera tested on same senario with screen width and hight 1024x768
  getByTestId('content').getBoundingClientRect = () => {
    return {
      x: 484.59375,
      y: 100,
      width: 77.40625,
      height: 40,
      top: 100,
      right: 562,
      bottom: 140,
      left: 484.59375,
    }
  }

  getByTestId('Tooltip-Wrapper').getBoundingClientRect = () => {
    return {
      x: 462,
      y: 0,
      width: 100,
      height: 100,
      top: 0,
      right: 562,
      bottom: 100,
      left: 462,
    }
  }

  act(() => {
    fireEvent.resize(window)
  })

  expect(getByTestId('content')).toHaveClass('bottom')
})

it('Change direction on screen overlap (bottom to top)', () => {
  const { getByTestId } = render(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        width: 1024,
        height: 768,
      }}
    >
      <Tooltip content="Ola mundo" direction="bottom" width={70} open>
        <div style={{ backgroundColor: '#ccc', width: 100, height: 100 }}>
          <span style={{ color: 'white' }}>Teste</span>
        </div>
      </Tooltip>
    </div>,
  )

  //Data geted from Opera tested on same senario with screen width and hight 1024x768
  getByTestId('content').getBoundingClientRect = () => {
    return {
      x: 471,
      y: 642,
      width: 82,
      height: 26,
      top: 642,
      right: 553,
      bottom: 668,
      left: 471,
    }
  }

  getByTestId('Tooltip-Wrapper').getBoundingClientRect = () => {
    return {
      x: 462,
      y: 668,
      width: 100,
      height: 100,
      top: 668,
      right: 562,
      bottom: 768,
      left: 462,
    }
  }

  act(() => {
    fireEvent.resize(window)
  })

  expect(getByTestId('content')).toHaveClass('top')
})

it('Not change direction on screen overlap (bottom to top)', () => {
  const { getByTestId } = render(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        width: 1024,
        height: 768,
      }}
    >
      <Tooltip
        content="Ola mundo"
        direction="bottom"
        width={70}
        dissableAutoChangeDirection
        open
      >
        <div style={{ backgroundColor: '#ccc', width: 100, height: 100 }}>
          <span style={{ color: 'white' }}>Teste</span>
        </div>
      </Tooltip>
    </div>,
  )

  //Data geted from Opera tested on same senario with screen width and hight 1024x768
  getByTestId('content').getBoundingClientRect = () => {
    return {
      x: 471,
      y: 642,
      width: 82,
      height: 26,
      top: 642,
      right: 553,
      bottom: 668,
      left: 471,
    }
  }

  getByTestId('Tooltip-Wrapper').getBoundingClientRect = () => {
    return {
      x: 462,
      y: 668,
      width: 100,
      height: 100,
      top: 668,
      right: 562,
      bottom: 768,
      left: 462,
    }
  }

  act(() => {
    fireEvent.resize(window)
  })

  expect(getByTestId('content')).toHaveClass('bottom')
})

it('Interactive works', () => {
  const { getByTestId } = render(
    <Tooltip content="this is the tooltip">
      <span>teste</span>
    </Tooltip>,
  )

  //Open and close normal test
  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )
  fireEvent.mouseEnter(getByTestId('children'))
  act(() => jest.advanceTimersByTime(400))
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
  fireEvent.mouseLeave(getByTestId('children'))
  act(() => jest.advanceTimersByTime(400))
  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )

  //Open leave and back before time finish
  fireEvent.mouseEnter(getByTestId('children'))
  act(() => jest.advanceTimersByTime(400))
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
  fireEvent.mouseLeave(getByTestId('children'))
  act(() => jest.advanceTimersByTime(200))
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
  fireEvent.mouseEnter(getByTestId('children'))
  act(() => jest.advanceTimersByTime(250))
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
  fireEvent.mouseLeave(getByTestId('children'))
  act(() => jest.advanceTimersByTime(400))
  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )

  //Open leave and hover tip
  fireEvent.mouseEnter(getByTestId('children'))
  act(() => jest.advanceTimersByTime(400))
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
  fireEvent.mouseLeave(getByTestId('children'))
  act(() => jest.advanceTimersByTime(200))
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
  fireEvent.mouseEnter(getByTestId('content'))
  act(() => jest.advanceTimersByTime(250))
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
})

it('Disable interactive', () => {
  const { getByTestId } = render(
    <Tooltip content="this is the tooltip" disableInteractive>
      <span>teste</span>
    </Tooltip>,
  )

  //Open and close normal test
  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )
  fireEvent.mouseEnter(getByTestId('children'))
  act(() => jest.advanceTimersByTime(400))
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
  fireEvent.mouseLeave(getByTestId('children'))
  act(() => jest.advanceTimersByTime(400))
  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )

  //Open leave and back before time finish
  fireEvent.mouseEnter(getByTestId('children'))
  act(() => jest.advanceTimersByTime(400))
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
  fireEvent.mouseLeave(getByTestId('children'))
  act(() => jest.advanceTimersByTime(200))
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
  fireEvent.mouseEnter(getByTestId('children'))
  act(() => jest.advanceTimersByTime(250))
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
  fireEvent.mouseLeave(getByTestId('children'))
  act(() => jest.advanceTimersByTime(400))
  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )

  //Open leave and hover tip
  fireEvent.mouseEnter(getByTestId('children'))
  act(() => jest.advanceTimersByTime(400))
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
  fireEvent.mouseLeave(getByTestId('children'))
  act(() => jest.advanceTimersByTime(200))
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
  fireEvent.mouseEnter(getByTestId('content'))
  act(() => jest.advanceTimersByTime(250))
  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )
})

it('Changes delay time', () => {
  const { getByTestId } = render(
    <Tooltip content="this is the tooltip" delay={1000}>
      <span>teste</span>
    </Tooltip>,
  )

  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )

  //Testing default time to open
  fireEvent.mouseEnter(getByTestId('children'))

  act(() => jest.advanceTimersByTime(500))
  //200 ms should not be enought to open
  expect(() => getByTestId('content')).toThrowError(
    'Unable to find an element by: [data-testid="content"]',
  )

  act(() => jest.advanceTimersByTime(500))
  //400 ms shoud be default timer
  expect(getByTestId('content')).toHaveTextContent('this is the tooltip')
})

it('Change tip width', () => {
  const { getByTestId } = render(
    <Tooltip content="this is the tooltip" width={1000} open>
      <span>teste</span>
    </Tooltip>,
  )

  expect(getByTestId('content')).toHaveStyle('width:1000px')
})

test('Callback onOpen', (done) => {
  const onOnpen = () => {
    done()
  }

  const { getByTestId } = render(
    <Tooltip content="this is the tooltip" onOpen={onOnpen}>
      <span>teste</span>
    </Tooltip>,
  )

  fireEvent.mouseEnter(getByTestId('children'))
  act(() => jest.advanceTimersByTime(400))
})

test('Callback onClose', (done) => {
  const onClose = () => {
    done()
  }

  const { getByTestId } = render(
    <Tooltip content="this is the tooltip" onClose={onClose}>
      <span>teste</span>
    </Tooltip>,
  )

  fireEvent.mouseEnter(getByTestId('children'))
  act(() => jest.advanceTimersByTime(400))
  fireEvent.mouseLeave(getByTestId('children'))
  act(() => jest.advanceTimersByTime(400))
})
