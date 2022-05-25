import React, {useState, useRef, useEffect} from 'react';
import {Progress, Popconfirm} from 'antd';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import moment from 'moment';
import classNames from "classnames";
import {v4} from "uuid";

import {useAuth} from 'global';
import {linkApi} from 'variable';
import {Avatar, Message, Spin} from "components";

import RemoveIcon from 'assets/svg/remove';
import DownloadIcon from 'assets/svg/download';


// [{
//   createdDate: "2022-02-18 17:03:11",
//   fileName: "LLC-cost_637808005911976625.jpg",
//   id: "6932",
//   path: "https://fecredit.com.vn/wp-content/download",
//   size: "21.16 KB",
//   thumb: "https://fecredit.com.vn/wp-content/uploads/2020/08/LLC-cost.jpg",
// }]
const Component = (
  {
    value = [],
    onChange,
    deleteFile,
    showBtnUpload = true,
    showBtnDownload = () => true,
    showBtnDelete = () => true,
    method = 'post',
    maxSize = 40,
    multiple = true,
    right = false,
    action = linkApi + '/File',
    maxCount,
    onlyImage = false,
    accept = 'image/*',
    extendButton = () => null,
    validation = async () => true,
    ...prop
  }
) => {
  const { t } = useTranslation();
  const {formatDate} = useAuth();
  const [isLoading, set_isLoading] = useState(false);
  const ref = useRef();
  let [listFiles, set_listFiles] = useState(!onlyImage && value ? value.map(_item => {
    if (!!_item.status) return _item;
    return {status: 'done', id: _item.id, ..._item, response: {data: {..._item, thumb: _item.thumb || _item.path} }};
  }) : [])

  const handleDownload = async (file) => {
    const response = await axios.get(file.response ? file.response.data.path : file.path, { responseType: 'blob'});
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
    link.target = '_blank';
    link.download = file.response ? file.response.data.fileName : file.name;
    link.click();
  };

  useEffect(() => {
    const tempData = !onlyImage && value ? value.map(_item => {
      if (!!_item.status) return _item;
      return {status: 'done', id: _item.id, ..._item, response: {data: {..._item, thumb: _item.thumb || _item.path}}};
    }) : [];
    if (JSON.stringify(listFiles) !== JSON.stringify(tempData)) {
      set_listFiles(tempData);
      setTimeout(() => {
        import("glightbox").then(({default: GLightbox}) => GLightbox())
      });
    }
  }, [value, onlyImage])

  useEffect(() => {
    setTimeout(() => {
      import("glightbox").then(({default: GLightbox}) => GLightbox())
    });
  }, []);

  // error
  return <div>
    <div className={classNames({'text-right': right})}>
      <input
        type="file"
        className={'hidden'}
        accept={accept}
        multiple={!onlyImage && multiple}
        ref={ref}
        onChange={async ({target}) => {
          for (let i = 0; i < target.files.length; i++) {
            const file = target.files[i];
            if (maxSize && file.size > maxSize * 1024 * 1024) {
              await Message.warning(`${file.name} (${((file.size)/ (1024*1024)).toFixed(1)}mb): ${t("components.form.ruleMaxSize", {max: maxSize})}`);
              return false;
            }

            if (!await validation(file, listFiles)) {
              return false;
            }

            const thumbUrl = await new Promise((resolve) => {
              let fileReader = new FileReader();
              fileReader.onload = (e) => resolve(fileReader.result);
              fileReader.readAsDataURL(file);
            });
            const dataFile = {
              lastModified: file.lastModified,
              lastModifiedDate: file.lastModifiedDate,
              name: file.name,
              size: file.size,
              type: file.type,
              originFileObj: file,
              thumbUrl,
              id: v4(),
              percent: 0,
              status: 'uploading'
            };
            listFiles.push(dataFile);
            set_listFiles([...listFiles]);

            if (action) {
              set_isLoading(true);
              if (typeof action === "string") {
                const bodyFormData = new FormData();
                bodyFormData.append('file', file);

                try {
                  const {data} = await axios({
                    method,
                    url: action,
                    data: bodyFormData,
                    onUploadProgress: function (event) {
                      set_listFiles([...listFiles.map(item => {
                        if (item.id === dataFile.id) {
                          item.percent = parseInt((event.loaded / event.total) * 100);
                        }
                        return item;
                      })]);
                    },
                  });
                  set_isLoading(false);
                  onChange([...listFiles.map(item => {
                    if (item.id === dataFile.id) {
                      item.status = 'done';
                      item.response = data;
                    }
                    return item;
                  })]);
                } catch (e) {
                  set_isLoading(false);
                  if (e.response.data.message) Message.error(e.response.data.message);
                  set_listFiles(listFiles.filter(_item => _item.id !== dataFile.id));
                }
              } else {

                try {
                  const data = await action(file, {
                    onUploadProgress: function (event) {
                      set_listFiles([...listFiles.map(item => {
                        if (item.id === dataFile.id) {
                          item.percent = parseInt((event.loaded / event.total) * 100);
                        }
                        return item;
                      })]);
                    },
                  });
                  set_isLoading(false);
                  onChange([...listFiles.map(item => {
                    if (item.id === dataFile.id) {
                      item.status = 'done';
                      item.response = data;
                    }
                    return {...item};
                  })]);
                } catch (e) {
                  set_isLoading(false);
                }
              }
              setTimeout(() => {
                import("glightbox").then(({default: GLightbox}) => new GLightbox())
              }, );
            }
          }
          ref.current.value = "";
        }}
      />
      <span onClick={() => ref.current.click()}>
        {onlyImage
          ? (value ? <Spin spinning={isLoading}>{!!prop.children ? prop.children : <Avatar size={150} src={value?.thumb || value} />}</Spin> : <div className="avatar-uploader"><i className="las la-plus la-3x" /></div>) :
          (showBtnUpload && <button className="bg-blue-500 text-white px-4 h-10 rounded-xl hover:bg-blue-400 inline-flex items-center mb-3"><i className="las la-upload mr-1"/> {t('components.form.Upload')}</button>)}
      </span>
    </div>

    <div>
      {!onlyImage && listFiles.map((file, index) => (
        <div key={index} className={classNames('flex items-center py-1', {'bg-yellow-100': file.status === 'error'})}>
          <Spin spinning={file.status === 'uploading'}>
            <a href={file?.response ? file?.response?.data?.path : file?.path}  className="glightbox">
              <img
                width="150"
                className={'object-cover object-center h-20'}
                src={(!!file?.response?.data?.thumb) ? file.response.data.thumb : file.thumbUrl}
                alt={file.name}
              />
              {/*<i className="las la-play-circle text-8xl px-6 mr-1" />*/}
            </a>
          </Spin>
          <div className="flex-1 flex items-center relative">
            <div className={'pl-5'}>
              <strong>{(!!file?.response?.data?.fileName) ? file.response.data.fileName : file.name}</strong>
              {file.status === 'error' && <span className={'px-2 py-1 bg-red-500 text-white'}>Upload Error</span>}
              {(file?.response?.data?.createdDate || file.lastModified) && (
                <div>Added {moment((file?.response?.data?.createdDate)
                  ? file.response.data.createdDate
                  : file.lastModified).format(formatDate + " - HH:mm")} |&nbsp;
                  {(!!file?.response?.data?.size
                    ? file.response.data.size
                    : (typeof file.size === 'number' ? ((file.size / (1024 * 1024)).toFixed(2) + "MB") : file.size))}
                </div>
              )}
              {file.status === 'uploading' && <Progress percent={file.percent} />}
            </div>
            {(file.status === "done" || !file.status) && (
              <div className="absolute right-0 flex">
                {extendButton(file)}
                {!!showBtnDownload(file) && (
                  <button
                    className="embed border border-gray-300 text-xs rounded-lg mr-2"
                    onClick={() => handleDownload(file)}
                  >
                    <DownloadIcon/>
                  </button>
                )}
                {!!showBtnDelete(file) && (
                  <Popconfirm
                    placement="left"
                    title={t("components.datatable.areYouSureWant")}
                    icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                    onConfirm={async () => {
                      if (deleteFile && file?.response?.data?.id) {
                        const data = await deleteFile(file?.response?.data?.id);
                        if (!data) {
                          return false
                        }
                      }
                      onChange && onChange(listFiles.filter(_item => _item.id !== file.id));
                    }}
                    okText={t("components.datatable.ok")}
                    cancelText={t("components.datatable.cancel")}
                  >
                    <button
                      className="embed border border-gray-300 text-xs rounded-lg mr-2"
                    >
                      <RemoveIcon/>
                    </button>
                  </Popconfirm>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>;
};
export default Component;
