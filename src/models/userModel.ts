import { Model, DataTypes } from "sequelize";
import sequelize from "../config/config"; // Import your Sequelize instance

class User extends Model {
  public id!: number;
  public name!: string | null;
  public age!: number | null;
  public email!: string | null;
  public address!: string | null;

  // Other model properties and methods
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false, // Set this to true if you have timestamp fields in your table
  }
);

export default User;
