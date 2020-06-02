import React from 'react'
import { map, reduce } from 'lodash'
import Row from '../../../../../components/Row'
import './index.scss'

export default class Sheet extends React.Component{

  calculateWidth() {
    const { table: {fields = []} = {} } = this.props;
    return reduce(fields, (accumulator, field)=> {
      return accumulator += field.width;
    }, 0)
  }

  renderHeader() {
    const { table: {fields = []} = {} } = this.props;
    return (
      <ul className="sheet-header" style={{width: this.calculateWidth()}}>
        { map(fields, field => {
          return (
            <li 
              className="sheet-header-field" 
              style={{width: field.width}}
              key={field.id}>
                {field.name}
            </li>)
        })}
      </ul>
    )
  }
  
  renderRows() {
    const { table: { fields=[], rows =[]} = {} } = this.props;
    return map(rows, row => {
      return (<Row key={row.id} fields={fields} values={row}/>)
    })
  }

  render(){
    const { table: { rows =[]} = {} } = this.props;
    return (
      <div className="sheet-wrapper">
        { this.renderHeader() }
        <div className="sheet-body" style={{width: this.calculateWidth()}}>
          <div className="sheet-no"></div>
          <div className="sheet-rows">
            {this.renderRows()}
          </div>
        </div>
      </div>
    )
  }
}