import React from 'react'
import { connect } from 'react-redux'

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
import { addAuthority } from '../../actions/authorities'

import { yellowPagesUrl, authoritiesUrl } from '../../urls'

import './index.css'

class AdminAuthorities extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      message: '',
      success: false,
      error: false,
      permissions: null,
      options: [],
      selected: '',
      designation: null
    }
    this.delayedCallback = _.debounce(this.ajaxCall, 300)
  }

  handleSubmit = () => {
    if (this.state.selected && this.state.designation) {
      let data = {
        designation: this.state.designation,
        person: this.state.selected.id
      }
      this.props.addAuthority(
        data,
        authoritiesUrl(this.props.activeHostel),
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
    const { name, options, selected, designation, message } = this.state
    const { match, constants } = this.props
    let designations = []
    for (var i in constants.designations) {
      designations.push({
        key: i.toString(),
        text: constants.designations[i].toString(),
        value: i.toString()
      })
    }
    return (
      <Grid container>
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
              <div>
                <Header as='h4'>
                  {' '}
                  {constants.designations[match.params.id]}{' '}
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
                    selection
                    search={(options, _) => {return options}}
                    closeOnChange
                    options={options}
                    placeholder="Enter Name"
                  />
                </Form.Field>
                <Form.Field>
                  <label>Designation</label>
                  <Dropdown
                    name='designation'
                    value={designation}
                    onChange={this.handleChange}
                    selection
                    closeOnChange
                    options={designations}
                  />
                </Form.Field>
                <Button primary size='medium' onClick={this.handleSubmit} width={3}>
                  Submit
                </Button>
              </Form>
            </div>
          </Grid.Column>
      </Grid>
    )
  }
}

function mapStateToProps(state) {
  return {
    searchPersonResults: state.searchPersonResults,
    activeHostel: state.activeHostel
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchPerson: (url, successCallBack) => {
      dispatch(searchPerson(url, successCallBack))
    },
    addAuthority: (url, data, successCallBack, errCallBack) => {
      dispatch(addAuthority(url, data, successCallBack, errCallBack))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminAuthorities)
