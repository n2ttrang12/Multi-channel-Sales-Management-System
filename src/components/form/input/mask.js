import React, {useEffect, useRef} from "react";
import classNames from "classnames";

const Component = ({mask, addonBefore, addonAfter, ...prop}) => {
  const input = useRef();

  useEffect(() => {
    if (mask) {
      import('inputmask').then(({default: Inputmask}) => Inputmask(mask).mask(input.current));
    }
  }, [mask]);
  return  <div className={'border rounded-xl ant-input flex items-center'}>
    {!!addonBefore && <div className={'h-10 rounded-l-xl bg-gray-200 p-2'}>{addonBefore}</div>}
    <input
      ref={input}
      className={classNames(
        'w-full h-10 text-gray-600 bg-white pr-9 pl-4 ant-input',
        {
          'rounded-xl border-none': !addonBefore && !addonAfter,
          'rounded-l-xl border-r': !addonBefore && !!addonAfter,
          'rounded-r-xl border-l': !!addonBefore && !addonAfter,
          'border-r border-l': !!addonBefore && !!addonAfter,
        },
      )}
      {...prop}
    />
    {!!addonAfter && <div className={'h-10 rounded-r-xl bg-gray-200 p-2'}>{addonAfter}</div>}
  </div>
};
export default Component;
