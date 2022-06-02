// import {useRef} from "react";
// import {DatePicker} from "antd";
// import ReactDOM from "react-dom";
// import moment from "moment";
//
// const Component = ({...props}) => {
//   const dateRef = props.ref || useRef();
//   return <DatePicker
//     {...props}
//     ref={dateRef}
//     onOpenChange={(e) => {
//       if (!e) {
//         const rangePickerDomNode = ReactDOM.findDOMNode(dateRef.current);
//         const [startInput, endInput] = rangePickerDomNode.querySelectorAll('.ant-picker-input input');
//         const selectDate = moment(startInput.value, 'DD/MM/YYYY');
//         if (selectDate.isValid() && props.onChange) {
//           props.onChange(selectDate, startInput.value)
//         }
//       }
//     }}
//   />
// };
// export default Component;
