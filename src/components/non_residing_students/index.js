import React from 'react'
import { connect } from 'react-redux'
import { toast } from 'react-semantic-toasts'
import moment from 'moment'
import axios from 'axios'
import { getCookie } from 'formula_one/src/utils'

import {
  Button,
  Container,
  Dropdown,
  Form,
  Header,
  Input,
  Segment,
  Table,
  Grid,
} from 'semantic-ui-react'

import {
  nonResidingStudentsUrl,
  allNonResidingStudentsUrl,
} from '../../urls'
import './index.css'


class NonResidingStudents extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      designation: '',
      department: '',
      mobileNumber: '',
      roomNumber: '',
      fromDate: '',
      uptoDate: '',
      emailId: '',
      saving: false,
      loading: true,
      students: [],
      showAddForm: false,
      editMode: false,
      editingStudentId: null,
      searchQuery: '',
      filterDesignation: '',
      filterDepartment: '',
      filterBhawan: '',
      showAllBhawans: false,
    }
  }

  componentDidMount () {
    if (this.props.setNavigation) {
      this.props.setNavigation('Non Residing Students')
    }
    this.fetchStudents()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.activeHostel !== this.props.activeHostel) {
      this.fetchStudents()
    }
  }

  fetchStudents = () => {
    this.setState({ loading: true })
    axios
      .get(nonResidingStudentsUrl(this.props.activeHostel))
      .then((res) => {
        this.setState({
          students: res.data,
          loading: false,
        })
      })
      .catch(() => {
        this.setState({
          students: [],
          loading: false,
        })
      })
  }

  fetchAllStudents = () => {
    this.setState({ loading: true })
    axios
      .get(allNonResidingStudentsUrl())
      .then((res) => {
        this.setState({
          students: res.data,
          loading: false,
          showAllBhawans: true,
        })
      })
      .catch(() => {
        this.setState({ loading: false })
        toast({
          type: 'error',
          title: 'You are not allowed to view all bhawans',
          animation: 'fade up',
          icon: 'frown outline',
          time: 3000,
        })
      })
  }

  showCurrentBhawanStudents = () => {
    this.setState({
      showAllBhawans: false,
      filterBhawan: '',
    })
    this.fetchStudents()
  }

  downloadFilteredCsv = (filteredStudents) => {
    const { filterDesignation, filterDepartment, filterBhawan, showAllBhawans, searchQuery } = this.state
    const { constants, activeHostel } = this.props

    const currentBhawanName = constants.hostels && constants.hostels[activeHostel] ? constants.hostels[activeHostel] : activeHostel
    const filteredOn = [
      `Scope=${showAllBhawans ? 'All Bhawans' : currentBhawanName}`,
      `Search=${searchQuery || 'NA'}`,
      `Designation=${filterDesignation || 'NA'}`,
      `Department=${this.getDepartmentLabel(filterDepartment) || 'NA'}`,
      `Bhawan=${filterBhawan || 'NA'}`,
    ].join('; ')

    const rows = filteredStudents.map((student) => {
      const mobile = student.mobile_number || student.mobileNumber || ''
      const room = student.room_number || student.roomNumber || ''
      const fromDate = student.from_date || student.fromDate || ''
      const uptoDate = student.upto_date || student.uptoDate || ''
      const email = student.email_id || student.emailId || ''
      const bhawanCode = student.hostel_code || student.hostelCode || ''
      const bhawanName = student.hostel_name || student.hostelName || (constants.hostels && constants.hostels[bhawanCode]) || (constants.hostels && constants.hostels[activeHostel]) || ''
      return [
        bhawanName,
        student.name || '',
        student.designation || '',
        this.getDepartmentLabel(student.department || ''),
        mobile,
        room,
        fromDate ? moment(fromDate).format('DD/MM/YYYY') : '',
        uptoDate ? moment(uptoDate).format('DD/MM/YYYY') : '',
        email,
      ]
    })

    const csvLines = [
      `Filtered on:,${filteredOn}`,
      'Name of the bhawan,Name,Designation,Department,Mobile number,Room number,From (date),Upto (date),Email-id',
      ...rows.map((row) => row.map((col) => `"${String(col).replace(/"/g, '""')}"`).join(',')),
    ]

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'non_residing_students_filtered.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  getDepartmentCodeFromValue = (value) => {
    const { constants } = this.props
    if (!value) {
      return ''
    }

    if (constants.departments && constants.departments[value]) {
      return value
    }

    if (constants.departments) {
      for (const code in constants.departments) {
        if (constants.departments[code] === value) {
          return code
        }
      }
    }

    return value
  }

  getDepartmentLabel = (value) => {
    const { constants } = this.props
    if (!value) {
      return ''
    }
    return (constants.departments && constants.departments[value]) || value
  }

  toggleAddForm = () => {
    this.setState((prevState) => ({
      showAddForm: !prevState.showAddForm,
      editMode: prevState.showAddForm ? false : prevState.editMode,
      editingStudentId: prevState.showAddForm ? null : prevState.editingStudentId,
    }))
  }

  editStudent = (student) => {
    this.setState({
      showAddForm: true,
      editMode: true,
      editingStudentId: student.id,
      name: student.name || '',
      designation: student.designation || '',
      department: this.getDepartmentCodeFromValue(student.department || ''),
      mobileNumber: student.mobile_number || student.mobileNumber || '',
      roomNumber: student.room_number || student.roomNumber || '',
      fromDate: student.from_date || student.fromDate || '',
      uptoDate: student.upto_date || student.uptoDate || '',
      emailId: student.email_id || student.emailId || '',
    })
  }

  resetForm = () => {
    this.setState({
      name: '',
      designation: '',
      department: '',
      mobileNumber: '',
      roomNumber: '',
      fromDate: '',
      uptoDate: '',
      emailId: '',
      saving: false,
      editMode: false,
      editingStudentId: null,
    })
  }

  handleSubmit = () => {
    const {
      name,
      designation,
      department,
      mobileNumber,
      roomNumber,
      fromDate,
      uptoDate,
      emailId,
      editMode,
      editingStudentId,
    } = this.state

    const parsedFromDate = moment(fromDate, 'YYYY-MM-DD', true)
    const parsedUptoDate = moment(uptoDate, 'YYYY-MM-DD', true)

    if (!parsedFromDate.isValid() || !parsedUptoDate.isValid()) {
      toast({
        type: 'error',
        title: 'Please enter valid dates',
        animation: 'fade up',
        icon: 'frown outline',
        time: 3000,
      })
      return
    }

    if (!parsedFromDate.isBefore(parsedUptoDate)) {
      toast({
        type: 'error',
        title: 'From date must be earlier than Upto date',
        animation: 'fade up',
        icon: 'frown outline',
        time: 3000,
      })
      return
    }

    const payload = {
      name: name,
      designation: designation,
      department: department || '',
      mobile_number: mobileNumber,
      room_number: roomNumber,
      from_date: fromDate,
      upto_date: uptoDate,
      email_id: emailId,
    }

    this.setState({ saving: true })
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    }
    axios
      [editMode ? 'patch' : 'post'](
        editMode
          ? `${nonResidingStudentsUrl(this.props.activeHostel)}${editingStudentId}/`
          : nonResidingStudentsUrl(this.props.activeHostel),
        payload,
        { headers: headers }
      )
      .then(() => {
        this.resetForm()
        this.fetchStudents()
        toast({
          type: 'success',
          title: editMode ? 'Non residing student updated successfully' : 'Non residing student registered successfully',
          animation: 'fade up',
          icon: 'smile outline',
          time: 3000,
        })
      })
      .catch(() => {
        this.setState({ saving: false })
        toast({
          type: 'error',
          title: 'Unable to register non residing student',
          animation: 'fade up',
          icon: 'frown outline',
          time: 3000,
        })
      })
  }

  render () {
    const {
      name,
      designation,
      department,
      mobileNumber,
      roomNumber,
      fromDate,
      uptoDate,
      emailId,
      saving,
      loading,
      students,
      showAddForm,
      editMode,
      searchQuery,
      filterDesignation,
      filterDepartment,
      filterBhawan,
      showAllBhawans,
    } = this.state

    const { constants, activeHostel } = this.props

    const designationOptions = [
      { key: 'ra', text: 'RA', value: 'ra' },
      { key: 'pdf', text: 'PDF', value: 'pdf' },
      { key: 'jrf', text: 'JRF', value: 'jrf' },
      { key: 'srf', text: 'SRF', value: 'srf' },
      { key: 'project_fellow', text: 'Project Fellow', value: 'project_fellow' },
      { key: 'npdf', text: 'NPDF', value: 'npdf' },
      { key: 'ipdf', text: 'IPDF', value: 'ipdf' },
      { key: 'research_intern', text: 'Research Intern', value: 'research_intern' },
      { key: 'visitor', text: 'Visitor', value: 'visitor' },
    ]

    let departmentOptions = []
    if (constants.departments) {
      for (const code in constants.departments) {
        departmentOptions = [
          ...departmentOptions,
          {
            key: code,
            text: constants.departments[code],
            value: code,
          },
        ]
      }
    }

    const filteredStudents = students.filter((student) => {
      const mobile = student.mobile_number || student.mobileNumber || ''
      const email = student.email_id || student.emailId || ''
      const room = student.room_number || student.roomNumber || ''
      const deptValue = student.department || ''
      const deptLabel = this.getDepartmentLabel(deptValue)
      const bhawanCode = (student.hostel_code || student.hostelCode || '').toLowerCase()
      const query = searchQuery.trim().toLowerCase()
      const designationMatch = !filterDesignation || student.designation === filterDesignation
      const departmentMatch = !filterDepartment || deptValue === filterDepartment || deptLabel === filterDepartment
      const bhawanMatch = !filterBhawan || bhawanCode === filterBhawan.toLowerCase()
      if (!designationMatch || !departmentMatch || !bhawanMatch) {
        return false
      }
      if (!query) {
        return true
      }
      return (
        (student.name || '').toLowerCase().includes(query) ||
        mobile.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        room.toLowerCase().includes(query) ||
        deptValue.toLowerCase().includes(query) ||
        deptLabel.toLowerCase().includes(query)
      )
    })

    return (
      <Container>
        <Grid>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column width={8}>
              <Header as='h3'>Non Residing Students</Header>
            </Grid.Column>
            <Grid.Column width={8} textAlign='right'>
              <Button primary type='button' onClick={this.toggleAddForm}>
                {showAddForm ? 'Close Form' : 'Add Non Dining Student'}
              </Button>
              <Button type='button' onClick={this.fetchAllStudents}>Show All Bhawans</Button>
              <Button  type='button' onClick={this.showCurrentBhawanStudents}>Show Current Bhawan</Button>
            </Grid.Column>
          </Grid.Row>
     
        
        </Grid>

        {showAddForm && (
          <Segment>
            <Form>
              <Form.Field required>
                <label>Name of the bhawan</label>
                <Input
                  value={constants.hostels && constants.hostels[activeHostel]}
                  readOnly
                  disabled
                />
              </Form.Field>
              <Form.Field required>
                <label>Name</label>
                <Input name='name' value={name} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field required>
                <label>Designation (RA/PDF/JRF/SRF/Project Fellow/NPDF/IPDF/Research Intern/Visitor)</label>
                <Dropdown
                  name='designation'
                  selection
                  options={designationOptions}
                  value={designation}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Department</label>
                <Dropdown
                  name='department'
                  selection
                  search
                  clearable
                  options={departmentOptions}
                  value={department}
                  onChange={this.handleChange}
                  placeholder='Select department (optional)'
                />
              </Form.Field>
              <Form.Field required>
                <label>Mobile number</label>
                <Input name='mobileNumber' value={mobileNumber} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field required>
                <label>Room number</label>
                <Input name='roomNumber' value={roomNumber} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field required>
                <label>From (date)</label>
                <Input type='date' name='fromDate' value={fromDate} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field required>
                <label>Upto (date)</label>
                <Input type='date' name='uptoDate' value={uptoDate} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field required>
                <label>Email-id</label>
                <Input type='email' name='emailId' value={emailId} onChange={this.handleChange} />
              </Form.Field>

              <Button
                primary
                type='button'
                onClick={this.handleSubmit}
                loading={saving}
                disabled={
                  !name ||
                  !designation ||
                  !mobileNumber ||
                  !roomNumber ||
                  !fromDate ||
                  !uptoDate ||
                  !emailId
                }
              >
                {editMode ? 'Update Non Dining Student' : 'Save Non Dining Student'}
              </Button>
              {editMode && (
                <Button
                  type='button'
                  onClick={() => {
                    this.resetForm()
                    this.setState({ showAddForm: false })
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </Form>
          </Segment>
        )}

        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column width={6}>
                <Input
                  fluid
                  icon='search'
                  placeholder='Search by name/mobile/email/room/department'
                  name='searchQuery'
                  value={searchQuery}
                  onChange={this.handleChange}
                />
              </Grid.Column>
              <Grid.Column width={5}>
                <Dropdown
                  fluid
                  selection
                  clearable
                  placeholder='Filter by designation'
                  name='filterDesignation'
                  value={filterDesignation}
                  options={designationOptions}
                  onChange={this.handleChange}
                />
              </Grid.Column>
              <Grid.Column width={5}>
                <Dropdown
                  fluid
                  selection
                  search
                  clearable
                  placeholder='Filter by department'
                  name='filterDepartment'
                  value={filterDepartment}
                  options={departmentOptions}
                  onChange={this.handleChange}
                />
              </Grid.Column>
              <Grid.Column width={5}>
                <Dropdown
                  fluid
                  selection
                  search
                  clearable
                  placeholder='Filter by bhawan'
                  name='filterBhawan'
                  value={filterBhawan}

                  options={Object.keys(constants.hostels || {}).map((code) => ({ key: code, text: constants.hostels[code], value: code }))}
                  onChange={this.handleChange}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment>
          <div>Total Count: {filteredStudents.length}</div>
        <Button style={{ marginBottom: '5px' }}  type='button' onClick={() => this.downloadFilteredCsv(filteredStudents)}>Download  CSV</Button>

          <div style={{ overflowX: 'auto' }}>
          <Table celled compact unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name of the bhawan</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Designation</Table.HeaderCell>
                <Table.HeaderCell>Department</Table.HeaderCell>
                <Table.HeaderCell>Mobile number</Table.HeaderCell>
                <Table.HeaderCell>Room number</Table.HeaderCell>
                <Table.HeaderCell>From (date)</Table.HeaderCell>
                <Table.HeaderCell>Upto (date)</Table.HeaderCell>
                <Table.HeaderCell>Email-id</Table.HeaderCell>
                <Table.HeaderCell>Edit</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!loading && filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const designationObj = designationOptions.find((item) => item.value === student.designation) || {}
                  const mobile = student.mobile_number || student.mobileNumber || ''
                  const room = student.room_number || student.roomNumber || ''
                  const fromDate = student.from_date || student.fromDate || ''
                  const uptoDate = student.upto_date || student.uptoDate || ''
                  const email = student.email_id || student.emailId || ''
                  const bhawanCode = student.hostel_code || student.hostelCode || ''
                  const bhawanName = student.hostel_name || student.hostelName || (constants.hostels && constants.hostels[bhawanCode]) || (constants.hostels && constants.hostels[activeHostel]) || ''
                  return (
                    
                    <Table.Row key={student.id}>
                      <Table.Cell>{bhawanName}</Table.Cell>
                      <Table.Cell>{student.name}</Table.Cell>
                      <Table.Cell>{designationObj.text || student.designation}</Table.Cell>
                      <Table.Cell>{this.getDepartmentLabel(student.department)}</Table.Cell>
                      <Table.Cell>{mobile}</Table.Cell>
                      <Table.Cell>{room}</Table.Cell>
                      <Table.Cell>{fromDate ? moment(fromDate).format('DD/MM/YYYY') : ''}</Table.Cell>
                      <Table.Cell>{uptoDate ? moment(uptoDate).format('DD/MM/YYYY') : ''}</Table.Cell>
                      <Table.Cell>{email}</Table.Cell>
                      <Table.Cell>
                        <Button size='small' onClick={() => this.editStudent(student)}>
                          Edit
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              ) : loading ? (
                <Table.Row>
                  <Table.Cell colSpan='10'>Loading...</Table.Cell>
                </Table.Row>
              ) : (
                <Table.Row>
                  <Table.Cell colSpan='10'>No records found.</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          </div>
        </Segment>
      </Container>
    )
  }
}


function mapStateToProps (state) {
  return {
    activeHostel: state.activeHostel,
  }
}


export default connect(mapStateToProps, null)(NonResidingStudents)
