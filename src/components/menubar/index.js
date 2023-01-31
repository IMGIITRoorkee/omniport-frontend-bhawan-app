import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { Icon, Menu } from "semantic-ui-react";

import {
  homePageUrl,
  complaintUrl,
  profilePageUrl,
  bookingUrl,
  eventUrl
} from "../../urls";

import "./index.css";

class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "",
      activeSubGroup: 'home'
    };
  }

  componentDidMount() {
    switch (location.pathname) {
      case homePageUrl(): {
        this.setState({
          activeSubGroup: 'home'
        })
        return
      }
      case complaintUrl(): {
        this.setState({
          activeSubGroup: 'complaints'
        })
        return
      }
      case bookingUrl(): {
        this.setState({
          activeSubGroup: 'bookings'
        })
        return
      }
      case eventUrl(): {
        this.setState({
          activeSubGroup: 'events'
        })
        return
      }
      case profilePageUrl(): {
        this.setState({
          activeSubGroup: 'profile'
        })
        return
      }
    }
  }

  handleItemClick = (e, { name }) => {
    this.props.linkClick();
    this.setState({ activeSubGroup: name })
    this.setState({ activeItem: name });
  };

  render() {
    const { sidebarStatus } = this.props;
    const { activeSubGroup } = this.state;
    return (
      <Menu
        styleName={[
          "sub-header",
          "menu-bar",
          sidebarStatus ? "" : "closed-menu-bar",
        ].join(" ")}
        floated="right"
        size="large"
        pointing
        secondary
        vertical
      >
        <Scrollbars autoHide >
          <Link to={bookingUrl()}>
            <Menu.Item
              name="bookings"
              onClick={this.handleItemClick}
              active={activeSubGroup === 'bookings'}
              className={["menu-icon-bar", "menu-items"].join(" ")}
            >
              <Icon name="book" />
              Book a Room
            </Menu.Item>
          </Link>
          <Link to={complaintUrl()}>
            <Menu.Item
              name="complaints"
              onClick={this.handleItemClick}
              active={activeSubGroup === 'complaints'}
              className={["menu-icon-bar", "menu-items"].join(" ")}
            >
              <Icon name="book" />
              Make a complaint
            </Menu.Item>
          </Link>
          <Link to={profilePageUrl()}>
            <Menu.Item
              name="profile"
              onClick={this.handleItemClick}
              active={activeSubGroup === 'profile'}
              className={["menu-icon-bar", "menu-items"].join(" ")}
            >
              <Icon name="book" />
              Visit My Profile
            </Menu.Item>
          </Link>
          <Link to={eventUrl()}>
            <Menu.Item
              name="events"
              onClick={this.handleItemClick}
              active={activeSubGroup === 'events'}
              className={["menu-icon-bar", "menu-items"].join(" ")}
            >
              <Icon name="book" />
              Events
            </Menu.Item>
          </Link>
          <Link to={homePageUrl()}>
            <Menu.Item
              name="home"
              onClick={this.handleItemClick}
              active={activeSubGroup === 'home'}
              className={["menu-icon-bar", "menu-items"].join(" ")}
            >
              <Icon name="book" />
              Home Page
            </Menu.Item>
          </Link>
        </Scrollbars>
      </Menu>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    course: state.getUserCourses,
    user: state.getUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserCourses: () => {
      dispatch(getUserCourses());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
