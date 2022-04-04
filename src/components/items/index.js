import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
   Header,
   Table,
   Container,
   Dropdown,
   Pagination,
   Segment,
   Button,
   Checkbox,
   Input,
   Modal,
   Form
  } from 'semantic-ui-react'

import moment from 'moment'

import { Loading } from "formula_one";

import { itemsUrl, defaultItemsUrl, itemsDownloadUrl} from '../../urls'

import { getDefaultItems } from '../../actions/default-items'
import { getItems } from '../../actions/items'
import { addDefaultItem} from '../../actions/add_defaultitem';
import { entries } from '../constants'

import './index.css'

class Items extends Component {
  state = {
    activePage: 1,
    open: false,
    loading: true,
    entryNo: '5',
    itemName: '',
    itemDownloadUrl: '',
  };

  componentDidMount() {
    this.props.getDefaultItems(
      defaultItemsUrl(this.props.activeHostel),
    )
    this.props.getItems(
      `${itemsUrl(this.props.activeHostel)}`,
      this.successCallBack,
      this.errCallBack
    )
    this.setState({
      itemDownloadUrl: itemsDownloadUrl(this.props.activeHostel)
    })
  }

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value.toUpperCase() })
    }
  }

  handleSubmit = (e) => {
    let data = {
      name: this.state.itemName.trim(),
    };
    this.setState({
      loading: true,
    })
    this.props.addDefaultItem(
      data,
      this.props.activeHostel,
      this.defaultItemSuccessCallBack,
      this.defaultItemErrCallBack
    );
  };

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage, loading: false })
    this.props.getItems(
      `${itemsUrl(this.props.activeHostel)}?page=${activePage}`,
      this.successCallBack,
      this.errCallBack
    )
  }

  handleEntriesChange = (e, { value }) => {
    this.setState({ entryNo: value })
    this.setState({
      loading: true
    })
    this.props.getItems(
      `${itemsUrl(this.props.activeHostel)}?page=${this.state.activePage}&perPage=${value}`,
      this.successCallBack,
      this.errCallBack
    )
  }

  defaultItemSuccessCallBack = (res) => {
    this.setState({
      success: true,
      error: false,
      message: res.statusText,
      loading: false
    })
    this.close()
  }

  defaultItemErrCallBack = (err) => {
    this.setState({
      error: true,
      success: false,
      message: err,
      loading: false
    })
    this.close()
  }

  successCallBack = () => {
    this.setState({
      loading: false,
    })
  }

  errCallBack = () => {
    this.setState({
      loading: false,
    })
  }

  show = () => {
    this.setState({ open: true })
  }

  close = () => this.setState({ open: false })

  render() {
    const {
      activePage,
      loading,
      entryNo,
      open,
      itemName,
      itemDownloadUrl
    } = this.state
    const { items, defaultItems, constants } = this.props
    
    return (
      <div>
        {/* <div styleName="item-header">
          <Header as='h4'>Complaint Items </Header>
            <Button primary onClick={this.show}>
              Add Item
            </Button>
            <a href={itemDownloadUrl} download>
              <Button
                primary
              >
                Download list
              </Button>
            </a>
        </div> */}
        <div styleName="item-header">
          <Header as='h4'>Complaint Items</Header>
            <div styleName="item-header">
              <Button basic onClick={this.show} color='blue'>
                Add Item
              </Button>
              <a href={itemDownloadUrl} download>
                <Button
                  primary
                >
                  Download list
                </Button>
              </a>
              </div>
        </div>
        <Container>
        {!loading?
          (
            <React.Fragment>
              {(items.results && items.results.length > 0)
                ?
                (
                  <div styleName = "table-overflow">
                    <Table unstackable celled>
                    <Table.Header>
                      <Table.Row>
                      <Table.HeaderCell>S No.</Table.HeaderCell>
                        <Table.HeaderCell>Item</Table.HeaderCell>
                        <Table.HeaderCell>Quantity</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {items.results && items.results.length > 0
                        ? items.results.map((item, index) => {
                            return (
                              <Table.Row key={index}>
                                <Table.Cell>{entryNo * (activePage - 1) + index + 1}</Table.Cell>
                                <Table.Cell>{item.name}</Table.Cell>
                                <Table.Cell>{item.quantity}</Table.Cell>
                              </Table.Row>
                            )
                          })
                        : null}
                    </Table.Body>
                  </Table>
                  <div styleName='pagination-container'>
                    <div>
                        {items.count > entryNo ? (
                          <Pagination
                            activePage={activePage}
                            onPageChange={this.handlePaginationChange}
                            totalPages={Math.ceil(items.count / entryNo)}
                          />
                        ) : null}
                    </div>
                    <div>
                          Entries per page : 
                          <Dropdown
                            name='entries'
                            selection
                            options={entries}
                            onChange={this.handleEntriesChange}
                            value={entryNo}
                            compact
                          />
                    </div>
                  </div>
                </div>
                ):
                (
                  <Segment>No complaint items found</Segment>
                )
              }
            </React.Fragment>
          ):
          (
            <Loading />
          )
        }
        </Container>
        <Modal size='mini' open={open} onClose={this.close}>
              <Modal.Header styleName='center'>Add Item</Modal.Header>
              <Modal.Content>
              <Form centered>
              <Form.Field>
                  <label>Name</label>
                  <Input
                    name='itemName'
                    value={itemName}
                    onChange={this.handleChange}
                  />
              </Form.Field>
              </Form>
              </Modal.Content>
              <Modal.Actions styleName='modalActions'>
              <Button onClick={this.handleSubmit} loading={loading} primary>
                Add
              </Button>
              </Modal.Actions>
            </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    defaultItems: state.defaultItems,
    items: state.items,
    activeHostel: state.activeHostel,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getItems: (url, successCallBack, errCallBack) => {
      dispatch(getItems(url, successCallBack, errCallBack))
    },
    getDefaultItems: (url) => {
      dispatch(getDefaultItems(url))
    },
    addDefaultItem: (data, residence, successCallBack, errCallBack) => {
      dispatch(addDefaultItem(data, residence, successCallBack, errCallBack));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Items)

