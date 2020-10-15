require 'test_helper'

class ConversationTest < ActiveSupport::TestCase
  def setup
    @conversation = Conversation.new(request_id: 1, user_id: 2)
  end

  test "Should not allow an empty request_id" do
    @conversation.request_id = ""
    assert @conversation.invalid?
  end

  test "Should not allow an empty user_id" do
    @conversation.user_id = ""
    assert @conversation.invalid?
  end

end
