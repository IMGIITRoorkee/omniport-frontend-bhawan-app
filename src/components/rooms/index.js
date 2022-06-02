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

import { roomsUrl, studentAccommodationsUrl, specificRoomUrl, specificAccommodationUrl} from '../../urls'
import { getRooms } from '../../actions/rooms'
import { getStudentAcccommodation } from '../../actions/student_accommodation'
import { updateRooms } from '../../actions/update_rooms'
import { updateStudentAccommodation } from '../../actions/update_student_accommodation'

import './index.css'

class Rooms extends Component {
  state = {
    success: false,
    err: false,
    message: '',
    loading: true,
    netAccommodation: [],
    enableEdit: Array(16).fill(false),
    changedData: [],
    changedStudentData: {},
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
    if(constants && constants.room_occupancy_list.length>0 && rooms && rooms.length>0 && 
          studentAccommodation && studentAccommodation.length>0){
      let total_seats=0,net_accommodation=[];
      constants.room_occupancy_list.sort()
      constants.room_occupancy_list.map((seat,index) => {
        let netAccommodation=0;
        rooms.map((room,index) => {
          if(room.occupancy==seat){
            if(constants.room_types[room.roomType]=='TOTAL CONSTRUCTED ROOMS')
              netAccommodation+=room.count
            else
              netAccommodation-=room.count
          }
        })
        studentAccommodation.map((accommodation,index) => {
          if(constants.room_occupancy[seat]=='SINGLE')
            netAccommodation-=accommodation.residingInSingle
          else if(constants.room_occupancy[seat]=='DOUBLE')
            netAccommodation-=accommodation.residingInDouble
          else
            netAccommodation-=accommodation.residingInTriple
        })
        total_seats+=(netAccommodation*(index+1))
        net_accommodation.push(netAccommodation)
      })
      net_accommodation.push(total_seats)
      if( JSON.stringify(this.state.netAccommodation) !== JSON.stringify(net_accommodation))
      this.setState({ netAccommodation : net_accommodation})
    }
  }

  handleSubmit = () => {
      const {changedData} = this.state
      changedData.map((room,index) => {
        const id = room.id
        if(room.value=='')
        room.value=0
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
      const {changedStudentData} = this.state
      if(Object.keys(changedStudentData).length !== 0){
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
      enableEdit: Array(15).fill(false),
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
    newEnableEdit[index]=true
    this.setState({ enableEdit : newEnableEdit })
  }

  handleEdit = (id, event, { name, value }) => {
    let data = this.state.changedData
    const index = data.findIndex(room => room.id == id)
    if(index==-1){
      data.push({
        id:id,
        name:name,
        value:value
      })
    }
    else{
      data[index].value=value
    }
    this.setState({ changedData : data })
  }

  handleStudentEdit = (id, event, { name, value }) => {
    let data = this.state.changedStudentData
    data['id']=id
    if(value=='')
    value=0
    data[name]=value
    this.setState({ changedStudentData : data })
  }

  render() {
    const {
      loading,
      open,
      netAccommodation,
      enableEdit,
    } = this.state
    const { rooms, studentAccommodation, constants } = this.props
    this.calculateAccommodation()
    return (
      <div>
        <div styleName="item-header">
          <Header as='h4'>Net Accommodation </Header>
        </div>
        <Container>
        {!loading?
          (
            <React.Fragment>
              {(rooms && rooms.length > 0 && studentAccommodation && studentAccommodation.length > 0)
                ?
                (
                  <div styleName = "table-overflow">
                    <Table unstackable celled>
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
                      {constants.room_types_list && constants.room_types_list.length > 0 && rooms && rooms.length>0
                        ? constants.room_types_list.map((type, row_index) => {
                            let total_seats=0, occupancy=1
                            rooms.sort(function(a, b) {
                              return a.occupancy.localeCompare(b.occupancy);
                            });
                            return (
                              <Table.Row key={row_index}>
                                <Table.Cell>{constants.room_types[type]}</Table.Cell>
                                {rooms && rooms.map((room,col_index) => {
                                  if(room && room.roomType==type){
                                    total_seats+=(room.count*occupancy)
                                    occupancy+=1;
                                    return(
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
                      {studentAccommodation && studentAccommodation.map((accommodation,index) => {
                        let total_seats= accommodation.residingInSingle+accommodation.residingInDouble*2+accommodation.residingInTriple*3
                        return(
                          <Table.Row>
                          <Table.Cell>PRESENTLY RESIDING IN THE CAMPUS</Table.Cell>
                          {constants && constants.room_occupancy_list && constants.room_occupancy_list.map((occupancy,index) => {4
                                let seat
                                if(index==0)
                                  seat='residingInSingle'
                                else if(index==1)
                                  seat='residingInDouble'
                                else
                                  seat='residingInTriple'
                                return(
                                  <Table.Cell onClick={() => this.changeEditable(12+index)}>
                                    {(studentAccommodation && enableEdit[12+index])
                                      ? 
                                        (
                                          <Input
                                            name={seat}
                                            type='number'
                                            defaultValue={studentAccommodation[0][seat]}
                                            onChange={(event, value) => this.handleStudentEdit(studentAccommodation[0].id, event, value)}
                                          />
                                        )
                                      : studentAccommodation[0][seat]
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
                          <Table.Cell>Net Accommodation for Students</Table.Cell>
                          {netAccommodation && netAccommodation.length > 0 && netAccommodation.map((accommodation,index) => {
                              return(
                                <Table.Cell>{accommodation}</Table.Cell>
                              )
                          })
                          }
                      </Table.Row>
                      <Table.Row>
                          <Table.Cell></Table.Cell>
                          {netAccommodation && netAccommodation.length > 0 && netAccommodation.map((accommodation,index) => {
                              let total_net_accommodation=accommodation*(index+1)
                              if(index<3)
                              return(
                                <Table.Cell>{accommodation}x{index+1}={total_net_accommodation}</Table.Cell>
                              )
                              else
                              return(
                                <Table.Cell>{accommodation}</Table.Cell>
                              )
                          })
                          }
                      </Table.Row>
                        <Table.Row>
                          <Table.Cell colSpan='4' textAlign='center'>NUMBER OF STUDENTS NEED ACCOMMODATION</Table.Cell>
                          <Table.Cell onClick={() => this.changeEditable(15)}>
                            {(studentAccommodation && enableEdit[15])
                              ? 
                                (
                                  <Input
                                    name='totalNeedAccommodation'
                                    type='number'
                                    defaultValue={studentAccommodation[0].totalNeedAccommodation}
                                    onChange={(event, value) => this.handleStudentEdit(studentAccommodation[0].id, event, value)}
                                  />
                                )
                              : studentAccommodation[0].totalNeedAccommodation
                            }
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell colSpan='4' textAlign='center'>NET SHORTAGE/VACANCY OF SEATS AFTER ACCOMMODATING STUDENTS</Table.Cell>
                          <Table.Cell>{netAccommodation && netAccommodation.length > 0 && 
                                        netAccommodation[3]-studentAccommodation[0].totalNeedAccommodation}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                  </Table>
                      <div styleName='pagination-container'>
                        <div>
                        <Button primary onClick={this.handleSubmit}>
                          Update
                        </Button>
                        </div>
                      </div>
                </div>
                ):
                (
                  <Segment>No accommodation information found</Segment>
                )
              }
            </React.Fragment>
          ):
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

