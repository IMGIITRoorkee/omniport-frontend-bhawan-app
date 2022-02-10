import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Loading } from "formula_one"

import {
  getRoomBookings,
  getPresentRoomBookings,
  getPastRoomBookings
} from '../../actions/get-room-bookings'
import { updateBooking } from '../../actions/book-room'

import { statusBookingsUrl, specificBookingUrl, bookingsDownloadUrl } from '../../urls'

import {
  Menu,
  Header,
  Table,
  Button,
  Modal,
  Container,
  Icon,
  Pagination,
  Message,
  Grid,
  Segment
} from 'semantic-ui-react'

import './index.css'

class BookingRequests extends Component {
  state = {
    open: false,
    activeItem: 'pending',
    pastBookingIcon: 'angle down',
    message: '',
    success: false,
    err: false,
    activeId: null,
    detailOpen: false,
    activeBooking: null,
    activePastItem: 'confirmed',
    activePage: 1,
    openReject: false,
    presentLoading: true,
    pastLoading: true,
    bookingDownloadUrl: '',
  }

  componentDidMount() {
    const { activePost } = this.props

    if(activePost == 'sup'){
      this.props.getPresentRoomBookings(
        statusBookingsUrl(
          this.props.activeHostel,
          this.props.constants.statues.BOOKING_STATUSES.pen,
          'false'
        ),
        this.presentSuccessCallBack,
        this.presentErrCallBack

      )
      this.props.getPastRoomBookings(
        statusBookingsUrl(
          this.props.activeHostel,
          this.props.constants.statues.BOOKING_STATUSES.cnf,
          'true'
        ),
        this.pastSuccessCallBack,
        this.pastErrCallBack
      )
    }else {
      this.setState({ activeItem: 'forwarded' })
      this.props.getPresentRoomBookings(
        statusBookingsUrl(
          this.props.activeHostel,
          this.props.constants.statues.BOOKING_STATUSES.fwd,
          'false'
        ),
        this.presentSuccessCallBack,
        this.presentErrCallBack
      )
      this.props.getPastRoomBookings(
        statusBookingsUrl(
          this.props.activeHostel,
          this.props.constants.statues.BOOKING_STATUSES.cnf,
          'true'
        ),
        this.pastSuccessCallBack,
        this.pastErrCallBack
      )
    }
    this.setState({
      bookingDownloadUrl: bookingsDownloadUrl(this.props.activeHostel)
    })
  }

  close = () => this.setState({ open: false, openReject: false })

