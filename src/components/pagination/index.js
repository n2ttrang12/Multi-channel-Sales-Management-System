import React, {useEffect, useRef, useCallback, useState} from "react";
import { Select } from 'antd';
import classNames from "classnames";

const Component = (
  {
    total = 4, pageSizeOptions = [], pageSize = 10, pageIndex = 1,
    queryParams = () => {},
  }
) => {
  const listOfPageItem = useRef([]);
  const [ranges, setRanges] = useState([]);
  const buildIndexes = useCallback(() => {
    const lastIndex = getLastIndex(total, pageSize);
    listOfPageItem.current = getListOfPageItem(pageIndex, lastIndex);
    setRanges([(pageIndex - 1) * pageSize + 1, Math.min(pageIndex * pageSize, total)])
  }, [pageIndex, pageSize, total])


  useEffect(() => {
    buildIndexes();
  }, [buildIndexes]);


  const getLastIndex = (total, pageSize) => {
    return Math.ceil(total / pageSize);
  }

  const onPageSizeChange = (size) => {
    queryParams({pageSize: size, current: pageIndex});
    buildIndexes();
  }

  const onPageIndexChange = (index) => {
    queryParams({pageSize, current: index});
  }

  const getListOfPageItem = (pageIndex, lastIndex) => {
    const concatWithPrevNext = (listOfPage) => {
      const prevItem = {
        type: 'prev',
        disabled: pageIndex === 1
      };
      const nextItem = {
        type: 'next',
        disabled: pageIndex === lastIndex
      };
      return [prevItem, ...listOfPage, nextItem];
    };
    const generatePage = (start, end) => {
      const list = [];
      for (let i = start; i <= end; i++) {
        list.push({
          index: i,
          type: 'page'
        });
      }
      return list;
    };

    if (lastIndex <= 9) {
      return concatWithPrevNext(generatePage(1, lastIndex));
    } else {
      const generateRangeItem = (selected, last) => {
        let listOfRange = [];
        const prevFiveItem = {
          type: 'prev_5'
        };
        const nextFiveItem = {
          type: 'next_5'
        };
        const firstPageItem = generatePage(1, 1);
        const lastPageItem = generatePage(lastIndex, lastIndex);
        if (selected < 4) {
          listOfRange = [...generatePage(2, 5), nextFiveItem];
        } else if (selected < last - 3) {
          listOfRange = [prevFiveItem, ...generatePage(selected - 2, selected + 2), nextFiveItem];
        } else {
          listOfRange = [prevFiveItem, ...generatePage(last - 4, last - 1)];
        }
        return [...firstPageItem, ...listOfRange, ...lastPageItem];
      };
      return concatWithPrevNext(generateRangeItem(pageIndex, lastIndex));
    }
  }

  return total > 0 && (
    <div className="flex items-center justify-between mt-3 select-none">
      <div>
        <Select defaultValue={pageSize} className="min-w-[115px]" onChange={(value) => onPageSizeChange(value)}>
          {pageSizeOptions.map((item, index) => <Select.Option key={index} value={item}>{item} / page</Select.Option>)}
        </Select>
        <span className="ml-3 text-black">
          {ranges[0]}-{ranges[1]} of {total} items
        </span>
      </div>
      <div className="flex justify-center border border-gray-100 p-1 rounded-xl bg-white">
        <div className="flex flex-wrap justify-center duration-300 transition-all">
          {listOfPageItem.current.map((page, index) => (
            <button
              key={index}
              className={classNames('text-center duration-300 transition-all py-1 px-2.5 text-sm font-medium leading-normal', {
                'text-blue-700 hover:text-blue-500': pageIndex !== page.index,
                'bg-blue-500 rounded-full text-white hover:text-white': pageIndex === page.index,
                'pointer-events-none': page.disabled || ['next_5', 'prev_5'].includes(page.type)
              })}
              onClick={() => onPageIndexChange(page.type === 'prev' ? pageIndex - 1 : (page.type === 'next' ? pageIndex + 1 : page.index))}
            >
              {page.type === 'prev' && <i className="las la-angle-left text-sm" />}
              {page.type === 'next' && <i className="las la-angle-right text-sm" />}
              {page.type === 'page' && page.index}
              {(page.type === 'prev_5' || page.type === 'next_5') && '...'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
};
export default Component;
