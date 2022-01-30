import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TimeInput } from 'semantic-ui-calendar-react'
import {
  Grid,
  Header,
  Table,
  Button,
  Modal,
  Container,
  Icon,
  Dropdown,
  Pagination,
  Popup,
  Segment,
} from 'semantic-ui-react'
import moment from 'moment'

import { Loading } from "formula_one"

import {
  getPendingComplains,
  getResolvedComplains,
  increaseUnsuccefulAttempts,
} from '../../actions/complains'
import { getTimeSlots, changeTimeSlot } from '../../actions/time-slots'
import { resolveComplain } from '../../actions/resolveComplain'
import {
  statusComplainsUrl,
  increaseUnsuccesfulComplainsUrl,
  timeSlotsUrl,
} from '../../urls'

import { toast } from 'react-semantic-toasts'
import './index.css'

const days = [
  { key: 'mon', text: 'Monday', value: 'mon' },
  { key: 'tue', text: 'Tuesday', value: 'tue' },
  { key: 'wed', text: 'Wednesday', value: 'wed' },
  { key: 'thu', text: 'Thursday', value: 'thu' },
  { key: 'fri', text: 'Friday', value: 'fri' },
  { key: 'sat', text: 'Saturday', value: 'sat' },
  { key: 'sun', text: 'Sunday', value: 'sun' },
  { key: 'dai', text: 'Daily', value: 'dai' },
]

const types = [
  { key: 'ele', text: 'ELECTRIC', value: 'ele' },
  { key: 'car', text: 'CARPENTRY', value: 'car' },
  { key: 'cle', text: 'CLEANING', value: 'cle' },
]

class AdminComplains extends Component {
  state = {
    open: false,
    pastComplainIcon: 'angle up',
    from: '',
    to: '',
    success: false,
    err: false,
    message: '',
    pendingLoading: true,
    pastLoading: true,
    type: '',
    activeId: null,
    activeItem: 'apr',
    activePage: 1,
    activeAprPage: 1,
    found: false,
    foundType: false,
    foundId: 1,
  }

  componentDidMount() {
    this.props.setNavigation('Student Complains')
    this.props.getPendingComplains(
      statusComplainsUrl(this.props.activeHostel, ['pending']),
      this.pendingSuccessCallBack,
      this.pendingErrCallBack
    )
    this.props.getResolvedComplains(
      statusComplainsUrl(this.props.activeHostel, [
        'resolved',
        'unresolved',
      ]),
      this.pastSuccessCallBack,
      this.pastErrCallBack
    )
    this.props.getTimeSlots(this.props.activeHostel)
  }

  show = (id) => {
    this.setState({
      open: true,
      activeId: id,
    })
  }

  close = () => this.setState({ open: false })

