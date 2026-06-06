import React from 'react';
import { connect } from 'react-redux';
import {
  Header,
  Image,
  Container,
  Button,
  Form,
  Dropdown,
  TextArea,
  Input,
  Icon,
  Grid,
  Message,
  Label,
  Modal
} from 'semantic-ui-react';
import { TimeInput } from 'semantic-ui-calendar-react';
import {
  getFacility,
  getFacilities,
  editFacility,
} from '../../actions/facilities';
import { facilitiesUrl, facilityUrl } from '../../urls';
import './index.css';
import moment from 'moment';

const options = [
  { key: 'mon', text: 'Monday', value: 'mon' },
  { key: 'tue', text: 'Tuesday', value: 'tue' },
  { key: 'wed', text: 'Wednesday', value: 'wed' },
  { key: 'thu', text: 'Thursday', value: 'thu' },
  { key: 'fri', text: 'Friday', value: 'fri' },
  { key: 'sat', text: 'Saturday', value: 'sat' },
  { key: 'sun', text: 'Sunday', value: 'sun' },
];

class Facility extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editsuccess: false,
      id: this.props.activeFacility || 1,
      editMode: false,
      information: '',
      startTime: [''],
      endTime: [''],
      descriptions: [''],
      name: '',
      days: [[]],
      formattedTimings: {},
      displayImage: null,
      imageURL: '',
      removerDisplay: false,
    };
  }

  componentDidMount() {
    this.props.setNavigation('Facilities');
    this.props.getFacilities(
      facilitiesUrl(this.props.activeHostel),
      this.successCallBack,
      this.errCallBack
    );
    this.props.getFacility(
      this.props.activeHostel,
      this.state.id,
      this.successCallBack,
      this.facilityErrCallBack
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.facility.id !== prevProps.facility.id) {
      const formattedTimings = this.formatTimings(this.props.facility.timings)
      this.setState({
        formattedTimings: formattedTimings
      });
    }
  }

  createForm = () => {
    return this.state.descriptions.map((description, i) => (
      <div key={i}>
        <Form.Group>
          <Form.Field>
            <label>Description</label>
            <Input
              value={description || ''}
              onChange={(event) => this.handleDescriptionsChange(i, event)}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field>
            <label>Days</label>
            <Dropdown
              name='days'
              placeholder='Select Day'
              multiple
              selection
              options={options}
              value={this.state.days[i]}
              onChange={(event, { value }) =>
                this.handleDaysChange(event, i, value)
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Start time</label>
            <TimeInput
              name='startTime'
              value={this.state.startTime[i]}
              onChange={(event, { value }) =>
                this.handleStartTimeChange(event, i, value)
              }
            />
          </Form.Field>
          <Form.Field>
            <label>End time</label>
            <TimeInput
              name='endTime'
              value={this.state.endTime[i]}
              onChange={(event, { value }) =>
                this.handleEndTimeChange(event, i, value)
              }
            />
          </Form.Field>
          {this.state.descriptions.length > 1 ? (
            <Icon name='close' onClick={() => removeClick(i)} />
          ) : null}
        </Form.Group>
      </div>
    ));
  };

  submitData = () => {
    const { information, startTime, endTime, descriptions } = this.state;

    if (information && descriptions && startTime && endTime) {
      let formData = new FormData();
      formData.append('name', this.state.name);
      formData.append('description', this.state.information);
      let timings = [];
      for (var i = 0; i < this.state.days.length; i++) {
        for (var j = 0; j < this.state.days[i].length; j++) {
          timings.push({
            day: this.state.days[i][j],
            start: this.state.startTime[i],
            end: this.state.endTime[i],
            description: this.state.descriptions[i],
          });
        }
      }
      let data = null;
      if (timings.length > 0) {
        data = {
          description: this.state.information,
          timings: timings,
        };
      } else {
        data = {
          description: this.state.information,
        };
      }
      this.props.editFacility(
        facilityUrl(this.props.activeHostel, this.state.id),
        data,
        this.editFacilityCallBack,
        this.errCallBack
      );
    }
    this.toggleEditMode();
  };

  uploadImage = () => {
    if (this.state.displayImage && this.state.imageURL) {
      const formData = new FormData()
      formData.append('displayPicture', this.state.displayImage);
      this.props.editFacility(
        facilityUrl(this.props.activeHostel, this.state.id),
        formData,
        this.editFacilityCallBack,
        this.errCallBack
      );
      this.handleCloseModal()
    }
  }

  removeImage = () => {
    const data = {
      'displayPicture': null
    }
    this.props.editFacility(
      facilityUrl(this.props.activeHostel, this.state.id),
      data,
      this.editFacilityCallBack,
      this.errCallBack
    );
    this.handleRemoverModal()
  }

  removeClick = (i) => {
    let descriptions = [...this.state.descriptions];
    let startTime = [...this.state.startTime];
    let endTime = [...this.state.endTime];
    let days = [...this.state.days];
    descriptions.splice(i, 1);
    startTime.splice(i, 1);
    endTime.splice(i, 1);
    days.splice(i, 1);
    this.setState({
      descriptions,
      startTime,
      endTime,
      days,
    });
  };

  handleDescriptionsChange(i, event) {
    let descriptions = [...this.state.descriptions];
    descriptions[i] = event.target.value;
    this.setState({ descriptions });
  }

  handleDaysChange(event, i, value) {
    let days = [...this.state.days];
    days[i] = value;
    this.setState({ days });
  }

  handleStartTimeChange(event, i, value) {
    let startTime = [...this.state.startTime];
    startTime[i] = value;
    this.setState({ startTime });
  }

  handleEndTimeChange(event, i, value) {
    let endTime = [...this.state.endTime];
    endTime[i] = value;
    this.setState({ endTime });
  }

  handleCloseModal = () => {
    this.setState({
      displayImage: null,
      imageURL: '',
    })
  }

  addClick = () => {
    this.setState((prevState) => ({
      descriptions: [...prevState.descriptions, ''],
      startTime: [...prevState.startTime, ''],
      endTime: [...prevState.endTime, ''],
      days: [...prevState.days, []],
    }));
  };

  successCallBack = (res) => {
    this.setState({
      success: true,
      error: false,
      message: res.statusText,
      convenientTime: '',
      complaint: '',
      category: '',
      information: res.data.description,
      day: [],
      start: [],
      end: [],
      description: [],
    });
  };
  editFacilityCallBack = (res) => {
    this.setState({
      editsuccess: true,
      error: false,
      message: res.statusText,
      convenientTime: '',
      complaint: '',
      category: '',
      information: res.data.description,
      day: [],
      start: [],
      end: [],
      description: [],
    });
    this.props.getFacility(
      this.props.activeHostel,
      this.state.id,
      this.successCallBack,
      this.errCallBack
    );
  };

  errCallBack = (err) => {
    this.setState({
      error: true,
      success: false,
      message: err,
    });
  };
  facilityErrCallBack = (err) => { };
  toggleEditMode = () => {
    const editMode = this.state.editMode;
    this.setState({
      editMode: !editMode,
    });
  };

  formatTimings = (timings) => {
    var filterByDesc = {}
    timings.forEach(function (item) {
      if (!filterByDesc.hasOwnProperty(item.description)) {
        filterByDesc[item.description] = []
      }
      filterByDesc[item.description].push(item)
    })
    var formattedTimings = {}
    for (let [key, value] of Object.entries(filterByDesc)) {
      formattedTimings[key] = {}
      value.forEach(function (item) {
        const time = item.start + "-" + item.end
        if (!formattedTimings[key].hasOwnProperty(time)) {
          formattedTimings[key][time] = []
        }
        formattedTimings[key][time].push(item.day)
      })
    }
    return formattedTimings;
  }

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  };
  handleFacilityChange = (id) => {
    this.setState({
      id,
    });
    this.props.getFacility(
      this.props.activeHostel,
      id,
      this.successCallBack,
      this.errCallBack
    );
  };
  handleSelectPicture = async (e, i) => {
    const z = e.target.files;
    if (e.target.files && e.target.files.length == 1) {
      const displayImage = await readFile(z[0]);
      const displayImageFile = await dataURLtoFile(displayImage, 'image.png');

      this.setState({
        displayImage: displayImageFile,
        imageURL: displayImage
      });
    }
  };
  handleRemoverModal = () => {
    this.setState({
      removerDisplay: !this.state.removerDisplay,
    })
  }

  render() {
    const { facility, facilities, activePost } = this.props;
    const { information, formattedTimings, displayImage, imageURL } = this.state;
    return (
      <Grid.Column width={16}>
        <Grid.Column>
          {this.state.error && (
            <Message warning>
              <Icon name='warning' />
              {this.state.message.response.data}
            </Message>
          )}
          {this.state.editsuccess && (
            <Message positive>{this.state.message}</Message>
          )}
          <div>
            {facilities && facilities.length > 0
              ? facilities.map((allFacility, index) => {
                return (
                  <Button
                    styleName='button_margin'
                    onClick={() => this.handleFacilityChange(allFacility.id)}
                  >
                    {allFacility.name}
                  </Button>
                );
              })
              : null}
          </div>
          {facility ? (
            <React.Fragment>
              <Modal
                open={Boolean(imageURL)}
                centered
                size='tiny'
                closeIcon
                closeOnDimmerClick={false}
              >
                <Header>Upload facility image</Header>
                <Modal.Content>
                  <Image
                    src={imageURL}
                  />
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    basic
                    icon='left arrow'
                    content='Keep current'
                    secondary
                    onClick={this.handleCloseModal}
                  />
                  <Button
                    basic
                    icon='photo'
                    content='Done'
                    primary
                    onClick={this.uploadImage}
                  />
                </Modal.Actions>
              </Modal>
              <Modal
                open={this.state.removerDisplay}
                onClose={this.handleRemoverModal}
                size='mini'
                closeIcon
              >
                <Header>Are you sure?</Header>
                <Modal.Content>
                  Are you sure you want to continue this irreversible
                  action?
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    basic
                    icon='left arrow'
                    content='Keep'
                    positive
                    onClick={this.handleRemoverModal}
                  />
                  <Button
                    basic
                    icon='trash alternate'
                    content='Delete'
                    negative
                    onClick={this.removeImage}
                  />
                </Modal.Actions>
              </Modal>
              <Header as='h2'>{facility.name}</Header>
              <Grid divided='vertically'>
                <Grid.Row columns={2}>
                  <Grid.Column width={4}>
                    <div styleName='facilityImage'>
                      <Image
                        src={
                          facility.displayPicture ||
                          'https://react.semantic-ui.com/images/wireframe/image.png'
                        }
                        size='medium'
                      />
                      {activePost != null && facility.displayPicture ?
                        <div styleName='actions'>
                          <Button styleName="update-image">
                            <label htmlFor='updatedFile' styleName='labelButton'>
                              Change
                            </label>
                          </Button>
                          <input
                            type='file'
                            accept='image/*'
                            onChange={this.handleSelectPicture}
                            id='updatedFile'
                            hidden
                          />
                          <Button
                            styleName='update-image'
                            onClick={this.handleRemoverModal}
                          >
                            Remove
                          </Button>
                        </div> :
                        <React.Fragment>
                          <Button styleName="upload-image">
                            <label htmlFor='uploadedFile' styleName='labelButton'>
                              Upload image
                            </label>
                          </Button>
                          <input
                            type='file'
                            accept='image/*'
                            onChange={this.handleSelectPicture}
                            name='uploadedFile'
                            id='uploadedFile'
                            hidden
                          />
                        </React.Fragment>
                      }
                    </div>
                  </Grid.Column>
                  <Grid.Column width={12}>
                    <Container>
                      {this.state.editMode ? (
                        <div>
                          <Header as='h5'>Edit Information</Header>
                          <Form>
                            <TextArea
                              name='information'
                              value={information}
                              onChange={this.handleChange}
                              placeholder='Tell us more'
                              fluid
                            />
                            <Header as='h3'>Timings</Header>
                            {this.createForm()}
                            <Form.Field>
                              <Icon
                                onClick={this.addClick}
                                name='plus'
                                size='big'
                                styleName='plus-icon'
                              />
                            </Form.Field>
                            <Form.Group>
                              <Form.Button onClick={this.submitData}>
                                Save Changes
                              </Form.Button>
                              <Form.Button onClick={this.toggleEditMode}>
                                Cancel
                              </Form.Button>
                            </Form.Group>
                          </Form>
                          * Filling any timing will rewrite the old timigs with
                          new one
                        </div>
                      ) : (
                        <div>
                          {facility.description}
                          <Header size='small' styleName='low_margin'>
                            Timings
                          </Header>
                          {
                            facility.timings && facility.timings.length > 0 && formattedTimings != {}
                              ? <Grid celled>
                                {
                                  Object.keys(formattedTimings).map((key) => {
                                    return (
                                      <Grid.Row>
                                        <Grid.Column styleName="facilityDescription" width={4}>{key}</Grid.Column>
                                        <Grid.Column width={12}>
                                          <Grid celled>
                                            {Object.keys(formattedTimings[key]).map((newKey) => {
                                              return (
                                                <Grid.Row>
                                                  <Grid.Column styleName="facilityDescription" width={6}>{newKey}</Grid.Column>
                                                  <Grid.Column width={10}>
                                                    {
                                                      formattedTimings[key][newKey].map((day) => {
                                                        return (
                                                          <Label>{day.charAt(0).toUpperCase() + day.slice(1)}</Label>
                                                        )
                                                      })
                                                    }
                                                  </Grid.Column>
                                                </Grid.Row>
                                              )
                                            })}
                                          </Grid>
                                        </Grid.Column>
                                      </Grid.Row>
                                    )
                                  })
                                }
                              </Grid>
                              : ""
                          }
                          {activePost != null && (
                            <Button
                              basic
                              color='blue'
                              onClick={this.toggleEditMode}
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      )}
                    </Container>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </React.Fragment>
          ) : null}
        </Grid.Column>
      </Grid.Column >
    );
  }
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function mapStateToProps(state) {
  return {
    activeFacility: state.activeFacility,
    facility: state.facility,
    facilities: state.facilities,
    activeHostel: state.activeHostel,
    activePost: state.activePost
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getFacilities: (url, successCallBack, errCallBack) => {
      dispatch(getFacilities(url, successCallBack, errCallBack));
    },
    getFacility: (residence, id, successCallBack, errCallBack) => {
      dispatch(getFacility(residence, id, successCallBack, errCallBack));
    },
    editFacility: (url, data, successCallBack, errCallBack) => {
      dispatch(editFacility(url, data, successCallBack, errCallBack));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Facility);
