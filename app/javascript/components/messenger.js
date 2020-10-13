import React, { Component } from "react";
import { withRouter, Redirect, Route } from "react-router-dom";
import Navegation from "./navegation";
import { DirectUpload } from "activestorage";
import {
  Container,
  Col,
  Row,
  Image,
  Toast,
  Form,
  Button,
  Spinner,
  Pagination,
  PageItem,
  ListGroup,
  Navbar,
  NavbarBrand,
  ListGroupItem
} from "react-bootstrap";

class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      requests: [],
      msg: "",
      request_title: "",
      show: false,
      today: new Date()
    };
  }
  // let's clean the fetch using the Abortable Fetch!
  controller = new AbortController();

  componentDidMount() {
    const { history } = this.props;
    const user_id = JSON.parse(sessionStorage.getItem("User")).id;
    const { request_id } = this.props.match.params;
    fetch(`/api/v1/requests/${request_id}/conversations?user_id=${user_id}`, {
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
          conversations: data.conversations,
          requests: data.request,
          request_title: data.request[0].description,
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          history.push("/map");
        }
      });
  }

  onClose = (e) => {
    this.setState({ show: false });
  };

  componentWillUnmount() {
    //We abort the fetch request when we unmount the component
    this.controller.abort();
  }

  chat(request, conversation) {
    const { history } = this.props;
    history.push(`/requests/${request}/conversations/${conversation}/`);
  }

  complete_request(request) {
    fetch(`/api/v1/requests/${request}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
      body: JSON.stringify({
        isActive: false,
        status_id: 2
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          show: true,
          msg: "Your request was closed successfully",
        });
        const { history } = this.props;
        history.push("/profile");
      });
  }

  reset_request(request) {
    const user_id = JSON.parse(sessionStorage.getItem("User")).id;
    fetch(`/api/v1/reset_request/${request}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
      body: JSON.stringify({
        request_id: request,
        user_id: user_id
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          show: true,
          msg: "Your request was re-published successfully",
        });
        window.location.reload(false);
      });
  }

  render() {
    const { conversations, requests, request_title, show, msg, today} = this.state;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (!sessionStorage.getItem("Token") || !sessionStorage.getItem("User")) {
      return <Redirect to="/login" />;
    }
    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    const userAvatar = sessionStorage.getItem("Avatar");

    return (
      <React.Fragment>
        <style type="text/css">{this.custom()}</style>
        <Navegation />
        <Toast
          onClose={this.onClose}
          show={show}
          delay={3000}
          autohide
          className="alertStyled"
        >
          <Toast.Header>
            <strong className="mr-auto">Information</strong>
          </Toast.Header>
          <Toast.Body>{msg}</Toast.Body>
        </Toast>
        <Container fluid>
          <Row className="min-vh-50">
            <Col className="messengerWrap">
              <Container>
                <h4 className="fancyText font-weight-light">
                  <p className="text-center font-weight-light">Request</p>
                  <hr className="bg-white w-50" />
                  {request_title}
                </h4>
              </Container>
            </Col>
          </Row>
          <Container className="py-4">
            <Row>
              <Col xs={12} sm={12} md={6} lg={6} className="text-center mb-4">
                <h4 className="font-weight-light">Information</h4>
                <hr />
                <ListGroup className="my-4 text-left">
                  {requests.map((request, i) => (
                    <ListGroup.Item key={i}>
                      <p>Location: {request.city}</p>
                      <p>Request type: {request.request_type.name}</p>
                      <p>Status: {request.status.name}</p>
                      <hr />
                      {request.status_id === 1 &&
                      request.isActive === false  ? (
                        <button
                          className="greenCustom"
                          onClick={() => this.reset_request(request.id)}
                        >
                          Re-pusblish
                        </button>
                      ) : (
                        <button
                          className="greenCustom"
                          onClick={() => this.complete_request(request.id)}
                        >
                          Complete
                        </button>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} className="text-center mb-4">
                <h4 className="font-weight-light">
                  Chats ({conversations.length})
                </h4>
                <hr />
                {conversations.length === 0 ? (
                  "There isn't any conversation for this request yet"
                ) : (
                  <ListGroup className="my-4">
                    {conversations.map((chat, i) => (
                      <ListGroup.Item className="text-center" key={i}>
                        <h4 className="font-weight-light text-left">
                          {chat.user.id === currentUser.id
                            ? request.user.first_name +
                              " " +
                              request.user.last_name
                            : chat.user.first_name + " " + chat.user.last_name}

                          <button
                            onClick={() => this.chat(chat.request_id, chat.id)}
                            className="greenCustom float-right"
                          >
                            Chat
                          </button>
                        </h4>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
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

export default withRouter(Messenger);
