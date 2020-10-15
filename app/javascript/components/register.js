import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Image,
  Toast,
  Spinner
} from "react-bootstrap";
import { withRouter, Redirect, Link } from "react-router-dom";
import LogoSmall from "images/logoSmall.png";
import ReactFilestack from "filestack-react";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      govID: "",
      govIDPrev: "",
      avatar: "",
      avatarPrev: "",
      email: "",
      password: "",
      password_confirmation: "",
      show: false,
      alert: false,
      error: "",
      msg: "",
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onChange = (e) => {
    switch (e.target.name) {
      case "govID":
        if (e.target.files.length > 0) {
          if (e.target.files[0].name.length > 20) {
            this.setState({
              govIDPrev: e.target.files[0].name.slice(0, 20) + "...",
            });
          } else {
            this.setState({
              govIDPrev: e.target.files[0].name,
            });
          }
          this.setState({
            govID: e.target.files[0],
          });
        }
        break;

      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };
  onClose = (e) => {
    this.setState({ show: false, alert: false});
  };
  onSuccess = (avatar,avatarPrev) => {
    this.setState({
      avatar: avatar,
      avatarPrev: avatarPrev
    });
  };
  onSuccessGov = (govID, govIDPrev) => {
    this.setState({
      govID: govID,
      govIDPrev: govIDPrev
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
    const { history } = this.props;
    const {
      first_name,
      last_name,
      govID,
      govIDPrev,
      avatarPrev,
      avatar,
      email,
      error,
      password,
      password_confirmation,
    } = this.state;
   if (avatarPrev === "" || govIDPrev === ""){
       this.setState({
        alert: true,
        error: 1,
      });
   }
   if (password === password_confirmation && password.length >= 8){
      this.setState({
        alert: true,
        error: 1
      });
    }
    if (error === 0) {
      fetch("/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        avatar: avatar,
        govid: govID
        }),
      })
        .then((response) => response.json())
        .then((data) => {
            this.setState({
              alert: true,
              msg: "Account created!",
            });
          history.push("/login");
        });
    } else {
      this.setState({
        alert: true
      });
    }
  };

  render() {
    const {
      first_name,
      govID,
      govIDPrev,
      avatarPrev,
      last_name,
      email,
      password,
      password_confirmation,
      show,
      alert,
      error, 
      msg,
    } = this.state;
    if (sessionStorage.getItem("Token") || sessionStorage.getItem("User")) {
      return <Redirect to="/profile" />;
    }
    return (
      <React.Fragment>
        <style type="text/css">{this.custom()}</style>
        <Container fluid>
          <Toast
            onClose={this.onClose}
            show={alert}
            delay={3000}
            autohide
            className="alertStyled"
          >
            <Toast.Header>
              <strong className="mr-auto">
                {error === 0 ? "Success!" : "Error"}
              </strong>
            </Toast.Header>
            <Toast.Body>
              {error === 0
                ? msg
                : "Missing Parameter(s), please make sure that you have added all the information and uploaded an avatar and your GovID"}
            </Toast.Body>
          </Toast>
          <Row>
            <Col
              xs={12}
              sm={12}
              md={8}
              lg={8}
              className="leftSide d-none text-center d-md-block d-lg-block"
            ></Col>
            <Col xs={12} sm={12} md={4} lg={4} className="rightSide centered">
              <Image src={LogoSmall} className="mb-4" />
              <Form onSubmit={this.onSubmit}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="first_name"
                    onChange={this.onChange}
                    style={{
                      border: "none",
                      borderBottom: "1px solid #426f42",
                      background: "transparent",
                      outline: "none",
                      color: "#395f39",
                      height: "35px",
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="last_name"
                    onChange={this.onChange}
                    style={{
                      border: "none",
                      borderBottom: "1px solid #426f42",
                      background: "transparent",
                      outline: "none",
                      color: "#395f39",
                      height: "35px",
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Avatar</Form.Label>
                  <br />
                  {avatarPrev === "" ? (
                    <ReactFilestack
                      apikey={"AepgBLjjBQUuhs4RBOUbYz"}
                      componentDisplayMode={{
                        type: "button",
                        customText: "Upload your Avatar",
                        customClass: "greenCustom",
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
                </Form.Group>
                <Form.Group>
                  <Form.Label>Government-approved ID</Form.Label>
                  <br />
                  {govIDPrev === "" ? (
                    <ReactFilestack
                      apikey={"AepgBLjjBQUuhs4RBOUbYz"}
                      componentDisplayMode={{
                        type: "button",
                        customText: "Upload your Government-approved ID",
                        customClass: "greenCustom",
                      }}
                      onSuccess={(res) =>
                        this.onSuccessGov(
                          res.filesUploaded[0].url,
                          res.filesUploaded[0].filename
                        )
                      }
                    />
                  ) : (
                    <p>{govIDPrev}</p>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    required
                    onChange={this.onChange}
                    style={{
                      border: "none",
                      borderBottom: "1px solid #426f42",
                      background: "transparent",
                      outline: "none",
                      color: "#395f39",
                      height: "35px",
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    name="password"
                    onChange={this.onChange}
                    style={{
                      border: "none",
                      borderBottom: "1px solid #426f42",
                      background: "transparent",
                      outline: "none",
                      color: "#395f39",
                      height: "35px",
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    name="password_confirmation"
                    onChange={this.onChange}
                    style={{
                      border: "none",
                      borderBottom: "1px solid #426f42",
                      background: "transparent",
                      outline: "none",
                      color: "#395f39",
                      height: "35px",
                    }}
                  />
                </Form.Group>
                <Button variant="greenCustom" type="submit">
                  {show ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    "Register"
                  )}
                </Button>
                <Link to="/login" className="bRight">
                  Back
                </Link>
              </Form>
            </Col>
          </Row>
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

export default withRouter(Register);

