import * as React from 'react';
import { useSpring, animated } from 'react-spring';

function Number({from=0, to=0}) {
  const [flip, set] = React.useState(false)
  const { number } = useSpring({
    reset: false,
    from: { number: from },
    number: to,
    delay: 200,
    onRest: () => set(!flip),
  })

  return <animated.div>{number.to(n => n.toFixed(0))}</animated.div>
}

export default React.memo(Number)