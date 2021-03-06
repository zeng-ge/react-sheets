import { connect } from 'react-redux'
import actions from '../../../../actions'
import { CreateTableModal } from '../CreateTable'

const mapStateToProps = state => ({ 
  visible: state.sheets.renameTableModalVisibility,
  tableId: state.sheets.activeTableId
})
const mapDispatchToProps = {
  toggleModal: actions.toggleRenameTableModal,
  confirmAction: actions.renameTable
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTableModal)