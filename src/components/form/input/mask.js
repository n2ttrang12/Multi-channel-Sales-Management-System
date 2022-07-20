import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

const Component = ({ mask, value, addonBefore, addonAfter, form, disabled, ...prop }) => {
  const input = useRef();
  if (prop.condition) {
    delete prop.condition;
  }
  useEffect(() => {
    if (mask) {
      import('inputmask').then(({ default: Inputmask }) => Inputmask(mask).mask(input.current));
    }
  }, []);
  return (
    <div className={'border rounded-xl ant-input flex items-center'}>
      {!!addonBefore && <div>{addonBefore(form)}</div>}
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
          disabled && 'bg-gray-100 text-gray-400',
        )}
        readOnly={disabled}
        value={value || ''}
        {...prop}
      />
      {!!addonAfter && <div>{addonAfter(form)}</div>}
    </div>
  );
};
export default Component;
