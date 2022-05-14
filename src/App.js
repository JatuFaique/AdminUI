import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import EditModal from "./EditModal";
import { Spinner } from "reactstrap";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resP: [],
      resResult: [],
      errMessage: [],
      searchTerm: "",
      currentPage: 0,
      filerRes: [],
      checkedList: [],
      currentID: null,
      email: "",
      role: "",
      name: "",
      modal: false,
      selectAll: false,
      updated: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.showLoading = this.showLoading.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleRole = this.handleRole.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
  }

  componentDidMount() {
    const url =
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

    axios
      .get(url)
      .then((response) => {
        const res_local = JSON.parse(localStorage.getItem("resLoc"));
        console.log(res_local);
        this.setState(
          {
            resResult:
              res_local ||
              response.data.map((a) => {
                return { ...a, isChecked: false };
              }),
          },
          () => {
            localStorage.setItem(
              "resLoc",
              JSON.stringify(this.state.resResult)
            );
            this.setState({
              resP: this.state.resResult,
            });
          }
        );
      })
      .catch((error) => {
        this.setState({
          errMessage: error.message,
        });
      });
  }

  search(rows) {
    return rows.filter(
      (row) =>
        row.name.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) >
          -1 ||
        row.email.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) >
          -1 ||
        row.id.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) >
          -1 ||
        row.role.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) > -1
    );
  }

  showLoading() {
    return (
      <Spinner className="loading" size="">
        Loading...
      </Spinner>
    );
  }

  handleChange(event) {
    this.setState({ resResult: this.state.resP });
    this.setState({ searchTerm: event.target.value }, () => {
      let tfile = this.search(this.state.resResult);
      this.setState({ resResult: tfile });
    });
  }

  handleCheck(item, e) {
    console.log("this", e.target.name);
    let currid = this.state.resResult.findIndex(
      (element) => element.id === item.id
    );

    let newArray = [...this.state.resResult];
    newArray[currid] = {
      ...newArray[currid],
      isChecked: !newArray[currid].isChecked,
    };
    this.setState({
      resResult: newArray,
    });

    this.setState({
      checkedList: [...this.state.checkedList, item.id],
    });
    if (e.target.checked) {
      //true append id to checklist

      if (this.state.checkedList.indexOf(this.state.checkedList[item]) === -1) {
        this.setState({
          checkedList: [...this.state.checkedList, item.id],
        });
      }
    } else {
      this.setState({
        checkedList: this.state.checkedList.filter((c_item) => {
          return c_item !== item.id;
        }),
      });
    }
  }

  handleSelectAll(e, checkedList, currentPage) {
    this.setState({ selectAll: !this.state.selectAll }, () => {
      if (this.state.selectAll === false) {
        this.setState({ checkedList: [] });
      }
    });
    let start = currentPage * 10;
    let end = 0;
    this.state.resResult.length < 10
      ? (end = this.state.resResult.length)
      : (end = start + 10);

    let newArray = [...this.state.resResult];

    this.state.resResult.slice(start, end).map((item, index) => {
      newArray[item.id - 1] = {
        ...newArray[item.id - 1],
        isChecked: !item.isChecked,
      };

      this.setState((prevState) => ({
        checkedList: [...prevState.checkedList, item.id],
      }));
    });

    this.setState({
      resResult: newArray,
    });
  }

  listofAllButtons() {
    let pageNumber = [];
    for (let i = 0; i < this.state.resResult.length / 10; i++) {
      pageNumber.push(i);
    }
    return (
      <nav>
        <ul style={{ display: "inline" }}>
          <button
            className="btn-class"
            onClick={() => {
              this.setState({ currentPage: 0 });
            }}
          >
            Start
          </button>
          <button
            className="btn-class"
            onClick={() => {
              this.setState({ currentPage: this.state.currentPage - 1 });
            }}
          >
            prev
          </button>
          {pageNumber.map((number) => (
            <li
              key={number}
              style={{
                listStyleType: "none",
                display: "inline",
                padding: "5px",
              }}
            >
              <button
                className="btn-class"
                onClick={() => {
                  this.setState({ currentPage: number });
                }}
              >
                {number + 1}
              </button>
            </li>
          ))}
          <button
            className="btn-class"
            onClick={() => {
              this.setState({ currentPage: this.state.currentPage + 1 });
            }}
          >
            next
          </button>
          <button
            className="btn-class"
            onClick={() => {
              this.setState({
                currentPage: this.state.resResult.length / 10 - 1,
              });
            }}
          >
            end
          </button>
        </ul>
      </nav>
    );
  }

  handleDelete(e, checkedList) {
    if (this.state.selectAll) {
      this.setState({
        selectAll: !this.state.selectAll,
      });
    }
    let tempfiles = this.state.resResult;
    let filter = [];
    tempfiles.map((obj) => {
      if (!checkedList.includes(obj.id)) {
        filter = [...filter, obj];
      }
    });
    this.setState(
      {
        filerRes: filter,
      },
      () => {
        localStorage.setItem("resLoc", JSON.stringify(this.state.filerRes));
        this.setState({
          resResult: this.state.filerRes,
          resP: this.state.filerRes,
        });
      }
    );
    this.setState({
      checkedList: [],
    });
  }

  handleAdd(e, checkedList) {
    let tempfiles = this.state.resResult;
    let filter = tempfiles;
    filter = [...filter, { email: "aaa", name: "op", id: "00", role: "op" }];

    this.setState(
      {
        filerRes: filter,
      },
      () => {
        localStorage.setItem("resLoc", JSON.stringify(this.state.filerRes));
        this.setState({
          resResult: this.state.filerRes,
          resP: this.state.filerRes,
        });
      }
    );
    this.setState({
      checkedList: [],
    });
  }

  handleName(event, currentEdit) {
    this.setState({
      name: event.target.value,
    });
  }
  handleEmail(event, currentEdit) {
    this.setState({
      email: event.target.value,
    });
  }
  handleRole(event, currentEdit) {
    this.setState({
      role: event.target.value,
    });
  }
  handleEditSubmit(event, currentEdit) {
    event.preventDefault();
    this.state.resP.map((item, i) => {
      if (item.id === currentEdit) {
        let newArray = [...this.state.resP];
        newArray[i] = {
          ...newArray[i],
          name: this.state.name,
          email: this.state.email,
          role: this.state.role,
          isChecked: false,
        };
        this.setState(
          {
            resP: newArray,
            resResult: newArray,
          },
          () => {
            localStorage.setItem("resLoc", JSON.stringify(newArray));
            this.setState({
              checkedList: [],
            });
          }
        );
      }
    });
  }

  handleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    let mypage = [...Array(5)].map((a, index) => {
      let index1 = index * 10;
      return this.state.resResult.slice(index1, index1 + 10);
    });
    if (this.state.resP.length === 0 && this.state.errMessage.length === 0) {
      return this.showLoading();
    }

    if (this.state.resP.length === 0 && this.state.errMessage.length !== 0) {
      return <div>Some error : {this.state.errMessage}</div>;
    } else {
      return (
        <div className="app-container">
          <input placeholder="Search" onChange={this.handleChange}></input>
          <table className="response-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      this.handleSelectAll(
                        e,
                        this.state.checkedList,
                        this.state.currentPage
                      );
                    }}
                    checked={this.state.selectAll}
                  ></input>
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {this.state.resResult
                .slice(
                  this.state.currentPage * 10,
                  this.state.currentPage * 10 + 10
                )
                .map((person, i) => (
                  <tr
                    key={i}
                    className={
                      person.isChecked === true ? "active-row" : "inactice-row"
                    }
                  >
                    <td>
                      <input
                        type="checkbox"
                        name={person.id}
                        checked={person.isChecked}
                        onChange={(e) => {
                          this.handleCheck(person, e);
                        }}
                      ></input>
                    </td>
                    <td>{person.id}</td>
                    <td>{person.name}</td>
                    <td>{person.email}</td>
                    <td>{person.role}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          {this.listofAllButtons()}
          <div>
            <button
              className="btn-class delete"
              onClick={(e) => {
                this.handleDelete(e, this.state.checkedList);
              }}
            >
              Delete
            </button>
            <button
              className="btn-class delete"
              onClick={(e) => {
                this.handleAdd(e, this.state.checkedList);
              }}
            >
              Add
            </button>
            <button
              className="btn-class edit"
              onClick={(e) => {
                if (this.state.checkedList.length !== 0) {
                  let p = this.state.resResult.filter(
                    (row) => row.id === this.state.checkedList[0]
                  );

                  this.setState({
                    name: p[0].name,
                    email: p[0].email,
                    role: p[0].role,
                  });
                  if (this.state.checkedList.length !== 0) {
                    this.setState({
                      modal: !this.state.modal,
                      currentID: this.state.checkedList[0],
                    });
                  }
                } else {
                  alert("nothing to edit");
                }
              }}
            >
              Edit
            </button>
          </div>
          {this.state.modal ? (
            <EditModal
              resResult={this.state.resResult}
              filerRes={this.state.filerRes}
              handleModal={this.handleModal}
              name={this.state.name}
              modal={this.state.modal}
              currID={this.state.currentID}
              handleName={this.handleName}
              handleEmail={this.handleEmail}
              handleRole={this.handleRole}
              handleEditSubmit={this.handleEditSubmit}
            />
          ) : (
            <div></div>
          )}
        </div>
      );
    }
  }
}
