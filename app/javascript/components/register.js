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
import { DirectUpload } from "activestorage";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      govID: {},
      govIDPrev: "",
      email: "",
      password: "",
      password_confirmation: "",
      show: false,
      alert: false,
      msg: ""
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
              govIDPrev: e.target.files[0].name.slice(0, 20) + "..."
            });
          } else {
            this.setState({
              govIDPrev: e.target.files[0].name,
            });
          }
          this.setState({
            govID: e.target.files[0]
          });
        }
        break;
         
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };
  onClose = (e) => {
    this.setState({ show: false });
  };
  onSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
    const {
      first_name,
      last_name,
      govID,
      email,
      password,
      password_confirmation,
    } = this.state;
    if (password === password_confirmation && password.length >= 8){
    fetch("/api/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.uploadGovID(govID, data);
      });
    } else {
      this.setState({
        alert: true, msg: "Your password must be at least 8 characters long"
      })
    }
  };

  uploadGovID = (file, user) => {
    const { history } = this.props;
    const upload = new DirectUpload(
      file,
      "http://localhost:3000/rails/active_storage/direct_uploads"
    );
    upload.create((error, blob) => {
      if (!error) {
        this.setState({
          show: true
        });
        fetch(`/api/v1/users/${user.user.id}/govID`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ govID: blob.signed_id }),
        })
          .then((response) => response.json())
          .then((data) => {
            history.push("/login");
          });
      } else {
        console.log("ERROR LMAO");
      }
    });
  };

  render() {
    const {
      first_name,
      govID,
      govIDPrev,
      last_name,
      email,
      password,
      password_confirmation,
      show,
      alert,
      msg
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
              <strong className="mr-auto">Error</strong>
            </Toast.Header>
            <Toast.Body>
              {msg}
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
                <Form.Label>GovID</Form.Label>
                <Form.File
                  type="file"
                  name="govID"
                  label={govIDPrev === "" ? "Upload your ID" : govIDPrev}
                  onChange={this.onChange}
                  custom
                  className="mb-4 mt-2"
                />
                <Form.Group>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
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

