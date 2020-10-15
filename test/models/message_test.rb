require 'test_helper'

class MessageTest < ActiveSupport::TestCase
  def setup
    @message = Message.new(conversation_id: 1, chat: "Testing this conversation", user_id: 2)
  end

  test "Should not allow an empty conversation_id" do
    @message.conversation_id = ""
    assert @message.invalid?
  end

  test "Should not allow an empty user_id" do
    @message.user_id = ""
    assert @message.invalid?
  end

  test "Should not allow an empty chat" do
    @message.chat = ""
    assert @message.invalid?
  end

end
