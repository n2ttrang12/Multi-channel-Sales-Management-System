import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Form, Checkbox, Radio, Switch, Slider, DatePicker as DateAntDesign } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import classNames from 'classnames';

import { useAuth } from 'global';
import { Upload } from 'components';
import { convertFormValue } from 'utils';
import {
  ColorButton,
  Chips,
  Editor,
  SelectTag,
  Select,
  TreeSelect,
  TableTransfer,
  Password,
  Mask,
  DatePicker,
} from './input';

const Component = ({
  className,
  columns,
  textSubmit,
  textCancel = 'components.form.modal.cancel',
  handSubmit,
  values = {},
  form,
  onFirstChange = () => {},
  widthLabel = null,
  checkHidden = false,
  extendForm = () => {},
  isShowCancel = false,
  extendTopForm = null,
  extendFirstForm = null,
  extendButton = null,
  idSubmit = 'idSubmit',
  classGroupButton = 'justify-center items-center',
}) => {
  const { t } = useTranslation();
  const { formatDate } = useAuth();
  const [_columns, set_columns] = useState([]);

  const handleFilter = useCallback(async () => {
    let $columns = [];
    columns
      .filter((item) => !!item && !!item.formItem)
      .map((item, index) => {
        if (item.formItem && item.formItem.condition && !item.formItem.condition(values[item.name], form)) {
          return item;
        }
        if (!!item.formItem && item.formItem.type === 'title') {
          if (!$columns) {
            $columns = [[item]];
          } else {
            $columns.push([item]);
          }
        } else if (
          $columns &&
          $columns.length &&
          !!$columns[$columns.length - 1][0] &&
          $columns[$columns.length - 1][0].formItem.type === 'title'
        ) {
          $columns.push([item]);
        } else {
          if ($columns && $columns.length) {
            $columns[$columns.length - 1].push(item);
          } else {
            if (!$columns) {
              $columns = [[item]];
            } else {
              $columns.push([item]);
            }
          }
        }

        if (item.formItem.type === 'password' && !!item.formItem.confirm) {
          const rules = [
            {
              type: 'custom',
              validator: ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue(item.name) === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(t('components.form.rulesConfirmPassword'));
                },
              }),
            },
          ];
          if (item.formItem.confirmRequired) {
            rules.push({ type: 'required' });
          }
          const confirmItem = {
            name: 'confirm' + item.name,
            title: t('components.form.confirm') + ' ' + item.title.toLowerCase(),
            formItem: {
              type: 'password',
              rules,
            },
          };
          if (JSON.stringify(columns[index + 1]) !== JSON.stringify(confirmItem)) {
            columns.splice(index + 1, 0, confirmItem);
          }
        }
        return item;
      });
    if (JSON.stringify(_columns) !== JSON.stringify($columns)) {
      set_columns($columns);
    }
  }, [columns, values, _columns, form, t]);

  useEffect(() => {
    if (form) {
      form.resetFields();
      form.setFieldsValue(values);
    }
  }, [form, values]);

  useEffect(() => {
    handleFilter(values);
  }, [handleFilter, values]);

  const generateInput = (formItem, item, values) => {
    switch (formItem.type) {
      case 'hidden':
        break;
      // case "media":
      //   return <Media limit={formItem.limit} />;
      case 'addable':
        return (
          <Form.List name={item.name}>
            {(fields, { add, remove }) => (
              <Fragment>
                {fields.map(({ key, name, ...restField }, i) => (
                  <div className="w-full flex justify-between gap-3" key={i}>
                    {formItem.column.map((column, index) => (
                      <div
                        className={
                          'col-span-12' +
                          (' sm:col-span-' +
                            (column.formItem.colTablet
                              ? column.formItem.colTablet
                              : column.formItem.col
                              ? column.formItem.col
                              : 12)) +
                          (' lg:col-span-' + (column.formItem.col ? column.formItem.col : 12))
                        }
                        key={index}
                      >
                        {generateForm(column, index)}
                      </div>
                    ))}
                    <i
                      className="las la-minus-circle text-2xl mt-1.5 hover:text-blue-400 cursor-pointer"
                      onClick={() => remove(name)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="rounded-xl border h-8 text-white bg-blue-500 hover:bg-blue-400 px-5"
                  onClick={() => add()}
                >
                  <i className="las la-plus mr-1" />
                  {formItem.text_add}
                </button>
              </Fragment>
            )}
          </Form.List>
        );
      case 'editor':
        return <Editor readOnly={formItem.disabled} />;
      case 'color_button':
        return <ColorButton />;
      case 'upload':
        return <Upload {...formItem} />;
      case 'table_transfer':
        return <TableTransfer formItem={formItem} form={form} />;
      case 'password':
        return (
          <Password
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
            disabled={formItem.disabled && typeof values[item.name] !== 'undefined'}
          />
        );
      case 'textarea':
        return (
          <textarea
            className="ant-input px-4 py-3 w-full rounded-xl text-gray-600 bg-white border border-solid"
            rows="4"
            maxLength="1000"
            disabled={formItem.disabled && typeof values[item.name] !== 'undefined'}
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
          />
        );
      case 'slider_number':
        return (
          <Slider
            range
            tipFormatter={(value) =>
              (value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0') +
              (formItem.symbol ? formItem.symbol : '')
            }
            max={formItem.max ? formItem.max : 9999999}
            defaultValue={formItem.initialValues ? [formItem.initialValues.start, formItem.initialValues.end] : [0, 0]}
          />
        );
      case 'date':
        return (
          <DatePicker
            format={
              (!formItem.picker || formItem.picker === 'date') && formatDate + (formItem.showTime ? ' HH:mm' : '')
            }
            onChange={(date) => formItem.onChange && formItem.onChange(date, form)}
            disabledDate={(current) => formItem.disabledDate && formItem.disabledDate(current, form)}
            showTime={formItem.showTime}
            picker={formItem.picker || 'date'}
            disabled={!!formItem.disabled && formItem.disabled(values)}
          />
        );
      case 'date_range':
        return (
          <DateAntDesign.RangePicker
            format={formatDate + (formItem.showTime ? ' HH:mm' : '')}
            disabledDate={(current) => formItem.disabledDate && formItem.disabledDate(current, form)}
            defaultValue={formItem.initialValues && [formItem.initialValues.start, formItem.initialValues.end]}
            showTime={formItem.showTime}
            disabled={!!formItem.disabled && formItem.disabled(values)}
          />
        );
      case 'checkbox':
        return formItem.list ? (
          <Checkbox.Group
            options={formItem.list}
            onChange={(value) => formItem.onChange && formItem.onChange(value, form)}
          />
        ) : (
          <Checkbox onChange={(value) => formItem.onChange && formItem.onChange(value.target.checked, form)}>
            {formItem.label}
          </Checkbox>
        );
      case 'radio':
        return (
          <Radio.Group
            options={formItem.list}
            buttonStyle={formItem.style}
            optionType={formItem.style ? 'button' : ''}
          />
        );
      case 'tag':
        return (
          <SelectTag
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
            tag={formItem.tag}
            form={form}
            disabled={formItem.disabled && typeof values[item.name] !== 'undefined'}
          />
        );
      case 'chips':
        return (
          <Chips
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
            disabled={formItem.disabled && typeof values[item.name] !== 'undefined'}
          />
        );
      case 'select':
        return (
          <Select
            onChange={(value) => formItem.onChange && formItem.onChange(value, form)}
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
            formItem={formItem}
            form={form}
            disabled={formItem.disabled && typeof values[item.name] !== 'undefined'}
          />
        );
      case 'tree_select':
        return (
          <TreeSelect
            formItem={formItem}
            form={form}
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
          />
        );
      case 'switch':
        return (
          <Switch
            checkedChildren={<i className="las la-lg la-check" />}
            unCheckedChildren={<i className="las la-lg la-times" />}
            defaultChecked={!!values && values[item.name] === 1}
          />
        );
      default:
        return (
          <Mask
            mask={formItem.mask}
            addonBefore={formItem.addonBefore}
            addonAfter={formItem.addonAfter}
            maxLength={formItem.maxLength}
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
            onBlur={(e) => formItem.onBlur && formItem.onBlur(e, form)}
            disabled={formItem.disabled && typeof values[item.name] !== 'undefined'}
          />
        );
    }
  };
  const generateForm = (item, index) => {
    if (item.formItem) {
      if (item.formItem.type === 'title') {
        return <h4>{item.title}</h4>;
      }
      const rules = [];
      switch (item.formItem.type) {
        case 'number':
          rules.push(() => ({
            validator(_, value) {
              if (!value || /^[1-9]*\d+(\.\d{1,2})?$/.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t('components.form.only number')));
            },
          }));
          break;
        case 'only_number':
          rules.push(() => ({
            validator(_, value) {
              if (!value || /^[0-9]+$/.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t('components.form.only number')));
            },
          }));
          break;
        default:
      }

      if (item.formItem.rules) {
        item.formItem.rules
          .filter((item) => !!item)
          .map((rule) => {
            switch (rule.type) {
              case 'required':
                if (!rule.message) {
                  rule.message = t('components.form.ruleRequired');
                }
                rules.push({
                  required: true,
                  message: rule.message,
                });
                if (!item.formItem.type) {
                  rules.push({
                    whitespace: true,
                    message: t('components.form.ruleRequired'),
                  });
                }
                break;
              case 'email':
                if (!rule.message) {
                  rule.message = t('components.form.ruleEmail');
                }
                rules.push(() => ({
                  validator(_, value) {
                    const regexEmail =
                      /^(([^<>()[\]\\.,;:$%^&*\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!value || (typeof value === 'string' && regexEmail.test(value))) {
                      return Promise.resolve();
                    } else if (
                      typeof value === 'object' &&
                      value.length > 0 &&
                      value.filter((item) => !regexEmail.test(item)).length === 0
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(rule.message));
                  },
                }));
                break;
              case 'min':
                if (!rule.message) {
                  switch (item.formItem.type) {
                    case 'number':
                      rule.message = t('components.form.ruleMin', {
                        min: rule.value,
                      });
                      break;
                    case 'only_number':
                      rule.message = t('components.form.ruleMinNumberLength', {
                        min: rule.value,
                      });
                      break;
                    default:
                      rule.message = t('components.form.ruleMinLength', {
                        min: rule.value,
                      });
                  }
                }
                if (item.formItem.type === 'number') {
                  rules.push(() => ({
                    validator(_, value) {
                      if (!value || /^0$|^-?[1-9]\d*(\.\d+)?$/.test(value)) {
                        if (/^0$|^-?[1-9]\d*(\.\d+)?$/.test(value)) {
                          if (parseFloat(value) < rule.value) {
                            return Promise.reject(new Error(rule.message));
                          }
                        }
                      }
                      return Promise.resolve();
                    },
                  }));
                } else {
                  rules.push({
                    type: item.formItem.type === 'number' ? 'number' : 'string',
                    min: rule.value,
                    message: rule.message,
                  });
                }

                break;
              case 'max':
                if (!rule.message) {
                  switch (item.formItem.type) {
                    case 'number':
                      rule.message = t('components.form.ruleMax', {
                        max: rule.value,
                      });
                      break;
                    case 'only_number':
                      rule.message = t('components.form.ruleMaxNumberLength', {
                        max: rule.value,
                      });
                      break;
                    default:
                      rule.message = t('components.form.ruleMaxLength', {
                        max: rule.value,
                      });
                  }
                }
                if (item.formItem.type === 'number') {
                  rules.push(() => ({
                    validator(_, value) {
                      if (!value || /^0$|^-?[1-9]\d*(\.\d+)?$/.test(value)) {
                        if (/^0$|^-?[1-9]\d*(\.\d+)?$/.test(value)) {
                          if (parseFloat(value) > rule.value) {
                            return Promise.reject(new Error(rule.message));
                          }
                        }
                      }
                      return Promise.resolve();
                    },
                  }));
                } else {
                  rules.push({
                    type: item.formItem.type === 'number' ? 'number' : 'string',
                    max: rule.value,
                    message: rule.message,
                  });
                }

                break;
              case 'url':
                if (!rule.message) {
                  rule.message = t('components.form.incorrectPathFormat');
                }
                rules.push({
                  type: 'url',
                  message: rule.message,
                });
                break;
              case 'only_text':
                if (!rule.message) {
                  rule.message = t('components.form.only text');
                }
                rules.push(() => ({
                  validator(_, value) {
                    if (!value || /^[A-Za-z]+$/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(rule.message));
                  },
                }));
                break;
              case 'only_text_space':
                if (!rule.message) {
                  rule.message = t('components.form.only text');
                }
                rules.push(() => ({
                  validator(_, value) {
                    if (!value || /^[a-zA-Z ]+$/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(rule.message));
                  },
                }));
                break;
              case 'password':
                rules.push(() => ({
                  validator: async (rule, value) => {
                    if (!!value && value.trim() !== '' && value.length > rule.min ? rule.min - 1 : 0) {
                      if (/^(?!.* )(?=.*\d)(?=.*[A-Z]).*$/.test(value)) return Promise.resolve();
                      else return Promise.reject(t('components.form.rulePassword'));
                    } else return Promise.resolve();
                  },
                }));
                break;
              case 'custom':
                rules.push(rule.validator);
                break;
              default:
            }
            return rule;
          });
      }

      const otherProps = {
        key: index,
        label: item.title,
        name: item.name,
        labelAlign: 'left',
      };
      if (rules.length) {
        otherProps.rules = rules;
      }
      if (widthLabel) {
        otherProps.labelCol = { flex: widthLabel };
      }

      if (item.formItem.type === 'switch' || item.formItem.type === 'checkbox') {
        otherProps.valuePropName = 'checked';
      }
      if (item.formItem.type === 'hidden') {
        otherProps.hidden = true;
      }

      // return (
      //   <Form.Item {...otherProps}>
      //     {generateInput(item.formItem, item, values)}
      //   </Form.Item>
      // );
      return item.formItem.type !== 'addable' ? (
        <Form.Item {...otherProps} className={item.formItem.wrapClassName}>
          {generateInput(item.formItem, item, values)}
          {/* {item?.formItem?.additional? (<span className="ant-form-text ml-2">{item.formItem.additional}</span>) : null} */}
        </Form.Item>
      ) : (
        generateInput(item.formItem, item, values)
      );
    }
    return null;
  };
  const generateCol = _columns.map(($column, i) => (
    <div className={'grid gap-x-5'} key={i}>
      {$column.map((column, index) => (
        <div
          className={
            'col-span-12' +
            (' sm:col-span-' +
              (column.formItem.colTablet
                ? column.formItem.colTablet
                : column.formItem.col
                ? column.formItem.col
                : 12)) +
            (' lg:col-span-' + (column.formItem.col ? column.formItem.col : 12))
          }
          key={index}
        >
          {generateForm(column, index)}
        </div>
      ))}
    </div>
  ));

  const handFinish = (values) => {
    values = convertFormValue(columns, values, form);
    handSubmit && handSubmit(values);
  };

  const handleConvertData = (values) => {
    columns
      .filter(
        (item) => !!item && !!item.formItem,
        // && (!item.formItem.condition || item.formItem.condition(values, form))
      )
      .map((item) => {
        if (item.formItem && item.formItem.convert && values[item.name]) {
          values[item.name] = item.formItem.convert(values[item.name]);
        } else {
          switch (item.formItem.type) {
            case 'date':
              if (values && values[item.name]) {
                values[item.name] = moment(values[item.name]);
              } else if (item.formItem.value) {
                values[item.name] = moment(item.value);
              }
              break;
            case 'date_range':
              if (values && values[item.name]) {
                values[item.name] = [moment(values[item.name][0]), moment(values[item.name][1])];
              }
              break;
            case 'number':
              if (values[item.name]) {
                values[item.name] = parseFloat(values[item.name]);
              }
              break;
            default:
              if (!values[item.name]) {
                values[item.name] = item.value;
              }
              break;
          }
        }
        return item;
      });
    return values;
  };
  return (
    <Form
      className={className}
      form={form}
      layout={!widthLabel ? 'vertical' : 'horizontal'}
      onFinish={handFinish}
      initialValues={handleConvertData(values)}
      onValuesChange={async (objValue) => {
        onFirstChange();
        if (form && checkHidden) {
          for (const key in objValue) {
            if (Object.prototype.hasOwnProperty.call(objValue, key)) {
              columns
                .filter((_item) => _item.name === key)
                .forEach((item) => {
                  if (item.formItem && item.formItem.onChange) {
                    item.formItem.onChange(objValue[key], form);
                  }
                });
            }
          }
          await handleFilter({ ...values, ...form.getFieldsValue() });
        }
      }}
    >
      <div
        className={
          'sm:col-span-1 sm:col-span-2 sm:col-span-3 sm:col-span-4 sm:col-span-5 sm:col-span-6 sm:col-span-7 sm:col-span-8 sm:col-span-9 sm:col-span-10 sm:col-span-11 sm:col-span-12'
        }
      />
      {extendTopForm && extendTopForm(values)}
      <div className={'flex items-center'}>
        {extendFirstForm && extendFirstForm(values)}
        <div className={'grow'}>{generateCol}</div>
      </div>
      {extendForm && extendForm(values)}

      <div className={classNames('flex', classGroupButton)}>
        {extendButton && extendButton(values)}
        {isShowCancel && (
          <button
            className="bg-blue-500 text-white text-base p-2 w-full rounded-xl hover:bg-blue-400 mt-1"
            type="reset"
          >
            {t(textCancel)}
          </button>
        )}
        {textSubmit && (
          <button
            className="bg-blue-500 text-white text-base p-2 w-full rounded-xl hover:bg-blue-400 mt-1"
            type="submit"
            id={idSubmit}
          >
            {textSubmit}
          </button>
        )}
      </div>
    </Form>
  );
};
export default Component;
