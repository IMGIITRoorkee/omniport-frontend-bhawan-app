import React from 'react'
import { connect } from 'react-redux'
import { Table, Header, Pagination, Segment, Dropdown } from 'semantic-ui-react'

import { Loading } from "formula_one"

import { getComplains } from '../../actions/complains'
import { addComplaint } from '../../actions/add_complaint'
import { complainsUrl } from '../../urls'
import { entries } from '../../constants'
import moment from 'moment'
import './index.css'


class Complains extends React.Component {
  state = {
    complainAgainID: null,
    activePage: 1,
    complainsLoading: true,
    entryNo: '5',
  }
  componentDidMount() {
    this.props.getComplains(
      complainsUrl(this.props.activeHostel),
      this.complainsSuccessCallBack,
      this.complainsErrCallBack
    )
  }
  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage, complainsLoading: true })
    this.props.getComplains(
      `${complainsUrl(this.props.activeHostel)}?page=${activePage}`,
      this.complainsSuccessCallBack,
      this.complainsErrCallBack
    )
  }

  handleEntriesChange = (e, { value }) => {
    this.setState({ entryNo: value })
    this.setState({
      pendingLoading: true
    })
    this.props.getComplains(
      `${complainsUrl(this.props.activeHostel)}?page=${this.state.activePage}&perPage=${value}`,
      this.complainsSuccessCallBack,
      this.complainsErrCallBack
    )
  }

  complainsSuccessCallBack = (res) => {
    this.setState({
      complainsLoading: false,
    })
  }

  complainsErrCallBack = (err) => {
    this.setState({
      complainsLoading: false,
    })
  }

  render() {
    const { complains, constants } = this.props
    const { activePage, complainsLoading, entryNo } = this.state

    return (
      <React.Fragment>
          <Header as='h3'>My Complains</Header>
          {!complainsLoading?
            (
              <React.Fragment>
                {(complains.results && complains.results.length > 0)?
            (
              <React.Fragment>
                <div styleName="table-height">
                <Table unstackable celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>ID</Table.HeaderCell>
                      <Table.HeaderCell>Complaint Description</Table.HeaderCell>
                      <Table.HeaderCell>Complain Type</Table.HeaderCell>
                      <Table.HeaderCell>Complain Status</Table.HeaderCell>
                      <Table.HeaderCell>Complain Date and Time</Table.HeaderCell>
                      <Table.HeaderCell>Applicant Room</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {complains.results && complains.results.length > 0
                      ? complains.results.map((complain, index) => {
                          return (
                            <Table.Row>
                              <Table.Cell>
                                {entryNo * (activePage - 1) + index + 1}
                              </Table.Cell>
                              <Table.Cell>{complain.description}</Table.Cell>
                              <Table.Cell>{constants.complaint_types[complain.complaintType]}</Table.Cell>
                              <Table.Cell>{constants.statues.COMLAINT_STATUSES[complain.status]}</Table.Cell>
                              <Table.Cell>{moment(complain.datetimeCreated).format('DD/MM/YY, hh:mm a')}</Table.Cell>
                              <Table.Cell>{complain.roomNo}</Table.Cell>
                            </Table.Row>
                          )
                        })
                      : null}
                  </Table.Body>
                </Table>
                </div>
                <div styleName='pagination-container'>
                  <div>
                    {complains.count > entryNo ? (
                      <Pagination
                        activePage={activePage}
                        onPageChange={this.handlePaginationChange}
                        totalPages={Math.ceil(complains.count / entryNo)}
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
                    <Segment>No Complains made yet</Segment>
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
    complains: state.complains,
    activePage: state.activePage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getComplains: (url, successCallBack, errCallBack) => {
      dispatch(getComplains(url, successCallBack, errCallBack))
    },
    addComplaint: () => {
      dispatch(addComplaint())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Complains)
