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

import moment from 'moment'

import { Loading } from "formula_one";

import { roomsUrl, studentAccommodationsUrl} from '../../urls'
import { getRooms } from '../../actions/rooms'
import { getStudentAcccommodation } from '../../actions/student_accommodation'

import './index.css'

class Rooms extends Component {
  state = {
    open: false,
    loading: true,
    net_accommodation: [],
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

  calculateAccomodation() {
    const { rooms, studentAccommodation, constants } = this.props
    if(constants && constants.room_occupancy_list.length>0 && rooms && rooms.length>0 && 
          studentAccommodation && studentAccommodation.length>0){
      let total_seats=0;
      constants.room_occupancy_list.map((seat,index) => {
        let net_accommodation=0;
        rooms.map((room,index) => {
          if(room.occupancy==seat){
            if(constants.room_types[room.roomType]=='TOTAL CONSTRUCTED ROOMS')
              net_accommodation+=room.count
            else
              net_accommodation-=room.count
          }
        })
        studentAccommodation.map((accommodation,index) => {
          if(constants.room_occupancy[seat]=='SINGLE')
            net_accommodation-=accommodation.residingInSingle
          else if(constants.room_occupancy[seat]=='DOUBLE')
            net_accommodation-=accommodation.residingInDouble
          else
            net_accommodation-=accommodation.residingInTriple
        })
        total_seats+=(net_accommodation*(index+1))
        this.state.net_accommodation.push(net_accommodation)
      })
      this.state.net_accommodation.push(total_seats)
    }
  }

  successCallBack = () => {
    this.setState({
      loading: false,
    })
    this.calculateAccomodation()
  }

  errCallBack = () => {
    this.setState({
      loading: false,
    })
  }

  close = () => this.setState({ open: false })

  render() {
    const {
      loading,
      open,
      net_accommodation,
    } = this.state
    const { rooms, studentAccommodation, constants } = this.props
    this.calculateAccomodation()
    return (
      <div>
        <div styleName="item-header">
          <Header as='h4'>Net Accomodation </Header>
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
                      {constants.room_types_list && constants.room_types_list.length > 0
                        ? constants.room_types_list.map((type, index) => {
                            let total_seats=0, occupancy=1
                            return (
                              <Table.Row key={index}>
                                <Table.Cell>{constants.room_types[type]}</Table.Cell>
                                {rooms && rooms.map((room,index) => {
                                  if(room && room.roomType==type){
                                    total_seats+=(room.count*occupancy)
                                    occupancy+=1;
                                    return(
                                      <Table.Cell>{room.count}</Table.Cell>
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
                          <Table.Cell>{accommodation.residingInSingle}</Table.Cell>
                          <Table.Cell>{accommodation.residingInDouble}</Table.Cell>
                          <Table.Cell>{accommodation.residingInTriple}</Table.Cell>
                          <Table.Cell>{total_seats}</Table.Cell>
                          </Table.Row>
                        )
                      })   
                      }
                      <Table.Row>
                          <Table.Cell>Net Accomodation for Students</Table.Cell>
                          {net_accommodation && net_accommodation.length > 0 && net_accommodation.map((accommodation,index) => {
                              return(
                                <Table.Cell>{accommodation}</Table.Cell>
                              )
                          })
                          }
                      </Table.Row>
                      <Table.Row>
                          <Table.Cell></Table.Cell>
                          {net_accommodation && net_accommodation.length > 0 && net_accommodation.map((accommodation,index) => {
                              let total_net_accomodation=accommodation*(index+1)
                              if(index<3)
                              return(
                                <Table.Cell>{accommodation}*{index+1}={total_net_accomodation}</Table.Cell>
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
                          <Table.Cell>{studentAccommodation && studentAccommodation[0].totalNeedAccommodation}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell colSpan='4' textAlign='center'>NET SHORTAGE/VACANCY OF SEATS AFTER ACCOMODATING STUDENTS</Table.Cell>
                          <Table.Cell>{net_accommodation && net_accommodation.length > 0 && 
                                        net_accommodation[3]-studentAccommodation[0].totalNeedAccommodation}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
                ):
                (
                  <Segment>No accomodation information found</Segment>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rooms)

