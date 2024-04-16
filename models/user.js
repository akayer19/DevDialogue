const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // Define model attributes
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4] // Passwords must be at least 8 characters long
      },
    }
  }, {
    // Model options
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10); // Generate salt
        user.password = await bcrypt.hash(user.password, salt); // Hash password
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
    sequelize,
    modelName: 'User',
    timestamps: false,
    freezeTableName: true,
    underscored: true,
  });

  // Define associations
  User.associate = (models) => {
    User.hasMany(models.Post, { foreignKey: 'userId' }); // Define the association with the Post model
  };

  // Optional: Define any instance or class-level methods
  User.prototype.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password); // Compare the hashed password
  };

  return User;
};
