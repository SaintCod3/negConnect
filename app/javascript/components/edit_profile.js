import React, { Component } from "react";
import { withRouter, Redirect, Route } from "react-router-dom";
import Navegation from "./navegation";
import { Container, Col, Row, Image, Toast, Form, Button, Spinner} from "react-bootstrap";
import ReactFilestack from "filestack-react";

class Edit_profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      avatar: "",
      avatarPrev: "",
      email: "",
      password: "",
      password_confirmation: "",
      show: false,
      alert: false,
      msg: ""
    };
    this.editProfile = this.editProfile.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount(){
    const { history } = this.props;
    if (!sessionStorage.getItem("Token") || !sessionStorage.getItem("User")) {
      history.push("/login")
    } else {
      const currentUser = JSON.parse(sessionStorage.getItem("User"))
      this.setState({
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        avatar:sessionStorage.getItem("Avatar"),
        email: currentUser.email
      });
    }
  }

  onChange = (e) => {
     const {
       first_name,
       last_name
     } = this.state;
    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    switch (e.target.name) {
      case "avatar":
        if (e.target.files.length > 0) {
          if ( e.target.files[0].name.length > 20) {
            this.setState({
              avatarPrev: e.target.files[0].name.slice(0, 20) + "...",
            });
          } else {
             this.setState({
               avatarPrev: e.target.files[0].name
             });
          }
          this.setState({
            avatar: e.target.files[0]
          });
        }
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
        if (first_name === "" || last_name === "") {
          this.setState({
            first_name: currentUser.first_name,
            last_name: currentUser.last_name,
          });
        }
  };
  onClose = (e) => {
    this.setState({ alert: false });
  };

  onSuccess = (avatar, avatarPrev) => {
    this.setState({
      avatar: avatar,
      avatarPrev: avatarPrev
    })
  }
  editProfile = (e) => {
    e.preventDefault();
    e.target.reset();
    const {
      first_name,
      last_name,
      avatar,
      email,
      password,
      password_confirmation,
    } = this.state;
    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    if (password === "" ){
      this.setState({
        alert: true,
        msg: "Please enter your current password to save your changes"
      })
    } else {
    fetch(`/api/v1/users/${currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        avatar
      }),
    })
      .then((response) => response.json())
      .then((data) => {
          sessionStorage.setItem("User", JSON.stringify(data.user));
          window.location.reload(false);
      });
  };
}

  render() {
    const {
      first_name,
      avatar,
      avatarPrev,
      last_name,
      email,
      password,
      password_confirmation,
      show,
      alert,
      msg
    } = this.state;
    if (!sessionStorage.getItem("Token") || !sessionStorage.getItem("User")) {
      return <Redirect to="/login" />;
    }
    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    const userAvatar = JSON.parse(sessionStorage.getItem("User")).avatar;
    const userGovID = JSON.parse(sessionStorage.getItem("User")).govid;

    return (
      <React.Fragment>
        <style type="text/css">{this.custom()}</style>
        <Navegation />
        <Toast
          onClose={this.onClose}
          show={alert}
          delay={3000}
          autohide
          className="alertStyled"
        >
          <Toast.Header>
            <strong className="mr-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{msg}</Toast.Body>
        </Toast>
        <Container fluid>
          <Row className=" text-center min-vh-50">
            <Col className="text-center profileWrap my-auto py-4">
              <Image src={userAvatar} roundedCircle className="mb-4 avatar" />
              <h4 className="font-weight-light">
                {currentUser.first_name} {currentUser.last_name}
              </h4>
            </Col>
          </Row>
          <Container className="my-4">
            <Row>
              <Col xs={12} sm={12} md={6} lg={4} className="text-center mb-4">
                <h4 className="font-weight-light">Contact</h4>
                <hr />
                <h6 className="font-weight-light">{currentUser.email}</h6>

                <h4 className="font-weight-light mt-4">ID</h4>
                <hr />
                <a href={userGovID} target="_new">
                  View
                </a>
              </Col>
              <Col xs={12} sm={12} md={6} lg={8}>
                <h4 className="font-weight-light text-center">Edit Profile</h4>
                <hr />
                <Form onSubmit={this.editProfile}>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      placeholder={currentUser.first_name}
                      onChange={this.onChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        background: "transparent",
                        outline: "none",
                        height: "30px",
                      }}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      placeholder={currentUser.last_name}
                      onChange={this.onChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        background: "transparent",
                        outline: "none",
                        height: "30px",
                      }}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Avatar</Form.Label>
                  </Form.Group>
                  {avatarPrev === "" ? (
                    <ReactFilestack
                      apikey={"AepgBLjjBQUuhs4RBOUbYz"}
                      componentDisplayMode={{
                        type: "button",
                        customText: "Upload your Avatar",
                        customClass: "greenCustom mb-4",
                      }}
                      onSuccess={(res) =>
                        this.onSuccess(
                          res.filesUploaded[0].url,
                          res.filesUploaded[0].filename
                        )
                      }
                    />
                  ) : (
                    <p>{avatarPrev}</p>
                  )}

                  <Form.Group>
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      onChange={this.onChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        background: "transparent",
                        outline: "none",
                        height: "30px",
                      }}
                    />
                  </Form.Group>
                  <Button variant="greenCustom bRight" type="submit">
                    {show ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
        </Container>
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

export default withRouter(Edit_profile);
