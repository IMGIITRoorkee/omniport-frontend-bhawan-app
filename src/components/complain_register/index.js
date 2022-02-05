import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  Button,
  Form,
  TextArea,
  Message,
  Segment,
  Icon,
  Header,
  Dropdown,
  Pagination,
  Table,
  Grid,
} from 'semantic-ui-react';

import { Loading } from "formula_one"

import './index.css';

import { getComplains } from '../../actions/complains';
import { addComplaint } from '../../actions/add_complaint';
import { complainsUrl } from '../../urls';

class ComplainRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      complain: '',
      category: '',
      loading: false,
      success: false,
      error: false,
      message: '',
      activePage: 1,
      complainsLoading: true,
    };
  }

  componentDidMount() {
    this.props.setNavigation('Register a Complain');

    this.props.getComplains(
      complainsUrl(this.props.activeHostel),
      this.complainsSuccessCallBack,
      this.complainsErrCallBack
    );
  }

  complainsSuccessCallBack = (res) => {
    this.setState({
      complainsLoading: false,
    })
  }

  complainsErrCallBack = (err) => {
    this.setState({
      complainsLoading: false,
    })
  }

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  };

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage, complainsLoading: true });
    this.props.getComplains(
      `${complainsUrl(this.props.activeHostel)}?page=${activePage}`,
      this.complainsSuccessCallBack,
      this.complainsErrCallBack
    );
  };

  handleSubmit = (e) => {
    let data = {
      complaintType: this.state.category,
      description: this.state.complain.trim(),
    };
    this.setState({
      loading: true,
    })
    this.props.addComplaint(
      data,
      this.props.activeHostel,
      this.successCallBack,
      this.errCallBack
    );
  };

  successCallBack = (res) => {
    this.setState({
      success: true,
      error: false,
      message: res.statusText,
      loading: false,
      convenientTime: '',
      complain: '',
      category: '',
      complainsLoading: true,
    });
    this.props.getComplains(
      complainsUrl(this.props.activeHostel),
      this.complainsSuccessCallBack,
      this.complainsErrCallBack
    );
  };

  errCallBack = (err) => {
    this.setState({
      error: true,
      success: false,
      message: err,
      loading: false,
      activePage:1,
    });
  };
  render() {
    const { complains, constants } = this.props;
    const { activePage, loading, complainsLoading, complain, category } = this.state;
    let options = [];
    for (var i in constants.complaint_types) {
      options.push({
        key: i.toString(),
        text: constants.complaint_types[i].toString(),
        value: i.toString(),
      });
    }
    return (
      <Grid.Column width={12} floated='left'>
        {this.state.error && (
          <Message warning>
            <Icon name='warning' />
            Your complain could not be made. Please try again
          </Message>
        )}
        {this.state.success && (
          <Message positive>Your complain has been made succesfully</Message>
        )}
        <Form>
          <Form.Field required>
            <label>Category</label>
            <Dropdown
              name='category'
              selection
              options={options}
              value={category}
              onChange={this.handleChange}
              styleName='field-width'
              required
            />
          </Form.Field>
          <div styleName='info'>
            <div>3 attempts will be made to resolve your complaint</div>
            <div>
              The complaint will be deleted after 3 unsuccessful attempts
            </div>
          </div>
          <Form.Field
            name='complain'
            value={complain}
            onChange={this.handleChange}
            control={TextArea}
            label='Complaint Description / Feedback'
            placeholder='Type your complaint here ....'
            styleName='complaint'
            rows='5'
            required
          />
          <Button
            size='medium'
            styleName='button'
            onClick={this.handleSubmit}
            width={3}
            loading={loading}
            disabled={complain.trim()=='' || category==''}
          >
            Submit
          </Button>
        </Form>
        <Header as='h3'>My Complains and Feedback</Header>
        {!complainsLoading?
          (
            <React.Fragment>
              {(complains.results && complains.results.length > 0)?
          (
            <React.Fragment>
          <div styleName="table-height">
          <Table unstackable celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Complaint Description</Table.HeaderCell>
                <Table.HeaderCell>Complain Type</Table.HeaderCell>
                <Table.HeaderCell>Complain Status</Table.HeaderCell>
                <Table.HeaderCell>Complain Date and Time</Table.HeaderCell>
                <Table.HeaderCell>Applicant Room</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {complains.results && complains.results.length > 0
                ? complains.results.map((complain, index) => {
                    return (
                      <Table.Row>
                        <Table.Cell>
                          {5 * (activePage - 1) + index + 1}
                        </Table.Cell>
                        <Table.Cell>{complain.description}</Table.Cell>
                        <Table.Cell>
                          {constants.complaint_types[complain.complaintType]}
                        </Table.Cell>
                        <Table.Cell>
                          {constants.statues.COMLAINT_STATUSES[complain.status]}
                        </Table.Cell>
                        <Table.Cell>
                          {moment(
                            complain.datetimeCreated
                          ).format('DD/MM/YY H:mm')}
                        </Table.Cell>
                        <Table.Cell>{complain.roomNo}</Table.Cell>
                      </Table.Row>
                    );
                  })
                : null}
            </Table.Body>
          </Table>
          </div>
          {complains.count > 5 ? (
            <Pagination
              activePage={activePage}
              onPageChange={this.handlePaginationChange}
              totalPages={Math.ceil(complains.count / 5)}
            />
          ) : null}
        </React.Fragment>
          ):
          (
            <Segment>No Complains or Feedback Yet</Segment>
          )
        }
            </React.Fragment>
          ):
          (
            <Loading />
          )
        }

      </Grid.Column>
    );
  }
}
function mapStateToProps(state) {
  return {
    complains: state.complains,
    activeHostel: state.activeHostel
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getComplains: (url, successCallBack, errCallBack) => {
      dispatch(getComplains(url, successCallBack, errCallBack));
    },
    addComplaint: (data, residence, successCallBack, errCallBack) => {
      dispatch(addComplaint(data, residence, successCallBack, errCallBack));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplainRegister);
