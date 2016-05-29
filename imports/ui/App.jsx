import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import Task from './Task.jsx';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false,
    };
  }

  countIncompleted() {
    return this.props.tasks.filter(task => !task.checked).length;
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const text = this.refs.textInput.value.trim();
    Meteor.call('tasks.insert', text);
    this.refs.textInput.value = '';
  }

  renderTasks() {
    const tasks = this.state.hideCompleted ?
                  this.props.tasks.filter(task => !task.checked) :
                  this.props.tasks;

    return tasks.length ? tasks.map(task => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    }) : (<p className='todoPlaceholder'>Sign in to create new todo items...</p>);
  }

  render() {
    const toggleHideCompleted = this.toggleHideCompleted.bind(this);
    const handleSubmit = this.handleSubmit.bind(this);
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.countIncompleted()})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={toggleHideCompleted}
            />
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper />

          { this.props.currentUser ?
            <form className="new-task" onSubmit={handleSubmit}>
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add a new task"
              />
            </form> : ''
          }
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }

}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
