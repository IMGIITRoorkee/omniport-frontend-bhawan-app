import React from 'react'
import { connect } from 'react-redux'
import { Table, Header, Pagination, Segment, Dropdown } from 'semantic-ui-react'

import { Loading } from "formula_one"

import { getComplaints } from '../../actions/complaints'
import { addComplaint } from '../../actions/add_complaint'
import { complaintsUrl } from '../../urls'
import { entries } from '../constants'
import moment from 'moment'
import './index.css'


class Complaints extends React.Component {
  state = {
    complaintAgainID: null,
    activePage: 1,
    complaintsLoading: true,
    entryNo: '5',
  }
  componentDidMount() {
    this.props.getComplaints(
      `${complaintsUrl(this.props.activeHostel)}?me=True`,
      this.complaintsSuccessCallBack,
      this.complaintsErrCallBack
    )
  }
  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage, complaintsLoading: true })
    this.props.getComplaints(
      `${complaintsUrl(this.props.activeHostel)}?page=${activePage}`,
      this.complaintsSuccessCallBack,
      this.complaintsErrCallBack
    )
  }

  handleEntriesChange = (e, { value }) => {
    this.setState({ entryNo: value })
    this.setState({
      pendingLoading: true
    })
    this.props.getComplaints(
      `${complaintsUrl(this.props.activeHostel)}?page=${this.state.activePage}&perPage=${value}`,
      this.complaintsSuccessCallBack,
      this.complaintsErrCallBack
    )
  }

  complaintsSuccessCallBack = (res) => {
    this.setState({
      complaintsLoading: false,
    })
  }

  complaintsErrCallBack = (err) => {
    this.setState({
      complaintsLoading: false,
    })
  }

  render() {
    const { complaints, constants } = this.props
    const { activePage, complaintsLoading, entryNo } = this.state

    return (
      <React.Fragment>
          <Header as='h3'>My Complaints</Header>
          {!complaintsLoading?
            (
              <React.Fragment>
                {(complaints.results && complaints.results.length > 0)?
            (
              <React.Fragment>
                <div styleName="table-height"> 
                <Table unstackable celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>ID</Table.HeaderCell>
                      <Table.HeaderCell>Complaint Description</Table.HeaderCell>
                      <Table.HeaderCell>complaint Type</Table.HeaderCell>
                      <Table.HeaderCell>complaint Status</Table.HeaderCell>
                      <Table.HeaderCell>complaint Date and Time</Table.HeaderCell>
                      <Table.HeaderCell>Applicant Room</Table.HeaderCell>
                      <Table.HeaderCell>Items</Table.HeaderCell>
                      <Table.HeaderCell>Remark</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {complaints.results && complaints.results.length > 0
                      ? complaints.results.map((complaint, index) => {
                          return (
                            <Table.Row>
                              <Table.Cell>
                                {entryNo * (activePage - 1) + index + 1}
                              </Table.Cell>
                              <Table.Cell>{complaint.description}</Table.Cell>
                              <Table.Cell>{constants.complaint_types[complaint.complaintType]}</Table.Cell>
                              <Table.Cell>{constants.statues.COMPLAINT_STATUSES[complaint.status]}</Table.Cell>
                              <Table.Cell>{moment(complaint.datetimeCreated).format('DD/MM/YY, hh:mm a')}</Table.Cell>
                              <Table.Cell>{complaint.roomNo}</Table.Cell>
                              <Table.Cell>
                                {complaint.items.length > 0 
                                  ? complaint.items.map((item,index) => {
                                    return(
                                      <Table.Row>
                                        <Table.Cell>
                                          {item.quantity}
                                        </Table.Cell>
                                        <Table.Cell>
                                          {item.name}
                                        </Table.Cell>
                                      </Table.Row>
                                    )
                                  })
                                  :(
                                  'None'
                                  )
                                }
                              </Table.Cell>
                              <Table.Cell>
                                  {complaint.remark && complaint.remark.trim() != '' 
                                    ? complaint.remark : 'None'}
                              </Table.Cell>
                            </Table.Row>
                          )
                        })
                      : null}
                  </Table.Body>
                </Table>
                </div>
                <div styleName='pagination-container'>
                  <div>
                    {complaints.count > entryNo ? (
                      <Pagination
                        activePage={activePage}
                        onPageChange={this.handlePaginationChange}
                        totalPages={Math.ceil(complaints.count / entryNo)}
                      />
                    ) : null}
                  </div>
                  <div>
                    Entries per page : 
                      <Dropdown
                        name='entries'
                        selection
                        options={entries}
                        onChange={this.handleEntriesChange}
                        value={entryNo}
                        compact
                      />
                  </div>
                </div>
                    </React.Fragment>
                  ):
                  (
                    <Segment>No Complaints made yet</Segment>
                  )
                }
                    </React.Fragment>
                  ):
                  (
                    <Loading />
                  )
                }
        </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    complaints: state.complaints,
    activePage: state.activePage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getComplaints: (url, successCallBack, errCallBack) => {
      dispatch(getComplaints(url, successCallBack, errCallBack))
    },
    addComplaint: () => {
      dispatch(addComplaint())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Complaints)
