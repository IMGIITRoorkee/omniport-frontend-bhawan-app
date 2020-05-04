import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Icon, } from 'semantic-ui-react'
import './index.css'
export default class MyInfo extends React.Component {

  handleRedirect = () => {
    if(this.props.who_am_i.isStudent ) {
    this.props.history.push("/bhawan_app/profile")
    }
  };

  render() {
    const { who_am_i } = this.props
    return (
        <Card>
          <Card.Content>
              <Card.Content styleName="font_color" onClick={this.handleRedirect}>
                <Icon name="user" size="small" />
                <strong>{who_am_i.fullName}</strong>
              </Card.Content>
              <Card.Description styleName="font_color" onClick={this.handleRedirect}>
                <Icon name="home" size="small" />
                {who_am_i.residence}
              </Card.Description>
              <Card.Description styleName="font_color" onClick={this.handleRedirect}>
                <Icon name="hotel" size="small"/>
                {who_am_i.roomNumber}
              </Card.Description>
          </Card.Content>
        </Card>
    )
  }
}
