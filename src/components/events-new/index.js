import React, { Component, lazy } from "react";
import { eventsUrl } from "../../urls";
import { getEvents } from "../../actions/events";
import { connect } from "react-redux";

import { tailwindWrapper } from "../../../../../formula_one/src/utils/tailwindWrapper";

const EventCard = lazy(() => import("../events-card-new/index"));

class NewEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.props.getEvents(eventsUrl(this.props.activeHostel));
    this.state.loading = false;
  }

  handleRegister = (eventName) => {
    alert(`You have registered for ${eventName}`);
  };

  render() {
    const { events } = this.props;
    const { loading } = this.state;
    return (
      <div className={tailwindWrapper("container mx-auto mb-4")}>
        <h2
          className={tailwindWrapper("text-2xl text-[#133BC5] font-bold mb-2")}
        >
          Events
        </h2>
        <div className={tailwindWrapper("flex justify-between mb-2")}>
          <p className={tailwindWrapper("text-lg font-bold")}>
            Upcoming Bhawan Events
          </p>
          <p className={tailwindWrapper("font-bold text-[#133BC5]")}>
            View More
          </p>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {events.length > 0 ? (
              events.map((event, index) => (
                <EventCard
                  key={index}
                  eventName={event.name}
                  eventLocation={event.location}
                  eventDate={event.date}
                  eventTime={event.timings[0].start}
                  eventDeadline={event.deadlineDate}
                  onRegister={() => this.handleRegister(event.name)}
                />
              ))
            ) : (
              <p>There are no events.</p>
            )}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    loading: state.loading,
    activeHostel: state.activeHostel,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getEvents: (url) => {
      dispatch(getEvents(url));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewEvents);
