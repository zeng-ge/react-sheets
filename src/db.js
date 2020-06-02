// fake data
export default [
  {
    tableId: 'table-1',
    tableName: '测温情况',
    fields: [
      { id: 'column-1', name: '体温', type: 'text', primary: true, width: 60 },
      { id: 'column-2', name: '日期', type: 'text', width: 200 },
      { id: 'column-3', name: '班级', type: 'radio', options: [
        {value: 1, name: '三年级一班', isDefault: true},
        {value: 2, name: '三年级二班'}
      ], width: 200 },
      { id: 'column-4', name: '学生', type: 'text', width: 100 },
      { id: 'column-5', name: '家长电话', type: 'text', width: 150 }
    ],
    rows: [
      {id: 'row-1', "column-1": '36.2', "column-2": '2020-03-01', "column-3": 1, "column-4": '张三', "column-5": '13612345671'},
      {id: 'row-2', "column-1": '36.3', "column-2": '2020-03-01', "column-3": 2, "column-4": '张三', "column-5": '13612345672'},
      {id: 'row-3', "column-1": '36.4', "column-2": '2020-03-01', "column-3": 1, "column-4": '张三', "column-5": '13612345671'},
      {id: 'row-4', "column-1": '36.5', "column-2": '2020-03-02', "column-3": 1, "column-4": '张三', "column-5": '13612345671'},
      {id: 'row-5', "column-1": '36.6', "column-2": '2020-03-03', "column-3": 1, "column-4": '张三', "column-5": '13612345671'}
    ]
  }
];