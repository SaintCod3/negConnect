import React, { Component } from "react";
import Navegation from "./navegation";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import {
  Image,
  Jumbotron,
  Container,
  Row,
  Col,
  Pagination,
  PageItem,
  Button,
  Toast,
  Modal
} from "react-bootstrap";
import { withRouter, Redirect, Link } from "react-router-dom";

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      isMounted: false,
      showingInfoWindow: false,
      activeMarker: {},
      selectedRequest: {},
      perPage: 0,
      total: 0,
      pages: 0,
      currentPage: 0,
      msg: "",
      error: false,
      show: false,
      modal: false,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.volunteering = this.volunteering.bind(this);
    this.mapRef = React.createRef();
  }
  // let's clean the fetch using the Abortable Fetch!
  controller = new AbortController();

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedRequest: props,
      activeMarker: marker,
      show: true,
    });
    console.log(this.state.selectedRequest)
  };

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };
  onDragEnd = (e, map) => {
     const newLat = map.center.lat();
     const newLng = map.center.lng();
     fetch(
       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${newLat},${newLng}&sensor=true&key=AIzaSyBmtwEawgSNBX-fmf0rrgTtLZvW58Iragc`
     )
       .then((response) => response.json())
       .then((data) => {
         console.log(data.results[0]);
       });
  };

  onClose = (e) => {
    this.setState({ show: false });
  };
  onCloseError = (e) => {
    this.setState({ error: false });
  };

  volunteering(request) {
    const { history } = this.props;
    const user_id = JSON.parse(sessionStorage.getItem("User")).id;
    fetch(`/api/v1/requests/${request}/volunteers?user_id=${user_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
      body: JSON.stringify({
        user_id,
        request,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else response.json();
      })
      .then((data) => {
        history.push(`/profile`);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          this.setState({
            error: true,
            msg: "You have already volunteered to this request",
          });
        }
      });
  }

  componentDidMount() {
    if (!this.state.requests) {
      window.location.reload(false);
    }
    fetch(
      `/api/v1/requests?&page=${
        this.state.currentPage
      }`,
      {
        method: "GET",
        signal: this.controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
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
        console.log(data)
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.log(error)
        }
      });
  }

  componentWillUnmount() {
    //We abort the fetch request when we unmount the component
    this.controller.abort();
  }

  displayMarkers = () => {
    return this.state.requests.map((request, i) => {
      return (
        <Marker
          position={{
            lat: request.lat,
            lng: request.lng,
          }}
          icon={{
            url: `http://maps.google.com/mapfiles/ms/icons/${
              request.request_types_id === 1 ? "blue-dot" : "red-dot"
            }.png`,
          }}
          onClick={this.onMarkerClick}
          description={request.description}
          volunteers={request.volunteers.length}
          location={request.city}
          requestor={request.user.first_name + " " + request.user.last_name}
          request={request.id}
          status={request.status.name}
          request_type={request.request_type.name}
          key={i}
        />
      );
    });
  };

  render() {
    if (
      !sessionStorage.getItem("Token") ||
      !sessionStorage.getItem("User") ||
      !sessionStorage.getItem("currentLat") ||
      !sessionStorage.getItem("currentLng") ||
      !sessionStorage.getItem("currentCity")
    ) {
      return <Redirect to="/login" />;
    }

    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    const {
      requests,
      perPage,
      total,
      pages,
      currentPage,
      msg,
      error,
      show,
      modal,
      modalClosing,
    } = this.state;

    return (
      <>
        <style type="text/css">{this.custom()}</style>
        <Map
          google={this.props.google}
          zoom={15}
          initialCenter={{
            lat: sessionStorage.getItem("currentLat"),
            lng: sessionStorage.getItem("currentLng"),
          }}
          disableDefaultUI={false}
          onClick={this.onMapClicked}
          id="Map"
          onDragend={this.onDragEnd}
          ref={this.mapRef}
        >
          {this.displayMarkers()}
        </Map>
        <Modal
          show={show}
          onHide={this.onClose}
          backdrop="static"
          keyboard={false}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title className="font-weight-light">
              Request of {this.state.selectedRequest.requestor}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Description: {this.state.selectedRequest.description}</p>
            <p>Status: {this.state.selectedRequest.status}</p>
            <p>Request type: {this.state.selectedRequest.request_type}</p>
            <p>Volunteers: {this.state.selectedRequest.volunteers} /5</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={this.onClose}>
              Close
            </Button>
            <Button
              variant="greenCustom"
              onClick={() =>
                this.volunteering(this.state.selectedRequest.request)
              }
            >
              Help with this request
            </Button>
          </Modal.Footer>
        </Modal>
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
        <Navegation />
      </>
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

export default GoogleApiWrapper({
  apiKey: "AIzaSyBmtwEawgSNBX-fmf0rrgTtLZvW58Iragc",
})(MapContainer);
