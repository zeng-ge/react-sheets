import { map, times } from 'lodash'
// fake data
const generateRow = count => {
  return map(times(100), index => {
    return {
      id: `row-${index}`, 
      "column-1": '36.2', 
      "column-2": '2020-03-01',
      "column-3": 1, 
      "column-4": '张三',
      "column-5": '13612345671'
    }
  })
}
export default [
  {
    tableId: 'table-1',
    tableName: '测温情况',
    fields: [
      { id: 'column-1', name: '体温', type: 'TEXT', primary: true, width: 60 },
      { id: 'column-2', name: '日期', type: 'TEXT', width: 200 },
      { id: 'column-3', name: '班级', type: 'RADIO', options: [
        {value: 1, name: '三年级一班', default: true},
        {value: 2, name: '三年级二班'}
      ], width: 200 },
      { id: 'column-4', name: '学生', type: 'TEXT', width: 100 },
      { id: 'column-5', name: '家长电话', type: 'TEXT', width: 150 }
    ],
    rows: generateRow(100)
  }
];