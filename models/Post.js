// post model

const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW // Set default value to current date and time
    },
    // other fields as necessary
  }, {
    // Define virtual attributes
    getterMethods: {
      date: function() {
        // Format the date however you want
        return this.createdAt.toLocaleDateString(); // Example format: MM/DD/YYYY
      }
    }
  });

  Post.associate = (models) => {
    // Define associations here
    Post.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Post;
};

