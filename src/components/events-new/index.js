import React, { Component, lazy } from 'react';
import { tailwindWrapper } from "../../../../../formula_one/src/utils/tailwindWrapper";

const EventCard = lazy(() => import("../events-card-new/index"))
class NewEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      max_length: 3,
      loading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  }

  handleRegister = (eventName) => {
    alert(`You have registered for ${eventName}`);
  }

  render() {
    const { loading } = this.state;
    return (
      <div className={tailwindWrapper("container mx-auto mb-4")}>
        <h2 className={tailwindWrapper("text-2xl text-[#133BC5] font-bold mb-2")}>Events</h2>
        <div className={tailwindWrapper("flex justify-between mb-2")}>
          <p className={tailwindWrapper("text-lg font-bold")}>Upcoming Bhawan Events</p>
          <p className={tailwindWrapper("font-bold text-[#133BC5]")}>View More</p>
        </div>
        {!loading ? (
          <div className={tailwindWrapper("flex flex-col space-y-2")}>
            {[...Array(this.state.max_length)].map((_, index) => (
              <EventCard
                key={index}
                eventName={`Event ${index + 1}`}
                eventLocation={`Location ${index + 1}`}
                onRegister={() => this.handleRegister(`Event ${index + 1}`)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }
}

export default NewEvents;
