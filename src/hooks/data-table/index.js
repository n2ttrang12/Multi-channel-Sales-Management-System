import React, {useState, useEffect, useRef, Fragment, useCallback} from "react";
import { v4 } from "uuid";
import {Table, Radio, Checkbox, DatePicker} from 'antd';
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate, } from "react-router";
import moment from "moment";
import {Pagination} from "components";

import {checkTextToShort, cleanObjectKeyNull, getQueryStringParams} from "utils";

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

const Hook = (
  {
    isLoading, setIsLoading, Get, id = () => true, showList = true, footer = () => null, defaultRequest = {},
    pageIndex = 'page',
    pageSize = 'perPage',
    sort = 'sorts',
    filter = 'filter',
    fullTextSearch = 'fullTextSearch',
    columns = [],
    loading = false,
    showPagination = true,
    leftHeader,
    rightHeader,
    showSearch = true,
    save = true,
    searchPlaceholder,
    subHeader,
    xScroll = '100%',
    yScroll = null,
    emptyText = <div>No Data</div>,
    loadFirst = false,
    onRow = () => {},
    ...prop
  }
) => {
  const [idTable] = useState('temp-' + v4());
  const [objData, setObjData] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const param = useRef(localStorage.getItem(idTable) ? JSON.parse(localStorage.getItem(idTable)) : {
    [pageIndex]: 1,
    [pageSize]: 10, ...defaultRequest
  });

  const {t} = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      localStorage.removeItem(idTable);
    };
  }, [idTable]);

  const onChange = useCallback(async (request) => {
    if (request) {
      localStorage.setItem(idTable, JSON.stringify(request));
      param.current = request;
    } else if (localStorage.getItem(idTable)) {
      param.current = JSON.parse(localStorage.getItem(idTable));
    }

    if (showList && Get) {
      setIsLoading && setIsLoading(true);
      const {data, count, ...prop} = await Get(param.current, id());
      if (data.length === 0 && param.current[pageIndex] > 1) {
        await onChange({...param.current, page: param.current[pageIndex] - 1});
      } else {
        setObjData(prop);
        setDataSource(data);
        setTotalData(count);
        setIsLoading && setIsLoading(false);
      }
    } else {
      setIsLoading && setIsLoading(false);
    }
  }, [Get, id, idTable, pageIndex, setIsLoading, showList]);

  const params = (save && location.search && location.search.indexOf(pageIndex+'=') > -1)
    ? getQueryStringParams(location.search)
    : param.current;

  if (params[filter] && typeof params[filter] === "string") {
    params[filter] = JSON.parse(params[filter]);
  }
  if (params[sort] && typeof params[sort] === "string") {
    params[sort] = JSON.parse(params[sort]);
  }

  const mount = useRef(false)
  const handleSearch = useCallback(async () => {
    if (!!save || !!loadFirst) {
      const _data = {
        [pageIndex]: params[pageIndex],
        [pageSize]: params[pageSize],
        [sort]: JSON.stringify(params[sort]),
        [filter]: JSON.stringify(params[filter]),
        [fullTextSearch]: params[fullTextSearch],
      };
      await onChange(cleanObjectKeyNull(_data));
    }
  }, [filter, fullTextSearch, loadFirst, onChange, pageIndex, pageSize, params, save, sort]);

  useEffect(() => {
    if (!mount.current) {
      mount.current  = true;
      handleSearch();
    }
  }, [mount, handleSearch, location.search, showList]);

  const groupButton = (confirm, clearFilters, key, value) => (
    <div className="grid grid-cols-2 gap-1">
      <button
        className="bg-blue-100 px-4 py-2.5 rounded-xl hover:bg-blue-500 hover:text-white"
        onClick={() => clearFilters()}
      >
        {t('components.datatable.reset')}
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2.5 rounded-xl hover:bg-blue-400 inline-flex items-center"
        onClick={() => confirm(value)}
      >
        <i className="las la-search mr-1"/>
        {t('components.datatable.search')}
      </button>
    </div>
  );
  const ref = useRef();
  // noinspection JSUnusedGlobalSymbols
  const getColumnSearchInput = (key) => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
      <div className="p-1">
        <input
          className="w-full h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-100 pr-9 pl-4 mb-1"
          value={selectedKeys}
          type="text"
          placeholder={t('components.datatable.pleaseEnterValueToSearch')}
          onChange={e => setSelectedKeys(e.target.value)}
        />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </div>
    ),
    filterIcon: filtered => (
      <i className="las la-lg la-search" style={{color: filtered ? '#3699FF' : undefined}}/>
    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => ref.current.select());
      }
    }
  });
  // noinspection JSUnusedGlobalSymbols
  const getColumnSearchRadio = (filters, key) => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters,}) => (
      <Fragment>
        <RadioGroup
          options={filters}
          value={selectedKeys}
          onChange={e => setSelectedKeys(e.target.value + "")}
        />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </Fragment>
    ),
    filterIcon: filtered => (
      <i className="las la-lg la-dot-circle" style={{color: filtered ? '#3699FF' : undefined}}/>
    ),
  });
  // noinspection JSUnusedGlobalSymbols
  const getColumnSearchCheckbox = (filters, key) => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
      <Fragment>
        <CheckboxGroup
          options={filters}
          value={selectedKeys}
          onChange={e => setSelectedKeys(e)}
        />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </Fragment>
    ),
    filterIcon: filtered => (
      <i className="las la-lg la-check-square" style={{color: filtered ? '#3699FF' : undefined}}/>
    ),
  });
  // noinspection JSUnusedGlobalSymbols
  const getColumnSearchDate = (key) => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
      <Fragment>
        <RangePicker
          renderExtraFooter={() =>(
            <button
              className="bg-blue-100 w-full px-3 py-1 rounded-xl hover:bg-blue-500 hover:text-white"
              onClick={() => document.activeElement.blur()}
            >
              {t('components.datatable.ok')}
            </button>
          )}
          format={['DD/MM/YYYY', 'DD/MM/YY']}
          value={!!selectedKeys && selectedKeys.length ? [moment(selectedKeys[0]), moment(selectedKeys[1])] : []}
          onChange={e => setSelectedKeys(e)}
        />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </Fragment>
    ),
    filterIcon: filtered => (
      <i className="las la-lg la-calendar" style={{color: filtered ? '#3699FF' : undefined}}/>
    )
  });

  const cols = columns.filter(col => !!col && !!col.tableItem).map(col => {
    let item = col.tableItem;

    if (item.filter) {
      if (params[filter] && params[filter][col.name]) {
        item = {...item, defaultFilteredValue: params[filter][col.name]};
      }

      switch (item.filter.type) {
        case "radio":
          item = {...item, ...getColumnSearchRadio(item.filter.list, col.name)};
          break;
        case "checkbox":
          item = {...item, ...getColumnSearchCheckbox(item.filter.list, col.name)};
          break;
        case "date":
          item = {...item, ...getColumnSearchDate(col.name)};
          break;
        default:
          item = {...item, ...getColumnSearchInput(col.name)};
      }
      delete item.filter;
    }

    if (item.sorter && params[sort] && params[sort][col.name]) {
      item.defaultSortOrder = params[sort][col.name] === 'ASC' ? 'ascend' : (params[sort][col.name] === 'DESC' ? 'descend' : '');
    }
    if (!item.render) {
      item.render = (text) => checkTextToShort(text);
    }

    return {
      title: col.title,
      dataIndex: col.name,
      ...item
    };
  });

  const handleTableChange = (pagination, filters = {}, sorts, tempFullTextSearch) => {
    let tempPageIndex = pagination ? pagination.current : params[pageIndex];
    const tempPageSize = pagination ? pagination.pageSize : params[pageSize];

    let tempSort = (sorts && sorts?.field && sorts?.order)
      ? {[sorts.field]: sorts.order === 'ascend' ? 'ASC' : (sorts.order === 'descend' ? 'DESC' : '')}
      : (sorts?.field ? null : sorts);
    if (tempSort) {
      tempSort = JSON.stringify(tempSort);
    }

    let tempFilter = cleanObjectKeyNull(filters);
    tempFilter = Object.keys(tempFilter).length === 0 ? null : JSON.stringify(tempFilter);
    if (tempFullTextSearch !== params[fullTextSearch]) {
      tempPageIndex = 1;
    }
    const tempParams = cleanObjectKeyNull({[pageIndex]: tempPageIndex, [pageSize]: tempPageSize, [sort]: tempSort, [filter]: tempFilter, [fullTextSearch]: tempFullTextSearch});
    if (save) {
      navigate(location.pathname + "?" + new URLSearchParams(tempParams).toString())
    }
    onChange && onChange(tempParams);
  };

  return [
    onChange,
    (data, columns) => {
      if (columns) {
        columns = columns.map((col) => ({title: col.title, dataIndex: col.name}));
      }
      return (
        <div className="intro-x">
          <div className="flex justify-between mb-2.5">
            {!!leftHeader && (
              <div className="mb-7">
                {leftHeader}
              </div>
            )}
            {!!showSearch && (
              <div className="relative">
                <input
                  className="w-52 h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-100 pr-9 pl-4"
                  defaultValue={params.fullTextSearch}
                  type="text"
                  placeholder={searchPlaceholder ? searchPlaceholder : t('components.datatable.pleaseEnterValueToSearch')}
                  onChange={(event) => handleTableChange(null, params[filter], params[sort], event.target.value)}
                />
                <i className="text-lg las la-search absolute top-1.5 right-3 z-10" />
              </div>
            )}
            {!!rightHeader && (
              <div>
                {rightHeader}
              </div>
            )}
          </div>
          {subHeader && subHeader(totalData)}
          {!!showList && (
            <Fragment>
              <Table
                onRow={onRow}
                locale={{emptyText: <div className="bg-gray-100 text-gray-400 py-4">{emptyText}</div>}}
                loading={isLoading}
                columns={columns || cols}
                pagination={false}
                dataSource={(data || dataSource).map((item) => ({...item, key: item.id || v4()}))}
                onChange={(pagination, filters, sorts) => handleTableChange(null, filters, sorts, params.fullTextSearch)}
                showSorterTooltip={false}
                scroll={{x: xScroll, y: yScroll}}
                size="small"
                {...prop}
              />
              {showPagination && <Pagination
                total={totalData} pageIndex={+params[pageIndex]} pageSize={+params[pageSize]} pageSizeOptions={[10, 20, 30, 40]}
                queryParams={(pagination) => handleTableChange(pagination, params[filter], params[sort], params.fullTextSearch)}
              />}
            </Fragment>
          )}
          <div className="footer">{footer(objData)}</div>
        </div>
      );
    }
  ];
};
export default Hook;
