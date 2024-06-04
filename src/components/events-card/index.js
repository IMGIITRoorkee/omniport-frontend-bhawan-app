import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './index.css';
import { getEvents } from '../../actions/events';
import { eventsUrl, eventUrl } from '../../urls';
import { addEvent } from '../../actions/add-events';
import moment from 'moment' 


class EventsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addEvent: false,
      event: '',
      venue: '',
      time: '',
    };
  }

  componentDidMount() {
    this.props.getEvents(eventsUrl(this.props.activeHostel));
  }

  componentDidUpdate(prevProps) {
    if(prevProps.activeHostel !== this.props.activeHostel){
      this.props.getEvents(eventsUrl(this.props.activeHostel));
    }
  }

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  };

  handleSubmit = (e) => {
    let data = {
      name: this.state.event,
      date: this.props.activeDay,
      description: this.state.venue,
      timings: [
        {
          day: 'mon',
          start: this.state.time,
          end: '00:00:00',
          description: 'tfgcygvjy',
        },
      ],
    };
    this.props.addEvent(
      data,
      eventsUrl(this.props.activeHostel),
      this.successCallBack,
      this.errCallBack
    );
  };

  successCallBack = (res) => {
    this.setState({
      success: true,
      error: false,
      message: res.statusText,
    });
  };

  errCallBack = (err) => {
    this.setState({
      error: true,
      success: false,
      message: err,
    });
  };
  toggleAddEvent = () => {
    const addEvent = this.state.addEvent;
    this.setState({
      addEvent: !addEvent,
    });
  };
  render() {
    const { event, venue, time } = this.state
    const { dayEvents, activePost } = this.props;

    return (
      <>
        <div styleName='event-card-border'>
          {dayEvents.length > 0 ? dayEvents.map((event) => {
            return(
              <>
              <div styleName='event-card'>
                <div styleName='event-card-upper'> 
                  <div styleName='event-card-upper-left'>
                    <img src={event.displayPicture}></img>
                    </div>
                    <div styleName='event-card-upper-right'>
                      <div styleName='event-card-upper-right-upper'>
                        {event.name}
                         </div>
                         <div styleName=' event-card-upper-right-middle'>
                          <div styleName='flex-down event-props'> 
                              <div> Time : </div>
                              <div> Date : </div>
                              <div> Venue: </div>
                          </div>
                          <div styleName='flex-down event-props-values'> 
                              <div> {moment(
                                event.timings[0].start,
                                'hh:mm:ss'
                              ).format('hh:mm A')} - {moment(
                                event.timings[0].end,
                                'hh:mm:ss'
                              ).format('hh:mm A')} </div>
                              <div> {event.date} </div>
                              {/* TO DO:  CREATE VENUE FIELD */}
                              <div> No venue field </div>
                          </div>
                         </div>
                         <div styleName='event-card-upper-right-bottom'>
                           {/*TO DO: REGISTER API CREATE  */}
                            <div styleName='register-button'> Register </div>
                         </div>
                    </div>
                </div>
                <div styleName='event-card-lower'> 
                  {event.description}
                </div>
              </div>
              </>
            );
          }) : 
            <>
            <Link to='/bhawan_app/events'>
                <div>No events today</div>
              </Link>
              </>
          }
        </div>
      </>
    );
  }
}
function mapStateToProps(state) {
  let dayEvents = [];
  if (state.events && state.events.length > 0 && state.activeDay)
    dayEvents = state.events.filter(function (event) {
      return event.date == state.activeDay;
    });
  return {
    events: state.events,
    activeDay: state.activeDay,
    dayEvents: dayEvents,
    activePost: state.activePost,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getEvents: (url) => {
      dispatch(getEvents(url));
    },
    addEvent: (data, url, successCallBack, errCallBack) => {
      dispatch(addEvent(data, url, successCallBack, errCallBack));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EventsCard);
