import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  Header,
  Table,
  Container,
  Dropdown,
  Pagination,
  Segment,
  Button,
  Checkbox,
  Input,
  Modal,
  Form,
  Tab
} from 'semantic-ui-react'
import { toast } from 'react-semantic-toasts'

import { Loading } from "formula_one";

import { roomsUrl, studentAccommodationsUrl, specificRoomUrl, specificAccommodationUrl, accommodationDataDownloadUrl } from '../../urls'
import { getRooms } from '../../actions/rooms'
import { getStudentAcccommodation } from '../../actions/student_accommodation'
import { updateRooms } from '../../actions/update_rooms'
import { updateStudentAccommodation } from '../../actions/update_student_accommodation'
import moment from 'moment'

import './index.css'

class Rooms extends Component {
  state = {
    success: false,
    err: false,
    message: '',
    loading: true,
    netAccommodation: [],
    availableRooms: [],
    enableEdit: Array(19).fill(false),
    changedData: [],
    changedStudentData: {},
    last_modified: new Date('December 25, 2000 01:30:00'),
  };

  componentDidMount() {
    this.props.getRooms(
      `${roomsUrl(this.props.activeHostel)}`,
      this.successCallBack,
      this.errCallBack
    )
    this.props.getStudentAcccommodation(
      studentAccommodationsUrl(this.props.activeHostel),
    )
  }

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value.toUpperCase() })
    }
  }

  calculateAccommodation() {
    const { rooms, studentAccommodation, constants } = this.props
    if (constants && constants.room_occupancy_list.length > 0 && rooms && rooms.length > 0 &&
      studentAccommodation && studentAccommodation.length > 0) {
      let total_seats = 0, total_rooms = 0, net_accommodation = [], available_rooms = [];
      constants.room_occupancy_list.sort()
      constants.room_occupancy_list.map((seat, index) => {
        let netAccommodation = 0;
        rooms.map((room, index) => {
          if (room.occupancy == seat) {
            if (constants.room_types[room.roomType] == 'TOTAL CONSTRUCTED ROOMS')
              netAccommodation += room.count
            else
              netAccommodation -= room.count
          }
        })
        total_rooms += netAccommodation * seat
        available_rooms.push(netAccommodation)
        netAccommodation *= parseInt(seat)
        studentAccommodation.map((accommodation, index) => {
          if (constants.room_occupancy[seat] == 'SINGLE')
            netAccommodation -= accommodation.residingInSingle
          else if (constants.room_occupancy[seat] == 'DOUBLE')
            netAccommodation -= accommodation.residingInDouble
          else
            netAccommodation -= accommodation.residingInTriple
        })
        total_seats += (netAccommodation)
        net_accommodation.push(netAccommodation)
      })
      net_accommodation.push(total_seats)
      available_rooms.push(total_rooms)
      if (JSON.stringify(this.state.netAccommodation) !== JSON.stringify(net_accommodation))
        this.setState({ netAccommodation: net_accommodation })
      if (JSON.stringify(this.state.availableRooms) !== JSON.stringify(available_rooms))
        this.setState({ availableRooms: available_rooms })
    }
  }

  handleSubmit = () => {
    const { changedData } = this.state
    changedData.map((room, index) => {
      const id = room.id
      if (room.value == '')
        room.value = 0
      let data = {
        count: room.value
      }
      this.props.updateRooms(
        specificRoomUrl(this.props.activeHostel, id),
        data,
        this.successUpdateCallBack,
        this.errUpdateCallBack
      )
    })
    const { changedStudentData } = this.state
    if (Object.keys(changedStudentData).length !== 0) {
      const id = changedStudentData.id
      this.props.updateStudentAccommodation(
        specificAccommodationUrl(this.props.activeHostel, id),
        changedStudentData,
        this.successUpdateCallBack,
        this.errUpdateCallBack
      )
    }
  }

  successUpdateCallBack = (res) => {
    this.props.getRooms(
      `${roomsUrl(this.props.activeHostel)}`,
      this.successCallBack,
      this.errCallBack
    )
    this.props.getStudentAcccommodation(
      studentAccommodationsUrl(this.props.activeHostel),
    )
    this.setState({
      netAccommodation: [],
      changedStudentData: {},
      enableEdit: Array(19).fill(false),
      changedData: [],
      success: true,
      error: false,
      message: res.statusText,
    })
  }

  errUpdateCallBack = (err) => {
    this.setState({
      error: true,
      success: false,
      message: err
    })
    toast({
      type: 'error',
      title: 'Unable to update accommodation data',
      animation: 'fade up',
      icon: 'frown outline',
      time: 4000,
    })
  }

  successCallBack = () => {
    this.setState({
      loading: false,
    })
  }

  errCallBack = () => {
    this.setState({
      loading: false,
    })
  }

  changeEditable = (index) => {
    let newEnableEdit = this.state.enableEdit
    newEnableEdit[index] = true
    this.setState({ enableEdit: newEnableEdit })
  }

  handleEdit = (id, event, { name, value }) => {
    let data = this.state.changedData
    const index = data.findIndex(room => room.id == id)
    if (index == -1) {
      data.push({
        id: id,
        name: name,
        value: value
      })
    }
    else {
      data[index].value = value
    }
    this.setState({ changedData: data })
  }

  handleStudentEdit = (id, event, { name, value }) => {
    let data = this.state.changedStudentData
    data['id'] = id
    if (value == '')
      value = 0
    data[name] = value
    this.setState({ changedStudentData: data })
  }

  lastModified = (rooms, studentAccommodation) => {
    var date = new Date('December 25, 2000 01:30:00')
    for(var i = 0 ; i < rooms.length ; i++){
      var new_date = new Date(rooms[i].datetimeModified)
      if(new_date>date){
        date = new_date;
      }
    }
    for(var i = 0 ; i < studentAccommodation.length ; i++){
      var new_date = new Date(studentAccommodation[i].datetimeModified)
      if(new_date>date){
        date = new_date;
      }
    }
    if((JSON.stringify(this.state.last_modified)!== JSON.stringify(date)) && rooms){
      this.setState({
        last_modified:date,
      })
    }
  }

  render() {
    const {
      loading,
      open,
      netAccommodation,
      availableRooms,
      enableEdit,
      last_modified,
    } = this.state
    const { rooms, studentAccommodation, constants, activePost } = this.props
    this.calculateAccommodation()
    this.lastModified(rooms, studentAccommodation)
    
    return (
      <div>
        <div styleName="item-header">
          <Header as='h4'>Net Accommodation </Header>
          {([...constants['global_council']].includes(activePost)) &&
            <a href={accommodationDataDownloadUrl()} download>
              <Button
                primary
              >
                Download data for all bhawans
              </Button>
            </a>
          }
        </div>
        <Container>
          {!loading ?
            (
              <React.Fragment>
                {(rooms && rooms.length > 0 && studentAccommodation && studentAccommodation.length > 0)
                  ?
                  (
                    <div styleName="table-overflow">
                      <Table unstackable celled selectable>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>Rooms</Table.HeaderCell>
                            <Table.HeaderCell>Single Seated</Table.HeaderCell>
                            <Table.HeaderCell>Double Seated</Table.HeaderCell>
                            <Table.HeaderCell>Triple Seated</Table.HeaderCell>
                            <Table.HeaderCell>Total Seats</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {constants.room_types_list && constants.room_types_list.length > 0 && rooms && rooms.length > 0
                            ? constants.room_types_list.map((type, row_index) => {
                              let total_seats = 0, occupancy = 1
                              rooms.sort(function (a, b) {
                                return a.occupancy.localeCompare(b.occupancy);
                              });
                              return (
                                <Table.Row key={row_index}>
                                  <Table.Cell>{constants.room_types[type]}</Table.Cell>
                                  {rooms && rooms.map((room, col_index) => {
                                    if (room && room.roomType == type) {
                                      total_seats += (room.count * occupancy)
                                      occupancy += 1;
                                      return (
                                        <Table.Cell onClick={() => this.changeEditable(col_index)}>
                                          {(enableEdit[col_index])
                                            ?
                                            (
                                              <Input
                                                name={`${room.occupancy}${room.roomType}`}
                                                type='number'
                                                defaultValue={room.count}
                                                onChange={(event, value) => this.handleEdit(room.id, event, value)}
                                              />
                                            )
                                            : room.count
                                          }
                                        </Table.Cell>
                                      )
                                    }
                                  })
                                  }
                                  <Table.Cell>{total_seats}</Table.Cell>
                                </Table.Row>
                              )
                            })
                            : null}
                          <Table.Row>
                            <Table.Cell>NET ACCOMMODATION FOR STUDENTS</Table.Cell>
                            {availableRooms && availableRooms.length > 0 && availableRooms.map((room, index) => {
                              return (
                                <Table.Cell>{room}</Table.Cell>
                              )
                            }
                            )}
                          </Table.Row>
                        </Table.Body>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell colSpan='5' >Students</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {studentAccommodation && studentAccommodation.map((accommodation, row_index) => {
                            let total_seats = accommodation.residingInSingle + accommodation.residingInDouble + accommodation.residingInTriple
                            return (
                              <Table.Row>
                                {(accommodation.isRegistered) ?
                                  (<Table.Cell>Registered students presently residing in the campus</Table.Cell>)
                                  : (<Table.Cell>Non-Registered students presently residing in the campus</Table.Cell>)
                                }
                                {constants && constants.room_occupancy_list && constants.room_occupancy_list.map((occupancy, index) => {
                                  let seat
                                  if (index == 0)
                                    seat = 'residingInSingle'
                                  else if (index == 1)
                                    seat = 'residingInDouble'
                                  else
                                    seat = 'residingInTriple'
                                  return (
                                    <Table.Cell onClick={() => this.changeEditable(12 + index + row_index * 3)}>
                                      {(studentAccommodation && enableEdit[12 + index + row_index * 3])
                                        ?
                                        (
                                          <Input
                                            name={seat}
                                            type='number'
                                            defaultValue={accommodation[seat]}
                                            onChange={(event, value) => this.handleStudentEdit(accommodation.id, event, value)}
                                          />
                                        )
                                        : accommodation[seat]
                                      }
                                    </Table.Cell>
                                  )
                                })
                                }
                                <Table.Cell>{total_seats}</Table.Cell>
                              </Table.Row>
                            )
                          })
                          }
                          <Table.Row>
                            <Table.Cell>Present vacant seats for Students</Table.Cell>
                            {netAccommodation && netAccommodation.length > 0 && netAccommodation.map((accommodation, index) => {
                              return (
                                <Table.Cell>{accommodation}</Table.Cell>
                              )
                            })
                            }
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell colSpan='4' textAlign='center'>NUMBER OF STUDENTS NEED ACCOMMODATION</Table.Cell>
                            <Table.Cell onClick={() => this.changeEditable(18)}>
                              {studentAccommodation && studentAccommodation.length > 0 && studentAccommodation.map((accommodation, index) => {
                                if (accommodation.isRegistered) {
                                  if (enableEdit[18]) {
                                    return (
                                      <Input
                                        name='totalNeedAccommodation'
                                        type='number'
                                        defaultValue={accommodation.totalNeedAccommodation}
                                        onChange={(event, value) => this.handleStudentEdit(accommodation.id, event, value)}
                                      />
                                    )
                                  }
                                  else {
                                    return (
                                      <div>
                                        {accommodation.totalNeedAccommodation}
                                      </div>
                                    )
                                  }
                                }
                              })}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell colSpan='4' textAlign='center'>NET SHORTAGE/VACANCY OF SEATS AFTER ACCOMMODATING STUDENTS</Table.Cell>
                            <Table.Cell>{netAccommodation && netAccommodation.length > 0 &&
                              netAccommodation[3] - studentAccommodation[0].totalNeedAccommodation}</Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                      Last Modified: {moment(last_modified).format('DD/MM/YY, hh:mm a')}
                      <div styleName='pagination-container'>
                        <div>
                          <Button primary onClick={this.handleSubmit}>
                            Update
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) :
                  (
                    <Segment>No accommodation information found</Segment>
                  )
                }
              </React.Fragment>
            ) :
            (
              <Loading />
            )
          }
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rooms: state.rooms,
    studentAccommodation: state.studentAccommodation,
    activeHostel: state.activeHostel,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRooms: (url, successCallBack, errCallBack) => {
      dispatch(getRooms(url, successCallBack, errCallBack))
    },
    getStudentAcccommodation: (url) => {
      dispatch(getStudentAcccommodation(url))
    },
    updateRooms: (id, data, residence, successCallBack, errCallBack) => {
      dispatch(
        updateRooms(id, data, residence, successCallBack, errCallBack)
      )
    },
    updateStudentAccommodation: (id, data, residence, successCallBack, errCallBack) => {
      dispatch(
        updateStudentAccommodation(id, data, residence, successCallBack, errCallBack)
      )
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rooms)

