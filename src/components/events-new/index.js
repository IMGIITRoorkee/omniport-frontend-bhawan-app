import React, { Component } from 'react';
import { tailwindWrapper } from "../../../../../formula_one/src/utils/tailwindWrapper";

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

    const EventCard = ({ eventName, eventLocation, onRegister , index }) => {
      const backgroundColorClass = index % 2 === 0 ? "bg-[#E5E9FF]" : "bg-white";
      return (
        <div className={tailwindWrapper(`flex justify-around items-center p-2 rounded-lg ${backgroundColorClass}`)}>
          <div><h3 className={tailwindWrapper("text-xl font-semibold mb-2")}>{eventName}</h3></div>
          <div className={tailwindWrapper("flex flex-col")}><p className={tailwindWrapper("text-[#133BC5] mb-1 font-bold")}>{eventLocation}</p>
            <p className={tailwindWrapper("mb-1 font-bold")}>Date : 10/12/24</p>
            <p className={tailwindWrapper("mb-1 text-[#133BC5] font-bold" )}>Time : 8:00PM</p></div>
          <div className={tailwindWrapper("flex flex-col gap-2")}><button
            className={tailwindWrapper("text-[#133BC5] bg-white border border-[#133BC5] font-bold px-4 py-2 rounded-lg")}
            onClick={onRegister}
          >
            Register
          </button>
            <p className={tailwindWrapper("text-gray-700 mb-2")}>registration upto 10/12/24 8:00pm</p>
          </div>
        </div>
      );
    }

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
