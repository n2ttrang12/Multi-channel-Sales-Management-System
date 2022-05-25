import React, {useState, useEffect, useRef, useCallback} from "react";
import {Spin} from "components";
import {v4} from "uuid";
import {smoothDnD} from "./smooth-dnd";

const Component = ({idRequest, Get, Put, ChangeColumn, onClick, allowSetStatus = true}) => {
  const [listData, setListData] = useState([]);
  const [id] = useState(v4());
  const [isLoading, set_isLoading] = useState(true);
  const domListData = useRef([]);
  const listStatus = useRef([]);
  const mounted = useRef(false);
  const initFunction = useCallback(async () => {
    const {data} = await Get(idRequest);
    setListData(data);

    let _removedIndex = null;
    let _removedIndexColumn = null;
    let _addedIndex = null;
    let _addedIndexColumn = null;
    const divId = document.getElementById(id);

    if (divId) {
      data.map((item, indexData) => {
        listStatus.current.push({value: item.id, label: item.name});
        if (item.allowActions?.allowEdit) {
          const childId = document.getElementById(item.id);
          if (!!childId) {
            domListData.current[item.id] = smoothDnD(document.getElementById(item.id), {
              groupName: id,
              getChildPayload: (index) => index,
              lockAxis: !!allowSetStatus ? undefined : 'xy',
              onDrop: async ({removedIndex, addedIndex}) => {
                if (allowSetStatus) {
                  if (removedIndex !== null) {
                    _removedIndex = removedIndex;
                    _removedIndexColumn = indexData;
                  }
                  if (addedIndex !== null) {
                    _addedIndex = addedIndex;
                    _addedIndexColumn = indexData;
                  }
                  if (_removedIndex !== null && _addedIndex !== null) {
                    let _item = {...data[_removedIndexColumn].tasks[_removedIndex]};
                    data[_removedIndexColumn].tasks.splice(_removedIndex, 1);
                    data[_addedIndexColumn].tasks.splice(_addedIndex, 0, _item);
                    _removedIndex = null;
                    _addedIndex = null;
                    !!Put && await Put(_item.id, data[_addedIndexColumn].id);
                  }
                }
              }
            });
          }
        }
        return item;
      });
    }
    setTimeout(async () => {
      if (divId) {
        smoothDnD(divId, {
          orientation: 'horizontal',
          dragHandleSelector: ".move-drag",
          getChildPayload: (index) => index,
          onDrop:async ({addedIndex, payload}) => {
            const column = data[payload];
            data.splice(payload, 1);
            data.splice(addedIndex, 0, column);
            !!ChangeColumn && await ChangeColumn(idRequest, data.map((item, index) => ({id: item.id, position: index})));
          }
        });
        import("perfect-scrollbar").then(({default: PerfectScrollbar}) => {
          new PerfectScrollbar(document.getElementById(id + 'wrapper'), {
            suppressScrollY: true,
          });
        });
        set_isLoading(false);
      }
    }, );
  }, [ChangeColumn, Get, Put, allowSetStatus, id, idRequest]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      initFunction();
    }
  }, [initFunction]);

  return (
    <Spin spinning={isLoading}>
      <div id={id + 'wrapper'} className="overflow-auto relative">
        <div id={id} className='drag-horizontal' style={{minWidth: (listData.length * 300) + 'px', minHeight: '200px'}}>
          {listData.map((item) => (
            <div
                className="group-card"
                style={{backgroundColor: item.backgroundColor}}
                key={item.id}
            >
              <div className="flex justify-between p-2">
                <h3><span style={{color: item.frontColor}}>{item.name} ({item.tasks.length})</span></h3>
                {item?.allowActions?.allowEdit && <i style={{color: item.frontColor}} className="move-drag las  la-lg la-arrows-alt" />}
              </div>
              <div id={item.id} className="drag-vertical">
                {item.tasks.map((subItem, subIndex) => (
                  <div
                    className="p-2 bg-white rounded-xl"
                    key={item.id + subIndex}
                    onClick={() => !!onClick && onClick(subItem)}
                  >
                    <strong>{subItem.task_name}</strong>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Spin>
  );
};
export default Component;
