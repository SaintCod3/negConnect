require 'test_helper'

class RequestTypeTest < ActiveSupport::TestCase
  def setup
    @request_type = RequestType.new(name: "One-time task")
  end

  test "Should not allow empty request type name" do
    @request_type.name = ""
    assert_not @request_type.save
  end

end
