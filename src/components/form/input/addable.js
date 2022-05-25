import { Fragment } from "react";
import { Form} from 'antd';
const Components = ({ text_add="Add field", fieldsName= [], name}) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <Fragment>
          {fields.map(({ key, name, ...restField },i) => (
            <div className='w-full flex justify-between gap-3' key={i}>
              {fieldsName.map((ele,index) => (
                <Form.Item
                  {...restField}
                  name={[name, ele.name]}
                  key={index}
                  className={'w-full'}
                >
                  <input
                    className='border border-gray-400 rounded-xl w-full h-10 text-gray-600 bg-white px-4 ant-input'
                    placeholder={ele.placeholder}
                    key={index}
                  />
                </Form.Item>
              ))}
              <i className="las la-minus-circle text-2xl mt-1.5 hover:text-blue-400 cursor-pointer" onClick={() => remove(name)} />
            </div>
          ))}
          <button
            type="button"
            className="rounded-xl border h-8 text-white bg-blue-500 hover:bg-blue-400 px-5"
            onClick={() => add()}
          >
            <i className="las la-plus" />
            {text_add}
          </button>
        </Fragment>
      )}
    </Form.List>
  );
};

export default Components;
