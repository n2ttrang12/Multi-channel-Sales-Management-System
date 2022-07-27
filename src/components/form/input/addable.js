import React, { Fragment } from 'react';
import { Form } from 'antd';
import classNames from "classnames";

const Component = ({ name, formItem, generateForm, form }) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <Fragment>
          <div className={'table w-full border-collapse addable'}>
            <div className="table-row">
              <div className={'table-cell border bg-gray-300 font-bold p-1 text-center w-10'}>STT</div>
              {formItem.column.map((column, index) => (
                <div key={index} className={classNames('table-cell border bg-gray-300 font-bold p-1 text-center', {
                  'w-full': formItem.column.length === 1,
                  'w-1/2': formItem.column.length === 2,
                  'w-1/3': formItem.column.length === 3,
                  'w-1/4': formItem.column.length === 4,
                  'w-1/5': formItem.column.length === 5,
                  'w-1/6': formItem.column.length === 6,
                })}>
                  {column.title}
                </div>
              ))}
              <div className={'w-8 h-1'} />
            </div>
            {fields.map(({ key, name: n, ...restField }, i) => (
              <div className="table-row" key={i}>
                <div className={'table-cell border bg-gray-300 text-center'}>{i + 1}</div>
                {formItem.column.map((column, index) => (
                  <div className={'table-cell border'} key={index}>
                    {generateForm(column, index, [n, column.name], true)}
                  </div>
                ))}
                <div className={'table-cell align-middle w-8'}>
                  <i
                    className="las la-trash-alt text-red-500 hover:text-red-400 cursor-pointer text-3xl"
                    onClick={() => {
                      remove(n);
                      formItem.onAdd && formItem.onAdd(form.getFieldValue(name), form);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className={'flex justify-end'}>
            <button
              type="button"
              className="rounded-xl font-medium text-white bg-blue-500 hover:bg-blue-400 py-1.5 px-4 my-2 addable-add"
              onClick={() => {
                add();
                formItem.onAdd && formItem.onAdd(form.getFieldValue(name), form);
              }}
            >
              <i className="las la-plus mr-1 text-lg" />
              <span className={'relative -top-0.5'}>{formItem.textAdd}</span>
            </button>
          </div>
        </Fragment>
      )}
    </Form.List>
  );
};
export default Component;
