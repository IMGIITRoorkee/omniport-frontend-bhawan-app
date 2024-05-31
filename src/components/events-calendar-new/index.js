import React from "react";
import { connect } from "react-redux";

import "./index.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { tailwindWrapper } from "../../../../../formula_one/src/utils/tailwindWrapper";

import { Grid, Responsive } from "semantic-ui-react";
import { getEvents } from "../../actions/events";
import { setActiveDay } from "../../actions/set-active-day";
import { eventsUrl } from "../../urls";

class EventCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      width: 0,
      columns: 12,
    };
  }

  resize = () => {
    if (this.state.width !== window.innerWidth) {
      this.setState({
        width: window.innerWidth,
        isMobile: window.innerWidth <= 1000,
        columns: window.innerWidth <= 1000 ? 16 : 12,
      });
    }
  };

  componentDidMount() {
    this.props.setNavigation("Events");
    this.props.getEvents(eventsUrl(this.props.activeHostel));
    this.resize();
  }

  handleDateClick = (arg) => {
    this.props.setActiveDay(arg.dateStr);
  };

  render() {
    return (
      <Grid.Column width={this.state.columns} floated='left'>
      <div className={tailwindWrapper("mb-12")}>
        <FullCalendar
          defaultView="dayGridMonth"
          dateClick={this.handleDateClick}
          weekends
          events={this.props.mappedEvents}
          selectable={true}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
          ]}
          headerToolbar={{
            left: "today prev,next",
            center: "title",
            right: "",
          }}
          buttonText={{
            today: 'Today',
          }}
          dayHeaderFormat={{
            weekday: "long",
          }}
          // editable={true}
          eventColor="#6381EB"
        />
      </div>
      </Grid.Column>
    );
  }
}
function mapStateToProps(state) {
  let mappedEvents = [];
  if (state.events && state.events.length > 0) {
    state.events.forEach((event) =>
      mappedEvents.push({
        title: event.name,
        date: event.date,
      })
    );
  }
  return {
    events: state.events,
    mappedEvents: mappedEvents,
    activeHostel: state.activeHostel,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    getEvents: (url) => {
      dispatch(getEvents(url));
    },
    setActiveDay: (day) => {
      dispatch(setActiveDay(day));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EventCalendar);
