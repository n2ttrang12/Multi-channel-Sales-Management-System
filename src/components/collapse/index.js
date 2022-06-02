import React, {createRef, useEffect, useState} from 'react';
import {Popover} from "antd";
import classNames from "classnames";

const Component = ({title, className = '', classNameParent = '', children, showArrow = true, popover = false}) => {
  const ref = createRef();
  const arrow = createRef();
  const [visible, set_visible] = useState(false);

  useEffect(() => {
    if (visible !== popover) {
      if (popover) {
        ref.current.style.removeProperty('height')
      }
      setTimeout(() => {
        set_visible(popover);
      }, 150);
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
    <li className={classNameParent}>
      {!visible ? titleBlock : (
        <Popover content={children} placement="rightTop">{titleBlock}</Popover>
      )}
      <ul
        className={classNames(
          'transition-all duration-300 ease-in-out overflow-hidden h-0 collapse',
          {
            'scale-0 h-0': visible,
            'scale-1': !visible
          }
        )}
        ref={ref}
      >{children}</ul>
    </li>
  );
};

export default Component;
