import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getRoomBookings } from '../../actions/get-room-bookings';

import { bookingsUrl } from '../../urls';

import { tailwindWrapper } from '../../../../../formula_one/src/utils/tailwindWrapper';


class GuestHouseBooking extends Component{
  state = { activePage: 1, loading: true };
  componentDidMount() {
    this.props.getRoomBookings(
      bookingsUrl(this.props.activeHostel, 'true'),
      this.successCallBack,
      this.errCallBack
    );
  }

  successCallBack = (res) => {
    this.setState({
      loading: false
    })
  }

  errCallBack = (err) => {
    this.setState({
      loading: false
    })
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage: activePage, loading: true });
    this.props.getRoomBookings(
      `${bookingsUrl(this.props.activeHostel, 'true')}&page=${activePage}`,
      this.successCallBack,
      this.errCallBack
    );
  };

  render(){
    
    const { bookingRequests } = this.props;
    const { activePage, loading } = this.state;
    
    return(
      <>
      {bookingRequests.results && bookingRequests.results.length == 0
    ?(<>
        <div className={tailwindWrapper('flex')}>
          <div className={tailwindWrapper('text-[#133BC5] mt-20 text-2xl font-semibold')}>Guest House</div>
        </div>
        <div className={tailwindWrapper(' my-8')}>Room Bookings</div>
        <div className={tailwindWrapper('flex  flex-col gap-5')}>
            <div className={tailwindWrapper('flex item-center justify-around font-extralight text-[#304FFE]')}>
              <div>Visitor Name</div>
              <div>Relation</div> 
              <div>Date</div>
              <div>Status</div>
            </div>
            <hr/>
            { bookingRequests.results.map((request, index) => {
              return(
                <div className={tailwindWrapper('flex item-center justify-around font-extralight text-xs')}>
                  <div className={tailwindWrapper('max-w-20')}>{request.bookedBy}</div>
                  <div className={tailwindWrapper('max-w-20')} >To be decided</div>
                  <div className={tailwindWrapper('max-w-20')}>{request.requestedFrom}-{request.requestedTill}</div>
                  <div className={tailwindWrapper('max-w-20')} >
                  Pending
                  </div>
                </div>
                )
            })}
            <span className={tailwindWrapper('mb-4')}>
            Want to book a guest house for your parents or relative<br/>
            Book here
            </span>
            <button className={tailwindWrapper('bg-[#133BC5] self-start rounded-md text-white px-28 py-3')} onClick={() => {
              window.alert("book button clicked")
            }}>Book here</button>
        </div>

    </>) 
    :
      (<>
        <div className={tailwindWrapper('')}>
          There are no current guest house bookings
        </div>
      </>)
    }
      </>
    )
  }

}

function mapStateToProps(state) {
  return {
    bookingRequests: state.bookingRequests,
    activeHostel: state.activeHostel
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRoomBookings: (residence, successCallBack, errCallBack) => {
      dispatch(getRoomBookings(residence, successCallBack, errCallBack));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GuestHouseBooking)
