import React, {createRef, useEffect, useState} from 'react';
import {Popover} from "antd";

const Component = ({title, className = '', children, showArrow = true, popover = false}) => {
  const ref = createRef();
  const arrow = createRef();
  const [visible, set_visible] = useState(false);

  useEffect(() => {
    if (visible !== popover) {
      setTimeout(() => {
        set_visible(popover);
      }, 150)
    }
  }, [popover, visible, set_visible])

  const onClick = () => {
    if (ref.current.style.height === 'auto') {
      ref.current.style.height = ref.current.offsetHeight + 'px';
    }
    setTimeout(() => {
      arrow.current.classList[!ref.current.style.height ? 'add' : 'remove']('rotate-90');
      ref.current.style.height = !ref.current.style.height ? ref.current.scrollHeight + "px" : '';
      if (ref.current.style.height) {
        setTimeout(() => {
          ref.current.style.height = 'auto'
        }, 150);
      }
    })
  }

  const titleBlock = (
    <div className={className} onClick={onClick}>
      {title}
      {showArrow && (
        <i className="las la-angle-right absolute right-3 transition-all duration-300 ease-in-out" ref={arrow}/>)}
    </div>
  );

  return (
    <li>
      {!visible ? titleBlock : (
        <Popover content={children} placement="rightTop">{titleBlock}</Popover>
      )}
      <ul className="transition-all duration-300 ease-in-out overflow-hidden h-0 collapse" ref={ref}>{children} </ul>
    </li>
  );
};

export default Component;
