import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TimeInput } from 'semantic-ui-calendar-react'
import {
  Grid,
  Header,
  Table,
  Button,
  Form,
  Modal,
  Container,
  Input,
  Icon,
  Dropdown,
  Pagination,
  Popup,
  Segment,
  TextArea,
} from 'semantic-ui-react'
import moment from 'moment'

import { Loading } from "formula_one"

import {
  getPendingComplains,
  getResolvedComplains,
  increaseUnsuccefulAttempts,
} from '../../actions/complains'
import { getDefaultItems } from '../../actions/default-items'
import { getTimeSlots, changeTimeSlot } from '../../actions/time-slots'
import { resolveComplain } from '../../actions/resolveComplain'
import { addItem } from '../../actions/add_item'
import {
  statusComplainsUrl,
  defaultItemsUrl,
  increaseUnsuccesfulComplainsUrl,
  timeSlotsUrl,
  complainsDownloadUrl,
} from '../../urls'
import { days, types, entries } from '../constants'

import { toast } from 'react-semantic-toasts'
import './index.css'


class AdminComplains extends Component {
  state = {
    open: false,
    pastComplainIcon: 'angle up',
    from: '',
    to: '',
    success: false,
    err: false,
    message: '',
    loading: true,
    pendingLoading: true,
    pastLoading: true,
    type: '',
    remark: '',
    activeId: null,
    activeStatus:"",
    activeItem: 'apr',
    activePage: 1,
    activeAprPage: 1,
    found: false,
    foundType: false,
    foundId: 1,
    entryNo: '5',
    entryAprNo: '5',
    complainsDownloadUrl: '',
    options: [],
    complaint_item : [{default_item:null, quantity:1}],
    residentSearch: "",
    residentSearchApr: "",
  }

