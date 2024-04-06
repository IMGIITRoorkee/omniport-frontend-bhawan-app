import React, { Component, lazy } from 'react';
import { eventsUrl } from '../../urls'
import { getEvents } from '../../actions/events'

import { tailwindWrapper } from "../../../../../formula_one/src/utils/tailwindWrapper";

const EventCard = lazy(() => import("../events-card-new/index"))

class NewEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      loading: true,
      hasEventThisMonth: false
    };
  }


  componentDidMount() {
    this.fetchEvents();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeHostel !== this.props.activeHostel) {
      this.fetchEvents();
    }
  }

  fetchEvents = async () => {
    try {
      const response = await getEvents(eventsUrl(this.props.activeHostel));
      this.setState({
        events: response.data,
        loading: false
      });
      this.checkIfEventThisMonth();
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };


  checkIfEventThisMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const eventsThisMonth = this.state.events.some(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfMonth && eventDate <= endOfMonth;
    });

    this.setState({
      hasEventThisMonth: eventsThisMonth
    });
  };


  handleRegister = (eventName) => {
    alert(`You have registered for ${eventName}`);
  }



  render() {

    const { loading, hasEventThisMonth } = this.state;
    console.log(hasEventThisMonth);
    return (
      <div className={tailwindWrapper("container mx-auto mb-4")}>
        <h2 className={tailwindWrapper("text-2xl text-[#133BC5] font-bold mb-2")}>Events</h2>
        <div className={tailwindWrapper("flex justify-between mb-2")}>
          <p className={tailwindWrapper("text-lg font-bold")}>Upcoming Bhawan Events</p>
          <p className={tailwindWrapper("font-bold text-[#133BC5]")}>View More</p>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {hasEventThisMonth ? (
              hasEventThisMonth.map((event, index) => (
                <EventCard
                  key={index}
                  eventName={event.name}
                  eventLocation={event.location}
                  eventDate={event.date}
                  eventTime={event.timings[0].start}
                  onRegister={() => this.handleRegister(event.name)}
                />
              ))
            ) : (
              <p>There's no event today.</p>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default NewEvents;
