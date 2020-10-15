require 'test_helper'

class StatusTest < ActiveSupport::TestCase
  def setup
    @status = Status.new(name: "status 1")
  end

  test "Should not allow empty statuses" do 
    @status.name = ""
    assert_not @status.save
  end

  test "Should allow valid statuses" do 
    assert @status.valid?
  end
end
