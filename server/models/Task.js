var db = require('./sequelize');
var Sequelize = require('sequelize');
var Completed = require('./completed');
var User = require('./User');

var Task = db.define('task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  dueBy: {
    type: Sequelize.DATE,
    allowNull: true
  },
  interval: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true
  },
  isArchived: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  },
}, {
  instanceMethods: {
    complete: function(userId) {
      return Completed.create().then(completed => {
        return User.findById(userId).then(user => {
          completed.setUser(user);
          console.log(completed);
          return completed.save();
        }).then(completed => {
          this.dueBy = new Date(this.dueBy).getTime() + this.interval;
          this.addCompleted(completed);
          return this.save();
        }).then(task => {
          return task.getCompleteds().then(completeds => {
            return completeds[0];
          });
        });
      });
    }
  }
});

module.exports = Task;