  componentDidMount() {
    this.props.setNavigation('Student Complains')
    this.props.getPendingComplains(
      statusComplainsUrl(this.props.activeHostel, ['pending','inprocess']),
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
    this.props.getDefaultItems(
      defaultItemsUrl(this.props.activeHostel),
    )
    this.props.getTimeSlots(this.props.activeHostel)
    this.setState({
      complainsDownloadUrl: complainsDownloadUrl(this.props.activeHostel)
    })

  }

  

  componentDidUpdate(prevProps) {
    if( (prevProps.defaultItems!== this.props.defaultItems) && this.props.defaultItems.results.length>0){
      let options = []
      const results = this.props.defaultItems.results
      for (var i in results) {
        options.push({
          key: results[i].id.toString(),
          text: results[i].name.toString(),
          value: results[i].id.toString(),
        });
      }
      this.setState({ options : options})
    }

  }

  show = (id,data,remark) => {
    this.setState({
      open: true,
      activeId: id,
      activeStatus: data.value,
      remark:remark,
    })
  }

  close = () => this.setState({ 
    open: false,
    remark: "", 
    activeId: null, 
    activeStatus: "" 
  })

  togglePastIcon = () => {
    const pastComplainIcon = this.state.pastComplainIcon
    pastComplainIcon === 'angle down'
      ? this.setState({ pastComplainIcon: 'angle up' })
      : this.setState({ pastComplainIcon: 'angle down' })
  }

  handleChange = (event, { name, value }) => {
    if(this.state.hasOwnProperty(name)) {
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

  addItemField = () => {
    this.setState((prevState) => ({
      complaint_item: [...prevState.complaint_item, {default_item: null, quantity: null}],
    }))
  }

  resolveComplaint = () => {
    const body = {
      status: this.state.activeStatus,
      remark: this.state.remark,
    }
    {this.state.complaint_item.map((element, index) => {
      if(element.default_item!=null){
      const data = {
        complaint: this.state.activeId,
        default_item: element.default_item,
        quantity: element.quantity,
      }
      this.props.addItem(
        data,
        this.props.activeHostel,
        this.resolveSuccessCallBack,
        this.errCallBack
      )
    }})}
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
      statusComplainsUrl(this.props.activeHostel, ['pending','inprocess']),
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
    
    let complaint_item = [{default_item:null, quantity:null}]
    this.setState({ complaint_item })
    
  }

  errCallBack = () =>{

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

  handleResidentSearch = (e, { value }) => {
    this.setState({ residentSearch: value })
    this.setState({
      pendingLoading: true
    })
    this.props.getPendingComplains(
      `${statusComplainsUrl(this.props.activeHostel, [
        'PENDING','INPROCESS'
      ])}search=${value}`,
      this.pendingSuccessCallBack,
      this.pendingErrCallBack
    )
  }

  handlePastResidentSearch = (e, { value }) => {
    this.setState({ residentSearchApr: value })
    this.setState({
      pastLoading: true
    })
    this.props.getResolvedComplains(
      `${statusComplainsUrl(this.props.activeHostel, [
        'RESOLVED',
        'UNRESOLVED',
      ])}search=${value}`,
      this.pastSuccessCallBack,
      this.pastErrCallBack
    )
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage })
    this.setState({
      pendingLoading: true
    })
    this.props.getPendingComplains(
      `${statusComplainsUrl(this.props.activeHostel, [
        'PENDING','INPROCESS'
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

  handleEntriesChange = (e, { value }) => {
    this.setState({ entryNo: value })
    this.setState({
      pendingLoading: true
    })
    this.props.getPendingComplains(
      `${statusComplainsUrl(this.props.activeHostel, [
        'PENDING','INPROCESS'
      ])}page=${this.state.activePage}&perPage=${value}`,
      this.pendingSuccessCallBack,
      this.pendingErrCallBack
    )
  }

  handlePastEntriesChange = (e, { value }) => {
    this.setState({ entryAprNo: value })
    this.setState({
      pastLoading: true
    })
    this.props.getResolvedComplains(
      `${statusComplainsUrl(this.props.activeHostel, [
        'RESOLVED',
        'UNRESOLVED',
      ])}&page=${this.state.activeAprPage}&perPage=${value}`,
      this.pastSuccessCallBack,
      this.pastErrCallBack
    )   
  }

  handleDefaultItemChange = (i, event, {value}) => {
    let complaint_item = [...this.state.complaint_item]
    complaint_item[i].default_item = parseInt(value)
    this.setState({ complaint_item })
  }
  handleQuantityChange(i, event) {
    let complaint_item = [...this.state.complaint_item]
    complaint_item[i].quantity = parseInt(event.target.value)
    this.setState({ complaint_item })
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
      options,
      pastComplainIcon,
      activePage,
      activeAprPage,
      pendingLoading,
      pastLoading,
      entryNo,
      entryAprNo,
      remark,
      complainsDownloadUrl,
      residentSearch,
      residentSearchApr
    } = this.state
    const { pendingComplains, resolvedComplains, defaultItems, constants } = this.props
    let complaint_status_options = [];
    for (var i in constants.statues['COMLAINT_STATUSES']) {
      complaint_status_options.push({
        key: i.toString(),
        text: constants.statues['COMLAINT_STATUSES'][i].toString(),
        value: i.toString(),
      });
    }
    return (
      <Grid container>
          <Grid.Column width={16}>
            <Container>
              <div styleName="complain-header">
                <Header as='h4'>Student Complains and Feedback</Header>
                <div styleName="complain-header">
                  <Input
                    name="residentSearch"
                    value={residentSearch}
                    onChange={this.handleResidentSearch}
                    icon="search"
                    placeholder="Search by Name/Enrollment no."
                  />
                  <a href={complainsDownloadUrl} download>
                    <Button
                    primary
                    >
                      Download list
                    </Button>
                  </a>
                </div>
              </div>
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
                            <Table.HeaderCell>Complaint Date and Time</Table.HeaderCell>
                            <Table.HeaderCell>Complaint Type</Table.HeaderCell>
                            <Table.HeaderCell>Contact Number</Table.HeaderCell>
                            <Table.HeaderCell>Applicant Room</Table.HeaderCell>
                            <Table.HeaderCell>
                              Unsuccesful attempts to solve
                            </Table.HeaderCell>
                            <Table.HeaderCell>Complaint status</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {pendingComplains.results &&
                            pendingComplains.results.length > 0
                            ? pendingComplains.results.map((complain, index) => {
                                return (
                                  <Table.Row key={index}>
                                    <Table.Cell>
                                      {entryNo * (activePage - 1) + index + 1}
                                    </Table.Cell>
                                    <Table.Cell>{complain.description}</Table.Cell>
                                    <Table.Cell>{complain.complainant}</Table.Cell>
                                    <Table.Cell>
                                      {moment(
                                        complain.datetimeCreated
                                      ).format('DD/MM/YY, hh:mm a')}
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
                                      <span styleName='cursor' styleName="plus-icon">
                                        <Icon name="add circle" color="grey" size="large" />
                                      </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                      <Dropdown 
                                        value={complain.status} 
                                        onChange={(e,data) => this.show(complain.id,data,complain.remark)} 
                                        search 
                                        selection 
                                        options={complaint_status_options} 
                                      />
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
                          {pendingComplains.count > entryNo ? (
                            <Pagination
                              activePage={activePage}
                              onPageChange={this.handlePaginationChange}
                              totalPages={Math.ceil(pendingComplains.count / entryNo)}
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
              <div styleName="complain-header">
                <Header as='h4'>
                  Past Complains and Feedback
                  <Icon name={pastComplainIcon} onClick={this.togglePastIcon} />
                </Header>
                <Input
                  name="residentSearchApr"
                  value={residentSearchApr}
                  onChange={this.handlePastResidentSearch}
                  icon="search"
                  placeholder="Filter by Name/Enrollment no."
                />
              </div>
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
                                <Table.HeaderCell>Complaint Date and Time</Table.HeaderCell>
                                <Table.HeaderCell>Complaint Type</Table.HeaderCell>
                                <Table.HeaderCell>Contact Number</Table.HeaderCell>
                                <Table.HeaderCell>Applicant Room</Table.HeaderCell>
                                <Table.HeaderCell>
                                  Unsuccesful attempts to solve
                                </Table.HeaderCell>
                                <Table.HeaderCell>Complain Status</Table.HeaderCell>
                                <Table.HeaderCell>Items</Table.HeaderCell>
                                <Table.HeaderCell>Remark</Table.HeaderCell>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {resolvedComplains.results &&
                              resolvedComplains.results.length > 0
                                ? resolvedComplains.results.map((complain, index) => {
                                    return (
                                      <Table.Row key={index}>
                                        <Table.Cell>
                                          {entryAprNo * (activeAprPage - 1) + index + 1}
                                        </Table.Cell>
                                        <Table.Cell>{complain.description}</Table.Cell>
                                        <Table.Cell>{complain.complainant}</Table.Cell>
                                        <Table.Cell>
                                          {moment(
                                            complain.datetimeCreated
                                          ).format('DD/MM/YY, hh:mm a')}
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
                                        <Table.Cell>
                                          {complain.items.length > 0 
                                            ? complain.items.map((item,index) => {
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
                                        : (
                                          'None'
                                        )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {complain.remark && complain.remark.trim() != '' 
                                              ? complain.remark : 'None'}
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
                          {resolvedComplains.count > entryAprNo ? (
                            <Pagination
                              activePage={activeAprPage}
                              onPageChange={this.handlePastPaginationChange}
                              totalPages={Math.ceil(resolvedComplains.count / entryAprNo)}
                            />
                          ) : null}
                        </div>
                        <div>
                          Entries per page : 
                          <Dropdown
                            name='entries'
                            selection
                            options={entries}
                            onChange={this.handlePastEntriesChange}
                            value={entryAprNo}
                            compact
                          />
                        </div>
                      </div>
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
              <Modal.Header styleName='center'>Change complain status?</Modal.Header>
              <Modal.Content>
              <Form>
              <Form.Group styleName='item-container'>
                  <Form.Field>
                  <label>Item</label>
                  </Form.Field>
                  <Form.Field styleName='field-width'>
                  <label>Quantity</label>
                  </Form.Field>
                </Form.Group>
              {this.state.complaint_item.map((element, index) => (
                  <Form.Group styleName='item-container' key={index}>
                  <Form.Field >
                    <Dropdown
                      name='default_item'
                      placeholder='Replace or repair items'
                      selection
                      options={options}
                      onChange={(event, value) => this.handleDefaultItemChange(index, event, value)}
                    />
                  </Form.Field>
                  <Form.Field styleName='field-width'>
                  <Input
                      name='quantity'
                      id = {index}
                      type='number'
                      onChange={(event) => this.handleQuantityChange(index, event)}
                      min={1}
                    />
                  </Form.Field>
                </Form.Group>
              ))}
              <div styleName='right-align'>
              <Header as='h5' onClick={this.addItemField} styleName='cursor'>
                  <span>+</span>
                  Add Item
              </Header>
              </div>
              <Form.Field
                name='remark'
                value={remark}
                onChange={this.handleChange}
                control={TextArea}
                label='Remark'
                placeholder='Type any remark ....'
                rows='3'
              />
              </Form>
              </Modal.Content>
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
    defaultItems: state.defaultItems,
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
    getDefaultItems: (url) => {
      dispatch(getDefaultItems(url))
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
    addItem: (data, residence, successCallBack, errCallBack) => {
      dispatch(
        addItem(data, residence, successCallBack, errCallBack)
      )
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminComplains)
