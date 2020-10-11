import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Image,
  Toast
} from "react-bootstrap";
import { withRouter, Redirect, Link } from "react-router-dom";
import Logo from 'images/logoNormal.png';
import LogoSmall from "images/logoSmall.png";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      show: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.getUserCity = this.getUserCity.bind(this);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCoordinates);
    } else {
      alert(
        "Geolocation is not supported by this browser, please use the latest version of it or try using a different browser"
      );
    }
  }

  getCoordinates(position) {
    sessionStorage.setItem("currentLat", position.coords.latitude);
    sessionStorage.setItem("currentLng", position.coords.longitude);
    this.getUserCity();
  }

  getUserCity() {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${sessionStorage.getItem(
        "currentLat"
      )},${sessionStorage.getItem(
        "currentLng"
      )}&sensor=true&key=AIzaSyBmtwEawgSNBX-fmf0rrgTtLZvW58Iragc`
    )
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem(
          "currentCity",
          data.results[0].formatted_address
        );
      });
  }
  
  componentDidMount() {
    this.getLocation();
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onClose = (e) => {
    this.setState({ show: false });
  };
  onSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
    const { email, password } = this.state;
    const { history } = this.props;
    fetch("/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(function (data) {
        if (data) {
          sessionStorage.setItem("Token", data.token);
          sessionStorage.setItem("User", JSON.stringify(data.user));
          history.push("/map");
        }
      })
      .catch((error) => {
        this.setState({ show: true });
      });
  };

  render() {
    const { email, password, show } = this.state;
    if (sessionStorage.getItem("Token") || sessionStorage.getItem("User")) {
      return <Redirect to="/map" />;
    }

    return (
      <React.Fragment>
        <style type="text/css">{this.custom()}</style>
        <Container fluid>
          <Toast
            onClose={this.onClose}
            show={show}
            delay={3000}
            autohide
            className="alertStyled toast"
          >
            <Toast.Header>
              <strong className="mr-auto">Error</strong>
            </Toast.Header>
            <Toast.Body>
              Unable to sign in, this error could be caused if you entered a
              wrong email or password.
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
                <Button variant="greenCustom" type="submit">
                  Sign in
                </Button>
                <Link to="/register" className="bRight">
                  Register
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

export default withRouter(Login);

