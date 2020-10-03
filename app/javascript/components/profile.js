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
  ListGroup
} from "react-bootstrap";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      perPage: 0,
      total: 0,
      pages: 0,
      currentPage: 0,
      volunteered: [],
      voPerPage: 0,
      voTotal: 0,
      voPages: 0,
      voCurrentPage: 0,
      msg: "",
      show: false,
    };
    this.changePageUp = this.changePageUp.bind(this);
    this.changePageDown = this.changePageDown.bind(this);
    this.voChangePageUp = this.voChangePageUp.bind(this);
    this.voChangePageDown = this.voChangePageDown.bind(this);
    this.chat = this.chat.bind(this);
    this.createConversation = this.createConversation.bind(this);
  }
  // let's clean the fetch using the Abortable Fetch!
  controller = new AbortController();

  componentDidMount() {
    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    if (currentUser === "") {
    window.location.reload(false);
    } else {
    fetch(
      `/api/v1/my_requests?user_id=${currentUser.id}&page=${this.state.currentPage}`,
      {
        method: "GET",
        signal: this.controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token")
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          requests: data.request,
          total: data.total_requests,
          perPage: data.per_page,
          pages: data.total_pages,
        });
        console.log(data);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
        }
      });
    fetch(
      `/api/v1/requests_voluntereed?user_id=${currentUser.id}&page=${this.state.voCurrentPage}`,
      {
        method: "GET",
        signal: this.controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + sessionStorage.getItem("Token"),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          volunteered: data.volunteer,
          voTotal: data.total_requests,
          voPerPage: data.per_page,
          voPages: data.total_pages,
        });
        console.log(data);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
        }
      });
   }
  }
  componentWillUnmount() {
    //We abort the fetch request when we unmount the component
    this.controller.abort();
  }

  chat(request) {
    const { history } = this.props;
    history.push(`/requests/${request}/messenger`);
  }

  createConversation(request){
    const { history } = this.props
    const user_id = JSON.parse(sessionStorage.getItem("User")).id;
    this.state.currentPage += 1;
    fetch(`/api/v1/requests/${request}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
      body: JSON.stringify({
        user_id: user_id,
        request_id: request,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if(!data.error){
          history.push(`/requests/${request}/conversations/${data.id}/`);
        } else {
          history.push(`/requests/${request}/conversations/${data.error[0].id}/`);
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.log(error)
        }
      });
  }

  changePageUp() {
    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    this.state.currentPage += 1;
    fetch(
      `/api/v1/my_requests?user_id=${currentUser.id}&page=${this.state.currentPage}`,
      {
        method: "GET",
        signal: this.controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + sessionStorage.getItem("Token"),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          requests: data.request,
        });
      });
  }

  changePageDown() {
    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    this.state.currentPage -= 1;
    fetch(
      `/api/v1/my_requests?user_id=${currentUser.id}&page=${this.state.currentPage}`,
      {
        method: "GET",
        signal: this.controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + sessionStorage.getItem("Token"),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          requests: data.request,
        });
      });
  }

  voChangePageUp() {
    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    this.state.voCurrentPage += 1;
    fetch(
      `/api/v1/requests_voluntereed?user_id=${currentUser.id}&page=${this.state.voCurrentPage}`,
      {
        method: "GET",
        signal: this.controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + sessionStorage.getItem("Token"),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          volunteered: data.volunteer,
        });
      });
  }

  voChangePageDown() {
    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    this.state.voCurrentPage -= 1;
    fetch(
      `/api/v1/requests_voluntereed?user_id=${currentUser.id}&page=${this.state.voCurrentPage}`,
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
          volunteered: data.volunteer,
        });
      });
  }
  render() {
    const {
      requests,
      pages,
      currentPage,
      volunteered,
      voPages,
      voCurrentPage,
      voTotal,
      total,
    } = this.state;
    if (!sessionStorage.getItem("Token") || !sessionStorage.getItem("User")) {
      return <Redirect to="/login" />;
    }
    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    const userAvatar = sessionStorage.getItem("Avatar");
    return (
      <React.Fragment>
        <style type="text/css">{this.custom()}</style>
        <Navegation />
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
              <Col xs={12} sm={12} md={6} lg={6} className="text-center mb-4">
                <h4 className="font-weight-light">My Requests ({total})</h4>
                <hr />
                {requests.length === 0 ? (
                  <h4 className="font-weight-light mb-4">
                    No requests, feel free to create a new one!
                  </h4>
                ) : (
                  <ListGroup className="my-4">
                    {requests.map((request, i) => (
                      <ListGroup.Item className="text-left" key={i}>
                        <h4 key={request.id} className="description">
                          {request.description.length > 50
                            ? request.description.slice(0, 50) + "..."
                            : request.description}
                        </h4>
                        <hr />
                        <p>Location: {request.city}</p>
                        <button
                          onClick={() => this.chat(request.id)}
                          className="greenCustom"
                        >
                          View
                        </button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
                {total <= 3 ? (
                  " "
                ) : (
                  <Pagination size="sm" className="justify-content-center">
                    <Pagination.Prev
                      onClick={this.changePageDown}
                      className={currentPage === 0 ? "disabled" : ""}
                    />
                    <Pagination.Item disabled>
                      {currentPage + 1}
                    </Pagination.Item>
                    <Pagination.Next
                      onClick={this.changePageUp}
                      className={currentPage === pages - 1 ? "disabled" : ""}
                    />
                  </Pagination>
                )}
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} className="text-center mb-4">
                <h4 className="font-weight-light">Voluntereed ({voTotal})</h4>
                <hr />
                {volunteered.length === 0 ? (
                  <h4 className="font-weight-light mb-4">
                    You didn't volunteered to any request, helping others is
                    free!
                  </h4>
                ) : (
                  <ListGroup className="my-4">
                    {volunteered.map((volunteer, i) => (
                      <ListGroup.Item className="text-left" key={i}>
                        <h4 key={i}>
                          {" "}
                          {volunteer.description.length > 50
                            ? volunteer.description.slice(0, 50) + "..."
                            : volunteer.description}
                        </h4>
                        <hr />
                        <p>Location: {volunteer.city}</p>
                        <button
                          onClick={() => this.createConversation(volunteer.id)}
                          className="greenCustom"
                        >
                          Chat
                        </button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
                {voTotal <= 3 ? (
                  ""
                ) : (
                  <Pagination size="sm" className="justify-content-center">
                    <Pagination.Prev
                      onClick={this.voChangePageDown}
                      className={voCurrentPage === 0 ? "disabled" : ""}
                    />
                    <Pagination.Item disabled>
                      {voCurrentPage + 1}
                    </Pagination.Item>
                    <Pagination.Next
                      onClick={this.voChangePageUp}
                      className={
                        voCurrentPage === voPages - 1 ? "disabled" : ""
                      }
                    />
                  </Pagination>
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

export default withRouter(Profile);
