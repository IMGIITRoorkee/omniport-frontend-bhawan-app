import React from "react";
import { connect } from "react-redux";
import { Card, Header, Grid, Icon } from "semantic-ui-react";
import { getRoomBookings } from "../../actions/get-room-bookings";
import { bookingsUrl } from "../../urls";
import blocks from "../../css/app.css";
import main from "./index.css";
import * as moment from "moment";
class UpcomingBookings extends React.Component {
  componentDidMount() {
    this.props.getRoomBookings(
      bookingsUrl(this.props.who_am_i.residence, "False")
    );
  }
  render() {
    const { bookingRequests, constants } = this.props;
    return (
      <React.Fragment>
        {bookingRequests.results && bookingRequests.results.length > 0
          ? bookingRequests.results.map((request, index) => {
              return (
                <Card fluid>
                  <Card.Content styleName="blocks.card-border">
                    <Header as="h4" styleName="blocks.zero-bottom-margin">
                      {
                        this.props.constants.hostels[
                          this.props.who_am_i.residence
                        ]
                      }{" "}
                      Room
                    </Header>
                    <span>
                      {constants.statues.BOOKING_STATUSES[request.status]}
                    </span>{" "}
                    . <span>Booking ID</span> . <span>{request.id}</span>
                  </Card.Content>
                  <Card.Content styleName="blocks.card-border">
                    <div styleName="main.flex main.space">
                      <div styleName="main.flex">
                        <div styleName="main.margin">
                          <div styleName="main.check">Check In</div>
                          <div styleName="main.check-detail">
                            {moment(request.requestedFrom, "YYYY-MM-DD").format(
                              "LL"
                            )}
                          </div>
                        </div>
                        <div styleName="main.margin">
                          <div styleName="main.check">Check In</div>
                          <div styleName="main.check-detail">
                            {moment(request.requestedTill, "YYYY-MM-DD").format(
                              "LL"
                            )}
                          </div>
                        </div>
                        <div styleName="main.margin main.column-center">
                          <div styleName="main.check-detail">
                            <Icon name="users" /> {request.visitor.length}{" "}
                            Visitors
                          </div>
                        </div>
                      </div>
                      <div styleName="main.center">
                        <Icon name="arrow down"></Icon>Download Invoice
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              );
            })
          : null}
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    bookingRequests: state.bookingRequests,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRoomBookings: (residence) => {
      dispatch(getRoomBookings(residence));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpcomingBookings);