  togglePastIcon = () => {
    const pastComplainIcon = this.state.pastComplainIcon
    pastComplainIcon === 'angle down'
      ? this.setState({ pastComplainIcon: 'angle up' })
      : this.setState({ pastComplainIcon: 'angle down' })
  }

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value })
    }
    if (name == 'type') {
      this.setState({
        from: '',
        to: '',
      })
      this.searchTime(value)
    }
  }

  searchTime(type) {
    let index
    let entry
    for (index = 0 ;index < this.props.timeSlots.length; ++index) {
      entry = this.props.timeSlots[index]
      if (entry && entry.complaintType && entry.complaintType === type) {
            this.setState({
              from: moment(entry.timing[0].start, 'HH:mm:SS').format('HH:mm'),
              to: moment(entry.timing[0].end, 'HH:mm:SS').format('HH:mm'),
              found: true,
              foundId: entry.id,
              foundType: true,
            })
            return
      }
    }
    this.setState({
      found: false,
      foundType: false,
    })
  }

  resolveComplaint = () => {
    const body = {
      status: 'res',
    }
    this.props.resolveComplain(
      this.state.activeId,
      body,
      this.props.activeHostel,
      this.resolveSuccessCallBack,
      this.errCallBack
    )
    this.close()
  }

  resolveSuccessCallBack = (res) => {
    this.setState({
      success: true,
      error: false,
      message: '',
    })
    this.props.getPendingComplains(
      statusComplainsUrl(this.props.activeHostel, ['pending']),
      this.pendingSuccessCallBack,
      this.pendingErrCallBack
    )
    this.props.getResolvedComplains(
      statusComplainsUrl(this.props.activeHostel, [
        'resolved',
        'unresolved',
      ]),
      this.pastSuccessCallBack,
      this.pastErrCallBack
    )
  }

  pendingSuccessCallBack = (res) => {
    this.setState({
      pendingLoading: false
    })
  }

  pendingErrCallBack = (err) => {
    this.setState({
      pendingLoading: false
    })
  }

  pastSuccessCallBack = (res) => {
    this.setState({
      pastLoading: false
    })
  }

  pastErrCallBack = (err) => {
    this.setState({
      pastLoading: false
    })
  }
  changeTiming = () => {
    let dayTiming = []

    if (this.state.foundType) {
      for (var index = 0; index < this.props.timeSlots.length; index++) {
        if (this.props.timeSlots[index].complaintType === this.state.type) {
          dayTiming = this.props.timeSlots[index].timing
          dayTiming[index].start = this.state.from
          dayTiming[index].end = this.state.to
          break
        }
      }
    } else {
      dayTiming = [{
        day: 'dai',
        start: this.state.from,
        end: this.state.to,
      }]
    }
    const data = {
      complaintType: this.state.type,
      timing: dayTiming,
    }
    this.props.changeTimeSlot(
      data,
      this.state.found,
      this.state.foundId,
      timeSlotsUrl(this.props.activeHostel),
      this.timeSlotSuccessCallBack,
      this.errorCallBack
    )
  }

  timeSlotSuccessCallBack = (res) => {
    this.setState({
      success: true,
      error: false,
      message: '',
    })
    toast({
      type: 'success',
      title: 'Time Slot changed',
      description: 'Time Slot Changed',
      animation: 'fade up',
      icon: 'smile outline',
      time: 4000,
    })
    this.props.getTimeSlots()
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage })
    this.setState({
      pendingLoading: true
    })
    this.props.getPendingComplains(
      `${statusComplainsUrl(this.props.activeHostel, [
        'PENDING',
      ])}page=${activePage}`,
      this.pendingSuccessCallBack,
      this.pendingErrCallBack
    )
  }

  handlePastPaginationChange = (e, { activePage }) => {
    this.setState({ activeAprPage: activePage })
    this.setState({
      pastLoading: true
    })
    this.props.getResolvedComplains(
      `${statusComplainsUrl(this.props.activeHostel, [
        'RESOLVED',
        'UNRESOLVED',
      ])}&page=${activePage}`,
      this.pastSuccessCallBack,
      this.pastErrCallBack
    )
  }

  increaseUnsuccesfulComplains = (id) => {
    this.props.increaseUnsuccefulAttempts(
      increaseUnsuccesfulComplainsUrl(this.props.activeHostel, id),
      this.resolveSuccessCallBack,
      this.errCallBack
    )
  }

  render() {
    const {
      open,
      pastComplainIcon,
      activePage,
      activeAprPage,
      pendingLoading,
      pastLoading
    } = this.state
    const { pendingComplains, resolvedComplains, constants } = this.props
    return (
      <Grid container>
          <Grid.Column width={16}>
            <Container>
              <Header as='h4'>Student Complains and Feedback</Header>
              {!pendingLoading?
                (
                  <React.Fragment>
                  {(pendingComplains.results &&
                    pendingComplains.results.length >0)?
                    (
                      <React.Fragment>
                      <div styleName="table-height table-overflow">
                      <Table celled unstackable>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Complaint Description</Table.HeaderCell>
                            <Table.HeaderCell>Applicant Name</Table.HeaderCell>
                            <Table.HeaderCell>Complaint Date</Table.HeaderCell>
                            <Table.HeaderCell>Complaint Type</Table.HeaderCell>
                            <Table.HeaderCell>Contact Number</Table.HeaderCell>
                            <Table.HeaderCell>Applicant Room</Table.HeaderCell>
                            <Table.HeaderCell>
                              Unsuccesful attempts to solve
                            </Table.HeaderCell>
                            <Table.HeaderCell>Mark as resolved</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {pendingComplains.results &&
                            pendingComplains.results.length > 0
                            ? pendingComplains.results.map((complain, index) => {
                                return (
                                  <Table.Row>
                                    <Table.Cell>
                                      {5 * (activePage - 1) + index + 1}
                                    </Table.Cell>
                                    <Table.Cell>{complain.description}</Table.Cell>
                                    <Table.Cell>{complain.complainant}</Table.Cell>
                                    <Table.Cell>
                                      {moment(
                                        complain.datetimeCreated.substring(0, 10),
                                        'YYYY-MM-DD'
                                      ).format('DD/MM/YY')}
                                    </Table.Cell>
                                    <Table.Cell>
                                      {
                                        constants.complaint_types[
                                          complain.complaintType
                                        ]
                                      }
                                    </Table.Cell>
                                    <Table.Cell>{complain.phoneNumber}</Table.Cell>
                                    <Table.Cell>{complain.roomNo}</Table.Cell>
                                    <Table.Cell
                                      onClick={() =>
                                        this.increaseUnsuccesfulComplains(complain.id)
                                      }
                                    >
                                      {complain.failedAttempts}
                                      <span styleName='cursor'> + </span>
                                    </Table.Cell>
                                    <Table.Cell onClick={() => this.show(complain.id)}>
                                      <span styleName='resolve-style'>Resolve</span>
                                    </Table.Cell>
                                  </Table.Row>
                                )
                              })
                            : null}
                        </Table.Body>
                      </Table>
                      </div>
                      {pendingComplains.count > 5 ? (
                        <Pagination
                          activePage={activePage}
                          onPageChange={this.handlePaginationChange}
                          totalPages={Math.ceil(pendingComplains.count / 5)}
                        />
                      ) : null}
                      </React.Fragment>
                    ):
                    (
                      <Segment>No pending complains found</Segment>
                    )
                  }
                  </React.Fragment>
                ):
                (
                  < Loading />
                )
              }

              <Header as='h4'>
                Select slot for
                <Dropdown
                  name='type'
                  placeholder='type'
                  selection
                  options={types}
                  onChange={this.handleChange}
                  compact
                />
                from
                  <span styleName="info-icon">
                  <Popup
                    content='Set the time to send emails automatically for this type of complain'
                    trigger={
                      <Icon
                        name='info'
                        size="small"
                        color="blue"
                        circular
                        aria-label='Set the time to send emails automatically for this type of complain'
                      />
                    }
                  />
                  </span>
                  <TimeInput
                    name='from'
                    placeholder='From'
                    value={this.state.from}
                    iconPosition='left'
                    onChange={this.handleChange}
                  />
                  <TimeInput
                    name='to'
                    placeholder='To'
                    value={this.state.to}
                    iconPosition='left'
                    onChange={this.handleChange}
                  />
                <Button primary onClick={this.changeTiming}>Change</Button>
              </Header>
              <Header as='h4'>
                Past Complains and Feedback
                <Icon name={pastComplainIcon} onClick={this.togglePastIcon} />
              </Header>
              {pastComplainIcon === 'angle down' && (
                <React.Fragment>
                  {!pastLoading?
                    (
                      <React.Fragment>
                        {(resolvedComplains.results && resolvedComplains.results.length > 0) ?
                      (
                      <React.Fragment>
                        <div styleName="table-height">
                          <Table celled unstackable>
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Complaint Description</Table.HeaderCell>
                                <Table.HeaderCell>Applicant Name</Table.HeaderCell>
                                <Table.HeaderCell>Complaint Date</Table.HeaderCell>
                                <Table.HeaderCell>Complaint Type</Table.HeaderCell>
                                <Table.HeaderCell>Contact Number</Table.HeaderCell>
                                <Table.HeaderCell>Applicant Room</Table.HeaderCell>
                                <Table.HeaderCell>
                                  Unsuccesful attempts to solve
                                </Table.HeaderCell>
                                <Table.HeaderCell>Complain Status</Table.HeaderCell>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {resolvedComplains.results &&
                              resolvedComplains.results.length > 0
                                ? resolvedComplains.results.map((complain, index) => {
                                    return (
                                      <Table.Row>
                                        <Table.Cell>
                                          {5 * (activeAprPage - 1) + index + 1}
                                        </Table.Cell>
                                        <Table.Cell>{complain.description}</Table.Cell>
                                        <Table.Cell>{complain.complainant}</Table.Cell>
                                        <Table.Cell>
                                          {moment(
                                            complain.datetimeCreated.substring(0, 10),
                                            'YYYY-MM-DD'
                                          ).format('DD/MM/YY')}
                                        </Table.Cell>
                                        <Table.Cell>
                                          {
                                            constants.complaint_types[
                                              complain.complaintType
                                            ]
                                          }
                                        </Table.Cell>
                                        <Table.Cell>{complain.phoneNumber}</Table.Cell>
                                        <Table.Cell>{complain.roomNo}</Table.Cell> 
                                        <Table.Cell>
                                          {complain.failedAttempts}
                                        </Table.Cell>
                                        <Table.Cell>
                                          {
                                            constants.statues.COMLAINT_STATUSES[
                                              complain.status
                                            ]
                                          }
                                        </Table.Cell>
                                      </Table.Row>
                                    )
                                  })
                                : null}
                            </Table.Body>
                          </Table>
                        </div>
                  {resolvedComplains.count > 5 ? (
                    <Pagination
                      activePage={activeAprPage}
                      onPageChange={this.handlePastPaginationChange}
                      totalPages={Math.ceil(resolvedComplains.count / 5)}
                    />
                  ) : null}
                      </React.Fragment>
                    ):
                    <Segment>No resolved complains found</Segment>
                  }
                      </React.Fragment>
                    ):
                    (
                      <Loading />
                    )
                  }
                </React.Fragment>
              )}
            </Container>
            <Modal size='mini' open={open} onClose={this.close}>
              <Modal.Header styleName='center'>Resolve Complain?</Modal.Header>
              <Modal.Actions styleName='modalActions'>
                <Button positive fluid onClick={this.resolveComplaint}>
                  Yes
                </Button>
                <Button negative fluid onClick={this.close}>
                  No
                </Button>
              </Modal.Actions>
            </Modal>
          </Grid.Column>
      </Grid>
    )
  }
}

function mapStateToProps(state) {
  return {
    pendingComplains: state.pendingComplains,
    resolvedComplains: state.resolvedComplains,
    timeSlots: state.timeSlots,
    activeHostel: state.activeHostel
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPendingComplains: (url, successCallBack, errCallBack) => {
      dispatch(getPendingComplains(url, successCallBack, errCallBack))
    },
    getResolvedComplains: (url, successCallBack, errCallBack) => {
      dispatch(getResolvedComplains(url, successCallBack, errCallBack))
    },
    getTimeSlots: (residence) => {
      dispatch(getTimeSlots(residence))
    },
    changeTimeSlot: (
      data,
      found,
      foundId,
      residence,
      successCallBack,
      errorCallBack
    ) => {
      dispatch(
        changeTimeSlot(
          data,
          found,
          foundId,
          residence,
          successCallBack,
          errorCallBack
        )
      )
    },
    increaseUnsuccefulAttempts: (url, successCallBack, errCallBack) => {
      dispatch(increaseUnsuccefulAttempts(url, successCallBack, errCallBack))
    },
    resolveComplain: (id, data, residence, successCallBack, errCallBack) => {
      dispatch(
        resolveComplain(id, data, residence, successCallBack, errCallBack)
      )
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminComplains)
