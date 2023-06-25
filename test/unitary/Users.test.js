import { describe } from "mocha";
import chai from "chai";
import { faker } from "@faker-js/faker";
import { UserModel } from "../../models/user.model.js";
import { createError } from "../../utils/error.js";
import mongoose from "mongoose";
import config from "../../utils/config.js";

const expect = chai.expect;

describe("Testing CRUD for User Controller", function() {
    before(async()=> {
    await mongoose.connect(config.mongoUrl)
    })

  let testUser

  it("It must create a new user", async function(done) {
    testUser = await UserModel.create({
        username: faker.person.fullName(),
        password: 'secret123',
        email: faker.internet.email(),
        fullAddress: {
            addres: 'asd',
            latLng: {
                lat:1,
                lng:1
            }
        },
        admin: true,
        tpye: 'user',
        pets: [faker.database.mongodbObjectId()],
        strategy: "local",
        
    })
    expect(testUser?._id).to.have.property("_id")
    })
    
  it("It must return all users", async function() {
    const response = await UserModel.find({})
    if (!response) {
        throw Error
    }        
    expect(response).to.be.an("array");
  });

  it("It must return one user by _id", async function() {
    const response = await UserModel.findOne({"_id": testUser._id})
    if (!response) {
        throw Error
    }
    expect(response._id).to.be.deep.equal(testUser._id);
  });

  it("It must return status 404 by wrong user _id", async function() {
    const response = await UserModel.findById(faker.database.mongodbObjectId())
    if (!response) {
        const customError = createError(404, 'Not found')
        expect(customError.status).to.be.equal(404);
    }
  });

  it("It should update testUser's name", async function() {
    const response = await UserModel.findByIdAndUpdate(testUser._id, {$set: {
        username: "Jorge",
        }}, {new:true}) 
    expect(response.username).to.be.deep.equal("Jorge");
  });

  it('It must get user created above and delete it', async function() {   
    await UserModel.findByIdAndDelete(testUser._id)
    const testUser_deleted = await UserModel.findOne({_id: testUser._id})
    expect(testUser_deleted).to.be.equal(null)
})



});


