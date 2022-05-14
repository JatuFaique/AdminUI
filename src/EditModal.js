import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export default class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: this.props.modal,
    };
  }
  render() {
    let m1 = null;
    this.props.resResult.some((t) => {
      // console.log(this.props.currID);
      //console.log("iska ", t, "ye ", this.props.name);
      if (t.id === this.props.currID) {
        m1 = t;
        console.log("baba idhar -> ", m1.name);
      }
    });

    return (
      <div>
        <Modal
          isOpen={this.state.modal}
          toggle={() => {
            this.setState({ modal: !this.state.modal });
          }}
          style={{ minWidth: "1000px" }}
        >
          <ModalHeader></ModalHeader>
          <ModalBody style={{ padding: "5px" }}>
            <label>Name</label>
            <input
              placeholder={m1.name}
              defaultValue={m1.name}
              onChange={(event) => {
                //this.props.handleEdit(event, this.props.currID);
                this.props.handleName(event, this.props.currID);
              }}
            />
            <label>Email</label>
            <input
              defaultValue={m1.email}
              onChange={(event) => {
                //this.props.handleEdit(event, this.props.currID);
                this.props.handleEmail(event, this.props.currID);
              }}
            />
            <label>Role</label>
            <input
              placeholder={m1.role}
              defaultValue={m1.role}
              onChange={(event) => {
                //this.props.handleEdit(event, this.props.currID);
                this.props.handleRole(event, this.props.currID);
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={(event) => {
                this.setState({ modal: !this.state.modal });
                this.props.handleEditSubmit(event, this.props.currID);
                this.props.handleModal();
              }}
            >
              OK
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
