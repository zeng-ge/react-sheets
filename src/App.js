import React from 'react'
import { Provider } from 'react-redux'
import Sheets from './features/sheets/containers/Sheets'
import store from './store'

export default class App extends React.Component{
  render(){
    return (
      <Provider store={store}>
        <Sheets />
      </Provider>
    )
  }
}