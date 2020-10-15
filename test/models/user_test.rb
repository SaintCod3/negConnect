require 'test_helper'

class UserTest < ActiveSupport::TestCase

  def setup 
    @user = User.new(first_name: "Test", last_name: "User", email: "user@test.test", password: "a1b2c323", avatar: "avatar.png", govid: "govid.png")
  end

  test "should not allow empty param" do 
    @user.first_name = ""
    assert_not @user.save, "User with empty param was saved"
  end

  test "password length should not be less than 8" do
    @user.password = "1234567"
    assert @user.invalid?
  end

  test "password shouldn't be blank" do
    @user.password = ""
    assert_not  @user.invalid?
  end

  test "if the password length is 8 or higher" do
    @user.password
    assert @user.valid?
  end

  test "should not allow an empty avatar" do
    @user.avatar = ""
    assert  @user.invalid?
  end

  test "should not allow an empty govID" do
    @user.govid = ""
    assert_not  @user.invalid?
  end

  test "should allow valid users" do
    assert  @user.valid?
  end

end
