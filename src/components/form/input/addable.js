import React, { Fragment } from 'react';
import { Form } from 'antd';

const Component = ({ name, formItem, generateForm, form }) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <Fragment>
          <div className={'table w-full border-collapse addable'}>
            <div className="table-row">
              <div className={'table-cell border bg-gray-300 font-bold p-1 text-center w-2'}>STT</div>
              {formItem.column.map((column, index) => (
                <div key={index} className={'table-cell border bg-gray-300 font-bold p-1 text-center'}>
                  {column.title}
                </div>
              ))}
              <div />
            </div>
            {fields.map(({ key, name, ...restField }, i) => (
              <div className="table-row" key={i}>
                <div className={'table-cell border bg-gray-300 text-center'}>{i + 1}</div>
                {formItem.column.map((column, index) => (
                  <div className={'table-cell border'} key={index}>
                    {generateForm(column, index, [name, column.name], true)}
                  </div>
                ))}
                <div className={'table-cell align-middle'}>
                  <i
                    className="las la-trash-alt text-red-500 hover:text-red-400 cursor-pointer text-3xl"
                    onClick={() => {
                      remove(name);
                      setTimeout(() => {
                        formItem.onAdd && formItem.onAdd(form.getFieldValue(name), form);
                      }, 1000);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="rounded-xl font-medium text-white bg-blue-500 hover:bg-blue-400 py-1.5 px-4 my-2 float-right addable-add"
            onClick={() => {
              add();
              formItem.onAdd && formItem.onAdd(form.getFieldValue(name), form);
            }}
          >
            <i className="las la-plus mr-1 text-lg" />
            <span className={'relative -top-0.5'}>{formItem.textAdd}</span>
          </button>
        </Fragment>
      )}
    </Form.List>
  );
};
export default Component;
