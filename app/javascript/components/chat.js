import React, { Component } from "react";
import { Container, Row, Col, Button, Image, Form, Toast} from "react-bootstrap";
import { LinkContainer, IndexLinkContainer } from "react-router-bootstrap";
import { withRouter, Redirect, Link } from "react-router-dom";
import Navegation from "./navegation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      request: [],
      text: "",
      msg: "",
      show: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
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
    const { text } = this.state;
    const user_id = JSON.parse(sessionStorage.getItem("User")).id;
    const { request_id } = this.props.match.params;
    const { conversation_id } = this.props.match.params;
    if (text != "") {
      fetch(
        `/api/v1/requests/${request_id}/conversations/${conversation_id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
          },
          body: JSON.stringify({
            conversation_id: conversation_id,
            user_id: user_id,
            chat: text,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          window.location.reload(false);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.log(error);
          }
        });
    } else {
      this.setState({
        show: true,
        msg: "You must write a message before sending",
      });
    }
  };
  // let's clean the fetch using the Abortable Fetch!
  controller = new AbortController();

  componentDidMount() {
    const { history } = this.props;
    const user_id = JSON.parse(sessionStorage.getItem("User")).id;
    const { request_id } = this.props.match.params;
    const { conversation_id } = this.props.match.params;
    fetch(
      `/api/v1/requests/${request_id}/conversations/${conversation_id}?user_id=${user_id}`,
      {
        method: "GET",
        signal: this.controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          messages: data.messages,
          request: data.request[0].description,
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          history.push("/map");
        }
      });
  }

  componentWillUnmount() {
    //We abort the fetch request when we unmount the component
    this.controller.abort();
  }

  render() {
    const { history } = this.props;
    if (!sessionStorage.getItem("Token") || !sessionStorage.getItem("User")) {
      history.push("/login");
      window.location.reload(false);
    }
    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    const userAvatar = sessionStorage.getItem("Avatar");

    const { messages, request, text, show, msg } = this.state;

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
            <strong className="mr-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{msg}</Toast.Body>
        </Toast>
        <div className="text-center bg-grey py-2">
          <h4 className="font-weight-light">Request: {request}</h4>
        </div>
        <Container fluid className="chat py-4">
          <Row>
            <Col lg={12}>
              {messages.length === 0 ? (
                <h4 className="font-weight-light text-center">
                  No messages, don't be shy!
                </h4>
              ) : (
                messages.map((message, i) => (
                  <>
                    <div>
                      <h4
                        className={
                          message.user_id === currentUser.id
                            ? "text-right"
                            : "text-left"
                        }
                      >
                        {message.user_id === currentUser.id
                          ? "You"
                          : message.user.first_name}
                      </h4>
                    </div>
                    <div
                      className={
                        message.user_id === currentUser.id
                          ? "bubbleMe bg-light"
                          : "bubbleUser"
                      }
                    >
                      <p>{message.chat}</p>
                    </div>
                  </>
                ))
              )}
            </Col>
          </Row>
        </Container>
        <div className="spacer"></div>
        <Form onSubmit={this.onSubmit} className="fixed-bottom chatBox">
          <Form.Group>
            <Form.Label>Message: </Form.Label>
            <Form.Control
              type="text"
              name="text"
              className="text"
              onChange={this.onChange}
            />
          </Form.Group>
          <LinkContainer to="/map">
            <a className="float-left greenCustom">
              <FontAwesomeIcon icon={"chevron-left"} /> Back
            </a>
          </LinkContainer>

          <button type="submit" className="float-right greenCustom">
            Send
          </button>
        </Form>
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

export default Chat;
