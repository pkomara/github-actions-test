const {expect} = require('chai');
const chai = require('chai');
const {add} = require('./index');

describe("unit testing add()",()=>{
    it("should add two numbers",()=>{
        expect(add(1,2)).to.equal(3);
    });
    it("should add two strings",()=>{
        expect(add("unit","testing")).to.equal("unittesting");
    });
})