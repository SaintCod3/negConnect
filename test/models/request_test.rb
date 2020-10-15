require 'test_helper'

class RequestTest < ActiveSupport::TestCase
  def setup
    @request = Request.new(description: "test", user_id: 1, status_id: 1, request_type_id: 1, city: "Edinburgh", lat: 1.0, lng: 2.0)
  end
  
  test "should not allow an empty description" do 
    @request.description = ""
    assert_not  @request.save
  end

  test "should not allow an empty user_id" do 
    @request.user_id = ""
    assert_not  @request.save
  end

  test "should not allow an empty status_id" do 
    @request.status_id = ""
    assert_not  @request.save
  end

  test "should not allow an empty request_type_id" do 
    @request.request_type_id = ""
    assert_not @request.save
  end


  test "should not allow an empty city" do 
    @request.city = ""
    assert_not  @request.save
  end

  test "should not allow an empty lat" do 
    @request.lat = ""
    assert_not  @request.save
  end

  test "should not allow an empty lng" do 
    @request.lng = ""
    assert_not  @request.save
  end

  test "should not allow a description longer than 300 characters" do 
    @request.description = "t" * 301
    assert_not  @request.save
  end

end
