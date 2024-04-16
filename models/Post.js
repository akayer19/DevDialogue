// models/post.js

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  });

  Post.associate = (models) => {
    // Define associations here
    Post.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Post;
};