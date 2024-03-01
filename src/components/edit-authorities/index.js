import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  Header,
  Image,
  Button,
  Form,
  Message,
  Icon,
  Dropdown,
  Grid
} from 'semantic-ui-react'

import { searchPerson } from '../../actions/searchPerson'
import { editAuthority } from '../../actions/authorities'
import { yellowPagesUrl, specificAuthoritiesUrl } from '../../urls'

import './index.css'

class EditAuthorities extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: this.props.activeAuthority.name || '',
      message: '',
      success: false,
      error: false,
      options: [],
      designation: this.props.activeAuthority.designation || ''
    }
    this.delayedCallback = _.debounce(this.ajaxCall, 300)
  }

  handleSubmit = () => {
    if (this.state.selected && this.state.designation) {
      let data = {
        designation: this.state.designation,
        person: this.state.selected.id,
      }
      this.props.editAuthority(
        data,
        specificAuthoritiesUrl(
          this.props.activeHostel,
          this.props.activeAuthority.id
        ),
        this.adminCallBack,
        this.errCallBack
      )
    }
  }

  adminCallBack = (res) => {
    this.setState({
      success: true,
      error: false,
      message: res.statusText
    })
  }
  errCallBack = (err) => {
    this.setState({
      error: true,
      success: false,
      message: err
    })
  }

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value })
    }
  }

  successCallBack = (res) => {
    let options = res.data.map((person, index) => {
      let text = person.fullName
      if (
        person.roles &&
        person.roles.length > 0 &&
        person.roles[0].data &&
        person.roles[0].data.branch
      ) {
        text = `${text} - ${person.roles[0].data.branch.department.name}`
      }
      return { key: index, text: text, value: person }
    })
    this.setState({
      options,
    })
  }

  ajaxCall = (e) => {
    this.props.searchPerson(
      yellowPagesUrl(e.target.value),
      this.successCallBack
    )
  }

  onSearchChange = (e) => {
    e.persist()
    this.setState({ [e.target.name]: e.target.value })
    this.delayedCallback(e)
  }

  onChange = (e, data) => {
    this.setState({ selected: data.value })
  }

  render() {
    const { options, selected, designation } = this.state
    const { constants } = this.props
    let designations = []
    for (var i in constants.designations) {
      designations.push({
        key: i.toString(),
        text: constants.designations[i].toString(),
        value: i.toString()
      })
    }
    return (
        <Grid.Column width={16}>
          <div styleName='centered'>
            {this.state.error && (
              <Message warning>
                <Icon name='warning' />
                {this.state.message.response.data}
              </Message>
            )}
            {this.state.success && (
              <Message positive>{this.state.message}</Message>
            )}
            {designation ? (
              <React.Fragment>
                <div>
                  <Header as='h4'>
                    {' '}
                    {constants.designations[designation]}{' '}
                  </Header>
                </div>
                <div>
                  <Image
                    src={
                      selected.displayPicture ||
                      'https://react.semantic-ui.com/images/wireframe/square-image.png'
                    }
                    size='tiny'
                    circular
                  />
                </div>

                <Form>
                  <Form.Field>
                    <label>Name</label>
                    <Dropdown
                      name='name'
                      onSearchChange={this.onSearchChange}
                      onChange={this.onChange}
                      value={selected}
                      search={(options, _) => {return options}}
                      selection
                      closeOnChange
                      options={options}
                    />
                  </Form.Field>
                  <Button
                   size='medium'
                   onClick={this.handleSubmit}
                   primary
                   width={3}
                  >
                    Submit
                  </Button>
                </Form>
              </React.Fragment>
            ) : (
              <React.Fragment>
                Go to <Link to='/bhawan_app/'>this</Link> and select the
                authority first
              </React.Fragment>
            )}
          </div>
        </Grid.Column>
    )
  }
}

function mapStateToProps(state) {
  return {
    searchPersonResults: state.searchPersonResults,
    activeAuthority: state.activeAuthority,
    activeHostel: state.activeHostel
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchPerson: (url, successCallBack) => {
      dispatch(searchPerson(url, successCallBack))
    },
    editAuthority: (url, data, successCallBack, errCallBack) => {
      dispatch(editAuthority(url, data, successCallBack, errCallBack))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAuthorities)
