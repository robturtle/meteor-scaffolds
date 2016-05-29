import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

export default class Task extends Component {

  toggleChecked() {
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }

  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.isPrivate);
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }

  render() {
    const deleteThisTask = this.deleteThisTask.bind(this);
    const toggleChecked = this.toggleChecked.bind(this);
    const togglePrivate = this.togglePrivate.bind(this);
    const username = this.props.task.username;
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.isPrivate,
    });
    return (
      <li className={taskClassName}>
        <button className="delete" onClick={deleteThisTask}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={this.props.task.checked}
          onClick={toggleChecked}
        />

        { this.props.showPrivateButton ? (
          <button className="button toggle-private" onClick={togglePrivate}>
            { this.props.task.isPrivate ? 'Private' : 'Public' }
          </button>
        ) : ''}

        <span className="text">
          { username ?
            (<strong>{this.props.task.username}: </strong>) : ''
          }
          {this.props.task.text}
        </span>
      </li>
    );
  }

}

Task.propTypes = {
  task: PropTypes.object.isRequired,
  showPrivateButton: PropTypes.bool,
};
