import React, { Component } from "react";

export default class TimeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { time: this.getTime() };
  }
  render() {
    return <div> {this.state.time} </div>;
  }

  getTime = () => {
    var today = new Date();
    var hour = "",
      minute = "",
      second = "";
    if (today.getHours() < 10) {
      hour = "0" + today.getHours();
    } else {
      hour = today.getHours();
    }
    if (today.getMinutes() < 10) {
      minute = "0" + today.getMinutes();
    } else {
      minute = today.getMinutes();
    }
    if (today.getSeconds() < 10) {
      second = "0" + today.getSeconds();
    } else {
      second = today.getSeconds();
    }
    return hour + ":" + minute + ":" + second;
  };

  componentDidMount() {
    console.log("TimeComponent Mounted...");
    this.interval = setInterval(
      () =>
        this.setState({
          time: this.getTime(),
        }),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
}
