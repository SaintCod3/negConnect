require 'test_helper'

class VolunteerTest < ActiveSupport::TestCase
  def setup 
    @volunteer = Volunteer.new(request_id: 1, user_id: 1)
  end

  test "should not allow empty user_id" do
     @volunteer.user_id = ""
     assert_not @volunteer.save
   end

  test "should not allow empty request_id" do
     @volunteer.request_id = ""
     assert_not  @volunteer.save
  end

end
