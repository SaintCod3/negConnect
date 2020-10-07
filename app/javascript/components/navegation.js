import React, { Component } from "react";
import {
  Navbar,
  Image,
  Button,
  Modal,
  NavDropdown,
  Nav,
  Form,
  Toast
} from "react-bootstrap";
import {withRouter, Link, useHistory } from "react-router-dom";
import { LinkContainer, IndexLinkContainer } from "react-router-bootstrap";
import LogoSmall from "images/logoSmall.png";
 
class Navegation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: "",
      show: false,
      request_types: [],
      type: "",
      description: "",
      msg: "",
      error: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  // let's clean the fetch using the Abortable Fetch!
  controller = new AbortController();

  componentDidMount() {
    this.intervalId = setInterval(this.getCounter, 5000);
    this.getCounter();
    fetch(`/api/v1/request_types`, {
      method: "GET",
      signal: this.controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          request_types: data,
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
        }
      });
  }

  getCounter = () => {
    fetch(`/api/v1/counter`, {
      method: "GET",
      signal: this.controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          counter: data,
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          history.push("/map");
        }
      });
  };

  onClose = (e) => {
    this.setState({ show: false });
  };
  onCloseError = (e) => {
    this.setState({ error: false });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  requestModal = (e) => {
    this.setState({ show: true });
  };

  onSubmit = (e) => {
    const { history } = this.props;
    e.preventDefault();
    const { description, type, currentTime } = this.state;
    const user_id = JSON.parse(sessionStorage.getItem("User")).id;
    const lat = sessionStorage.getItem("currentLat");
    const lng = sessionStorage.getItem("currentLng");
    const city = sessionStorage.getItem("currentCity");
    if (description != "" && description.length <= 300 && type != 0) {
      fetch(`/api/v1/requests?user_id=${user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        body: JSON.stringify({
          user_id: user_id,
          description: description,
          request_type_id: type,
          lng: lng,
          lat: lat,
          status_id: 1,
          isActive: true,
          city: city,
          req_time: new Date().toLocaleString()
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            show: false,
          });
          history.push(`/requests/${data.id}/messenger`);
          window.location.reload(false);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.log(error);
          }
        });
    } else {
      this.setState({
        error: true,
        msg: "Please review your request and try again",
      });
    }
  };

  componentWillUnmount() {
    //We abort the fetch request when we unmount the component
    this.controller.abort();
    //Clear the interval
    clearInterval(this.intervalId);
  }

  logout = (e) => {
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("User");
    sessionStorage.removeItem("Avatar");
    sessionStorage.removeItem("govID");
    this.props.history.push("/login");
  };

  render() {
    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    const userAvatar = sessionStorage.getItem("Avatar");
    const {
      counter,
      show,
      request_types,
      description,
      msg,
      error,
      currentTime
    } = this.state;
    return (
      <React.Fragment>
        <Navbar collapseOnSelect expand="lg" className="customBar" sticky="top">
          <Image src={LogoSmall} className="logo" />
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            aria-expanded="false"
          ></Navbar.Toggle>
          <Navbar.Collapse>
            <Nav className="mr-auto" size="sm">
              <Nav.Item>
                <LinkContainer to="/map">
                  <Nav.Link className="mr-2 navFancy">Map</Nav.Link>
                </LinkContainer>
              </Nav.Item>
              <Nav.Item>
                <LinkContainer to="/profile">
                  <Nav.Link className="mr-2 navFancy">Profile</Nav.Link>
                </LinkContainer>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={this.requestModal} className="mr-2 navFancy">
                  Create request
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="centeredItem">
                <Navbar.Text>Unfulfilled Requests: {counter}</Navbar.Text>
              </Nav.Item>
            </Nav>
            <Nav>
              <NavDropdown
                alignRight
                title={currentUser.first_name}
                id="collasible-nav-dropdown"
                className="mr-sm-2"
              >
                <Nav.Item>
                  <LinkContainer to="/edit_profile">
                    <Nav.Link className="ml-2">Edit Profile</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
                <NavDropdown.Divider />
                <Nav.Item>
                  <Nav.Link onClick={this.logout} className="ml-2">
                    Log out
                  </Nav.Link>
                </Nav.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Toast
          onClose={this.onCloseError}
          show={error}
          delay={3000}
          autohide
          className="alertStyled"
        >
          <Toast.Header>
            <strong className="mr-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{msg}</Toast.Body>
        </Toast>
        <Modal
          show={show}
          onHide={this.onClose}
          keyboard={false}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title>Submit your request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>
                Description
                <Form.Text muted>Up to 300 characters long.</Form.Text>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                name="description"
                onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Request Type</Form.Label>
              <Form.Control as="select" onChange={this.onChange} name="type">
                <option value="0">Choose...</option>
                {request_types.map((type, i) => (
                  <option key={i} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={this.onClose}>
              Close
            </Button>
            <Button variant="greenCustom" onClick={this.onSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
  custom() {
    return `
        .btn-greenCustom {
          background-color: transparent;
          padding: .375rem .75rem;
          border: 1px solid #426f42;
          vertical-align: middle;
          line-height: 1.5;
          font-size: 1rem;
          transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
          text-decoration: none;
          color: #426f42;
          border-radius: .25rem;
        }
        .btn-greenCustom:hover {
          padding: .375rem .75rem;
          border: 1px solid transparent;
          vertical-align: middle;
          line-height: 1.5;
          font-size: 1rem;
          transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
          text-decoration: none;
          border-radius: .25rem;
          background-color: #4c7f4c;
          color: white;
        }
        `;
  }
}




export default withRouter(Navegation)