  detailsClose = () => {
    this.setState({
      detailOpen: false,
    })
  }
  openModal = (activeId) => {
    this.setState({
      activeId: activeId,
      open: true
    })
  }
  openRejectModal = (activeId) => {
    this.setState({
      activeId: activeId,
      openReject: true
    })
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name, activePage: 1, presentLoading: true })
    this.props.getPresentRoomBookings(
      statusBookingsUrl(this.props.activeHostel, name, 'false'),
      this.presentSuccessCallBack,
      this.presentErrCallBack
    )
  }
  handlePastItemClick = (e, { name }) => {
    this.setState({ activePastItem: name, activeAprPage: 1, pastLoading: true })
    this.props.getPastRoomBookings(
      statusBookingsUrl(this.props.activeHostel, name, 'true'),
      this.pastSuccessCallBack,
      this.pastErrCallBack
    )
  }

  rejectBooking = () => {
    const body = {
      status: 'rej'
    }
    this.props.updateBooking(
      specificBookingUrl(this.props.activeHostel, this.state.activeId),
      body,
      this.successCallBack,
      this.errCallBack
    )
    this.setState({
      open: false,
    })
  }

  updateBooking = () => {
    const { activeItem, activeId } = this.state
    const body = {
      status:
        activeItem == 'pending'
          ? 'fwd'
          : activeItem == 'forwarded'
          ? 'apr'
          : 'cnf'
    }
    this.props.updateBooking(
      specificBookingUrl(this.props.activeHostel, activeId),
      body,
      this.successCallBack,
      this.errCallBack
    )
    this.setState({
      open: false
    })
  }

  successCallBack = (res) => {
    this.setState({
      success: true,
      error: false,
      message: res.statusText,
      presentLoading: true,
      pastLoading: true
    })
    this.props.getPresentRoomBookings(
      statusBookingsUrl(
        this.props.activeHostel,
        this.state.activeItem,
        'False'
      ),
      this.presentSuccessCallBack,
      this.presentErrCallBack
    )
    this.props.getPastRoomBookings(
      statusBookingsUrl(
        this.props.activeHostel,
        this.state.activePastItem,
        'true'
      ),
      this.pastSuccessCallBack,
      this.pastErrCallBack
    )
  }

  errCallBack = (err) => {
    this.setState({
      error: true,
      success: false,
      message: err
    })
  }

  presentSuccessCallBack = (res) => {
    this.setState({
      presentLoading: false
    })
  }

  presentErrCallBack = (err) => {
    this.setState({
      presentLoading: false
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

  togglePastIcon = () => {
    const pastBookingIcon = this.state.pastBookingIcon
    pastBookingIcon === 'angle down'
      ? this.setState({ pastBookingIcon: 'angle up' })
      : this.setState({ pastBookingIcon: 'angle down' })
  }

  setActiveBooking = (booking) => {
    this.setState({
      detailOpen: true,
      activeBooking: booking,
      activeId: booking.id
    })
  }
  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage, presentLoading: true })
    this.props.getPresentRoomBookings(
      `${statusBookingsUrl(
        this.props.activeHostel,
        this.state.activeItem,
        'False'
      )}&page=${activePage}`,
      this.presentSuccessCallBack,
      this.presentErrCallBack
    )
  }
  handlePastPaginationChange = (e, { activePage }) => {
    this.setState({ activeAprPage: activePage, pastLoading: true })
    this.props.getPastRoomBookings(
      `${statusBookingsUrl(
        this.props.activeHostel,
        this.state.activePastItem,
        true
      )}&page=${activePage}`,
      this.pastSuccessCallBack,
      this.pastErrCallBack
    )
  }
  render() {
    const {
      activeItem,
      activePastItem,
      open,
      openReject,
      pastBookingIcon,
      detailOpen,
      activePage,
      activeAprPage,
      presentLoading,
      bookingDownloadUrl,
    } = this.state
    const {
      presentBookingRequests,
      pastBookingRequests,
      constants,
      activePost
    } = this.props
    return (
      <Grid.Column width={16}>
        {this.state.error && (
          <Message warning>
            <Icon name='warning' />
            {this.state.message.response.data}
          </Message>
        )}
        {this.state.success && <Message positive>{this.state.message}</Message>}
        <Container>
          <div styleName="booking-header">
          <Header as='h4'>Room Bookings</Header>
            <a href={bookingDownloadUrl} download>
              <Button
              primary
              >
                Download list
              </Button>
            </a>
          </div>
          {!presentLoading?
            (
              <React.Fragment>
                <Menu compact icon='labeled'>
                  {activePost == 'sup' && (
                    <Menu.Item
                      name='pending'
                      active={activeItem === 'pending'}
                      onClick={this.handleItemClick}
                      color='blue'
                      styleName='booking-menu'
                    >
                      Pending
                    </Menu.Item>
                  )}
                  <Menu.Item
                    name='forwarded'
                    active={activeItem === 'forwarded'}
                    onClick={this.handleItemClick}
                    color='blue'
                    styleName='booking-menu'
                  >
                    Forwarded
                  </Menu.Item>
                  <Menu.Item
                    name='approved'
                    active={activeItem === 'approved'}
                    onClick={this.handleItemClick}
                    color='blue'
                    styleName='booking-menu'
                  >
                    Approved
                  </Menu.Item>
                  <Menu.Item
                    name='confirmed'
                    active={activeItem === 'confirmed'}
                    onClick={this.handleItemClick}
                    color='blue'
                    styleName='booking-menu'
                  >
                    Confirmed
                  </Menu.Item>
                </Menu>
                {(presentBookingRequests.results &&
                    presentBookingRequests.results.length > 0) ?
                    (
                      <React.Fragment>
                        <div styleName="table-height">
                        <Table
                  unstackable
                  celled
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>ID</Table.HeaderCell>
                      <Table.HeaderCell>Applicant Name</Table.HeaderCell>
                      <Table.HeaderCell>Applicant Room</Table.HeaderCell>
                      <Table.HeaderCell>No of Visitors</Table.HeaderCell>
                      <Table.HeaderCell>From </Table.HeaderCell>
                      <Table.HeaderCell>To</Table.HeaderCell>
                      <Table.HeaderCell>Contact Number</Table.HeaderCell>
                      <Table.HeaderCell>Show Details</Table.HeaderCell>
                      {activeItem !== 'confirmed' && (
                        <React.Fragment>
                          <Table.HeaderCell>
                            {activeItem == 'pending'
                              ? 'Forward Request'
                              : activeItem == 'forwarded'
                              ? 'Approve Request'
                              : 'Confirm Request'}
                          </Table.HeaderCell>
                          <Table.HeaderCell>Reject request</Table.HeaderCell>
                        </React.Fragment>
                      )}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {presentBookingRequests.results &&
                    presentBookingRequests.results.length > 0
                      ? presentBookingRequests.results.map((request, index) => {
                          return (
                            <Table.Row>
                              <Table.Cell
                                onClick={() => this.setActiveBooking(request)}
                              >
                                {5 * (activePage - 1) + index + 1}
                              </Table.Cell>
                              <Table.Cell
                                onClick={() => this.setActiveBooking(request)}
                              >
                                {request.bookedBy}
                              </Table.Cell>
                              <Table.Cell
                                onClick={() => this.setActiveBooking(request)}
                              >
                                {request.bookedByRoomNo}
                              </Table.Cell>
                              <Table.Cell
                                onClick={() => this.setActiveBooking(request)}
                              >
                                {request.visitor.length}
                              </Table.Cell>
                              <Table.Cell
                                onClick={() => this.setActiveBooking(request)}
                              >
                                {request.requestedFrom}
                              </Table.Cell>
                              <Table.Cell
                                onClick={() => this.setActiveBooking(request)}
                              >
                                {request.requestedTill}
                              </Table.Cell>
                              <Table.Cell
                                onClick={() => this.setActiveBooking(request)}
                              >
                                {request.phoneNumber}
                              </Table.Cell>
                              <Table.Cell
                                onClick={() => this.setActiveBooking(request)}
                              >
                                <span styleName="cursor">Show</span>
                              </Table.Cell>
                              {activeItem !== 'confirmed' && (
                                <React.Fragment>
                                  <Table.Cell
                                    onClick={() => this.openModal(request.id)}
                                  >
                                    <span styleName='forward'>
                                      {activeItem == 'pending'
                                        ? 'Forward'
                                        : activeItem == 'forwarded'
                                        ? 'Approve'
                                        : activeItem == 'approved'
                                        ? 'Confirm'
                                        : 'Confirmed'}
                                    </span>
                                  </Table.Cell>
                                  <Table.Cell
                                    onClick={() => this.openRejectModal(request.id)}
                                  >
                                    <span styleName='reject'>Reject</span>
                                  </Table.Cell>
                                </React.Fragment>
                              )}
                            </Table.Row>
                          )
                        })
                      : null}
                  </Table.Body>
                </Table>
                </div>
                {presentBookingRequests.count > 5 ? (
                  <Pagination
                    activePage={activePage}
                    onPageChange={this.handlePaginationChange}
                    totalPages={Math.ceil(presentBookingRequests.count / 5)}
                  />
                ) : null}
                      </React.Fragment>
                    ):
                    (
                        <Segment>No Booking Found</Segment>
                    )
                }
                    </React.Fragment>
                  ):
                  (
                    <Loading/>
                  )
                }

          <Header as='h4'>
            Past Bookings
            <Icon name={pastBookingIcon} onClick={this.togglePastIcon} className='cursor'/>
          </Header>
          {pastBookingIcon === 'angle up' && (
            <React.Fragment>
              <Menu compact icon='labeled'>
                <Menu.Item
                  name='confirmed'
                  active={activePastItem === 'confirmed'}
                  onClick={this.handlePastItemClick}
                  color='blue'
                  styleName='booking-menu'
                >
                  Confirmed
                </Menu.Item>
                <Menu.Item
                  name='rejected'
                  active={activePastItem === 'rejected'}
                  onClick={this.handlePastItemClick}
                  color='blue'
                  styleName='booking-menu'
                >
                  Rejected
                </Menu.Item>
              </Menu>
                {(pastBookingRequests.results &&
                  pastBookingRequests.results.length > 0)?
                    (
                      <React.Fragment>
                        <div styleName="table-height">
                          <Table unstackable celled>
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Applicant Name</Table.HeaderCell>
                                <Table.HeaderCell>Applicant Room</Table.HeaderCell>
                                <Table.HeaderCell>No of Visitors</Table.HeaderCell>
                                <Table.HeaderCell>From </Table.HeaderCell>
                                <Table.HeaderCell>To</Table.HeaderCell>
                                <Table.HeaderCell>Contact Number</Table.HeaderCell>
                              </Table.Row>
                            </Table.Header>
                            {pastBookingRequests.results &&
                            pastBookingRequests.results.length > 0
                              ? pastBookingRequests.results.map((request, index) => {
                                  return (
                                    <Table.Row
                                      onClick={() => this.setActiveBooking(request)}
                                    >
                                      <Table.Cell>
                                        {5 * (activeAprPage - 1) + index + 1}
                                      </Table.Cell>
                                      <Table.Cell>{request.bookedBy}</Table.Cell>
                                      <Table.Cell>{request.bookedByRoomNo}</Table.Cell>
                                      <Table.Cell>{request.visitor.length}</Table.Cell>
                                      <Table.Cell>{request.requestedFrom}</Table.Cell>
                                      <Table.Cell>{request.requestedTill}</Table.Cell>
                                      <Table.Cell>{request.phoneNumber}</Table.Cell>
                                    </Table.Row>
                                  )
                                })
                              : null}
                          </Table>
                          </div>
                          {pastBookingRequests.count > 5 ? (
                        <Pagination
                          activePage={activeAprPage}
                          onPageChange={this.handlePastPaginationChange}
                          totalPages={Math.ceil(pastBookingRequests.count / 5)}
                        />
                      ) : null}
                      </React.Fragment>
                    ):
                    (
                      <Segment>No Booking Request Found</Segment>
                    )
                }
            </React.Fragment>
          )}
        </Container>

        <Modal size='mini' open={openReject} onClose={this.close}>
          <Modal.Header styleName='center'>Reject Request</Modal.Header>
          <Modal.Actions styleName='modalActions'>
            <Button positive fluid onClick={this.rejectBooking}>
              Yes
            </Button>
            <Button negative fluid onClick={this.close}>
              No
            </Button>
          </Modal.Actions>
        </Modal>

        <Modal size='mini' open={open} onClose={this.close}>
          <Modal.Header styleName='center'>
            {activeItem === 'pending'
              ? 'Forward'
              : activeItem === 'forwarded'
              ? 'Approve'
              : 'Confirm'}{' '}
            Request
          </Modal.Header>
          <Modal.Actions styleName='modalActions'>
            <Button positive fluid onClick={this.updateBooking}>
              Yes
            </Button>
            <Button negative fluid onClick={this.close}>
              No
            </Button>
          </Modal.Actions>
        </Modal>

        {this.state.activeBooking ? (
          <Modal open={detailOpen} onClose={this.detailsClose} closeIcon>
            <Header icon='hotel' content='Booking Details' />
            <Modal.Content>
              <div>Applicant Name - {this.state.activeBooking.bookedBy}</div>
              <div>
                Current Status -{' '}
                {
                  constants.statues.BOOKING_STATUSES[
                    this.state.activeBooking.status
                  ]
                }
              </div>
              <div>From - {this.state.activeBooking.requestedFrom}</div>
              <div>To - {this.state.activeBooking.requestedTill}</div>
              <div>
                Applicants Room No. - {this.state.activeBooking.bookedByRoomNo}
              </div>
              <div>
                Applicants Phone Number - {this.state.activeBooking.phoneNumber}
              </div>
              <div>Visitors</div>
              <div>
                {this.state.activeBooking.visitor.length > 0
                  ? this.state.activeBooking.visitor.map((visitor) => {
                      return (
                        <div>
                          {visitor.fullName} - {visitor.relation} of{' '}
                          {this.state.activeBooking.bookedBy} -{' '}
                          <a
                            href={visitor.photoIdentification}
                            download={`bhawan-app${visitor.fullName}-${visitor.relation}of${this.state.activeBooking.bookedBy}`}
                          >
                            Download Identity Proof
                          </a>
                        </div>
                      )
                    })
                  : null}
              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={this.detailsClose}>
                <Icon name='remove' /> Cancel
              </Button>
              <Button color='green' onClick={this.updateBooking}>
                <Icon name='checkmark' />
                {activeItem === 'pending'
                  ? 'Forward'
                  : activeItem === 'forwarded'
                  ? 'Approve'
                  : 'Confirm'}
              </Button>
            </Modal.Actions>
          </Modal>
        ) : null}
      </Grid.Column>
    )
  }
}

function mapStateToProps(state) {
  return {
    bookingRequests: state.bookingRequests,
    presentBookingRequests: state.presentBookingRequests,
    pastBookingRequests: state.pastBookingRequests,
    activeHostel: state.activeHostel,
    activePost: state.activePost
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRoomBookings: (residence) => {
      dispatch(getRoomBookings(residence))
    },
    getPresentRoomBookings: (url, successCallBack, errCallBack) => {
      dispatch(getPresentRoomBookings(url, successCallBack, errCallBack))
    },
    getPastRoomBookings: (url, successCallBack, errCallBack) => {
      dispatch(getPastRoomBookings(url, successCallBack, errCallBack))
    },
    updateBooking: (id, data, residence, successCallBack, errCallBack) => {
      dispatch(
        updateBooking(id, data, residence, successCallBack, errCallBack)
      )
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingRequests)
